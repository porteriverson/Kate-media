import { NextResponse } from "next/server";
import { isAdminAuthError } from "@/lib/admin-auth";

export function routeErrorResponse(error: unknown) {
  if (isAdminAuthError(error)) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  console.error(error);
  return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
}

export function messageFromError(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}
