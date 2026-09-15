import { Section } from "@/components/ui/Section";
import { ContactForm } from "@/components/contact/ContactForm";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { MailIcon } from "@/components/icons/Icons";
import { contactIntro } from "@/content/contact";
import { site, socialLinks } from "@/content/site";
import { buildMetadata } from "@/lib/seo";

/* ---------------------------------------------------------------------------
   CONTACT PAGE
   The form emails Kate directly through Web3Forms — setup notes are at the
   top of src/components/contact/ContactForm.tsx and in .env.example.
   --------------------------------------------------------------------------- */

export const metadata = buildMetadata({
  title: "Contact",
  description:
    "Get in touch with Kate Iverson about social media management and short-form video content for your brand.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <Section>
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
        {/* Left column: intro + direct contact details */}
        <div className="lg:col-span-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blush-600">
            {contactIntro.eyebrow}
          </p>
          <h1 className="mt-6 text-4xl leading-[1.1] text-ink sm:text-5xl">
            {contactIntro.heading}
          </h1>
          <p className="mt-6 leading-relaxed text-cocoa-500">{contactIntro.body}</p>

          <div className="mt-10 border-t border-cocoa-100 pt-8">
            <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-cocoa-400">
              Prefer email?
            </h2>
            {/* TODO: real email address is set in src/content/site.ts */}
            <a
              href={`mailto:${site.email}`}
              className="mt-3 inline-flex items-center gap-3 font-heading text-xl text-ink underline-offset-4 transition-colors duration-300 hover:text-blush-600 hover:underline"
            >
              <MailIcon className="h-5 w-5 text-blush-500" />
              {site.email}
            </a>
          </div>

          <div className="mt-10 border-t border-cocoa-100 pt-8">
            <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-cocoa-400">
              Find me online
            </h2>
            <SocialLinks className="mt-4" />
            <ul className="mt-4 flex flex-col gap-1 text-sm text-cocoa-500">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  {link.handle} on {link.label}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-10 text-sm text-cocoa-400">
            Based in {site.location} · Working with clients anywhere
          </p>
        </div>

        {/* Right column: the form */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-cocoa-100 bg-ivory p-7 sm:p-10">
            <ContactForm />
          </div>
        </div>
      </div>
    </Section>
  );
}
