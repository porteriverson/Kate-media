/* ===========================================================================
   SITE INFO  —  name, contact details, social links, navigation
   ---------------------------------------------------------------------------
   ✏️  EDIT ME: everything in this file shows up in the header, footer and
   contact page. Change a value here and it updates everywhere.

   Anything marked "TODO" still needs Kate's real information.
   =========================================================================== */

export const site = {
  /** Full business name — used in the logo, footer and page titles. */
  name: "Kate Iverson Media",

  /** Short version, used where space is tight. */
  shortName: "Kate Iverson",

  /** One-line description used for SEO and link previews. */
  description:
    "Short-form video and social media management for small brands. Strategy, content creation and posting handled end to end, by Kate Iverson.",

  /** TODO: replace with the real domain once it's live (no trailing slash). */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://kateiversonmedia.com",

  /** TODO: replace with Kate's real business email address. */
  email: "hello@kateiversonmedia.com",

  /** Where she's based — shown in the footer and contact page. */
  location: "Utah Valley, Utah",

  /** Roughly how quickly she replies. Shown near the contact form. */
  responseTime: "within 1–2 business days",
} as const;

/* ---------------------------------------------------------------------------
   SOCIAL LINKS
   TODO: swap the placeholder URLs and handles for Kate's real profiles.
   To hide one, delete its block. Supported icons: "instagram" | "tiktok"
   | "linkedin" | "email" (see src/components/icons/SocialIcon.tsx).
   --------------------------------------------------------------------------- */
export type SocialLink = {
  label: string;
  handle: string;
  href: string;
  icon: "instagram" | "tiktok" | "linkedin" | "email";
};

export const socialLinks: SocialLink[] = [
  {
    label: "Instagram",
    handle: "@kateiversonmedia",
    href: "https://www.instagram.com/", // TODO: full profile URL
    icon: "instagram",
  },
  {
    label: "TikTok",
    handle: "@kateiversonmedia",
    href: "https://www.tiktok.com/", // TODO: full profile URL
    icon: "tiktok",
  },
  {
    label: "LinkedIn",
    handle: "Kate Iverson",
    href: "https://www.linkedin.com/", // TODO: full profile URL
    icon: "linkedin",
  },
];

/* ---------------------------------------------------------------------------
   MAIN NAVIGATION
   The order here is the order in the header and footer.
   --------------------------------------------------------------------------- */
export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;
