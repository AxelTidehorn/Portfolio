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

- **Type:** Archivo (variable weight + width; headings run condensed) and IBM Plex Mono for labels/metadata, self-hosted via `@fontsource` (imported at the top of `global.css`).
- **Paper:** light, warm `#F3F0E8` with a faint drafting grid on overview pages. Gallery pages (`compact` layout) get plain paper via `body.quiet` — no grid, no effects near photographs.
- **Line weights:** outline (`--w-outline`, 2px) for frames and section heads; division (`--w-div`, 1px) for cells and dividers; construction (`.rule--construction`, light ink) for rows and sub-fields. Lines are perfectly straight; the only "hand" quality is a barely visible ink-density drift along each line (an opacity mask, no displacement).

## Layout grid

The background grid is the layout system, not decoration. Module **8px**, major **40px**.

**Horizontal.** The grid is centred on the page: a major line always runs through the page centre (`background-position: calc(50% + tile/2)`). Containers (`.wrap`) are centred and their width is rounded with CSS `round()`:

- ≥ 760px: width = multiple of **80px** → each edge is a whole number of 40px cells from the centre, i.e. on a **major** line.
- < 760px: width = multiple of **16px** → edges on **minor** (8px) lines. Rounding to 80px on a phone would waste up to 79px of width.

Inside a container, columns are either fixed multiples of 40px or proportional widths rounded down to 40px (`round(down, (100% - gap) * 0.58, 40px)`), with the last column taking the remainder — which is then also a whole number of cells. Gaps are 40px. So title-block cells, hero/side columns, card columns, table columns and metadata fields all start on grid lines at every width. (Table columns use `cqw` units because table layout ignores percentages inside `round()`.)

**Vertical.** Measured from the top of the page. Line heights (body 24px, labels 16px, headings `round(up, 1em, 8px)`), margins, paddings and fixed heights (title-block rows 72/48px, table rows 40px, metadata rows 56px) are multiples of 8px. Image boxes are rounded **up** to 8px (`.snap`, using container-query units and the image ratio as `--r`); the image itself keeps its aspect ratio and any remainder is empty paper below it. Photographs are never cropped or resized to the grid.

**Lines** are drawn with `.rule` (set `--rt/--rr/--rb/--rl`): a pseudo-element, not borders, so lines never push content off the module. Top/left lines sit on the box's own coordinate, right/bottom lines just outside it, so every line covers exactly the pixel of the grid line it belongs to. The width variables are registered as non-inherited (`@property`) so nested boxes don't repeat a parent's frame.

**Limitations**

- Vertical alignment is guaranteed to the 8px module, not to 40px major lines: section starts depend on content height.
- Images inside Markdown body text are not snapped (CSS can't read their ratio), so content after an inline image can be off the 8px module by up to 7px. Use `gallery` or the cover for exact alignment.
- Requires CSS `round()`, container queries and `@property` (Safari/iOS 16.4+, Chrome 125+, Firefox 128+). Older browsers fall back to an unsnapped but fully working layout.
- On odd viewport widths the page centre is a half pixel; grid and edges round the same way in Chromium, other engines may differ by 1px.

## Deploying to Cloudflare Pages

Not configured yet. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**, pick this repository, then:

- Framework preset: Astro
- Build command: `npm run build`
- Build output directory: `dist`
- Environment variable: `NODE_VERSION` = `22`

Every push to a branch gets a preview URL; `main` becomes production. Attach `axeltidehorn.se` under the project's **Custom domains** only when ready — that step changes DNS.

## Known limitations

- No i18n: UI copy is English; `lang` is set in `src/data/site.ts`.
- Lightbox loads one large (≤2560 px) version per image; no zoom/pan beyond that.
- Inline images in project text are limited to the text column width; use `gallery` for full-width images.
