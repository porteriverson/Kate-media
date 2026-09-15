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
  heading: "How I ended up doing this",
  /** Short standfirst paragraph shown next to the headshot. */
  lede: "I'm Kate Iverson, a social media manager who got here the long way around, through public relations, brand messaging and a lot of time spent figuring out why some videos work and most don't.",
};

/* ---------------------------------------------------------------------------
   HEADSHOT
   To use a different photo, save it as /public/images/kate-headshot.jpg
   (portrait, around 1200x1600px works best) — no code change needed.
   Keep `alt` descriptive — it's read aloud by screen readers.
   --------------------------------------------------------------------------- */
export const headshot = {
  src: "/images/kate-headshot.jpg",
  alt: "Kate Iverson smiling outdoors in front of a green wall",
};

/* ---------------------------------------------------------------------------
   HER STORY — each string is one paragraph.
   --------------------------------------------------------------------------- */
export const story = [
  "I have a bachelor's degree in Public Relations and Strategic Communication from Utah Valley University, where I spent four years on messaging, audience research, crisis communication and campaign strategy. Less glamorous than it sounds, and it's the reason I think about content the way I do.",
  "That's still how I start every project. Before I pick up a camera I want to know who we're talking to, what they already think about you, and what we need them to remember afterward.",
  "Since then I've managed social media and made content for companies in travel services and in jewelry, along with a few others. The two have almost nothing in common, which is probably why they taught me so much. Travel is about selling a feeling, a place someone wants to be inside of. Jewelry is about precision: shooting small, detailed products so they look as good on a phone as they do in person, and earning enough trust that someone feels comfortable spending real money.",
  "Either way the approach was the same. Find the story only that brand can tell, put it in a format people will actually watch, and keep it going long enough to see it pay off.",
];

/* ---------------------------------------------------------------------------
   APPROACH — the three or four principles she works by.
   --------------------------------------------------------------------------- */
export const approach = {
  heading: "How I work",
  principles: [
    {
      title: "Brand voice comes first",
      body: "I'll happily use whatever format is working this week, but the message underneath it is always yours.",
    },
    {
      title: "Consistent beats perfect",
      body: "Six good videos this month will do more for you than one perfect video every quarter. I set things up so the content keeps coming.",
    },
    {
      title: "Numbers you can act on",
      body: "You won't get a wall of screenshots from me. You'll get what worked, what didn't, and what we're changing next month.",
    },
    {
      title: "One point of contact",
      body: "Nobody hands you off to a junior team. The person you talk to is the person filming, editing and posting.",
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
    title: "Social media & content management, travel services",
    detail:
      "Ran day-to-day social and content for a travel services company, built around destination videos that turned interest into inquiries.",
    meta: "Experience",
  },
  {
    title: "Social media & content management, jewelry",
    detail:
      "Made product-focused content for a jewelry brand, including the close-up filming and styling formats the account grew on.",
    meta: "Experience",
  },
  {
    title: "Multi-industry content creation",
    detail:
      "Hands-on work with food and beverage, fitness and lifestyle brands, applying the same process to very different audiences.",
    meta: "Experience",
  },
  // TODO: add certifications here as she earns them, e.g.
  // { title: "Meta Certified Digital Marketing Associate", detail: "…", meta: "Certification" },
];

/* ---------------------------------------------------------------------------
   RESULTS / STATS
   Currently empty, so the stats row is hidden on the About page entirely.
   To bring it back, add entries here with real numbers and the section
   reappears on its own — no other file needs touching. For example:

     export const stats: Stat[] = [
       { value: "40k+", label: "Followers grown for client accounts" },
       { value: "500+", label: "Short-form videos produced" },
     ];
   --------------------------------------------------------------------------- */
export type Stat = {
  /** The big number, written exactly as it should appear, e.g. "40k+". */
  value: string;
  /** The short line underneath it. */
  label: string;
};

export const stats: Stat[] = [];

/* ---------------------------------------------------------------------------
   PERSONAL BLURB — the human bit at the bottom of the page.
   --------------------------------------------------------------------------- */
export const personal = {
  heading: "Off the clock",
  body: "When I'm not filming, I'm usually planning the next trip, reorganizing a camera bag that does not need reorganizing, or sending friends videos with no context. The best content tends to come from people who are actually curious, so if you want to talk about your business for an hour, I'm happy to.",
};
