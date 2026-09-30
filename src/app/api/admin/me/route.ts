import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { routeErrorResponse } from "@/lib/route-errors";

export async function GET() {
  try {
    const { user } = await requireAdmin();
    return NextResponse.json({ id: user.id, email: user.email });
  } catch (error) {
    return routeErrorResponse(error);
  }
}
