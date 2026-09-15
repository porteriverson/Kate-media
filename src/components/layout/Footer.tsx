import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { navLinks, site } from "@/content/site";

/* ---------------------------------------------------------------------------
   Footer
   Site-wide footer: logo, quick nav, socials, email and copyright.
   All of the content comes from src/content/site.ts.
   --------------------------------------------------------------------------- */

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-cocoa-700 text-cream">
      <div className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-8">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <Logo tone="dark" />
            <p className="mt-5 text-sm leading-relaxed text-cocoa-100">
              Short-form video and social media management for small brands that want to be
              seen. Based in {site.location}, working with clients anywhere.
            </p>
            <SocialLinks tone="dark" className="mt-6" />
          </div>

          <div className="flex flex-col gap-10 sm:flex-row sm:gap-16">
            <nav aria-label="Footer">
              <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.22em] text-blush-300">
                Explore
              </h2>
              <ul className="mt-4 flex flex-col gap-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-cocoa-100 underline-offset-4 transition-colors duration-300 hover:text-cream hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.22em] text-blush-300">
                Get in touch
              </h2>
              <ul className="mt-4 flex flex-col gap-3 text-sm text-cocoa-100">
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="underline-offset-4 transition-colors duration-300 hover:text-cream hover:underline"
                  >
                    {site.email}
                  </a>
                </li>
                <li>{site.location}</li>
                <li>
                  <Link
                    href="/contact"
                    className="underline-offset-4 transition-colors duration-300 hover:text-cream hover:underline"
                  >
                    Send a message
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-cocoa-600 pt-7 text-xs text-cocoa-200 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {site.name}. All rights reserved.
          </p>
          <p>Made with care in Utah.</p>
        </div>
      </div>
    </footer>
  );
}
