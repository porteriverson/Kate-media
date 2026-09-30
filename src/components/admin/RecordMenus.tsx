"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Database, Json } from "@/lib/supabase/database.types";

type Client = Database["public"]["Tables"]["clients"]["Row"];
type Invoice = Database["public"]["Tables"]["invoices"]["Row"];
type Contract = Database["public"]["Tables"]["contracts"]["Row"];

function record(value: Json): Record<string, string> {
  if (!value || Array.isArray(value) || typeof value !== "object") return {};
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, typeof item === "string" ? item : ""]));
}

function ActionMenu({ onEdit, onDelete, deleteDisabled = false }: { onEdit: () => void; onDelete: () => void; deleteDisabled?: boolean }) {
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function close(event: MouseEvent) {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div ref={container} className="relative shrink-0">
      <button
        type="button"
        aria-label="More options"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-xl leading-none text-cocoa-500 hover:bg-cocoa-50 hover:text-cocoa-800"
      >
        <span aria-hidden="true">⋮</span>
      </button>
      {open ? (
        <div role="menu" className="absolute right-0 top-11 z-40 min-w-44 overflow-hidden rounded-xl border border-cocoa-100 bg-cream py-1 shadow-lg">
          <button type="button" role="menuitem" onClick={() => { setOpen(false); onEdit(); }} className="block w-full px-4 py-2 text-left text-sm text-cocoa-700 hover:bg-ivory">
            Edit
          </button>
          <button type="button" role="menuitem" disabled={deleteDisabled} onClick={() => { setOpen(false); onDelete(); }} className="block w-full px-4 py-2 text-left text-sm text-blush-600 hover:bg-blush-50 disabled:cursor-not-allowed disabled:opacity-40">
            Delete
          </button>
        </div>
      ) : null}
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cocoa-800/30 p-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-label={title} className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-cocoa-100 bg-cream p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-5">
          <h2 className="font-heading text-3xl text-ink">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-2xl leading-none text-cocoa-400 hover:text-cocoa-800">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, type = "text", required = false }: { label: string; name: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-ink">
      {label}
      <input name={name} type={type} required={required} value={value} onChange={(event) => onChange(event.target.value)} className="rounded-xl border border-cocoa-200 bg-ivory px-4 py-3 font-normal text-ink" />
    </label>
  );
}

function ErrorMessage({ error }: { error: string | null }) {
  return error ? <p role="alert" className="mt-4 rounded-xl bg-blush-50 px-4 py-3 text-sm text-blush-600">{error}</p> : null;
}

export function ClientRowActions({ client, redirectTo = `/admin/clients/${client.id}` }: { client: Client; redirectTo?: string }) {
  const router = useRouter();
  const address = record(client.billing_address);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: client.name,
    businessName: client.business_name,
    email: client.email,
    phone: client.phone ?? "",
    notes: client.notes ?? "",
    line1: address.line1 ?? "",
    line2: address.line2 ?? "",
    city: address.city ?? "",
    state: address.state ?? "",
    postalCode: address.postal_code ?? "",
    country: address.country ?? "US",
  });

  function setField(name: string, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const response = await fetch(`/api/admin/clients/${client.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        businessName: form.businessName,
        email: form.email,
        phone: form.phone,
        notes: form.notes,
        billingAddress: { line1: form.line1, line2: form.line2, city: form.city, state: form.state, postal_code: form.postalCode, country: form.country },
      }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(result.error ?? "Client could not be updated.");
      setBusy(false);
      return;
    }
    setEditing(false);
    setBusy(false);
    router.refresh();
  }

  async function remove() {
    if (!window.confirm(`Delete ${client.business_name}? This also deletes the Stripe Customer.`)) return;
    setBusy(true);
    setError(null);
    const response = await fetch(`/api/admin/clients/${client.id}`, { method: "DELETE" });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(result.error ?? "Client could not be deleted.");
      setBusy(false);
      return;
    }
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <>
      <ActionMenu onEdit={() => { setError(null); setEditing(true); }} onDelete={remove} />
      {error && !editing ? <p role="alert" className="mt-2 max-w-xs text-right text-xs text-blush-600">{error}</p> : null}
      {editing ? (
        <Modal title="Edit client" onClose={() => { if (!busy) setEditing(false); }}>
          <form onSubmit={save} className="mt-6 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Contact name" name="name" value={form.name} onChange={(value) => setField("name", value)} required />
              <Field label="Business name" name="businessName" value={form.businessName} onChange={(value) => setField("businessName", value)} required />
              <Field label="Email" name="email" type="email" value={form.email} onChange={(value) => setField("email", value)} required />
              <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={(value) => setField("phone", value)} />
            </div>
            <div className="border-t border-cocoa-100 pt-5">
              <p className="font-heading text-xl text-ink">Billing address</p>
              <div className="mt-4 grid gap-5 sm:grid-cols-2">
                <Field label="Address line 1" name="line1" value={form.line1} onChange={(value) => setField("line1", value)} />
                <Field label="Address line 2" name="line2" value={form.line2} onChange={(value) => setField("line2", value)} />
                <Field label="City" name="city" value={form.city} onChange={(value) => setField("city", value)} />
                <Field label="State / region" name="state" value={form.state} onChange={(value) => setField("state", value)} />
                <Field label="Postal code" name="postalCode" value={form.postalCode} onChange={(value) => setField("postalCode", value)} />
                <Field label="Country code" name="country" value={form.country} onChange={(value) => setField("country", value)} />
              </div>
            </div>
            <label className="flex flex-col gap-2 text-sm font-medium text-ink">Notes<textarea value={form.notes} onChange={(event) => setField("notes", event.target.value)} rows={3} className="rounded-xl border border-cocoa-200 bg-ivory px-4 py-3 font-normal text-ink" /></label>
            <ErrorMessage error={error} />
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" disabled={busy} onClick={() => setEditing(false)} className="rounded-full px-5 py-3 text-sm text-cocoa-600 hover:bg-ivory">Cancel</button>
              <button type="submit" disabled={busy} className="rounded-full bg-blush-300 px-5 py-3 text-sm font-medium text-cocoa-800 hover:bg-blush-400 disabled:opacity-60">{busy ? "Saving…" : "Save changes"}</button>
            </div>
          </form>
        </Modal>
      ) : null}
    </>
  );
}

export function InvoiceActions({ invoice }: { invoice: Invoice }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [dueDate, setDueDate] = useState(invoice.due_at ? invoice.due_at.slice(0, 10) : "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const response = await fetch(`/api/admin/invoices/${invoice.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ dueDate }) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(result.error ?? "Invoice could not be updated.");
      setBusy(false);
      return;
    }
    setEditing(false);
    setBusy(false);
    router.refresh();
  }

  async function remove() {
    if (!window.confirm("Delete this invoice? Open Stripe invoices will be voided first.")) return;
    setBusy(true);
    setError(null);
    const response = await fetch(`/api/admin/invoices/${invoice.id}`, { method: "DELETE" });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(result.error ?? "Invoice could not be deleted.");
      setBusy(false);
      return;
    }
    router.refresh();
  }

  const locked = ["paid", "void", "uncollectible"].includes(invoice.status);
  return (
    <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
      <ActionMenu onEdit={() => { setError(null); setEditing(true); }} onDelete={remove} deleteDisabled={busy} />
      {error ? <p role="alert" className="max-w-xs text-right text-xs text-blush-600">{error}</p> : null}
      {editing ? (
        <Modal title="Edit invoice" onClose={() => { if (!busy) setEditing(false); }}>
          <form onSubmit={save} className="mt-6 space-y-5">
            <p className="text-sm leading-6 text-cocoa-500">Update the due date for this invoice. Stripe will be updated before the local record.</p>
            <Field label="Due date" name="dueDate" type="date" value={dueDate} onChange={setDueDate} required />
            {locked ? <p className="text-sm text-cocoa-500">Paid, void, and uncollectible invoices cannot be edited.</p> : null}
            <ErrorMessage error={error} />
            <div className="flex justify-end gap-3">
              <button type="button" disabled={busy} onClick={() => setEditing(false)} className="rounded-full px-5 py-3 text-sm text-cocoa-600 hover:bg-ivory">Cancel</button>
              <button type="submit" disabled={busy || locked} className="rounded-full bg-blush-300 px-5 py-3 text-sm font-medium text-cocoa-800 hover:bg-blush-400 disabled:opacity-60">{busy ? "Saving…" : "Save changes"}</button>
            </div>
          </form>
        </Modal>
      ) : null}
    </div>
  );
}

