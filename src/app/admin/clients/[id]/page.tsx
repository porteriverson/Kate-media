import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { NewContractAction, NewInvoiceAction } from "@/components/admin/ClientActions";
import { ClientRowActions, ContractActions, InvoiceActions } from "@/components/admin/RecordMenus";
import { requireAdmin, isAdminAuthError } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

function date(value: string | null) {
  return value ? new Date(value).toLocaleDateString("en-US", { dateStyle: "medium" }) : "—";
}

function firstLineItemValue(lineItems: unknown, key: string) {
  if (!Array.isArray(lineItems) || !lineItems[0] || typeof lineItems[0] !== "object" || Array.isArray(lineItems[0])) return "";
  const value = (lineItems[0] as Record<string, unknown>)[key];
  return typeof value === "string" ? value : "";
}

function money(amount: number | null | undefined, currency: string | null | undefined) {
  if (amount === null || amount === undefined || !currency) return "";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(amount / 100);
}

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  let supabase;
  try {
    ({ supabase } = await requireAdmin());
  } catch (error) {
    if (isAdminAuthError(error)) redirect("/admin/login");
    throw error;
  }

  const { id } = await params;
  const [clientResult, invoicesResult, contractsResult] = await Promise.all([
    supabase.from("clients").select("*").eq("id", id).maybeSingle(),
    supabase.from("invoices").select("*").eq("client_id", id).order("created_at", { ascending: false }),
    supabase.from("contracts").select("*").eq("client_id", id).order("created_at", { ascending: false }),
  ]);
  if (clientResult.error) throw clientResult.error;
  if (invoicesResult.error) throw invoicesResult.error;
  if (contractsResult.error) throw contractsResult.error;
  if (!clientResult.data) notFound();

  const client = clientResult.data;
  const latestInvoice = invoicesResult.data?.[0];
  const latestContract = contractsResult.data?.[0];
  const latestPackageName = firstLineItemValue(latestInvoice?.line_items, "productName");
  const latestServiceFee = money(latestInvoice?.amount_due, latestInvoice?.currency);

  return (
    <main className="pb-16">
      <Link href="/admin" className="text-sm text-cocoa-500 underline-offset-4 hover:text-blush-600 hover:underline">← Back to clients</Link>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blush-600">Client</p>
          <h1 className="mt-3 font-heading text-4xl text-ink">{client.business_name}</h1>
          <p className="mt-2 text-cocoa-500">{client.name} · {client.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-blush-100 px-3 py-1 text-xs font-medium text-cocoa-700">Stripe {client.stripe_sync_status}</span>
        </div>
      </div>

      {client.stripe_sync_error ? <p className="mt-5 rounded-xl bg-blush-50 px-4 py-3 text-sm text-blush-600">Stripe sync error: {client.stripe_sync_error}</p> : null}

      <section className="mt-8 rounded-3xl border border-cocoa-100 bg-cream p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-heading text-3xl text-ink">Invoices</h2>
          <NewInvoiceAction clientId={client.id} />
        </div>
        {invoicesResult.data?.length ? <div className="mt-5 divide-y divide-cocoa-100">{invoicesResult.data.map((invoice) => (
          <div key={invoice.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="font-medium text-ink">{invoice.amount_due === null ? "Amount pending" : `${(invoice.amount_due / 100).toFixed(2)} ${(invoice.currency ?? "").toUpperCase()}`}</p><p className="text-sm text-cocoa-500">{date(invoice.created_at)} · {invoice.status}</p></div>
            <div className="flex items-center gap-4">
              {invoice.hosted_invoice_url ? <a href={invoice.hosted_invoice_url} target="_blank" rel="noreferrer" className="text-sm text-blush-600 underline-offset-4 hover:underline">Open hosted invoice</a> : null}
              <InvoiceActions invoice={invoice} />
            </div>
          </div>
        ))}</div> : <p className="mt-3 text-sm text-cocoa-500">No invoices yet.</p>}
      </section>

      <section className="mt-6 rounded-3xl border border-cocoa-100 bg-cream p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-heading text-3xl text-ink">Contracts</h2>
          <NewContractAction
            clientId={client.id}
            invoiceId={latestInvoice?.id}
            initialClientName={client.name}
            initialClientEmail={client.email}
            initialCompanyName={client.business_name}
            initialPackageName={latestPackageName}
            initialServiceFee={latestServiceFee}
            initialServiceStartDate={latestContract?.service_start_date ?? ""}
            initialScopeSummary={latestContract?.scope_summary ?? ""}
            initialSignatureCompanyName={client.business_name}
          />
        </div>
        {contractsResult.data?.length ? <div className="mt-5 divide-y divide-cocoa-100">{contractsResult.data.map((contract) => (
          <div key={contract.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-ink">{contract.signer_name}</p>
              <p className="text-sm text-cocoa-500">{date(contract.created_at)} · {contract.status}</p>
              {contract.service_start_date ? <p className="mt-1 text-sm text-cocoa-500">Starts {date(contract.service_start_date)}</p> : null}
              {contract.scope_summary ? <p className="mt-2 max-w-2xl whitespace-pre-wrap text-sm leading-6 text-cocoa-600">{contract.scope_summary}</p> : null}
            </div>
            <div className="flex items-center gap-4">
              {contract.signing_url ? <a href={contract.signing_url} target="_blank" rel="noreferrer" className="text-sm text-blush-600 underline-offset-4 hover:underline">Open signing link</a> : null}
              <ContractActions contract={contract} />
            </div>
          </div>
        ))}</div> : <p className="mt-3 text-sm text-cocoa-500">No contracts yet.</p>}
      </section>

      <section className="mt-6 rounded-3xl border border-cocoa-100 bg-cream p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-heading text-3xl text-ink">Details</h2>
          <ClientRowActions client={client} redirectTo="/admin" />
        </div>
        <dl className="mt-5 grid gap-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div><dt className="text-cocoa-400">Phone</dt><dd className="mt-1 text-cocoa-700">{client.phone || "—"}</dd></div>
          <div><dt className="text-cocoa-400">Stripe Customer</dt><dd className="mt-1 break-all text-cocoa-700">{client.stripe_customer_id || "Not linked"}</dd></div>
          <div><dt className="text-cocoa-400">Created</dt><dd className="mt-1 text-cocoa-700">{date(client.created_at)}</dd></div>
          {client.notes ? <div className="sm:col-span-2 lg:col-span-1"><dt className="text-cocoa-400">Notes</dt><dd className="mt-1 whitespace-pre-wrap text-cocoa-700">{client.notes}</dd></div> : null}
        </dl>
      </section>
    </main>
  );
}
