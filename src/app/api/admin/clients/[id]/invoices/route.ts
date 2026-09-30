import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { messageFromError, routeErrorResponse } from "@/lib/route-errors";
import { sendHostedInvoice } from "@/lib/stripe";

const invoiceSchema = z.object({
  items: z.array(z.object({
    priceId: z.string().startsWith("price_"),
    quantity: z.number().int().min(1).max(100),
  })).min(1).max(20),
  dueDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Due date must use YYYY-MM-DD format.")
    .refine((value) => {
      const dueDate = new Date(`${value}T23:59:59.000Z`);
      return !Number.isNaN(dueDate.getTime())
        && dueDate.toISOString().startsWith(value)
        && dueDate.getTime() > Date.now();
    }, "Due date must be a future date."),
  idempotencyKey: z.string().min(8).max(200).optional(),
});

type Context = { params: Promise<{ id: string }> };

export const runtime = "nodejs";

export async function POST(request: Request, context: Context) {
  try {
    const { id: clientId } = await context.params;
    const { supabase, user } = await requireAdmin();
    const parsed = invoiceSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Choose at least one valid Stripe Price and a future due date." }, { status: 400 });
    }

    const idempotencyKey = parsed.data.idempotencyKey ?? request.headers.get("idempotency-key") ?? crypto.randomUUID();
    const { data: existing } = await supabase
      .from("invoices")
      .select("*")
      .eq("idempotency_key", idempotencyKey)
      .maybeSingle();

    if (existing && existing.status !== "failed") {
      return NextResponse.json({ invoice: existing });
    }

    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("id, stripe_customer_id")
      .eq("id", clientId)
      .maybeSingle();
    if (clientError) throw clientError;
    if (!client) return NextResponse.json({ error: "Client not found." }, { status: 404 });
    if (!client.stripe_customer_id) {
      return NextResponse.json({ error: "This client does not have a synced Stripe Customer yet." }, { status: 409 });
    }

    let invoiceId = existing?.id;
    if (!invoiceId) {
      const { data: created, error: insertError } = await supabase
        .from("invoices")
        .insert({
          client_id: clientId,
          idempotency_key: idempotencyKey,
          line_items: parsed.data.items,
          created_by: user.id,
        })
        .select()
        .single();
      if (insertError || !created) throw insertError ?? new Error("Invoice could not be created.");
      invoiceId = created.id;
    } else {
      await supabase
        .from("invoices")
        .update({ status: "creating", error_message: null, failed_at: null })
        .eq("id", invoiceId);
    }

    try {
      const result = await sendHostedInvoice({
        invoiceId,
        stripeCustomerId: client.stripe_customer_id,
        items: parsed.data.items,
        dueDate: parsed.data.dueDate,
        localClientId: clientId,
      });
      const stripeInvoice = result.invoice;
      const status = stripeInvoice.status === "paid" ? "paid" : stripeInvoice.status === "void" ? "void" : "open";
      const { data: saved, error: saveError } = await supabase
        .from("invoices")
        .update({
          stripe_invoice_id: stripeInvoice.id,
          line_items: result.lineItems,
          currency: stripeInvoice.currency,
          amount_due: stripeInvoice.amount_due,
          amount_paid: stripeInvoice.amount_paid,
          hosted_invoice_url: stripeInvoice.hosted_invoice_url,
          invoice_pdf_url: stripeInvoice.invoice_pdf,
          status,
          due_at: stripeInvoice.due_date ? new Date(stripeInvoice.due_date * 1000).toISOString() : null,
          sent_at: new Date().toISOString(),
          paid_at: stripeInvoice.status === "paid" ? new Date().toISOString() : null,
          error_message: null,
        })
        .eq("id", invoiceId)
        .select()
        .single();

      if (saveError || !saved) throw saveError ?? new Error("Invoice details could not be saved.");
      return NextResponse.json({ invoice: saved }, { status: existing ? 200 : 201 });
    } catch (error) {
      await supabase
        .from("invoices")
        .update({ status: "failed", error_message: messageFromError(error), failed_at: new Date().toISOString() })
        .eq("id", invoiceId);
      return NextResponse.json(
        { error: "The invoice could not be sent.", invoiceId },
        { status: 502 },
      );
    }
  } catch (error) {
    return routeErrorResponse(error);
  }
}
