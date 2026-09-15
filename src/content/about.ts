/* ===========================================================================
   ABOUT PAGE
   ---------------------------------------------------------------------------
   ✏️  EDIT ME: Kate's story, qualifications and results.

   The narrative below is real copy (not placeholder) — it's built from her
   PR degree at UVU and her experience in the travel and jewelry industries.
   Edit the wording any time; the `stats` numbers are the main placeholders.
   =========================================================================== */

export const aboutIntro = {
  eyebrow: "About",
  heading: "Strategy first, camera second",
  /** Short standfirst paragraph shown next to the headshot. */
  lede: "I'm Kate Iverson — a social media manager who came to content the long way around: through public relations, brand messaging and a genuine obsession with why some videos work and most don't.",
};

/* ---------------------------------------------------------------------------
   HEADSHOT
   TODO: drop the real photo into /public/images/ (e.g. kate-headshot.jpg)
   and update `src` below. Until then a styled placeholder is shown.
   Keep `alt` descriptive — it's read aloud by screen readers.
   --------------------------------------------------------------------------- */
export const headshot = {
  src: "/images/kate-headshot.jpg",
  alt: "Kate Iverson, social media manager, smiling in a bright studio setting",
};

/* ---------------------------------------------------------------------------
   HER STORY — each string is one paragraph.
   --------------------------------------------------------------------------- */
export const story = [
  "I earned my bachelor's degree in Public Relations and Strategic Communication from Utah Valley University, where I spent four years learning how brands earn attention and, more importantly, how they keep it. Messaging, audience research, crisis communication, campaign strategy — the unglamorous foundation underneath every piece of content that ever felt effortless.",
  "That background is still how I start every project. Before I pick up a camera, I want to know who we're talking to, what they already believe about you, and the one thing we need them to walk away understanding. A video without that is just noise with good lighting.",
  "Since then I've managed social media and created content for companies in the travel services industry and the jewelry industry, among others — two worlds that could not be more different, which turned out to be the best possible training. Travel taught me to sell a feeling and a moment people want to be inside of. Jewelry taught me precision: how to shoot small, detailed products so they look as good on a phone screen as they do in person, and how to build the kind of trust that makes someone comfortable spending real money.",
  "What carried across both was the same approach. Find the story only that brand can tell, translate it into a format people actually stop for, and stay consistent long enough for it to compound.",
];

/* ---------------------------------------------------------------------------
   APPROACH — the three or four principles she works by.
   --------------------------------------------------------------------------- */
export const approach = {
  heading: "How I work",
  principles: [
    {
      title: "Brand voice over trends",
      body: "Trends are a delivery method, not a strategy. I'll use the format that's working this week, but the message underneath it is always yours.",
    },
    {
      title: "Consistency beats perfection",
      body: "Six good videos this month will outperform one perfect video every quarter. I build systems that keep the content coming.",
    },
    {
      title: "Numbers you can act on",
      body: "Reporting shouldn't be a wall of screenshots. I tell you what worked, what didn't, and what we're changing next month.",
    },
    {
      title: "One point of contact",
      body: "You're not handed off to a junior team. The person you talk to is the person filming, editing and posting.",
    },
  ],
};

/* ---------------------------------------------------------------------------
   QUALIFICATIONS & EXPERIENCE
   TODO: add certifications (Meta Blueprint, Google Analytics, HubSpot, etc.)
   as they're completed — just add another object to the list.
   --------------------------------------------------------------------------- */
export type Qualification = {
  title: string;
  detail: string;
  meta: string;
};

export const qualifications: Qualification[] = [
  {
    title: "B.S., Public Relations & Strategic Communication",
    detail:
      "Utah Valley University. Coursework in brand messaging, audience research, campaign strategy and media relations.",
    meta: "Education",
  },
  {
    title: "Social media & content management — travel services",
    detail:
      "Managed content and day-to-day social presence for a travel services company, building destination-led short-form video that converted interest into inquiries.",
    meta: "Experience",
  },
  {
    title: "Social media & content management — jewelry",
    detail:
      "Created product-focused content for a jewelry brand, developing the close-up filming and styling formats that carried the account's growth.",
    meta: "Experience",
  },
  {
    title: "Multi-industry content creation",
    detail:
      "Additional hands-on work across food and beverage, fitness and lifestyle brands — adapting one strategic process to very different audiences.",
    meta: "Experience",
  },
  // TODO: add certifications here as she earns them, e.g.
  // { title: "Meta Certified Digital Marketing Associate", detail: "…", meta: "Certification" },
];

/* ---------------------------------------------------------------------------
   RESULTS / STATS
   TODO: these are PLACEHOLDER numbers. Replace them with real results — or
   delete any you can't back up. Honest, smaller numbers beat vague big ones.
   --------------------------------------------------------------------------- */
export const stats = [
  { value: "0k+", label: "Followers grown for client accounts" }, // TODO: e.g. "40k+"
  { value: "000+", label: "Short-form videos produced" }, // TODO: e.g. "500+"
  { value: "0M+", label: "Organic views generated" }, // TODO: e.g. "2M+"
  { value: "0", label: "Industries worked across" }, // TODO: e.g. "6"
];

/* ---------------------------------------------------------------------------
   PERSONAL BLURB — the human bit at the bottom of the page.
   --------------------------------------------------------------------------- */
export const personal = {
  heading: "Off the clock",
  body: "When I'm not filming, I'm usually planning the next trip, reorganizing a camera bag that does not need reorganizing, or sending my friends videos with no context. I'm a big believer that the best content comes from people who are genuinely curious about things — so if you want to talk about your business for an hour, I'm the right person to call.",
};
