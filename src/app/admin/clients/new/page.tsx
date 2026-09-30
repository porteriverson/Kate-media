import { redirect } from "next/navigation";
import { NewClientForm } from "@/components/admin/NewClientForm";
import { requireAdmin, isAdminAuthError } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function NewClientPage() {
  try {
    await requireAdmin();
  } catch (error) {
    if (isAdminAuthError(error)) redirect("/admin/login?next=/admin/clients/new");
    throw error;
  }

  return (
    <main className="pb-16">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blush-600">Client setup</p>
        <h1 className="mt-3 font-heading text-4xl text-ink">Add a new client</h1>
        <p className="mt-2 text-cocoa-500">Their Stripe Customer will be created as part of saving this form.</p>
      </div>
      <NewClientForm />
    </main>
  );
}
