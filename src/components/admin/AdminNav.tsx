"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function AdminNav() {
  const [busy, setBusy] = useState(false);

  async function signOut() {
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      setBusy(false);
      return;
    }

    // The login page shares this route segment's layout, so client-side
    // navigation would preserve this component and its busy state.
    window.location.replace("/admin/login");
  }

  return (
    <nav className="mb-10 flex flex-col gap-4 rounded-2xl border border-cocoa-100 bg-cream px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <Link href="/admin" className="font-heading text-2xl text-ink">
          Kate&apos;s backend
        </Link>
        <p className="text-xs uppercase tracking-[0.18em] text-cocoa-400">Private dashboard</p>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <Link href="/admin" className="text-cocoa-600 hover:text-blush-600">Clients</Link>
        <Link href="/admin/clients/new" className="rounded-full bg-blush-300 px-4 py-2 font-medium text-cocoa-800 hover:bg-blush-400">
          New client
        </Link>
        <button type="button" onClick={signOut} disabled={busy} className="text-cocoa-500 underline-offset-4 hover:text-blush-600 hover:underline">
          {busy ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </nav>
  );
}
