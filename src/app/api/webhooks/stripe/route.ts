import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { finishProviderEvent, recordProviderEvent } from "@/lib/provider-events";
import { shouldAdvanceInvoiceStatus } from "@/lib/status";

export const runtime = "nodejs";

function isoFromUnix(value: number | null | undefined) {
  return value ? new Date(value * 1000).toISOString() : null;
}

function statusForEvent(type: string) {
  switch (type) {
    case "invoice.finalized":
    case "invoice.sent":
      return "open";
    case "invoice.paid":
      return "paid";
    case "invoice.payment_failed":
      return "payment_failed";
    case "invoice.voided":
      return "void";
    case "invoice.marked_uncollectible":
      return "uncollectible";
    default:
      return null;
  }
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!secret || !signature) {
    return NextResponse.json({ error: "Webhook is not configured." }, { status: 400 });
  }

  let event: Stripe.Event;
  const payload = await request.text();
  try {
    event = new Stripe(process.env.STRIPE_SECRET_KEY ?? "").webhooks.constructEvent(payload, signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  const stripeInvoice = event.data.object as Stripe.Invoice;
  const recorded = await recordProviderEvent({
    provider: "stripe",
    externalEventId: event.id,
    eventType: event.type,
    resourceId: typeof stripeInvoice.id === "string" ? stripeInvoice.id : null,
    payload: JSON.parse(payload),
  });
  if (recorded.duplicate) return NextResponse.json({ received: true, duplicate: true });

  try {
    const status = statusForEvent(event.type);
    if (!status || !event.type.startsWith("invoice.")) {
      await finishProviderEvent(recorded.eventId!, "ignored");
      return NextResponse.json({ received: true });
    }

    const supabase = createServiceClient();
    const { data: current, error: lookupError } = await supabase
      .from("invoices")
      .select("id, status")
      .eq("stripe_invoice_id", stripeInvoice.id)
      .maybeSingle();
    if (lookupError) throw lookupError;
    if (!current) {
      await finishProviderEvent(recorded.eventId!, "ignored", "Invoice is not linked to a local record.");
      return NextResponse.json({ received: true });
    }

    if (shouldAdvanceInvoiceStatus(current.status, status)) {
      await supabase
        .from("invoices")
        .update({
          status,
          currency: stripeInvoice.currency,
          amount_due: stripeInvoice.amount_due,
          amount_paid: stripeInvoice.amount_paid,
          hosted_invoice_url: stripeInvoice.hosted_invoice_url,
          invoice_pdf_url: stripeInvoice.invoice_pdf,
          due_at: isoFromUnix(stripeInvoice.due_date),
          sent_at: event.type === "invoice.sent" ? new Date().toISOString() : undefined,
          paid_at: event.type === "invoice.paid" ? isoFromUnix(stripeInvoice.status_transitions?.paid_at) : undefined,
          failed_at: event.type === "invoice.payment_failed" ? new Date().toISOString() : undefined,
        })
        .eq("id", current.id);
    }

    await finishProviderEvent(recorded.eventId!, "processed");
    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook processing failed.";
    await finishProviderEvent(recorded.eventId!, "failed", message);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}
