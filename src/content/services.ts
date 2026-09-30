/* ===========================================================================
   SERVICES & PRICING
   ---------------------------------------------------------------------------
   ✏️  EDIT ME: package names, prices and everything each one includes live
   here. The Services page and the cards on the home page both read from this
   file, so you only ever change it in one place.

   The packages and add-ons below match Kate's current pricing sheet.
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
  /** Default contract wording for the scope summary field. */
  contractScope: string;
  /** Set true on ONE package to give it the "Most popular" highlight. */
  highlighted?: boolean;
};

export const packages: Package[] = [
  {
    id: "starter",
    name: "Starter",
    bestFor: "Brands that want to show up consistently without the overwhelm.",
    price: "$450",
    priceNote: "per month",
    includes: [
      "1 social media platform",
      "8 feed posts",
      "2 short form videos",
      "Content planning",
      "Caption writing",
      "Scheduling",
    ],
    contractScope: "Monthly social media support for one platform, including content planning, caption writing, scheduling, 8 feed posts, and 2 short-form videos.",
  },
  {
    id: "professional",
    name: "Professional",
    bestFor: "Brands ready to grow an audience and turn it into customers.",
    price: "$900",
    priceNote: "per month",
    includes: [
      "Up to 2 platforms",
      "12 feed posts",
      "4 short form videos",
      "Content planning",
      "Caption writing",
      "Scheduling",
      "Monthly analytics",
    ],
    contractScope: "Monthly social media support for up to 2 platforms, including content planning, caption writing, scheduling, 12 feed posts, 4 short-form videos, and monthly analytics.",
    highlighted: true,
  },
  {
    id: "growth",
    name: "Growth",
    bestFor: "Brands that want their social handled completely, start to finish.",
    price: "$1700",
    priceNote: "per month",
    includes: [
      "Up to 3 platforms",
      "20 feed posts",
      "8 short form videos",
      "Content planning",
      "Caption writing",
      "Scheduling",
      "Monthly analytics",
      "Comment & DM management",
    ],
    contractScope: "Full-service monthly social media support for up to 3 platforms, including content planning, caption writing, scheduling, 20 feed posts, 8 short-form videos, monthly analytics, and comment and DM management.",
  },
];

/* ---------------------------------------------------------------------------
   Copy for the top of the Services page.
   --------------------------------------------------------------------------- */
export const servicesIntro = {
  eyebrow: "Services",
  heading: "Packages built around how much you want off your plate",
  body: "Every package covers the same core work: content that sounds like your brand, posted consistently, with reporting behind it. The difference is how much of it you get.",
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
   Add-ons. Two groups: things existing monthly clients can bolt on, and
   à la carte prices for anyone who isn't on a retainer. Delete a whole group
   (or the array) and it disappears from the Services page.
   --------------------------------------------------------------------------- */
export type AddOnGroup = {
  /** Heading on the group's card. */
  title: string;
  /** One line under the heading explaining who these prices are for. */
  note: string;
  /** The line items. Add or remove freely. */
  items: { name: string; price: string }[];
};

export const addOnGroups: AddOnGroup[] = [
  {
    title: "Monthly client add-ons",
    note: "Rates for brands already on a monthly package.",
    items: [
      { name: "Short form video", price: "$50" },
      { name: "Feed post", price: "$25" },
      { name: "Story set", price: "$20" },
      { name: "Additional content shoot", price: "$200" },
      { name: "Added platform", price: "$200" },
      { name: "Rush content", price: "+$25" },
    ],
  },
  {
    title: "À la carte services",
    note: "One-off pricing, no monthly package required.",
    items: [
      { name: "Short form video", price: "$100" },
      { name: "3 video bundle", price: "$275" },
      { name: "5 video bundle", price: "$425" },
      { name: "Feed post & caption", price: "$25" },
      { name: "Content shoot", price: "$300" },
      { name: "Social media strategy session", price: "$150" },
    ],
  },
];

/* ---------------------------------------------------------------------------
   Options in the contact form's "which package are you interested in?"
   dropdown. Built automatically from the packages above, plus two extras.
   --------------------------------------------------------------------------- */
export const packageOptions = [
  ...packages.map((pkg) => ({ value: pkg.id, label: `${pkg.name} (${pkg.price} ${pkg.priceNote})` })),
  { value: "custom", label: "A custom package" },
  { value: "not-sure", label: "Not sure yet, I'd like to talk it through" },
];
