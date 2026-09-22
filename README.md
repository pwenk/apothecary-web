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

Separately from the look, the site can be **structured** 24 ways: the original (Classic), the ten concepts in `planning/structure-concepts.md` (1–10) and the thirteen network concepts in `planning/network-ideas.md` (11–23). Pick one with the **Layout** row of the switcher, the keys **[** and **]**, or the URL (`?l=0` … `?l=23`). Any layout works with any style, e.g. `?l=9&v=2`.

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
| 11 | Seating Plan | Drunk Claude | Substances as dinner guests: who gets on, who must sit apart (`#/seat/<key>`) |
| 12 | Pull a Thread | Lateral thinking | Three threads per article; your path is a shareable string (`#/trail/<a,b,c>`) |
| 13 | Back-of-Book Index | Oblique Strategies | A book index with article·section numbers |
| 14 | Transit Map | Creative Director | Health lines, substance stations, interchanges (`#/line/<key>`) |
| 15 | Earned Links | TRIZ | A section's links appear in the margin once you finish reading it |
| 16 | My Shelf | Flux | Tick what you have; see what the articles say about it together (`#/shelf/<a+b>`) |
| 17 | Abstraction Ladder | Creative Thinking for Research | Climb up to wider groups or down into chemistry (`#/rung/<key>`) |
| 18 | Family Tree | claude-brainstorm | Every article traced back to its plant, microbe or animal |
| 19 | Glossary Hubs | Via negativa | Shared words underlined with definitions; each word has a page |
| 20 | Body Map | First principles | Tap a part of the body to see what acts on it (`#/body/<key>`) |
| 21 | Day Wheel | Perspective shift | A 24-hour wheel shaded by today's sun |
| 22 | Argument Map | How might we | Claims joined by supports, contradicts, replaced by |
| 23 | The Web | Obsidian graph view | A draggable, zoomable graph of everything as the home page, with local graphs and linked mentions |

Any article can be opened at one section with `#/<slug>/sec-<n>`. In layouts 11–23 every shared word has its own page at `#/term/<key>`.

**How the network works:** `js/network-data.js` lists the shared words (terms) and a few hand-made, sourced relations. `js/network.js` scans every article for those words, so links appear by themselves as articles are written. A term with no article of its own is shown as "not written yet".

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
- `js/network-data.js` – terms, relations and the hand-placed data for the network layouts (lines, tree, ladder, body, day, arguments)
- `js/network.js` – finds mentions, builds term pages and runs the small force-directed graph
- `js/sun.js` – sun height from the reader's clock, for the Cyanotype colours and the Day Wheel
- `js/layouts/NN-name.js` – one file per layout; each calls `APO.register(...)`
- `js/fern.js` – the Barnsley fern for style 2
- `js/lens.js` – drifting cells in the microscope lens for style 3
- `css/base.css` – shared structure
- `css/v1.css`, `css/v2.css`, `css/v3.css` – one file per style
- `css/layouts.css` – the ten layouts, built only from the style tokens
- `css/network.css` – the network layouts (11–23)

## Deploy

Hosted on Vercel as a static site (`vercel.json` adds security headers).

Nothing on this site is medical advice.
