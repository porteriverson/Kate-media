import { AdminNav } from "@/components/admin/AdminNav";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

async function isAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data: admin } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  return Boolean(admin);
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authenticated = await isAdmin();

  return (
    <div className="bg-ivory/40">
      <div className="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:px-10">
        {authenticated ? <AdminNav /> : null}
        {children}
      </div>
    </div>
  );
}
