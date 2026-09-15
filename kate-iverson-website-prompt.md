# Website Build Prompt: Kate Iverson Social Media

Build a clean, minimal, professional website for a solo social media manager's personal business. The site should showcase her short-form video content work, explain her service packages, establish credibility, and make it easy for potential clients to reach out.

## Tech Stack
- **Framework:** React
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Deployment:** Vercel
- Use a standard modern React setup (e.g., Vite or Next.js — Next.js is preferred if SEO/meta tags and file-based routing would help, but either is acceptable) with a clean component structure
- Logo image and additional real content (photos, videos, copy) will be provided separately and dropped into the repo — structure the project so these are easy to drop into an `/assets` or `/public` folder and reference

## Contact Form Backend
- Keep this simple — no database needed, just a reliable way for Kate to get an email when someone submits the form
- **Preferred approach:** Use a third-party form-to-email service like **Formspree** or **Web3Forms**. Point the form's submit action at the service's endpoint (using an API key stored in an environment variable) — no serverless function or backend code required. The service handles emailing Kate the submission directly.
- **Alternative (if a custom solution is preferred):** A small Vercel serverless function (API route) that receives the form data and sends an email via an API like Resend. No database — just a lightweight function whose only job is to send the email.
- Store any API keys as environment variables (never hard-coded), and include a `.env.example` documenting what's needed
- Show a clear success/error state on the form after submission (e.g., "Thanks! I'll be in touch soon." / an error message if something fails)
- Include basic spam protection (e.g., a honeypot field), since this form will be publicly accessible

## Brand & Design Direction
- **Business name:** Kate Iverson Social Media
- **Style:** Clean and minimal — generous white space, uncluttered layouts, one clear focal point per section
- **Color palette:** Pastel pink as the primary accent, warm brown as the complementary/secondary color, with white/off-white as the dominant background. Use the pink sparingly for accents (buttons, highlights, icons) rather than large blocks of color.
- **Typography:** A modern, friendly sans-serif for body text, paired with a slightly more editorial or serif-style font for headings to keep it feeling polished rather than generic.
- **Overall feel:** Approachable but professional — like a boutique creative studio, not a corporate agency.

## Pages & Sections

### 1. Home
- Hero section with a short, punchy tagline about what she does and who she helps
- A primary call-to-action button (e.g., "View My Work" or "Book a Call")
- Brief intro blurb (2-3 sentences) about her and her approach
- A preview strip of 3-4 featured videos/content pieces with a "See More Work" link to the full portfolio
- Quick overview of the service packages (short cards) linking to the full Services page
- A closing CTA section encouraging visitors to get in touch

### 2. Portfolio / My Work
- A video gallery as the centerpiece — embedded videos (support TikTok, Instagram Reels, and YouTube Shorts embeds)
- Organize into a responsive grid (e.g., 2-3 columns desktop, 1 column mobile), styled like a short-form content feed
- Optional filter/category tags if she works across multiple niches (e.g., "Restaurants," "Fashion," "Fitness") — build this as an easy-to-edit array/data structure so she can add new videos and categories herself later without touching layout code
- Each video item should have a small caption or client name/industry (no real client names needed yet — use placeholders she can swap in)

### 3. Services / Packages
- Clear package tiers (e.g., Starter, Growth, Premium — use placeholder names/pricing she can edit) laid out as comparison cards
- Each package should list: what's included (number of posts/month, content types, strategy calls, analytics reporting, etc.), and a price or "starting at" price
- A note that custom packages are available, with a CTA to inquire
- Keep this content-driven (easy to edit in one place) since pricing/offerings will likely change

### 4. About / Qualifications
- Professional headshot placeholder
- Her story — how she got into social media management, her philosophy/approach
- Qualifications section: certifications, past experience, notable results/metrics (placeholder stats she can fill in, e.g., "Grew X account to Y followers")
- Personal touch to build trust and likability (small personal blurb)

**Bio/experience content to include (use as real copy, not placeholder):**
- Bachelor's degree in Public Relations and Strategic Communication from Utah Valley University (UVU)
- Professional experience managing social media/content for companies in the travel services industry and the jewelry industry, among others
- Frame this as: a PR/strategic communication foundation combined with hands-on experience creating content across varied industries (travel, jewelry, and more), giving her both the storytelling instincts and the business/brand-strategy background to manage a client's social presence effectively
- Feel free to write this into a natural "About" narrative rather than a bare list — e.g., how her PR background shapes the way she approaches content strategy, messaging, and brand voice for clients

### 5. Contact
- Contact form (name, email, business/brand name, message, and a dropdown for "which package are you interested in?")
- No automatic scheduling/booking widget — this is outreach-only. The form is the primary path to get in touch.
- Direct email address and links to her social profiles (Instagram, TikTok, LinkedIn) as icons
- Keep this page focused and simple around the form + social/email links

### 6. Footer (site-wide)
- Logo/name, social icons, quick nav links, copyright line

## Functional Requirements
- Fully responsive (mobile-first, since much of her audience will find her via social links on their phones)
- Fast-loading — lazy-load video embeds so they don't slow down initial page load
- Simple, editable content structure — pricing, packages, and video gallery items should live in a clearly separated data section (e.g., a config/data file or CMS-style structure) so she can update content without editing layout/component code
- Basic SEO setup: page titles, meta descriptions, and alt text placeholders for images
- Smooth scroll and subtle hover/transition animations (nothing flashy — keep it aligned with the minimal aesthetic)
- Accessible: proper heading hierarchy, alt text, sufficient color contrast despite the pastel palette

## Content Notes
- Use realistic placeholder copy (not just "Lorem ipsum") so it's clear what kind of content belongs in each spot
- Placeholder video embeds can use sample/dummy embed codes for now, formatted so real links can be swapped in easily
- Flag clearly in code comments where she needs to insert her real photos, videos, pricing, and contact details

## Deliverable
A complete, working website (or web app) matching the above, organized with clean file/folder structure and comments so future edits are easy for someone without a coding background to eventually hand off to a low-code editor or a future developer.
