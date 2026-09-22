# Interlinking ideas

Round 2, after feedback on the ten layouts (22 Sep 2026).

**What Patrick liked:** the Prescription Pad's style, the Depth Dial's idea (but its Full view is thin), the Food ↔ Drug Map, and Six Lenses (it needs more content first).
**What's missing:** the article pages feel weak in every layout, and articles don't talk to each other.
**New wish:** cross-referencing by situation, e.g. *prevent a cold → treat a cold or flu → aftercare*, with what works and how sure we are.

> The claims in the sketches below are placeholders to show the shape. Articles like Zinc, Sleep or Hygiene don't exist yet, and every real claim needs its own source before it goes live.

---

## The one change underneath everything: a small web of things

Today each article is a sealed jar. To interlink, the site needs a few shared "nouns" that articles point at. Five kinds cover almost everything:

| Kind | Examples | Why it matters |
|---|---|---|
| **Substance** | aspirin, vitamin C, zinc, orange juice, honey | what the articles are about today |
| **Situation** | cold & flu, poor sleep, hangover, after antibiotics | why a reader actually shows up |
| **Phase** | prevent → treat → recover | turns a situation into a path |
| **Mechanism** | inflammation, gut flora, blood clotting | explains *why* two things connect |
| **Claim** | "zinc lozenges shorten colds by about a day" | one sentence + evidence level + source |

A **claim** is the glue: it links one substance to one situation (and phase), carries ● Well established / ◐ Debated / ○ Unproven, and points at the article section that backs it up. Every page below is just a different way of listing claims.

```
  SUBSTANCE ──claim──▶ SITUATION · PHASE
   zinc      "shortens a cold      cold & flu · treat
              by ~1 day" ◐
       │
       └── works through ──▶ MECHANISM (immune cells)
```

In code this is one more file next to `concepts-data.js`: `js/web-data.js` with `substances`, `situations`, `mechanisms`, `claims`. No database needed until there are hundreds of claims.

---

## Idea A · Care Paths (the one you asked for)

A page per situation, walked as a path. Each phase is a column; each claim is a card with its evidence mark and a link into the article that explains it.

```
┌───────────────────────────────────────────────────────────────────────┐
│  CARE PATH                                                            │
│  Cold & flu                                   14 claims · 6 articles  │
│                                                                       │
│   ① PREVENT            ② TREAT                ③ RECOVER               │
│  ─────────────────────────────────────────────────────────────────    │
│  ● Hand washing       ◐ Zinc lozenges         ◐ Sleep & fluids        │
│    cuts spread          ~1 day shorter          ...                   │
│    → Hygiene §2         → Zinc §3              → Sleep §1             │
│                                                                       │
│  ◐ Vitamin C daily    ● Paracetamol eases     ○ "Detox" teas          │
│    only helps under     fever and aches         no evidence           │
│    heavy strain         → Paracetamol §4       → Myths §2             │
│    → Orange juice §3                                                  │
│                       ⚠ Aspirin: not for                              │
│  ○ Echinacea            children and teens    ⚠ After antibiotics:    │
│    mixed results        → Aspirin §5            gut flora →           │
│                                                 Doxycycline §4        │
│  ─────────────────────────────────────────────────────────────────    │
│  Show: ● only   ●◐   ●◐○ (all)                                        │
└───────────────────────────────────────────────────────────────────────┘
```

- The **⚠ cards** come from articles' risk sections, so warnings travel to wherever the substance is recommended.
- The **evidence filter** at the bottom lets a skeptic see only ● claims.
- On phones the three columns become three steps with a ① ② ③ stepper on top.
- Articles get a matching strip at the top: *"Appears in: Cold & flu → Treat · After antibiotics → Recover"*.

## Idea B · Margin cross-references (makes the article pages better)

This answers "the article views are lacking". While you read, the right margin carries small notes that link sideways, like footnotes in a good textbook. On phones they fold into the text as tappable chips.

