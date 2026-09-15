import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { site } from "@/content/site";
import "./globals.css";

/* ---------------------------------------------------------------------------
   FONTS
   Body: DM Sans (modern, friendly sans-serif)
   Headings: Fraunces (soft editorial serif — keeps it boutique, not corporate)
   To change a font, swap the import and the loader below; the CSS variables
   are wired into the theme in globals.css.
   --------------------------------------------------------------------------- */
const bodyFont = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const displayFont = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["400", "500", "600"],
});

/* ---------------------------------------------------------------------------
   SITE-WIDE SEO
   Page-specific titles and descriptions are set in each page file; they slot
   into the "%s" in the template below.
   --------------------------------------------------------------------------- */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Short-Form Video & Social Media Management`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "social media manager",
    "short-form video",
    "Instagram Reels",
    "TikTok content creator",
    "content strategy",
    "Utah social media management",
  ],
  authors: [{ name: "Kate Iverson" }],
  creator: "Kate Iverson",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title: `${site.name} | Short-Form Video & Social Media Management`,
    description: site.description,
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kate Iverson Media — short-form video and social media management",
      },
    ],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#fdfbf8",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        {/* Lets keyboard users jump straight past the nav. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-[60] focus:rounded-full focus:bg-blush-300 focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-cocoa-800"
        >
          Skip to content
        </a>

        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
