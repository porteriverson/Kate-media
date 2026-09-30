import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { messageFromError, routeErrorResponse } from "@/lib/route-errors";
import { removeStripeInvoice, updateInvoiceDueDate } from "@/lib/stripe";

type Context = { params: Promise<{ id: string }> };

const dueDateSchema = z.object({
  dueDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Due date must use YYYY-MM-DD format.")
    .refine((value) => {
      const parsed = new Date(`${value}T23:59:59.000Z`);
      return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value);
    }, "Choose a valid due date."),
});

export async function PATCH(request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const { supabase } = await requireAdmin();
    const parsed = dueDateSchema.safeParse(await request.json().catch(() => ({})));
    if (!parsed.success) return NextResponse.json({ error: "Choose a valid due date." }, { status: 400 });

    const { data: invoice, error: lookupError } = await supabase
      .from("invoices")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (lookupError) throw lookupError;
    if (!invoice) return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
    if (["paid", "void", "uncollectible"].includes(invoice.status)) {
      return NextResponse.json({ error: "This invoice can no longer be edited." }, { status: 409 });
    }

    if (invoice.stripe_invoice_id) {
      try {
        await updateInvoiceDueDate(invoice.stripe_invoice_id, parsed.data.dueDate);
      } catch (error) {
        return NextResponse.json({ error: `The due date was not updated in Stripe: ${messageFromError(error)}` }, { status: 502 });
      }
    }

    const { data, error } = await supabase
      .from("invoices")
      .update({ due_at: new Date(`${parsed.data.dueDate}T23:59:59.000Z`).toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error || !data) throw error ?? new Error("Invoice could not be updated.");
    return NextResponse.json({ invoice: data });
  } catch (error) {
    return routeErrorResponse(error);
  }
}

export async function DELETE(_request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const { supabase } = await requireAdmin();
    const { data: invoice, error: lookupError } = await supabase
      .from("invoices")
      .select("id, stripe_invoice_id, status")
      .eq("id", id)
      .maybeSingle();
    if (lookupError) throw lookupError;
    if (!invoice) return NextResponse.json({ error: "Invoice not found." }, { status: 404 });

    if (invoice.stripe_invoice_id && !["failed", "void"].includes(invoice.status)) {
      try {
        await removeStripeInvoice(invoice.stripe_invoice_id, invoice.status);
      } catch (error) {
        return NextResponse.json({ error: messageFromError(error) }, { status: 409 });
      }
    }

    const { error } = await supabase.from("invoices").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return routeErrorResponse(error);
  }
}
