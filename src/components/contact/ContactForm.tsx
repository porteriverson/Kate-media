"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CheckIcon } from "@/components/icons/Icons";
import { formMessages } from "@/content/contact";
import { packageOptions } from "@/content/services";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

/* ===========================================================================
   CONTACT FORM
   ---------------------------------------------------------------------------
   Submissions are emailed straight to Kate by Web3Forms — there's no database
   and no server code to maintain.

   SETUP (one time):
     1. Go to https://web3forms.com and enter the email address that should
        receive form submissions. They email back an access key.
     2. Put that key in .env.local as NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY
        (see .env.example), and add the same value in Vercel under
        Project Settings > Environment Variables.

   Until a key is set, the form politely tells visitors to email instead.

   SPAM PROTECTION: the hidden "botcheck" field below is a honeypot. Real
   people never see or fill it in; bots that auto-fill every field do, and
   Web3Forms silently discards those submissions.
   =========================================================================== */

const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
const ENDPOINT = "https://api.web3forms.com/submit";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState(formMessages.error);
  const packageRef = useRef<HTMLSelectElement>(null);

  // Package cards link here with e.g. /contact?package=growth, which
  // pre-selects the matching option once the page loads. (Reading the URL
  // after mount instead of during render keeps the whole form in the initial
  // HTML, so it's visible instantly and readable by search engines.)
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("package");
    if (requested && packageRef.current) {
      packageRef.current.value = requested;
    }
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!ACCESS_KEY) {
      setErrorMessage(formMessages.notConfigured);
      setStatus("error");
      return;
    }

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setStatus("submitting");

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `New enquiry from ${data.name || "the website"}`,
          from_name: site.name,
          ...data,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        form.reset();
        setStatus("success");
      } else {
        setErrorMessage(formMessages.error);
        setStatus("error");
      }
    } catch {
      setErrorMessage(formMessages.error);
      setStatus("error");
    }
  }

  /* --- Success state: replaces the form entirely --------------------------- */
  if (status === "success") {
    return (
      <div
        role="status"
        className="flex flex-col items-center rounded-3xl border border-blush-200 bg-blush-50 px-8 py-16 text-center"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blush-300 text-cocoa-800">
          <CheckIcon className="h-6 w-6" />
        </span>
        <h2 className="mt-6 font-heading text-2xl text-ink">Message sent</h2>
        <p className="mt-3 max-w-sm text-cocoa-500">{formMessages.success}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-8 text-sm text-cocoa-600 underline underline-offset-4 transition-colors hover:text-blush-600"
        >
          Send another message
        </button>
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <form onSubmit={handleSubmit} noValidate={false} className="flex flex-col gap-6">
      {/* Honeypot — hidden from people, irresistible to bots. */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        style={{ display: "none" }}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Your name" name="name" autoComplete="name" required />
        <Field label="Email address" name="email" type="email" autoComplete="email" required />
      </div>

      <Field
        label="Business or brand name"
        name="business"
        autoComplete="organization"
        required
      />

      <div className="flex flex-col gap-2">
        <label htmlFor="package" className="text-sm font-medium text-ink">
          Which package are you interested in?
        </label>
        <select
          ref={packageRef}
          id="package"
          name="package"
          defaultValue=""
          className="w-full appearance-none rounded-xl border border-cocoa-200 bg-cream px-4 py-3 text-base text-ink transition-colors duration-300 hover:border-cocoa-300 focus:border-blush-400 focus:outline-none"
        >
          <option value="">Select an option…</option>
          {packageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm font-medium text-ink">
          Tell me about your brand
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          placeholder="What do you sell, who are you trying to reach, and what would make this a win for you?"
          className="w-full resize-y rounded-xl border border-cocoa-200 bg-cream px-4 py-3 text-base text-ink placeholder:text-cocoa-300 transition-colors duration-300 hover:border-cocoa-300 focus:border-blush-400 focus:outline-none"
        />
      </div>

      {status === "error" ? (
        <p
          role="alert"
          className="rounded-xl border border-blush-300 bg-blush-50 px-4 py-3 text-sm text-blush-600"
        >
          {errorMessage}{" "}
          <a href={`mailto:${site.email}`} className="font-medium underline underline-offset-4">
            {site.email}
          </a>
        </p>
      ) : null}

      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <Button size="lg" disabled={submitting} className="w-full sm:w-auto">
          {submitting ? "Sending…" : "Send message"}
        </Button>
        <p className="text-sm text-cocoa-400">I reply {site.responseTime}.</p>
      </div>
    </form>
  );
}

/* A single labelled text input. */
function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  className,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={name} className="text-sm font-medium text-ink">
        {label}
        {required ? <span className="sr-only"> (required)</span> : null}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-cocoa-200 bg-cream px-4 py-3 text-base text-ink placeholder:text-cocoa-300 transition-colors duration-300 hover:border-cocoa-300 focus:border-blush-400 focus:outline-none"
      />
    </div>
  );
}
