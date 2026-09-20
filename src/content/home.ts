/* ===========================================================================
   HOME PAGE COPY
   ---------------------------------------------------------------------------
   ✏️  EDIT ME: all of the wording on the home page lives here.
   The featured videos and package cards pull automatically from
   portfolio.ts and services.ts — no need to repeat them.
   =========================================================================== */

export const hero = {
  /** Small line above the headline. */
  eyebrow: "Social media management & short-form video",

  /** The big headline. Words wrapped in *asterisks* are highlighted in pink. */
  headline: "Short-form video that gets small brands *noticed*.",

  /** One or two sentences under the headline. */
  subhead:
    "I'm Kate. I plan, film, edit and post the content that turns your followers into customers, so you can get back to running your business.",

  primaryCta: { label: "View my work", href: "/work" },
  secondaryCta: { label: "Get in touch", href: "/contact" },
};

/** Short trust line under the hero buttons. TODO: update once real numbers exist. */
export const heroProof = "Trusted by brands in travel, jewelry, food and fitness";

export const intro = {
  eyebrow: "Hi, I'm Kate",
  heading: "I do the strategy and hold the camera",
  body: [
    "I studied public relations and strategic communication, so I start with what your brand is trying to say and who needs to hear it, not with whatever format happens to be trending that week.",
    "From there I handle the rest. Concepts, filming, editing, captions, posting, and the reporting that tells us what's working. It's just me, so the content stays consistent and it still sounds like you.",
  ],
  cta: { label: "More about me", href: "/about" },
};

export const workPreview = {
  eyebrow: "Recent work",
  heading: "A look at what I've been making",
  body: "Reels and short-form brand videos, all filmed and edited in-house.",
  cta: { label: "See more work", href: "/work" },
};

export const servicesPreview = {
  eyebrow: "Packages",
  heading: "Simple, flexible ways to work together",
  body: "Monthly packages that cover strategy, content and posting. Pick the level that fits where your brand is right now.",
  cta: { label: "Compare packages", href: "/services" },
};

export const closingCta = {
  eyebrow: "Let's talk",
  heading: "Ready to hand off your social media?",
  body: "Tell me a little about your brand and what you're hoping to grow. I'll get back to you with a few thoughts on where to start. No pressure either way.",
  primaryCta: { label: "Start the conversation", href: "/contact" },
};
