# Apothecary

Plain-language articles on everyday biology: aspirin, doxycycline, Ray Peat's ideas, orange juice, gelatin and more.

The site ships three complete visual styles. Switch with the pill at the bottom of the page, the keys **1 / 2 / 3**, or the URL (`?v=1`, `?v=2`, `?v=3`). The choice is remembered per browser.

| # | Name | Idea |
|---|------|------|
| 1 | Sheet | A daylight herbarium: specimens taped to paper, typewritten labels, a red accession stamp |
| 2 | Cyanotype | After Anna Atkins, 1843: white plant silhouettes on Prussian blue, with a fern grown from four equations |
| 3 | Darkfield | A microscope view: glowing specimens in round lenses, drifting cells, a 50 µm scale bar |

The first round of styles (Assay, Metabolic, Herbarium) is saved at the git tag `styles-round-1`.

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
- `js/app.js` – routing (`#/slug`) and style switching
- `js/fern.js` – the Barnsley fern for style 2
- `js/lens.js` – drifting cells in the microscope lens for style 3
- `css/base.css` – shared structure
- `css/v1.css`, `css/v2.css`, `css/v3.css` – one file per style

## Deploy

Hosted on Vercel as a static site (`vercel.json` adds security headers).

Nothing on this site is medical advice.
