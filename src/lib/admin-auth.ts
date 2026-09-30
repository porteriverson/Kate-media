import { createClient } from "@/lib/supabase/server";

export class AdminAuthError extends Error {
  constructor() {
    super("Admin authentication is required.");
    this.name = "AdminAuthError";
  }
}

export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new AdminAuthError();
  }

  const { data: admin, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError || !admin) {
    throw new AdminAuthError();
  }

  return { supabase, user };
}

export function isAdminAuthError(error: unknown): error is AdminAuthError {
  return error instanceof AdminAuthError;
}