export function ContractActions({ contract }: { contract: Contract }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    signerName: contract.signer_name,
    signerEmail: contract.signer_email,
    serviceStartDate: contract.service_start_date ?? "",
    scopeSummary: contract.scope_summary ?? "",
  });

  function setField(name: string, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const response = await fetch(`/api/admin/contracts/${contract.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(result.error ?? "Contract could not be updated.");
      setBusy(false);
      return;
    }
    setEditing(false);
    setBusy(false);
    router.refresh();
  }

  async function remove() {
    if (!window.confirm("Delete this contract? Sent contracts cannot be deleted.")) return;
    setBusy(true);
    setError(null);
    const response = await fetch(`/api/admin/contracts/${contract.id}`, { method: "DELETE" });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(result.error ?? "Contract could not be deleted.");
      setBusy(false);
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
      <ActionMenu onEdit={() => { setError(null); setEditing(true); }} onDelete={remove} deleteDisabled={busy} />
      {error ? <p role="alert" className="max-w-xs text-right text-xs text-blush-600">{error}</p> : null}
      {editing ? (
        <Modal title="Edit contract" onClose={() => { if (!busy) setEditing(false); }}>
          <form onSubmit={save} className="mt-6 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Signer name" name="signerName" value={form.signerName} onChange={(value) => setField("signerName", value)} required />
              <Field label="Signer email" name="signerEmail" type="email" value={form.signerEmail} onChange={(value) => setField("signerEmail", value)} required />
            </div>
            <Field label="Service start date" name="serviceStartDate" type="date" value={form.serviceStartDate} onChange={(value) => setField("serviceStartDate", value)} required />
            <label className="flex flex-col gap-2 text-sm font-medium text-ink">Scope summary<textarea value={form.scopeSummary} onChange={(event) => setField("scopeSummary", event.target.value)} rows={5} maxLength={4000} className="rounded-xl border border-cocoa-200 bg-ivory px-4 py-3 font-normal text-ink" required /></label>
            {contract.documenso_envelope_id ? <p className="text-sm text-cocoa-500">This contract has already been sent and cannot be edited.</p> : null}
            <ErrorMessage error={error} />
            <div className="flex justify-end gap-3">
              <button type="button" disabled={busy} onClick={() => setEditing(false)} className="rounded-full px-5 py-3 text-sm text-cocoa-600 hover:bg-ivory">Cancel</button>
              <button type="submit" disabled={busy || Boolean(contract.documenso_envelope_id)} className="rounded-full bg-blush-300 px-5 py-3 text-sm font-medium text-cocoa-800 hover:bg-blush-400 disabled:opacity-60">{busy ? "Saving…" : "Save changes"}</button>
            </div>
          </form>
        </Modal>
      ) : null}
    </div>
  );
}
