import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin, isAdminAuthError } from "@/lib/admin-auth";
import { ClientRowActions } from "@/components/admin/RecordMenus";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  let supabase;
  try {
    ({ supabase } = await requireAdmin());
  } catch (error) {
    if (isAdminAuthError(error)) redirect("/admin/login?next=/admin");
    throw error;
  }

  const { data: clients, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;

  return (
    <main className="pb-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blush-600">Overview</p>
          <h1 className="mt-3 font-heading text-4xl text-ink">Clients</h1>
          <p className="mt-2 text-cocoa-500">Create a client, then send their invoice and contract from one place.</p>
        </div>
        <Link href="/admin/clients/new" className="rounded-full bg-blush-300 px-5 py-3 text-center font-medium text-cocoa-800 hover:bg-blush-400">Add client</Link>
      </div>

      <div className="mt-8 rounded-3xl border border-cocoa-100 bg-cream">
        {clients?.length ? (
          <div className="divide-y divide-cocoa-100">
            {clients.map((client) => (
              <div key={client.id} className="flex flex-col gap-3 px-6 py-5 transition hover:bg-ivory sm:flex-row sm:items-center sm:justify-between">
                <Link href={`/admin/clients/${client.id}`} className="min-w-0 flex-1">
                  <h2 className="font-heading text-2xl text-ink">{client.business_name}</h2>
                  <p className="text-sm text-cocoa-500">{client.name} · {client.email}</p>
                </Link>
                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <span className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${client.stripe_sync_status === "synced" ? "bg-blush-100 text-cocoa-700" : "bg-cocoa-50 text-cocoa-500"}`}>
                    Stripe {client.stripe_sync_status}
                  </span>
                  <ClientRowActions client={client} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <h2 className="font-heading text-2xl text-ink">No clients yet</h2>
            <p className="mt-2 text-cocoa-500">Create the first client to begin the workflow.</p>
          </div>
        )}
      </div>
    </main>
  );
}
