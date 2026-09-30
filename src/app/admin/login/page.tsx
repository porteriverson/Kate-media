"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    setError(null);
    const supabase = createClient();
    const result = await supabase.auth.signInWithPassword({ email, password });
    if (result.error) {
      setError(result.error.message);
      setBusy(false);
      return;
    }

    const adminCheck = await fetch("/api/admin/me");
    if (!adminCheck.ok) {
      await supabase.auth.signOut();
      setError("This account is not approved for the Kate backend.");
      setBusy(false);
      return;
    }
    const requestedNext = new URLSearchParams(window.location.search).get("next");
    window.location.href = requestedNext?.startsWith("/") ? requestedNext : "/admin";
  }

  async function requestReset() {
    if (!email) {
      setError("Enter your email address first.");
      return;
    }
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const result = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });
    setBusy(false);
    if (result.error) setError(result.error.message);
    else setMessage("If that email is approved, a password reset link is on its way.");
  }

  return (
    <div className="mx-auto max-w-lg py-12">
      <div className="rounded-3xl border border-cocoa-100 bg-cream p-8 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blush-600">Private area</p>
        <h1 className="mt-4 font-heading text-4xl text-ink">Welcome back</h1>
        <p className="mt-3 text-cocoa-500">Sign in to manage clients, invoices, and contracts.</p>
        <form onSubmit={signIn} className="mt-8 flex flex-col gap-5">
          <label className="flex flex-col gap-2 text-sm font-medium text-ink">Email<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="rounded-xl border border-cocoa-200 bg-ivory px-4 py-3 font-normal" /></label>
          <label className="flex flex-col gap-2 text-sm font-medium text-ink">Password<input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} className="rounded-xl border border-cocoa-200 bg-ivory px-4 py-3 font-normal" /></label>
          {error ? <p role="alert" className="rounded-xl bg-blush-50 px-4 py-3 text-sm text-blush-600">{error}</p> : null}
          {message ? <p role="status" className="rounded-xl bg-blush-50 px-4 py-3 text-sm text-cocoa-600">{message}</p> : null}
          <button type="submit" disabled={busy} className="rounded-full bg-blush-300 px-6 py-3 font-medium text-cocoa-800 hover:bg-blush-400 disabled:opacity-60">{busy ? "Working…" : "Sign in"}</button>
        </form>
        <button type="button" onClick={requestReset} disabled={busy} className="mt-5 text-sm text-cocoa-500 underline-offset-4 hover:text-blush-600 hover:underline">Forgot your password?</button>
      </div>
    </div>
  );
}
