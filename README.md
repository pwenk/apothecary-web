# Apothecary, volume two

Field notes on drugs, food, hormones and desire. Six wings, read in walking order:

| # | Wing | What lives there |
|---|------|------------------|
| I | The Apothecary | How drugs, hormones and peptides work (aspirin, doxycycline, cabergoline, prolactin, dopamine, peptides…) |
| II | The Pantry | What is inside everyday food, read three ways: macro, micro and "the rest" |
| III | Signals | Patterns worth noticing: ADHD, cancer warning signs, low thyroid, low testosterone |
| IV | Schools | Whole worldviews read generously and checked honestly: Ray Peat, Jack Kruse |
| V | Attraction | Evolution, status, scent and seduction (after hours) |
| VI | Pleasure | Polarity, surrender, the bedroom (after hours) |

Day wings sit on herbarium paper; the two "after hours" wings switch to velvet. Every essay opens a question in its first lines and ends by opening the next one ("the loop").

## Writing a piece

Add a Markdown file to `content/<wing>/<slug>.md`:

```yaml
---
title: "Prolactin, the hormone that says enough"
slug: prolactin
wing: apothecary
series: "Molecules of desire"   # optional, groups pieces on the wing page
dek: "One sentence that makes them click."
minutes: 7
evidence: strong                # strong | mixed | thin | fringe (health pieces)
tags: [hormones, sex]
next: serotonin                 # the piece the last lines tease
sources:
  - title: "NIDDK: Prolactinoma"
    url: "https://www.niddk.nih.gov/health-information/endocrine-diseases/prolactinoma"
---
```

Pantry pieces add a `nutrition:` block (`per`, `macro`, `micro`, `rest`, `fdc`), shown as the three-view food label. The reading order inside each wing lives in `src/lib/wings.ts`.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run check      # type check + content check (frontmatter, next links, sources)
npm run build
```

Search engines are blocked until `APOTHECARY_INDEX=yes` is set on Vercel.

Nothing here is medical advice, and no page gives doses.

The first version (three herbarium styles, 24 layouts) is on `main` and at the git tag `styles-round-1` for round one.
