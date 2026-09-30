import Stripe from "stripe";
import { z } from "zod";
import { packages } from "@/content/services";

const catalogSchema = z.array(
  z.object({
    key: z.string().min(1),
    label: z.string().min(1).optional(),
    priceId: z.string().startsWith("price_"),
    scopeSummary: z.string().trim().min(1).optional(),
  }),
);

export type ConfiguredPrice = z.infer<typeof catalogSchema>[number];

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }

  return new Stripe(secretKey);
}

export function getConfiguredPrices() {
  const raw = process.env.STRIPE_PRICE_CATALOG_JSON;
  if (!raw) {
    return [];
  }

  try {
    return catalogSchema.parse(JSON.parse(raw));
  } catch {
    throw new Error("STRIPE_PRICE_CATALOG_JSON must be a valid price catalog JSON array.");
  }
}

export async function getConfiguredPriceDetails(priceId: string) {
  const configured = getConfiguredPrices().find((price) => price.priceId === priceId);
  if (!configured) {
    throw new Error("That Stripe Price is not enabled in the application catalog.");
  }

  const stripe = getStripe();
  const price = await stripe.prices.retrieve(priceId, { expand: ["product"] });

  if (!price.active) {
    throw new Error("That Stripe Price is inactive.");
  }

  if (price.unit_amount === null) {
    throw new Error("That Stripe Price must have a fixed unit amount for one-time invoices.");
  }

  const product = typeof price.product === "object" && price.product !== null ? price.product : null;
  const productName = product && "name" in product ? product.name : configured.label ?? priceId;
  const packageDefinition = packages.find((pkg) => pkg.id === configured.key);

  return {
    configured,
    price,
    productName,
    scopeSummary: configured.scopeSummary ?? packageDefinition?.contractScope ?? `Services included in the ${productName} package.`,
    snapshot: {
      key: configured.key,
      priceId: price.id,
      productId: typeof price.product === "string" ? price.product : product?.id ?? null,
      productName,
      currency: price.currency,
      unitAmount: price.unit_amount,
      type: "one_time" as const,
    },
  };
}

export async function createCustomer(input: {
  name: string;
  businessName: string;
  email: string;
  phone?: string | null;
  billingAddress?: Record<string, string>;
  localClientId: string;
}) {
  const stripe = getStripe();
  const rawAddress = input.billingAddress ?? {};
  const hasAddressDetails = Object.entries(rawAddress).some(([key, value]) => key !== "country" && Boolean(value));
  const address = hasAddressDetails
    ? Object.fromEntries(Object.entries(rawAddress).filter(([, value]) => Boolean(value)))
    : null;

  return stripe.customers.create(
    {
      name: input.name,
      email: input.email,
      phone: input.phone || undefined,
      address: address
        ? {
            line1: address.line1,
            line2: address.line2,
            city: address.city,
            state: address.state,
            postal_code: address.postal_code,
            country: address.country,
          }
        : undefined,
      metadata: {
        kate_client_id: input.localClientId,
        business_name: input.businessName,
      },
    },
    { idempotencyKey: `kate-client-${input.localClientId}` },
  );
}

export async function updateCustomer(input: {
  customerId: string;
  name: string;
  email: string;
  phone?: string | null;
  billingAddress?: Record<string, string>;
}) {
  const stripe = getStripe();
  const rawAddress = input.billingAddress ?? {};
  const hasAddressDetails = Object.entries(rawAddress).some(([key, value]) => key !== "country" && Boolean(value));
  const address = hasAddressDetails
    ? Object.fromEntries(Object.entries(rawAddress).filter(([, value]) => Boolean(value)))
    : undefined;

  return stripe.customers.update(input.customerId, {
    name: input.name,
    email: input.email,
    phone: input.phone || undefined,
    address: address
      ? {
          line1: address.line1,
          line2: address.line2,
          city: address.city,
          state: address.state,
          postal_code: address.postal_code,
          country: address.country,
        }
      : null,
  });
}

export async function deleteCustomer(customerId: string) {
  return getStripe().customers.del(customerId);
}

export async function updateInvoiceDueDate(stripeInvoiceId: string, dueDate: string) {
  return getStripe().invoices.update(stripeInvoiceId, {
    due_date: Math.floor(new Date(`${dueDate}T23:59:59.000Z`).getTime() / 1000),
  });
}

export async function removeStripeInvoice(stripeInvoiceId: string, status: string) {
  const stripe = getStripe();
  if (status === "draft" || status === "creating") {
    return stripe.invoices.del(stripeInvoiceId);
  }
  if (["open", "payment_failed"].includes(status)) {
    return stripe.invoices.voidInvoice(stripeInvoiceId);
  }
  throw new Error("This invoice cannot be deleted after it has been paid, voided, or marked uncollectible.");
}

export async function sendHostedInvoice(input: {
  invoiceId: string;
  stripeCustomerId: string;
  items: Array<{ priceId: string; quantity: number }>;
  dueDate: string;
  localClientId: string;
}) {
  const stripe = getStripe();
  const details = await Promise.all(input.items.map((item) => getConfiguredPriceDetails(item.priceId)));
  const unitAmounts = details.map((detail) => {
    if (detail.price.unit_amount === null) {
      throw new Error("All invoice prices must have a fixed unit amount.");
    }
    return detail.price.unit_amount;
  });
  const productIds = details.map((detail) => {
    const productId = typeof detail.price.product === "string" ? detail.price.product : detail.price.product?.id;
    if (!productId) {
      throw new Error("All invoice prices must be linked to a Stripe Product.");
    }
    return productId;
  });
  const lineItems = details.map((detail, index) => ({
    ...detail.snapshot,
    quantity: input.items[index].quantity,
  }));

  const draft = await stripe.invoices.create(
    {
      customer: input.stripeCustomerId,
      collection_method: "send_invoice",
      due_date: Math.floor(new Date(`${input.dueDate}T23:59:59.000Z`).getTime() / 1000),
      auto_advance: false,
      metadata: {
        kate_invoice_id: input.invoiceId,
        kate_client_id: input.localClientId,
      },
    },
    { idempotencyKey: `kate-invoice-${input.invoiceId}-draft` },
  );

  await Promise.all(
    input.items.map((item, index) =>
      stripe.invoiceItems.create(
        {
          customer: input.stripeCustomerId,
          invoice: draft.id,
          price_data: {
            currency: details[index].price.currency,
            product: productIds[index],
            unit_amount: unitAmounts[index],
          },
          quantity: item.quantity,
          description: details[index].productName,
          metadata: {
            kate_invoice_id: input.invoiceId,
            kate_client_id: input.localClientId,
          },
        },
        { idempotencyKey: `kate-invoice-${input.invoiceId}-item-${index}` },
      ),
    ),
  );

  const finalized = await stripe.invoices.finalizeInvoice(
    draft.id,
    { auto_advance: false },
    { idempotencyKey: `kate-invoice-${input.invoiceId}-finalize` },
  );
  const sent = await stripe.invoices.sendInvoice(
    finalized.id,
    {},
    { idempotencyKey: `kate-invoice-${input.invoiceId}-send` },
  );

  return { invoice: sent, lineItems };
}
