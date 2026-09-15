# Images

Drop photos and logo files in this folder. Anything in here is available on the
site at `/images/<filename>`.

## What goes where

| File | Where it shows up | How to switch it on |
| --- | --- | --- |
| `logo.svg` (or `.png`) | Header + footer logo | Set `USE_LOGO_IMAGE = true` in `src/components/layout/Logo.tsx` |
| `kate-headshot.jpg` | About page photo | Nothing to do — it replaces the placeholder automatically |
| `og-image.jpg` | The preview image when a link is shared | Uncomment the `images:` block in `src/lib/seo.ts` |
| `work/*.jpg` | Optional video cover images | Add `thumbnail: "/images/work/your-file.jpg"` to the video in `src/content/portfolio.ts` |

## Sizes that work well

- **Headshot** — portrait, around 900 x 1200px
- **Video covers** — vertical, around 720 x 1280px (a screenshot of the video works)
- **Share image** — 1200 x 630px
- **Logo** — SVG is best; if using PNG, export it at 2x the size it displays

Save photos as JPG (smaller files, faster site). Keep them under ~500KB each
where possible.
