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

  /** Kate's business email address. */
  email: "kateiversonmedia@gmail.com",

  /** Where she's based — shown in the footer and contact page. */
  location: "Utah Valley, Utah",

  /** Roughly how quickly she replies. Shown near the contact form. */
  responseTime: "within 1–2 business days",
} as const;

/* ---------------------------------------------------------------------------
   SOCIAL LINKS
   Instagram is the only account right now. To add another later, copy the
   block below and give it an icon name that SocialIcon knows about
   (see src/components/icons/Icons.tsx).
   --------------------------------------------------------------------------- */
export type SocialLink = {
  label: string;
  handle: string;
  href: string;
  icon: "instagram" | "email";
};

export const socialLinks: SocialLink[] = [
  {
    label: "Instagram",
    handle: "@kateiversonmedia",
    href: "https://www.instagram.com/kateiversonmedia/",
    icon: "instagram",
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
