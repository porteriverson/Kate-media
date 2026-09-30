import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getConfiguredPriceDetails, getConfiguredPrices } from "@/lib/stripe";
import { routeErrorResponse } from "@/lib/route-errors";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdmin();
    const prices = await Promise.all(
      getConfiguredPrices().map(async (configured) => {
        const details = await getConfiguredPriceDetails(configured.priceId);
        return {
          key: configured.key,
          label: configured.label ?? details.productName,
          priceId: details.price.id,
          productName: details.productName,
          scopeSummary: details.scopeSummary,
          currency: details.price.currency,
          unitAmount: details.price.unit_amount,
          type: "one_time",
        };
      }),
    );

    return NextResponse.json({ prices });
  } catch (error) {
    return routeErrorResponse(error);
  }
}
