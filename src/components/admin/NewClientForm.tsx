"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminField } from "@/components/admin/AdminField";

export function NewClientForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const body = {
      name: String(form.get("name") ?? ""),
      businessName: String(form.get("businessName") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      notes: String(form.get("notes") ?? ""),
      billingAddress: {
        line1: String(form.get("line1") ?? ""),
        line2: String(form.get("line2") ?? ""),
        city: String(form.get("city") ?? ""),
        state: String(form.get("state") ?? ""),
        postal_code: String(form.get("postalCode") ?? ""),
        country: String(form.get("country") ?? "US"),
      },
    };

    try {
      const response = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Client could not be created.");
      router.push(`/admin/clients/${result.client.id}`);
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Client could not be created.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-cocoa-100 bg-cream p-7 sm:p-10">
      <div className="grid gap-6 sm:grid-cols-2">
        <AdminField label="Contact name" name="name" required />
        <AdminField label="Business name" name="businessName" required />
        <AdminField label="Email" name="email" type="email" required />
        <AdminField label="Phone" name="phone" type="tel" />
      </div>

      <div className="mt-8 border-t border-cocoa-100 pt-8">
        <h2 className="font-heading text-2xl text-ink">Billing address <span className="font-sans text-sm text-cocoa-400">(optional)</span></h2>
        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          <AdminField label="Address line 1" name="line1" />
          <AdminField label="Address line 2" name="line2" />
          <AdminField label="City" name="city" />
          <AdminField label="State / region" name="state" />
          <AdminField label="Postal code" name="postalCode" />
          <AdminField label="Country code" name="country" placeholder="US" />
        </div>
      </div>

      <label className="mt-8 flex flex-col gap-2 text-sm font-medium text-ink">
        Notes
        <textarea name="notes" rows={4} className="rounded-xl border border-cocoa-200 bg-cream px-4 py-3 font-normal text-ink outline-none transition focus:border-blush-400" />
      </label>

      {error ? <p role="alert" className="mt-6 rounded-xl bg-blush-50 px-4 py-3 text-sm text-blush-600">{error}</p> : null}

      <div className="mt-8 flex items-center gap-4">
        <button type="submit" disabled={busy} className="rounded-full bg-blush-300 px-6 py-3 font-medium text-cocoa-800 hover:bg-blush-400 disabled:opacity-60">
          {busy ? "Saving…" : "Create client"}
        </button>
        <p className="text-sm text-cocoa-400">This also creates their Stripe Customer.</p>
      </div>
    </form>
  );
}
