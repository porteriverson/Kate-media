"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const result = await supabase.auth.updateUser({ password });
    if (result.error) {
      setError(result.error.message);
      setBusy(false);
      return;
    }
    router.push("/admin/login");
  }

  return (
    <div className="mx-auto max-w-lg py-12">
      <div className="rounded-3xl border border-cocoa-100 bg-cream p-8 sm:p-10">
        <h1 className="font-heading text-4xl text-ink">Set a new password</h1>
        <p className="mt-3 text-cocoa-500">Choose a password for the private dashboard.</p>
        <form onSubmit={submit} className="mt-8 flex flex-col gap-5">
          <label className="flex flex-col gap-2 text-sm font-medium text-ink">New password<input type="password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} className="rounded-xl border border-cocoa-200 bg-ivory px-4 py-3 font-normal" /></label>
          {error ? <p role="alert" className="rounded-xl bg-blush-50 px-4 py-3 text-sm text-blush-600">{error}</p> : null}
          <button type="submit" disabled={busy} className="rounded-full bg-blush-300 px-6 py-3 font-medium text-cocoa-800 hover:bg-blush-400 disabled:opacity-60">{busy ? "Saving…" : "Save password"}</button>
        </form>
      </div>
    </div>
  );
}
