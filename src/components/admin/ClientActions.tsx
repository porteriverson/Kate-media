"use client";

import { useEffect, useState } from "react";

type Price = {
  priceId: string;
  label: string;
  productName: string;
  currency: string;
  unitAmount: number | null;
  scopeSummary: string;
};

function priceLabel(price: Price) {
  if (price.unitAmount === null) return "";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: price.currency.toUpperCase() }).format(price.unitAmount / 100);
}

function Modal({ title, children, onClose, maxWidth = "max-w-xl" }: { title: string; children: React.ReactNode; onClose: () => void; maxWidth?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cocoa-800/30 p-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-label={title} className={`max-h-[90vh] w-full ${maxWidth} overflow-y-auto rounded-3xl border border-cocoa-100 bg-cream p-6 shadow-2xl sm:p-8`}>
        <div className="flex items-start justify-between gap-5">
          <h2 className="font-heading text-3xl text-ink">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-2xl leading-none text-cocoa-400 hover:text-cocoa-800">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ErrorMessage({ error }: { error: string | null }) {
  return error ? <p role="alert" className="mt-4 rounded-xl bg-blush-50 px-4 py-3 text-sm text-blush-600">{error}</p> : null;
}

export function NewInvoiceAction({ clientId }: { clientId: string }) {
  const [open, setOpen] = useState(false);
  const [prices, setPrices] = useState<Price[]>([]);
  const [selectedPrice, setSelectedPrice] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [dueDate, setDueDate] = useState("");
  const [busy, setBusy] = useState(false);
  const [requestKey, setRequestKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    fetch("/api/admin/catalog")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Price catalog could not be loaded.");
        setPrices(result.prices);
        setSelectedPrice((current) => current || result.prices[0]?.priceId || "");
      })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Price catalog could not be loaded."));
  }, [open]);

  function close() {
    if (busy) return;
    setOpen(false);
    setError(null);
  }

  async function sendInvoice() {
    if (!selectedPrice) {
      setError("Configure at least one package before sending an invoice.");
      return;
    }
    if (!dueDate) {
      setError("Choose a due date before sending the invoice.");
      return;
    }
    if (!window.confirm("Send this hosted invoice to the client now?")) return;
    setBusy(true);
    setError(null);
    const idempotencyKey = requestKey ?? crypto.randomUUID();
    if (!requestKey) setRequestKey(idempotencyKey);
    try {
      const response = await fetch(`/api/admin/clients/${clientId}/invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [{ priceId: selectedPrice, quantity }], dueDate, idempotencyKey }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Invoice could not be sent.");
      window.location.reload();
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "Invoice could not be sent.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button type="button" onClick={() => { setError(null); setOpen(true); }} className="rounded-full bg-blush-300 px-4 py-2.5 text-sm font-medium text-cocoa-800 hover:bg-blush-400">
        Send new invoice
      </button>
      {open ? (
        <Modal title="Send new invoice" onClose={close}>
          <p className="mt-2 text-sm leading-6 text-cocoa-500">Choose the package, quantity, and due date for this invoice.</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto]">
            <label className="flex flex-col gap-2 text-sm font-medium text-ink">
              Package
              <select value={selectedPrice} onChange={(event) => { setSelectedPrice(event.target.value); setRequestKey(null); }} className="rounded-xl border border-cocoa-200 bg-ivory px-4 py-3 font-normal">
                {prices.length === 0 ? <option value="">No catalog configured</option> : null}
                {prices.map((price) => (
                  <option key={price.priceId} value={price.priceId}>
                    {price.label} · {price.currency.toUpperCase()} {price.unitAmount === null ? "custom" : (price.unitAmount / 100).toFixed(2)}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-ink">
              Quantity
              <input type="number" min={1} max={100} value={quantity} onChange={(event) => { setQuantity(Number(event.target.value)); setRequestKey(null); }} className="w-24 rounded-xl border border-cocoa-200 bg-ivory px-4 py-3 font-normal" />
            </label>
          </div>
          <div className="mt-5 max-w-xs">
            <label className="flex flex-col gap-2 text-sm font-medium text-ink">
              Due date
              <input type="date" value={dueDate} onChange={(event) => { setDueDate(event.target.value); setRequestKey(null); }} className="rounded-xl border border-cocoa-200 bg-ivory px-4 py-3 font-normal" required />
            </label>
          </div>
          <ErrorMessage error={error} />
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" disabled={busy} onClick={close} className="rounded-full px-5 py-3 text-sm text-cocoa-600 hover:bg-ivory disabled:opacity-50">Cancel</button>
            <button type="button" disabled={busy} onClick={sendInvoice} className="rounded-full bg-blush-300 px-5 py-3 font-medium text-cocoa-800 hover:bg-blush-400 disabled:opacity-60">
              {busy ? "Sending…" : "Send invoice"}
            </button>
          </div>
        </Modal>
      ) : null}
    </>
  );
}

export function NewContractAction({
  clientId,
  invoiceId,
  initialClientName = "",
  initialClientEmail = "",
  initialCompanyName = "",
  initialPackageName = "",
  initialServiceFee = "",
  initialServiceStartDate = "",
  initialScopeSummary = "",
  initialSignatureCompanyName = "",
}: {
  clientId: string;
  invoiceId?: string;
  initialClientName?: string;
  initialClientEmail?: string;
  initialCompanyName?: string;
  initialPackageName?: string;
  initialServiceFee?: string;
  initialServiceStartDate?: string;
  initialScopeSummary?: string;
  initialSignatureCompanyName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [prices, setPrices] = useState<Price[]>([]);
  const [form, setForm] = useState({
    clientName: initialClientName,
    clientEmail: initialClientEmail,
    companyName: initialCompanyName,
    packagePriceId: "",
    packageName: initialPackageName,
    serviceFee: initialServiceFee,
    serviceStartDate: initialServiceStartDate,
    scopeSummary: initialScopeSummary,
    signatureCompanyName: initialSignatureCompanyName,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    fetch("/api/admin/catalog")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Price catalog could not be loaded.");
        const catalog = result.prices as Price[];
        setPrices(catalog);
        const selected = catalog.find((price) => price.productName === initialPackageName || price.label === initialPackageName) ?? catalog[0];
        if (selected) {
          setForm((current) => ({
            ...current,
            packagePriceId: selected.priceId,
            packageName: selected.productName,
            serviceFee: priceLabel(selected) || current.serviceFee,
            scopeSummary: selected.scopeSummary || current.scopeSummary,
          }));
        }
      })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Price catalog could not be loaded."));
  }, [initialPackageName, open]);

  function setField(name: string, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function selectPackage(priceId: string) {
    const selected = prices.find((price) => price.priceId === priceId);
    if (!selected) return;
    setForm((current) => ({
      ...current,
      packagePriceId: selected.priceId,
      packageName: selected.productName,
      serviceFee: priceLabel(selected) || current.serviceFee,
      scopeSummary: selected.scopeSummary,
    }));
  }

  function close() {
    if (busy) return;
    setOpen(false);
    setError(null);
  }

  async function sendContract() {
    if (!form.clientName.trim() || !form.clientEmail.trim() || !form.companyName.trim() || !form.packageName.trim() || !form.serviceFee.trim() || !form.serviceStartDate || !form.scopeSummary.trim() || !form.signatureCompanyName.trim()) {
      setError("Complete all contract fields before sending.");
      return;
    }
    if (!window.confirm("Send the contract for e-signature now?")) return;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/clients/${clientId}/contracts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(invoiceId ? { invoiceId } : {}),
          clientName: form.clientName.trim(),
          clientEmail: form.clientEmail.trim(),
          companyName: form.companyName.trim(),
          packageName: form.packageName.trim(),
          serviceFee: form.serviceFee.trim(),
          serviceStartDate: form.serviceStartDate,
          scopeSummary: form.scopeSummary.trim(),
          signatureCompanyName: form.signatureCompanyName.trim(),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Contract could not be sent.");
      window.location.reload();
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "Contract could not be sent.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button type="button" onClick={() => { setError(null); setOpen(true); }} className="rounded-full bg-blush-300 px-4 py-2.5 text-sm font-medium text-cocoa-800 hover:bg-blush-400">
        Send new contract
      </button>
      {open ? (
        <Modal title="Send new contract" onClose={close} maxWidth="max-w-2xl">
          <p className="mt-2 max-w-xl text-sm leading-6 text-cocoa-500">Review every field that will be prefilled in the contract before it is emailed to the client.</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium text-ink">
              Client name
              <input type="text" value={form.clientName} onChange={(event) => setField("clientName", event.target.value)} className="rounded-xl border border-cocoa-200 bg-ivory px-4 py-3 font-normal" required />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-ink">
              Client email
              <input type="email" value={form.clientEmail} onChange={(event) => setField("clientEmail", event.target.value)} className="rounded-xl border border-cocoa-200 bg-ivory px-4 py-3 font-normal" required />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-ink">
              Company name
              <input type="text" value={form.companyName} onChange={(event) => setField("companyName", event.target.value)} className="rounded-xl border border-cocoa-200 bg-ivory px-4 py-3 font-normal" required />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-ink">
              Package
              <select value={form.packagePriceId} onChange={(event) => selectPackage(event.target.value)} className="rounded-xl border border-cocoa-200 bg-ivory px-4 py-3 font-normal" required>
                {prices.length === 0 ? <option value="">No catalog configured</option> : null}
                {prices.map((price) => (
                  <option key={price.priceId} value={price.priceId}>
                    {price.productName} · {price.currency.toUpperCase()} {price.unitAmount === null ? "custom" : (price.unitAmount / 100).toFixed(2)}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-ink">
              Service fee
              <input type="text" value={form.serviceFee} onChange={(event) => setField("serviceFee", event.target.value)} placeholder="$450.00" className="rounded-xl border border-cocoa-200 bg-ivory px-4 py-3 font-normal" required />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-ink">
              Service start date
              <input type="date" value={form.serviceStartDate} onChange={(event) => setField("serviceStartDate", event.target.value)} className="rounded-xl border border-cocoa-200 bg-ivory px-4 py-3 font-normal" required />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-ink sm:col-span-2">
              Scope summary
              <textarea value={form.scopeSummary} onChange={(event) => setField("scopeSummary", event.target.value)} rows={5} maxLength={4000} placeholder="Briefly describe the services included in this package." className="resize-y rounded-xl border border-cocoa-200 bg-ivory px-4 py-3 font-normal leading-6" required />
              <span className="font-normal text-cocoa-400">Keep it concise and client-friendly.</span>
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-ink sm:col-span-2">
              Signature company name
              <input type="text" value={form.signatureCompanyName} onChange={(event) => setField("signatureCompanyName", event.target.value)} className="rounded-xl border border-cocoa-200 bg-ivory px-4 py-3 font-normal" required />
            </label>
          </div>
          <p className="mt-4 text-sm leading-6 text-cocoa-500">The client signature, printed name, and signed date are completed by the client in Documenso.</p>
          <ErrorMessage error={error} />
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" disabled={busy} onClick={close} className="rounded-full px-5 py-3 text-sm text-cocoa-600 hover:bg-ivory disabled:opacity-50">Cancel</button>
            <button type="button" disabled={busy} onClick={sendContract} className="rounded-full bg-blush-300 px-5 py-3 font-medium text-cocoa-800 hover:bg-blush-400 disabled:opacity-60">
              {busy ? "Sending…" : "Send contract"}
            </button>
          </div>
        </Modal>
      ) : null}
    </>
  );
}
