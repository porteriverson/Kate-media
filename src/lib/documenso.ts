import { z } from "zod";

const documentResponseSchema = z.object({
  id: z.string(),
  recipients: z.array(
    z.object({
      signingUrl: z.string().url().optional(),
      email: z.string().email().optional(),
    }),
  ).optional(),
});

const envelopeFieldsResponseSchema = z.object({
  id: z.string(),
  fields: z.array(
    z.object({
      id: z.number().int().positive(),
      type: z.string(),
      fieldMeta: z.record(z.string(), z.unknown()).nullable().optional(),
    }),
  ),
});

const prefillFieldSchema = z.object({
  fieldId: z.number().int().positive(),
  type: z.enum(["text", "number", "date", "radio", "checkbox", "dropdown", "signature", "name"]),
});

const prefillMapSchema = z.record(z.string(), prefillFieldSchema);

function getConfig() {
  const token = process.env.DOCUMENSO_API_TOKEN;
  const templateEnvelopeId = process.env.DOCUMENSO_TEMPLATE_ENVELOPE_ID;

  if (!token || !templateEnvelopeId) {
    throw new Error("Documenso API and template configuration are not complete.");
  }

  return {
    token,
    templateEnvelopeId,
    baseUrl: process.env.DOCUMENSO_API_BASE_URL ?? "https://app.documenso.com/api/v2",
    recipientId: Number(process.env.DOCUMENSO_SIGNER_RECIPIENT_ID ?? "1"),
  };
}

function getPrefillMap() {
  const raw = process.env.DOCUMENSO_PREFILL_FIELDS_JSON;
  if (!raw) {
    return {};
  }

  try {
    return prefillMapSchema.parse(JSON.parse(raw));
  } catch {
    throw new Error("DOCUMENSO_PREFILL_FIELDS_JSON must map field names to field IDs and Documenso field types.");
  }
}

async function documensoRequest<T>(path: string, init: RequestInit) {
  const { token, baseUrl } = getConfig();
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      Authorization: token,
      ...(init.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Documenso request failed (${response.status}): ${body.slice(0, 500)}`);
  }

  return (await response.json()) as T;
}

async function ensureTemplatePrefillFieldsReadOnly(
  templateEnvelopeId: string,
  prefillFields: Array<{ id: number; type: string; value: string }>,
) {
  if (prefillFields.length === 0) return;

  const templateRaw = await documensoRequest<unknown>(`/envelope/${templateEnvelopeId}`, {
    method: "GET",
  });
  const template = envelopeFieldsResponseSchema.parse(templateRaw);
  const fieldsById = new Map(template.fields.map((field) => [field.id, field]));
  const updates = prefillFields.flatMap((field) => {
    const templateField = fieldsById.get(field.id);
    if (!templateField) {
      throw new Error(`Documenso template field ${field.id} was not found.`);
    }
    if (templateField.type.toLowerCase() !== field.type.toLowerCase()) {
      throw new Error(`Documenso template field ${field.id} has an unexpected type.`);
    }
    if (templateField.fieldMeta?.readOnly === true && templateField.fieldMeta.required !== true) return [];

    const fieldMeta = templateField.fieldMeta ?? {};
    return [{
      id: field.id,
      type: templateField.type,
      fieldMeta: {
        ...fieldMeta,
        type: typeof fieldMeta.type === "string" ? fieldMeta.type : field.type,
        required: false,
        readOnly: true,
      },
    }];
  });

  if (updates.length === 0) return;

  await documensoRequest<unknown>("/envelope/field/update-many", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ envelopeId: templateEnvelopeId, data: updates }),
  });
}

export function buildPrefillFields(values: Record<string, string | null | undefined>) {
  return Object.entries(getPrefillMap())
    .map(([name, field]) => ({
      id: field.fieldId,
      type: field.type,
      value: values[name] ?? "",
    }))
    // Signature, name, and date fields are completed automatically or by the
    // signer. Documenso's template prefill API accepts data fields only.
    .filter((field) => ["text", "number", "date", "radio", "checkbox", "dropdown"].includes(field.type))
    .filter((field) => field.value.length > 0);
}

export async function sendContract(input: {
  contractId: string;
  client: { name: string; email: string; business_name: string };
  prefillFields: Array<{ id: number; type: string; value: string }>;
}) {
  const { templateEnvelopeId, recipientId } = getConfig();
  await ensureTemplatePrefillFieldsReadOnly(templateEnvelopeId, input.prefillFields);
  const payload = {
    envelopeId: templateEnvelopeId,
    externalId: `kate-contract-${input.contractId}`,
    recipients: [
      {
        id: recipientId,
        email: input.client.email,
        name: input.client.name,
      },
    ],
    prefillFields: input.prefillFields,
    distributeDocument: false,
  };
  const form = new FormData();
  form.append("payload", JSON.stringify(payload));

  const createdRaw = await documensoRequest<unknown>("/envelope/use", {
    method: "POST",
    body: form,
  });
  const created = documentResponseSchema.parse(createdRaw);

  const distributedRaw = await documensoRequest<unknown>("/envelope/distribute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ envelopeId: created.id }),
  });
  const distributed = documentResponseSchema.parse(distributedRaw);
  const signingUrl = distributed.recipients?.find((recipient) => recipient.email === input.client.email)?.signingUrl
    ?? distributed.recipients?.[0]?.signingUrl
    ?? created.recipients?.[0]?.signingUrl
    ?? null;

  return { envelopeId: created.id, signingUrl };
}
