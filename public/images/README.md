# Images

Everything in this folder is published with the website and available at
`/images/<filename>`. Keep it lean — these files get downloaded by visitors.

Full-resolution originals live in `design-assets/` at the top of the project
(that folder is never published).

## What's here

| File | Where it shows up | To replace it |
| --- | --- | --- |
| `logo.png` | Header | Swap the file, keep the name. If the shape changes, update `WIDTH`/`HEIGHT` in `src/components/layout/Logo.tsx` |
| `logo-light.png` | Footer (reversed version for the dark background) | Same as above — needs to be readable on dark brown |
| `logo-mark.png` | The circular "ki" mark, kept here for reuse | — |
| `kate-headshot.jpg` | About page | Swap the file, keep the name |
| `work/` | Optional cover images for portfolio videos | Add `thumbnail: "/images/work/your-file.jpg"` to the video in `src/content/portfolio.ts` |

The browser tab icon and the social share card are **not** in this folder —
they live in `src/app/` (see below).

## Sizes that work well

- **Headshot** — portrait, around 1200 x 1600px, saved as JPG
- **Video covers** — vertical, around 720 x 1280px (a screenshot of the video works)
- **Logo** — PNG with a transparent background, around 900px wide

Keep files under ~500KB where possible.

The full portfolio videos are not stored in this folder. Upload optimized video
files to the public Supabase `website-videos-public` bucket and keep only their
small poster images here.

## Icons and the share card (in `src/app/`)

| File | What it is |
| --- | --- |
| `src/app/icon.png` | The little icon in the browser tab |
| `src/app/apple-icon.png` | The icon when someone saves the site to their phone home screen |
| `src/app/opengraph-image.jpg` | The picture that appears when the link is texted, posted or messaged |
| `src/app/twitter-image.jpg` | Same picture, for X/Twitter |
| `src/app/*.alt.txt` | The description read aloud for those share images |

Replacing any of those files is enough — Next.js wires them up automatically.
The share images must stay 1200 x 630px.
