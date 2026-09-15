# Kate Iverson Social Media

The website for Kate Iverson Social Media — a portfolio and enquiry site for a
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
6. [Deploying to Vercel](#deploying-to-vercel)
7. [Before launch checklist](#before-launch-checklist)
8. [Project structure](#project-structure)

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

Everything is in `src/content/portfolio.ts`.

1. On TikTok, Instagram or YouTube, open the post and use **Share → Copy link**.
2. In the file, copy one of the existing blocks and paste it where you want the
   video to appear (the order in the file is the order on the page).
3. Update the details:

```ts
{
  id: "jewelry-03",                                  // any unique short label
  url: "https://www.tiktok.com/@you/video/123456",   // the link you copied
  client: "Wren & Gold Jewelry",                     // shown under the video
  category: "Jewelry",                               // must match a category
  caption: "Styling series that doubled saves.",     // one short line
  featured: true,                                    // optional: show on home page
},
```

**Notes**

- TikTok, Instagram Reels and YouTube Shorts links all work — the right embed is
  worked out automatically.
- `category` must exactly match one of the names in the `categories` list at the
  top of the same file. Add new categories to that list and filter buttons
  appear on their own. Categories with no videos are hidden automatically.
- `featured: true` adds a video to the strip on the home page. Three or four
  featured videos looks best.
- Videos only load when someone taps play, which keeps the site fast.

---

## Adding photos and the logo

Drop image files into `public/images/`. See `public/images/README.md` for the
exact filenames and sizes — short version:

- **Headshot** → save as `public/images/kate-headshot.jpg`. It replaces the
  placeholder on the About page automatically.
- **Logo** → save as `public/images/logo.svg`, then open
  `src/components/layout/Logo.tsx` and change `USE_LOGO_IMAGE = false` to
  `USE_LOGO_IMAGE = true`.
- **Favicon** (the little icon in the browser tab) → replace
  `src/app/icon.svg` with the logo mark.

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
- [ ] Headshot photo added to `public/images/`
- [ ] Logo file added and `USE_LOGO_IMAGE` switched on
- [ ] Favicon replaced — `src/app/icon.svg`
- [ ] Web3Forms key added, and a test message sent to confirm it arrives
- [ ] Share image added (optional) — `public/images/og-image.jpg`

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
│   ├── layout.tsx             Header/footer wrapper, fonts, site-wide SEO
│   ├── globals.css            Brand colours, fonts, base styles
│   ├── sitemap.ts             Auto-generated sitemap for search engines
│   └── robots.ts              Search engine instructions
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
    └── utils.ts               Class name helper

public/images/               Photos, logo and share image go here
```

### Notes for a future developer

- Next.js App Router; every page is statically pre-rendered.
- Tailwind CSS v4 with a CSS-first theme — design tokens are defined in the
  `@theme` block at the top of `src/app/globals.css`, not a JS config file.
- Only four components are client components (`Header`, `Reveal`, `VideoCard`,
  `WorkGallery`, `ContactForm`); everything else is a server component.
- Video embeds use a click-to-load facade. No third-party iframe or script is
  requested until a visitor plays a video, which keeps the initial load light.
- `AGENTS.md` and `CLAUDE.md` in the project root are generated automatically by
  Next.js; they're safe to ignore or delete.
