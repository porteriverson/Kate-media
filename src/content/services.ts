/* ===========================================================================
   SERVICES & PRICING
   ---------------------------------------------------------------------------
   ✏️  EDIT ME: package names, prices and everything each one includes live
   here. The Services page and the cards on the home page both read from this
   file, so you only ever change it in one place.

   TODO: all names, prices and inclusions below are PLACEHOLDERS — update them
   with Kate's real offerings before the site goes live.
   =========================================================================== */

export type Package = {
  /** Used in the URL hash and in the contact form dropdown — keep it short. */
  id: string;
  /** Package name shown on the card. */
  name: string;
  /** One line on who this package is the right fit for. */
  bestFor: string;
  /** The price. Write it exactly as it should appear, e.g. "$750" or "Custom". */
  price: string;
  /** Small text under the price, e.g. "per month" or "starting at". */
  priceNote: string;
  /** Bullet list of what's included. Add or remove lines freely. */
  includes: string[];
  /** Set true on ONE package to give it the "Most popular" highlight. */
  highlighted?: boolean;
};

export const packages: Package[] = [
  {
    id: "starter",
    name: "Starter",
    bestFor: "Brands that want to show up consistently without the overwhelm.",
    price: "$650",
    priceNote: "per month",
    includes: [
      "6 short-form videos per month",
      "1 filming day (on location or self-shot guidance)",
      "Editing, captions, hooks and trending audio",
      "Posting to 1 platform of your choice",
      "Monthly performance snapshot",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    bestFor: "Brands ready to grow an audience and turn it into customers.",
    price: "$1,200",
    priceNote: "per month",
    includes: [
      "12 short-form videos per month",
      "2 filming days per month",
      "Full content calendar + monthly strategy call",
      "Posting to 2 platforms, plus Stories",
      "Caption and hashtag strategy",
      "Community management (comments + DMs, 3x per week)",
      "Monthly analytics report with next-step recommendations",
    ],
    highlighted: true,
  },
  {
    id: "premium",
    name: "Premium",
    bestFor: "Brands that want their social handled completely, start to finish.",
    price: "$2,000",
    priceNote: "per month",
    includes: [
      "20+ short-form videos per month",
      "Weekly filming or on-call shoot days",
      "Quarterly brand + content strategy planning",
      "Posting to 3 platforms, plus Stories and repurposing",
      "Daily community management",
      "Influencer and UGC creator coordination",
      "Bi-weekly reporting and a monthly strategy call",
    ],
  },
];

/* ---------------------------------------------------------------------------
   Copy for the top of the Services page.
   --------------------------------------------------------------------------- */
export const servicesIntro = {
  eyebrow: "Services",
  heading: "Packages built around how much you want off your plate",
  body: "Every package includes the same thing at its core: content that actually sounds like your brand, posted consistently, with real reporting behind it. The only difference is volume and depth.",
};

/* ---------------------------------------------------------------------------
   The "everything includes" strip — things that come with every package.
   --------------------------------------------------------------------------- */
export const includedInEvery = [
  "A kickoff call to learn your brand voice",
  "Concepting and scripting for every video",
  "All filming and editing handled for you",
  "Content you own and can reuse anywhere",
];

/* ---------------------------------------------------------------------------
   The custom-package note at the bottom of the Services page.
   --------------------------------------------------------------------------- */
export const customPackage = {
  heading: "Need something in between?",
  body: "Most brands do. If you need a one-off content day, a launch campaign, or a mix of services that doesn't fit neatly into a package above, tell me what you're after and I'll put together a custom quote.",
  cta: { label: "Ask about a custom package", href: "/contact?package=custom" },
};

/* ---------------------------------------------------------------------------
   Optional add-ons. Delete this array (and it disappears from the page) if
   Kate doesn't want to list add-ons.
   --------------------------------------------------------------------------- */
export const addOns = [
  { name: "Extra filming day", price: "$350" },
  { name: "One-off content day (10 videos, no retainer)", price: "$800" },
  { name: "Social audit + 90-day strategy doc", price: "$450" },
  { name: "Paid ad creative (3 variations)", price: "$300" },
];

/* ---------------------------------------------------------------------------
   Options in the contact form's "which package are you interested in?"
   dropdown. Built automatically from the packages above, plus two extras.
   --------------------------------------------------------------------------- */
export const packageOptions = [
  ...packages.map((pkg) => ({ value: pkg.id, label: `${pkg.name} — ${pkg.price} ${pkg.priceNote}` })),
  { value: "custom", label: "A custom package" },
  { value: "not-sure", label: "Not sure yet — I'd like to talk it through" },
];
