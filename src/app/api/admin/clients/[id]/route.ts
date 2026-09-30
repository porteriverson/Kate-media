import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { deleteCustomer, updateCustomer } from "@/lib/stripe";
import { messageFromError, routeErrorResponse } from "@/lib/route-errors";

type Context = { params: Promise<{ id: string }> };

const addressSchema = z.record(z.string(), z.string()).default({});
const clientUpdateSchema = z.object({
  name: z.string().trim().min(1),
  businessName: z.string().trim().min(1),
  email: z.string().trim().email(),
  phone: z.string().trim().max(80).optional().or(z.literal("")),
  billingAddress: addressSchema,
  notes: z.string().trim().max(5000).optional().or(z.literal("")),
});

export async function GET(_request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const { supabase } = await requireAdmin();
    const [clientResult, invoicesResult, contractsResult] = await Promise.all([
      supabase.from("clients").select("*").eq("id", id).maybeSingle(),
      supabase.from("invoices").select("*").eq("client_id", id).order("created_at", { ascending: false }),
      supabase.from("contracts").select("*").eq("client_id", id).order("created_at", { ascending: false }),
    ]);

    if (clientResult.error) throw clientResult.error;
    if (invoicesResult.error) throw invoicesResult.error;
    if (contractsResult.error) throw contractsResult.error;
    if (!clientResult.data) return NextResponse.json({ error: "Client not found." }, { status: 404 });

    return NextResponse.json({
      client: clientResult.data,
      invoices: invoicesResult.data,
      contracts: contractsResult.data,
    });
  } catch (error) {
    return routeErrorResponse(error);
  }
}

export async function PATCH(request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const { supabase } = await requireAdmin();
    const parsed = clientUpdateSchema.safeParse(await request.json().catch(() => ({})));
    if (!parsed.success) return NextResponse.json({ error: "Please check the client details." }, { status: 400 });

    const { data: existing, error: lookupError } = await supabase
      .from("clients")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (lookupError) throw lookupError;
    if (!existing) return NextResponse.json({ error: "Client not found." }, { status: 404 });

    const input = parsed.data;
    if (existing.stripe_customer_id) {
      try {
        await updateCustomer({
          customerId: existing.stripe_customer_id,
          name: input.name,
          email: input.email,
          phone: input.phone || null,
          billingAddress: input.billingAddress,
        });
      } catch (error) {
        return NextResponse.json({ error: `The client was not updated in Stripe: ${messageFromError(error)}` }, { status: 502 });
      }
    }

    const { data, error } = await supabase
      .from("clients")
      .update({
        name: input.name,
        business_name: input.businessName,
        email: input.email,
        phone: input.phone || null,
        billing_address: input.billingAddress,
        notes: input.notes || null,
        stripe_sync_status: existing.stripe_customer_id ? "synced" : existing.stripe_sync_status,
        stripe_sync_error: null,
      })
      .eq("id", id)
      .select()
      .single();
    if (error || !data) throw error ?? new Error("Client could not be updated.");
    return NextResponse.json({ client: data });
  } catch (error) {
    return routeErrorResponse(error);
  }
}

export async function DELETE(_request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const { supabase } = await requireAdmin();
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("id, stripe_customer_id")
      .eq("id", id)
      .maybeSingle();
    if (clientError) throw clientError;
    if (!client) return NextResponse.json({ error: "Client not found." }, { status: 404 });

    const [{ count: invoiceCount, error: invoiceError }, { count: contractCount, error: contractError }] = await Promise.all([
      supabase.from("invoices").select("id", { count: "exact", head: true }).eq("client_id", id),
      supabase.from("contracts").select("id", { count: "exact", head: true }).eq("client_id", id),
    ]);
    if (invoiceError) throw invoiceError;
    if (contractError) throw contractError;
    if ((invoiceCount ?? 0) > 0 || (contractCount ?? 0) > 0) {
      return NextResponse.json({ error: "Delete this client’s invoices and contracts first." }, { status: 409 });
    }

    if (client.stripe_customer_id) {
      try {
        await deleteCustomer(client.stripe_customer_id);
      } catch (error) {
        return NextResponse.json({ error: `The Stripe Customer could not be deleted: ${messageFromError(error)}` }, { status: 502 });
      }
    }

    const { error } = await supabase.from("clients").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return routeErrorResponse(error);
  }
}
