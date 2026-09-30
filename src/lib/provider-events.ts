import { createServiceClient } from "@/lib/supabase/service";

export async function recordProviderEvent(input: {
  provider: "stripe" | "documenso";
  externalEventId: string;
  eventType: string;
  resourceId?: string | null;
  payload: unknown;
}) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("provider_events")
    .insert({
      provider: input.provider,
      external_event_id: input.externalEventId,
      event_type: input.eventType,
      resource_id: input.resourceId ?? null,
      payload: input.payload as never,
    })
    .select("id")
    .single();

  if (error?.code === "23505") {
    return { duplicate: true, eventId: null };
  }

  if (error) {
    throw error;
  }

  return { duplicate: false, eventId: data.id };
}

export async function finishProviderEvent(eventId: string, status: "processed" | "ignored" | "failed", error?: string) {
  const supabase = createServiceClient();
  await supabase
    .from("provider_events")
    .update({
      processing_status: status,
      processing_error: error ?? null,
      processed_at: new Date().toISOString(),
    })
    .eq("id", eventId);
}
