import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { createCustomer } from "@/lib/stripe";
import { messageFromError, routeErrorResponse } from "@/lib/route-errors";

const addressSchema = z.record(z.string(), z.string()).default({});
const clientSchema = z.object({
  name: z.string().trim().min(1),
  businessName: z.string().trim().min(1),
  email: z.string().trim().email(),
  phone: z.string().trim().max(80).optional().or(z.literal("")),
  billingAddress: addressSchema,
  notes: z.string().trim().max(5000).optional().or(z.literal("")),
});

export async function GET() {
  try {
    const { supabase } = await requireAdmin();
    const { data, error } = await supabase
      .from("clients")
      .select("id, name, business_name, email, stripe_sync_status, created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ clients: data });
  } catch (error) {
    return routeErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const { supabase, user } = await requireAdmin();
    const parsed = clientSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Please check the client details." }, { status: 400 });
    }

    const input = parsed.data;
    const { data: client, error: insertError } = await supabase
      .from("clients")
      .insert({
        name: input.name,
        business_name: input.businessName,
        email: input.email,
        phone: input.phone || null,
        billing_address: input.billingAddress,
        notes: input.notes || null,
        created_by: user.id,
      })
      .select()
      .single();

    if (insertError || !client) throw insertError ?? new Error("Client could not be created.");

    try {
      const stripeCustomer = await createCustomer({
        name: client.name,
        businessName: client.business_name,
        email: client.email,
        phone: client.phone,
        billingAddress: client.billing_address as Record<string, string>,
        localClientId: client.id,
      });
      const { data: synced, error: syncError } = await supabase
        .from("clients")
        .update({
          stripe_customer_id: stripeCustomer.id,
          stripe_sync_status: "synced",
          stripe_sync_error: null,
        })
        .eq("id", client.id)
        .select()
        .single();

      if (syncError || !synced) throw syncError ?? new Error("Stripe customer link failed.");
      return NextResponse.json({ client: synced }, { status: 201 });
    } catch (error) {
      await supabase
        .from("clients")
        .update({ stripe_sync_status: "failed", stripe_sync_error: messageFromError(error) })
        .eq("id", client.id);

      return NextResponse.json(
        { error: "The client was saved, but the Stripe Customer could not be created.", clientId: client.id },
        { status: 502 },
      );
    }
  } catch (error) {
    return routeErrorResponse(error);
  }
}
