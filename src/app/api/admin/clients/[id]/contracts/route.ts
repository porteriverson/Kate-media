import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { buildPrefillFields, sendContract } from "@/lib/documenso";
import { messageFromError, routeErrorResponse } from "@/lib/route-errors";

const contractSchema = z.object({
  invoiceId: z.string().uuid().optional(),
  clientName: z.string().trim().min(1, "Add the client's name."),
  clientEmail: z.string().trim().email("Use a valid client email."),
  companyName: z.string().trim().min(1, "Add the company name."),
  packageName: z.string().trim().min(1, "Add the package name."),
  serviceFee: z.string().trim().min(1, "Add the service fee."),
  serviceStartDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid service start date.")
    .refine((value) => !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`)), "Use a valid service start date."),
  scopeSummary: z.string().trim().min(1, "Add a scope summary before sending the contract.").max(4000),
  signatureCompanyName: z.string().trim().min(1, "Add the company name for the signature block."),
});
type Context = { params: Promise<{ id: string }> };

export const runtime = "nodejs";

export async function POST(request: Request, context: Context) {
  try {
    const { id: clientId } = await context.params;
    const { supabase, user } = await requireAdmin();
    const parsed = contractSchema.safeParse(await request.json().catch(() => ({})));
    if (!parsed.success) return NextResponse.json({ error: "Invalid contract details." }, { status: 400 });

    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("id, name, business_name, email")
      .eq("id", clientId)
      .maybeSingle();
    if (clientError) throw clientError;
    if (!client) return NextResponse.json({ error: "Client not found." }, { status: 404 });

    let invoice = null;
    if (parsed.data.invoiceId) {
      const result = await supabase
        .from("invoices")
        .select("id, client_id, line_items, amount_due, currency, created_at")
        .eq("id", parsed.data.invoiceId)
        .eq("client_id", clientId)
        .maybeSingle();
      if (result.error) throw result.error;
      invoice = result.data;
    } else {
      const result = await supabase
        .from("invoices")
        .select("id, client_id, line_items, amount_due, currency, created_at")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (result.error) throw result.error;
      invoice = result.data;
    }

    const { data: contract, error: insertError } = await supabase
      .from("contracts")
      .insert({
        client_id: clientId,
        invoice_id: invoice?.id ?? null,
        signer_name: parsed.data.clientName,
        signer_email: parsed.data.clientEmail,
        template_envelope_id: process.env.DOCUMENSO_TEMPLATE_ENVELOPE_ID ?? null,
        service_start_date: parsed.data.serviceStartDate,
        scope_summary: parsed.data.scopeSummary,
        created_by: user.id,
      })
      .select()
      .single();
    if (insertError || !contract) throw insertError ?? new Error("Contract could not be created.");

    try {
      const result = await sendContract({
        contractId: contract.id,
        client: {
          name: parsed.data.clientName,
          email: parsed.data.clientEmail,
          business_name: parsed.data.companyName,
        },
        prefillFields: buildPrefillFields({
          client_name: parsed.data.clientName,
          company_name: parsed.data.companyName,
          package_name: parsed.data.packageName,
          service_fee: parsed.data.serviceFee,
          service_start_date: parsed.data.serviceStartDate,
          service_frequency: "Month-to-month",
          scope_summary: parsed.data.scopeSummary,
          signature_company_name: parsed.data.signatureCompanyName,
        }),
      });
      const { data: saved, error: saveError } = await supabase
        .from("contracts")
        .update({
          documenso_envelope_id: result.envelopeId,
          signing_url: result.signingUrl,
          status: "pending",
          sent_at: new Date().toISOString(),
          error_message: null,
        })
        .eq("id", contract.id)
        .select()
        .single();
      if (saveError || !saved) throw saveError ?? new Error("Contract details could not be saved.");
      return NextResponse.json({ contract: saved }, { status: 201 });
    } catch (error) {
      await supabase
        .from("contracts")
        .update({ status: "failed", error_message: messageFromError(error), failed_at: new Date().toISOString() })
        .eq("id", contract.id);
      return NextResponse.json({ error: "The contract could not be sent.", contractId: contract.id }, { status: 502 });
    }
  } catch (error) {
    return routeErrorResponse(error);
  }
}
