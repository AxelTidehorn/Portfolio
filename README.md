# axeltidehorn.se

Photography-led personal portfolio. Static site built with [Astro](https://astro.build), deployable to Cloudflare Pages.

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static output in dist/
npm run check     # type/diagnostic check
npm test          # unit tests (node --test)
```

## Structure

| Path | What it is |
| --- | --- |
| `src/data/site.ts` | Site name, nav, homepage hero + intro, contact list. |
| `src/content/photography/*.md` | One file per photographic series. |
| `src/content/projects/*.md` | One file per project. Markdown body = project write-up. |
| `src/content.config.ts` | Schema for both collections (fields and defaults). |
| `src/assets/` | Images (optimised at build time). `placeholders/` holds temporary images. |
| `src/assets/brand/LogoB.svg` | The original logo, inlined unchanged in the header. |
| `src/components/` | `TitleBlock` (header), `Gallery` (+ lightbox), `WorkCard`, `Logo`. |
| `src/layouts/Base.astro` | HTML shell, SEO/meta tags, header, footer. |
| `src/pages/` | Routes: `/`, `/photography/`, `/photography/<series>/`, `/projects/`, `/projects/<project>/`, `/about/`. |
| `src/styles/global.css` | Design tokens (colours, fonts, spacing, paper grid) and base styles. |

Content is separate from display: adding or editing work never requires touching components.

## Logo

`src/assets/brand/LogoB.svg` is the original file. The header inlines it unchanged (only the XML prolog is stripped); if the file is removed, the header falls back to an empty labelled slot. `public/favicon.svg` is a copy of the same file — a dedicated small-size favicon may read better at 16 px.

## Adding photography

1. Export images as **sRGB** JPEGs (long edge ~3000 px is plenty). The build converts to WebP at quality 85–88 and generates responsive sizes; it never crops. Wide-gamut profiles are converted to sRGB by the image pipeline, so export sRGB yourself to stay in control of colour.
2. Put them in e.g. `src/assets/photography/<series-name>/`.
3. Create or edit `src/content/photography/<series-name>.md` (the file name becomes the URL):

```yaml
---
title: What We Leave Behind
summary: One line shown in the index and in search results.
order: 1            # sort order in lists
featured: true      # show in "Selected work" on the homepage
placeholder: false  # remove the red PLACEHOLDER badge
cover:
  src: ../../assets/photography/wwlb/01.jpg
  alt: Describe the photograph for screen readers.
images:
  - src: ../../assets/photography/wwlb/01.jpg
    alt: Describe the photograph.
    caption: Optional caption   # omit if not wanted
  - src: ../../assets/photography/wwlb/02.jpg
    alt: ...
---

Optional short statement about the series (Markdown).
```

Gallery layout follows the images: landscapes stand alone at full width, two consecutive portraits are paired side by side at equal height. Reorder `images` to change the sequence.

**Homepage hero:** change the import and `alt` in `src/data/site.ts` and set `placeholder: false`.

## Adding a project

Create `src/content/projects/<name>.md`. Frontmatter:

- `title`, `summary`, `cover` (required)
- `disciplines: [Software, Engineering]`, `status: Ongoing` (optional — leave out rather than guess)
- `meta:` list of `{ label, value }` rows shown in the project's title block (e.g. Type, Tools, Role)
- `links:` list of `{ label, href }` (external links, must be full URLs)
- `gallery:` list of images (same format as photography) shown after the text
- `order`, `featured`, `placeholder` as above

The Markdown body is the write-up: headings, prose, and inline images (`![alt](../../assets/projects/x/diagram.png)`) for CAD renders, diagrams, screenshots and process photos. Inline images are optimised too.

## Removing placeholders

Search for `placeholder: true` and `PLACEHOLDER` in `src/`. Files to finish:

- `src/data/site.ts` — hero image, intro text, `contact` list
- `src/pages/about.astro` — biography
- `src/content/**` — all records; `photography/placeholder-series.md` is a demo record and can be deleted
- `src/assets/placeholders/` — delete once nothing references it (the build fails if something still does, which is a useful check). `npm run placeholders` regenerates them.

## Visual system

- **Direction:** Scandinavian industrial manuals and product catalogues meet modern Swiss editorial design. The site borrows typography and information hierarchy, not drawing-sheet decoration.
- **Type:** Archivo variable for prominent editorial headlines; IBM Plex Mono for concise functional labels and metadata. Both are self-hosted via `@fontsource`.
- **Paper:** neutral warm off-white `#F3F0E8`, without a visible drafting-paper grid or copy-burn vignette.
- **Rules:** crisp straight dividers with deliberate weight contrast. No SVG distortion, ink masks or decorative technical symbols.
- **Layout:** conventional responsive editorial columns and gutters, with content and layout separated. Photography is never filtered or intentionally cropped for decorative effect.
- **Identity:** `TitleBlock.astro` now renders a compact industrial editorial masthead using the original monogram.

## Deployment (Cloudflare Workers static assets)

This repository is connected to a Cloudflare **Worker** named `portfolio`, using `wrangler.jsonc` for static assets.

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Static asset directory: `./dist`
- Node.js: version 22 or later

The production domain remains independent of this design work. Do not alter the Worker name or DNS while updating the design.

## Known limitations

- No i18n: UI copy is English; `lang` is set in `src/data/site.ts`.
- Lightbox loads one large (≤2560 px) version per image; no zoom/pan beyond that.
- Inline images in project text are limited to the text column width; use `gallery` for full-width images.
