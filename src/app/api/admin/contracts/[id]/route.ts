import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { routeErrorResponse } from "@/lib/route-errors";

type Context = { params: Promise<{ id: string }> };

const contractUpdateSchema = z.object({
  signerName: z.string().trim().min(1),
  signerEmail: z.string().trim().email(),
  serviceStartDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid service start date.")
    .refine((value) => !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`)), "Use a valid service start date."),
  scopeSummary: z.string().trim().min(1).max(4000),
});

export async function PATCH(request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const { supabase } = await requireAdmin();
    const parsed = contractUpdateSchema.safeParse(await request.json().catch(() => ({})));
    if (!parsed.success) return NextResponse.json({ error: "Please check the contract details." }, { status: 400 });

    const { data: contract, error: lookupError } = await supabase
      .from("contracts")
      .select("id, documenso_envelope_id, status")
      .eq("id", id)
      .maybeSingle();
    if (lookupError) throw lookupError;
    if (!contract) return NextResponse.json({ error: "Contract not found." }, { status: 404 });
    if (contract.documenso_envelope_id) {
      return NextResponse.json({ error: "Sent contracts cannot be edited. Create a new contract if the details changed." }, { status: 409 });
    }

    const { data, error } = await supabase
      .from("contracts")
      .update({
        signer_name: parsed.data.signerName,
        signer_email: parsed.data.signerEmail,
        service_start_date: parsed.data.serviceStartDate,
        scope_summary: parsed.data.scopeSummary,
      })
      .eq("id", id)
      .select()
      .single();
    if (error || !data) throw error ?? new Error("Contract could not be updated.");
    return NextResponse.json({ contract: data });
  } catch (error) {
    return routeErrorResponse(error);
  }
}

export async function DELETE(_request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const { supabase } = await requireAdmin();
    const { data: contract, error: lookupError } = await supabase
      .from("contracts")
      .select("id, documenso_envelope_id")
      .eq("id", id)
      .maybeSingle();
    if (lookupError) throw lookupError;
    if (!contract) return NextResponse.json({ error: "Contract not found." }, { status: 404 });
    if (contract.documenso_envelope_id) {
      return NextResponse.json({ error: "Sent contracts cannot be deleted because their Documenso envelope is still active." }, { status: 409 });
    }

    const { error } = await supabase.from("contracts").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return routeErrorResponse(error);
  }
}
