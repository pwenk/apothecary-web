# Apothecary

Plain-language articles on everyday biology: aspirin, doxycycline, Ray Peat's ideas, orange juice, gelatin and more.

The site ships three complete visual styles. Switch with the pill at the bottom of the page, the keys **1 / 2 / 3**, or the URL (`?v=1`, `?v=2`, `?v=3`). The choice is remembered per browser. New visitors get Cyanotype.

| # | Name | Idea |
|---|------|------|
| 1 | Sheet | A daylight herbarium: specimens taped to paper, typewritten labels, a red accession stamp |
| 2 | Cyanotype | After Anna Atkins, 1843: white plant silhouettes on Prussian blue, with a fern grown from four equations |
| 3 | Darkfield | A microscope view: glowing specimens in round lenses, drifting cells, a 50 µm scale bar |

**Cyanotype follows the sun.** `js/sun.js` works out how high the sun is from the reader's clock and time zone (no location prompt) and sets two dials, `--dusk` and `--night`, that `css/v2.css` mixes into the colours: Prussian blue by day, sunset orange at golden hour, and from sunset on amber on black with no blue light at all (a yellow multiply filter catches anything the palette misses). The button shows ☀, ◐ or ☾. Preview a phase with `?sun=day`, `?sun=dusk` or `?sun=night`. Without JavaScript, or in browsers without `color-mix()`, the page stays daytime blue.

The first round of styles (Assay, Metabolic, Herbarium) is saved at the git tag `styles-round-1`.

## Layouts

Separately from the look, the site can be **structured** eleven ways: the original (Classic) plus the ten concepts in `planning/structure-concepts.md`. Pick one with the **Layout** row of the switcher, the keys **[** and **]**, or the URL (`?l=0` … `?l=10`). Any layout works with any style, e.g. `?l=9&v=2`.

| # | Layout | Thinking skill | Idea |
|---|--------|----------------|------|
| 0 | Classic | – | The original home page and article |
| 1 | Medicine Cabinet | Drunk Claude | Shelves of bottles; each bottle is an article |
| 2 | Facts, not articles | Lateral thinking | A wall of single claims marked by certainty (`#/fact/<id>`) |
| 3 | Timeline Spine | Oblique Strategies | 1843 → today; reversed advice is marked |
| 4 | Prescription Pad | Creative Director | Five fixed boxes per article (`#/<slug>/<box>`) |
| 5 | Depth Dial | TRIZ + first principles | Every article at Glance, Gist or Full |
| 6 | Start from the question | Flux | Searchable "why / what" questions (`#/q/<id>`) |
| 7 | Food ↔ Drug Map | Janusian thinking | Articles pinned on a food → drug, old → new map |
| 8 | Museum Walk | SCAMPER + How might we | Rooms and a set route (`#/room/<key>`) |
| 9 | Accession Register | Via negativa | One sortable ledger and a plain article |
| 10 | Six Lenses | Six Thinking Hats | Articles × lenses grid (`#/lens/<key>`) |

Any article can be opened at one section with `#/<slug>/sec-<n>`.

## Run locally

No build step. Serve the folder with any static server:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Structure

- `index.html` – page shell, fonts, style switcher
- `js/articles.js` – all article content
- `js/specimens.js` – one drawn specimen (SVG) per article
- `js/concepts-data.js` – extra fields the layouts need (summaries, facts, dates, questions, map spots)
- `js/app.js` – routing, style and layout switching, the shared article page
- `js/layouts/NN-name.js` – one file per layout; each calls `APO.register(...)`
- `js/fern.js` – the Barnsley fern for style 2
- `js/lens.js` – drifting cells in the microscope lens for style 3
- `css/base.css` – shared structure
- `css/v1.css`, `css/v2.css`, `css/v3.css` – one file per style
- `css/layouts.css` – the ten layouts, built only from the style tokens

## Deploy

Hosted on Vercel as a static site (`vercel.json` adds security headers).

Nothing on this site is medical advice.
