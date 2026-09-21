# Apothecary

Plain-language articles on everyday biology: aspirin, doxycycline, Ray Peat's ideas, orange juice, gelatin and more.

The site ships three complete visual styles. Switch with the pill at the bottom of the page, the keys **1 / 2 / 3**, or the URL (`?v=1`, `?v=2`, `?v=3`). The choice is remembered per browser.

| # | Name | Idea |
|---|------|------|
| 1 | Assay | A pharmacology lab sheet: graph paper, ultramarine ink, articles listed like test results |
| 2 | Metabolic | Ray Peat's "warm body": hot orange, a live pulse line, heavy condensed type |
| 3 | Herbarium | A dark specimen cabinet: each article is a plate traced back to the organism it came from |

## Run locally

No build step. Serve the folder with any static server:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Structure

- `index.html` – page shell, fonts, style switcher
- `js/articles.js` – all article content
- `js/app.js` – routing (`#/slug`) and style switching
- `js/ambient.js` – drifting-cell background for style 3
- `css/base.css` – shared structure
- `css/v1.css`, `css/v2.css`, `css/v3.css` – one file per style

## Deploy

Hosted on Vercel as a static site (`vercel.json` adds security headers).

Nothing on this site is medical advice.
