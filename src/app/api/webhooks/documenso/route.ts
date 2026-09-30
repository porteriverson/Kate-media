import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { finishProviderEvent, recordProviderEvent } from "@/lib/provider-events";

export const runtime = "nodejs";

function statusForEvent(event: string) {
  switch (event) {
    case "DOCUMENT_SENT": return "pending";
    case "DOCUMENT_OPENED": return "opened";
    case "DOCUMENT_RECIPIENT_COMPLETED":
    case "DOCUMENT_SIGNED": return "signed";
    case "DOCUMENT_COMPLETED": return "completed";
    case "DOCUMENT_REJECTED": return "rejected";
    case "DOCUMENT_CANCELLED": return "cancelled";
    case "RECIPIENT_EXPIRED":
    case "DOCUMENT_EXPIRED": return "expired";
    default: return null;
  }
}

const statusRank: Record<string, number> = {
  creating: 0,
  draft: 0,
  pending: 1,
  opened: 2,
  signed: 3,
  completed: 4,
  rejected: 4,
  cancelled: 4,
  expired: 4,
  failed: 0,
};

export async function POST(request: Request) {
  const expectedSecret = process.env.DOCUMENSO_WEBHOOK_SECRET;
  const receivedSecret = request.headers.get("x-documenso-secret");
  if (!expectedSecret || receivedSecret !== expectedSecret) {
    return NextResponse.json({ error: "Invalid webhook secret." }, { status: 401 });
  }

  const body = await request.json().catch(() => null) as {
    event?: string;
    createdAt?: string;
    payload?: { envelopeId?: string; id?: string };
  } | null;
  if (!body?.event || !body.payload) {
    return NextResponse.json({ error: "Invalid webhook payload." }, { status: 400 });
  }

  const envelopeId = body.payload.envelopeId ?? body.payload.id ?? null;
  const eventId = request.headers.get("x-documenso-event-id")
    ?? `${envelopeId ?? "unknown"}:${body.event}:${body.createdAt ?? "unknown"}`;
  const recorded = await recordProviderEvent({
    provider: "documenso",
    externalEventId: eventId,
    eventType: body.event,
    resourceId: envelopeId,
    payload: body,
  });
  if (recorded.duplicate) return NextResponse.json({ received: true, duplicate: true });

  try {
    const status = statusForEvent(body.event);
    if (!status || !envelopeId) {
      await finishProviderEvent(recorded.eventId!, "ignored");
      return NextResponse.json({ received: true });
    }

    const supabase = createServiceClient();
    const { data: contract, error: lookupError } = await supabase
      .from("contracts")
      .select("id, status")
      .eq("documenso_envelope_id", envelopeId)
      .maybeSingle();
    if (lookupError) throw lookupError;
    if (!contract) {
      await finishProviderEvent(recorded.eventId!, "ignored", "Envelope is not linked to a local contract.");
      return NextResponse.json({ received: true });
    }

    if ((statusRank[status] ?? 0) >= (statusRank[contract.status] ?? 0)) {
      await supabase
        .from("contracts")
        .update({
          status,
          completed_at: status === "completed" ? new Date().toISOString() : undefined,
        })
        .eq("id", contract.id);
    }

    await finishProviderEvent(recorded.eventId!, "processed");
    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook processing failed.";
    await finishProviderEvent(recorded.eventId!, "failed", message);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}
