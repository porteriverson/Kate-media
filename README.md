# Kate Iverson Media

The website for Kate Iverson Media — a portfolio and enquiry site for a
short-form video and social media management business.

Built with **Next.js**, **TypeScript** and **Tailwind CSS**, and designed to be
deployed on **Vercel**.

---

## Table of contents

1. [Running the site on your computer](#running-the-site-on-your-computer)
2. [Where to change things](#where-to-change-things) ← start here for edits
3. [Adding videos to the portfolio](#adding-videos-to-the-portfolio)
4. [Adding photos and the logo](#adding-photos-and-the-logo)
5. [Setting up the contact form](#setting-up-the-contact-form)
6. [Using the private backend](#using-the-private-backend)
7. [Deploying to Vercel](#deploying-to-vercel)
8. [Before launch checklist](#before-launch-checklist)
9. [Project structure](#project-structure)

---

## Running the site on your computer

You need [Node.js](https://nodejs.org) (version 20 or newer) installed. Then, in
a terminal window opened in this folder:

```bash
npm install     # once, the first time
npm run dev     # start the site
```

Open <http://localhost:3000> in a browser. Any file you save updates the page
straight away.

Other commands:

| Command | What it does |
| --- | --- |
| `npm run dev` | Runs the site locally while you work on it |
| `npm run build` | Builds the production version (also catches errors) |
| `npm run lint` | Checks the code for problems |

---

## Where to change things

**Almost all wording, pricing and content lives in one folder: `src/content/`.**
You can edit these files in any text editor. They're plain text with comments
explaining each part, and you never need to touch the page layouts.

| I want to change… | Open this file |
| --- | --- |
| Business name, email address, social links, location | `src/content/site.ts` |
| Home page wording (headline, intro, calls to action) | `src/content/home.ts` |
| The video gallery — add, remove or reorder videos | `src/content/portfolio.ts` |
| Package names, prices and what's included | `src/content/services.ts` |
| The About page — story, qualifications, stats | `src/content/about.ts` |
| Contact page wording and form messages | `src/content/contact.ts` |
| Brand colours and fonts | `src/app/globals.css` (top of the file) |

A few rules to avoid breaking anything:

- Keep the quote marks `"` around text. If your text contains an apostrophe,
  that's fine — just don't delete the surrounding quotes.
- Keep the commas at the end of each line.
- Lines starting with `//` are notes to you and don't appear on the site.
- Anything marked `TODO` is a placeholder waiting for real information.

After saving, refresh the browser to see the change.

---

## Adding videos to the portfolio

The current portfolio uses direct video files served from a public Supabase
Storage bucket. The metadata and display order live in
`src/content/portfolio.ts`.

### One-time Supabase setup

1. Use the public Storage bucket named `website-videos-public`.
2. Restrict the bucket to video files and set a sensible file-size limit.
3. Upload optimized video files and use their object paths in
   `src/content/portfolio.ts`.
4. Add the Supabase project URL to `.env.local` and Vercel:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   ```

5. For each video, create a vertical poster image around 720 × 1280px, keep it
   under roughly 500KB, and place it in `public/images/work/`.

### Adding a hosted video

Add or update a record in `src/content/portfolio.ts`:

```ts
{
  id: "jewelry-03",
  videoPath: "portfolio/v1/jewelry-03.mp4",
  videoUrl: getPortfolioVideoUrl("portfolio/v1/jewelry-03.mp4"),
  client: "Wren & Gold Jewelry",
  category: "Jewelry",
  caption: "Styling series that doubled saves.",
  thumbnail: "/images/work/jewelry-03.jpg",
  featured: true,
},
```

**Notes**

- The four current records use direct Supabase video files. They are not loaded
  until a visitor taps the poster.
- Keep object paths versioned or uniquely named when replacing a video instead
  of overwriting the old object.
- The old `url` field remains available for TikTok, Instagram Reels and YouTube
  Shorts when an external embed is needed in the future.
- `category` must exactly match one of the names in the `categories` list at the
  top of the same file. Add new categories to that list and filter buttons
  appear on their own. Categories with no videos are hidden automatically.
- `featured: true` adds a video to the strip on the home page. Three or four
  featured videos looks best.
- Videos only load when someone taps play, which keeps the site fast. Posters
  are the only media loaded during the initial page render.

---

## Photos, logo and the share card

The logo, headshot, browser icon and social share card are all set up already.
To change any of them, replace the file and keep the same name — no code edit
needed.

| To change… | Replace this file |
| --- | --- |
| The logo in the header | `public/images/logo.png` |
| The logo in the footer (reversed, for the dark background) | `public/images/logo-light.png` |
| The About page photo | `public/images/kate-headshot.jpg` |
| The icon in the browser tab | `src/app/icon.png` |
| The icon when saved to a phone home screen | `src/app/apple-icon.png` |
| The picture shown when the link is texted or posted | `src/app/opengraph-image.jpg` **and** `src/app/twitter-image.jpg` (keep both identical, 1200 x 630px) |

Full-resolution originals of the logo and headshot are kept in
`design-assets/` at the top of the project. That folder is **not** published —
it's storage, so the 19MB original photo never gets sent to a visitor's phone.
See `public/images/README.md` for sizes and details.

### About the share card

When someone texts or posts a link to the site, they'll see a cream card with
the logo and the line "Short-form video & social media management". It's the
same picture for every page.

Two things to know:

- The picture only loads for other people once the site is live on its real
  domain **and** `NEXT_PUBLIC_SITE_URL` matches that domain.
- Messaging apps cache these aggressively. After changing the image, use
  [Facebook's debugger](https://developers.facebook.com/tools/debug/) or
  [X's card validator](https://cards-dev.twitter.com/validator) to force a
  refresh, or the old picture may keep showing for a while.

---

## Setting up the contact form

Form submissions are emailed straight to Kate using **Web3Forms**. There's no
database and no server code to maintain — and it's free at this volume.

**One-time setup:**

1. Go to <https://web3forms.com> and enter the email address that should receive
   enquiries. They email back an **access key**.
2. In this folder, make a copy of `.env.example` and name it `.env.local`.
3. Paste the key in:

   ```
   NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=your-key-here
   ```

4. Add the same value in Vercel under **Project Settings → Environment
   Variables**, then redeploy.

Until a key is added, the form politely asks visitors to email instead — it
never fails silently.

**Spam protection:** the form includes a hidden "honeypot" field that real
visitors never see. Bots fill it in, and those submissions are discarded.

> `.env.local` is never committed to git, so the key stays private.

---

## Using the private backend

The private backend lives at `/admin`. It uses Supabase Auth for Kate's
email/password login, stores client and provider status in Supabase, creates
Stripe Customers, sends hosted invoices, and sends contracts through
Documenso.

Add the backend variables from `.env.example` to `.env.local` and to Vercel.
The Supabase project already contains the backend tables and RLS policies. To
finish account setup:

1. Create Kate's email/password user in Supabase Auth.
2. Add that user's UUID to `public.admin_users` in the Supabase SQL editor.
3. Add the Stripe Price IDs to `STRIPE_PRICE_CATALOG_JSON`.
4. Configure Stripe's webhook URL as `/api/webhooks/stripe`.
5. Upload the contract template to Documenso, then set its envelope ID and
   field mapping in the Documenso environment variables.
6. Configure Documenso's webhook URL as `/api/webhooks/documenso`.

The dashboard intentionally sends one invoice at a time. It does not create
Stripe subscriptions or expose a client-facing portal.

---

## Deploying to Vercel

1. Push this project to a GitHub repository.
2. Go to <https://vercel.com>, click **Add New → Project**, and import that
   repository.
3. Vercel detects Next.js automatically — no build settings to change.
4. Before the first deploy, add the environment variables from `.env.example`
   under **Environment Variables**.
5. Click **Deploy**.

Every push to the `main` branch redeploys the live site automatically.

Once the real domain is connected, update `NEXT_PUBLIC_SITE_URL` in Vercel (and
the `url` fallback in `src/content/site.ts`) so links, SEO tags and the sitemap
point at the right address.

---

## Before launch checklist

Search the project for `TODO` to find every placeholder. The main ones:

- [ ] Real email address and social profile links — `src/content/site.ts`
- [ ] Real domain in `NEXT_PUBLIC_SITE_URL` — `.env.local` and Vercel
- [ ] Real videos and client names — `src/content/portfolio.ts`
- [ ] Real pricing and package inclusions — `src/content/services.ts`
- [ ] Real result numbers on the About page — `src/content/about.ts`
- [ ] Web3Forms key added, and a test message sent to confirm it arrives
- [ ] Supabase publishable/secret keys added to the deployment environment
- [ ] Kate's Supabase Auth user added to `public.admin_users`
- [ ] Stripe Price catalog and webhook secret configured
- [ ] Documenso template, field mapping, API token, and webhook secret configured
- [ ] Check the share card looks right by texting yourself a link once it's live

Already done: logo (header + footer), headshot, browser icon, phone icon and
the social share card.

---

## Project structure

```
src/
├── app/                     Pages — one folder per page
│   ├── page.tsx               Home
│   ├── work/page.tsx          Portfolio
│   ├── services/page.tsx      Packages & pricing
│   ├── about/page.tsx         About & qualifications
│   ├── contact/page.tsx       Contact form
│   ├── admin/                  Private client, invoice and contract dashboard
│   ├── api/                    Authenticated admin APIs and provider webhooks
│   ├── layout.tsx             Header/footer wrapper, fonts, site-wide SEO
│   ├── globals.css            Brand colours, fonts, base styles
│   ├── sitemap.ts             Auto-generated sitemap for search engines
│   ├── robots.ts              Search engine instructions
│   ├── icon.png               Browser tab icon
│   ├── apple-icon.png         Home screen icon
│   └── opengraph-image.jpg    The picture shown when the link is shared
│       + twitter-image.jpg
│
├── content/                 ⭐ ALL EDITABLE CONTENT LIVES HERE
│   ├── site.ts                Name, email, socials, navigation
│   ├── home.ts                Home page copy
│   ├── portfolio.ts           Video gallery
│   ├── services.ts            Packages and pricing
│   ├── about.ts               Bio, qualifications, stats
│   └── contact.ts             Contact page copy
│
├── components/              Reusable pieces of the page
│   ├── layout/                Header, footer, logo, social icons
│   ├── home/                  Home page sections
│   ├── work/                  Video gallery and video cards
│   ├── services/              Pricing cards
│   ├── about/                 Headshot
│   ├── contact/               Contact form
│   ├── ui/                    Buttons, sections, headings, animations
│   └── icons/                 Inline SVG icons
│
└── lib/                     Small helpers
    ├── embeds.ts              Turns share links into video embeds
    ├── seo.ts                 Builds each page's SEO tags
    ├── utils.ts               Class name helper
    ├── stripe.ts              Server-only Stripe integration
    ├── documenso.ts           Server-only Documenso integration
    └── supabase/              Browser, server, proxy and generated DB clients

public/images/               Logo, headshot and any video covers
design-assets/               Full-resolution originals (never published)
```

### Notes for a future developer

- Next.js App Router; public pages are static while `/admin` and provider APIs
  are dynamic server routes.
- Tailwind CSS v4 with a CSS-first theme — design tokens are defined in the
  `@theme` block at the top of `src/app/globals.css`, not a JS config file.
- Public content stays server-rendered where possible; dashboard forms and
  actions are client components backed by authenticated server routes.
- Video embeds use a click-to-load facade. No third-party iframe or script is
  requested until a visitor plays a video, which keeps the initial load light.
- `AGENTS.md` and `CLAUDE.md` in the project root are generated automatically by
  Next.js; they're safe to ignore or delete.