```
┌──────────────────────────────────────────┬────────────────────────────┐
│  Aspirin, the willow's long shadow       │                            │
│                                          │                            │
│  How it thins the blood                  │  ↔ Same mechanism          │
│  Aspirin switches off an enzyme in       │    Omega-3 and clotting    │
│  platelets for their whole life ...      │    ◐ Debated               │
│                                          │                            │
│                                          │  ⚠ Clashes with            │
│  Who should skip it                      │    Ibuprofen taken first   │
│  Children with a viral illness ...       │    blocks the effect       │
│                                          │                            │
│                                          │  ⇢ Used in                 │
│                                          │    Cold & flu → Treat      │
└──────────────────────────────────────────┴────────────────────────────┘
```

Three kinds of note are enough: **↔ same mechanism**, **⚠ clashes with**, **⇢ used in (care path)**.

## Idea C · The Pad Article (merge the two layouts you liked)

The Prescription Pad's look, with the Depth Dial built in and a much fuller "Full" setting.

```
┌───────────────────────────────────────────────────────────────┐
│  ℞  Aspirin                                  No. 001 · 6 min  │
│     Salix alba · white willow                                 │
│  ─────────────────────────────────────────────────────────    │
│  Depth:  [ Glance ]  [ Gist ]  [● Full ]                      │
│                                                               │
│  What it is │ What it does │ Evidence │ ⚠ Watch out │ Sources │
│  ─────────────────────────────────────────────────────────    │
│  Glance → one line per box (the pad fits on one screen)       │
│  Gist   → 3 bullets per box + evidence marks                  │
│  Full   → the whole text, margin notes (Idea B), a small      │
│           timeline of the substance, the mini-map, and        │
│           "Appears in" care paths                             │
└───────────────────────────────────────────────────────────────┘
```

This is why Full felt thin: it was only the plain article. Full should be where every cross-link and every graph lives.

## Idea D · The Map as the "Explore" room (so you don't forget it)

Keep the Food ↔ Drug Map as its own page in the main menu (*Articles · Care paths · Map · About*), and reuse it in three places:

1. **Explore page**: the full map, as today.
2. **Filtered by situation**: on a care path, a "Map" toggle shows only the substances in that path, coloured by phase (prevent / treat / recover). Where things cluster shows at a glance whether a situation is handled mostly by food or mostly by drugs.
3. **Mini-map in every Full article**: already built in layout 7, it moves into the Pad Article.

```
            DRUG
             ▲      ● paracetamol (treat)
             │   ● aspirin (treat)
   OLD ◀─────┼─────▶ NEW
             │  ◐ zinc (treat)
   honey ○   │     ● vitamin C (prevent)
             ▼
            FOOD            Cold & flu · 6 substances
```

## Idea E · Other graphs worth having

| Graph | Question it answers | Where it lives |
|---|---|---|
| **Evidence bar** per care path: how many ● ◐ ○ claims in each phase | "Is there real science here, or mostly hope?" | Top of each care path |
| **Course of an illness** timeline: day 0 → day 10 with what helps when | "It's day 3, what now?" | Cold & flu path |
| **Interaction grid**: substance × substance, ⚠ where they clash | "Can I take these together?" | Its own page, linked from ⚠ notes |
| **Connection web**: substances linked by shared mechanism | "What else works like this?" | Explore page, next to the map |

The interaction grid is the most useful one and the most risky one. It must only show clashes the articles cite, and say "not covered" rather than "safe" for empty cells.

## Idea F · Six Lenses, once there's enough to fill it

You're right that it needs more information. With six articles most cells are empty. It starts to pay off at about 15 articles and when each article is written to a fixed skeleton: *history · how it works · evidence · everyday use · risks · open debate*. The Pad Article (Idea C) already writes articles in fixed boxes. Once the boxes are filled, a lens is just "show box X across every article", so Six Lenses becomes a free extra view. It comes for free later and needs no work now.

---

## Suggested order

1. **Data web** (`web-data.js`): substances, situations, claims. Start with one situation, cold & flu.
2. **Pad Article** with the Depth Dial and margin notes (Ideas B + C). This fixes the weak article pages everywhere.
3. **First care path**: Cold & flu (Idea A), which needs 3–4 new articles (zinc, vitamin C, paracetamol, honey).
4. **Map as Explore** plus the situation filter (Idea D).
5. Evidence bars and the illness timeline (Idea E), then Six Lenses when there are ~15 articles.

A note on tone: care paths come closest to medical advice. Every path should keep the "explain, don't prescribe" rule from the Questions layout, and should end with the same line as the footer: talk to a doctor or pharmacist.
