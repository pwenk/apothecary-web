# Apothecary: 10 ways to structure the site

Date: 2026-09-21
Goal: decide how the site is organised (what pages exist, how people move
between them) before deciding how it looks. Every concept below works with
any of the three current styles (Sheet, Cyanotype, Darkfield).

Content we have today: 6 articles (Aspirin, Ray Peat, Doxycycline, Orange
juice, Gelatin, Raw carrot salad). Each one already carries a Latin name,
a common name, a kind ("Food · fruit"), a formula, one key figure, reading
time, 4 sections and a source list. The concepts use only that data, plus
a few new fields where noted.

---

## Part 1: the thinking toolbox

The two skills you named, plus the 10 similar ones found online, plus 2
about innovative websites.

### The two you named

| Skill | What it does |
|---|---|
| [Drunk Claude](https://github.com/KorroAi/drunk-claude) | A "lowered inhibition, not intelligence" persona. Intensity slider from tipsy (0.1) to blackout (1.0), 5 moods, 8 techniques ("hold my beer", "beer goggles", "what if but wrong", "last call"…). Every idea must make you laugh **and** think. |
| [Lateral Thinking](https://github.com/ysskrishna/ai-agent-skills/blob/main/skills/lateral-thinking/SKILL.md) | Edward de Bono's method. Write an impossible statement ("Po: …"), pull one workable principle out of it, then fan it out wider, deeper and sideways. |

### 10 similar idea skills

| # | Skill | Core move |
|---|---|---|
| 1 | [Oblique Strategies](https://github.com/jakedahn/oblique-skill) | Draws 4 random Brian Eno cards ("Use an old idea", "Honour thy error as a hidden intention") and applies them to your task. |
| 2 | [Creative Director](https://github.com/smixs/creative-director-skill) | Ad-agency pipeline: insight → 8-12 concepts → scores them against 571 award-winning campaigns. Uses SIT, bisociation, synectics, random entry. Punishes ideas that copy a known pattern. |
| 3 | [TRIZ](https://github.com/athola/claude-night-market/blob/master/plugins/tome/skills/triz/SKILL.md) | Soviet inventor's method. Name the trade-off ("more X makes Y worse"), then solve it by separating X and Y in time, space or condition instead of compromising. |
| 4 | [Flux](https://github.com/simota/agent-skills/blob/main/flux/SKILL.md) | Lists 10-20 hidden assumptions, flips them, and returns 3-5 reframed problems. Never gives a single answer. |
| 5 | [Creative Thinking for Research](https://github.com/Orchestra-Research/AI-Research-SKILLs/blob/main/21-research-ideation/creative-thinking-for-research/SKILL.md) | 8 cognitive-science tools, including Janusian thinking (hold two opposite ideas as true at once) and abstraction laddering. |
| 6 | [claude-brainstorm](https://github.com/MadeByTokens/claude-brainstorm) | Forces "ideas only, no solutions" mode. Techniques: SCAMPER, Six Thinking Hats, reverse brainstorm, analogy hunt, constraint play. |
| 7 | [thinking-via-negativa](https://github.com/tjboudreaux/cc-thinking-skills) | Improve by removing. Cut everything harmful or unneeded first, then see what's left. |
| 8 | [thinking-first-principles](https://github.com/tjboudreaux/cc-thinking-skills) | Separate what is truly needed from habit, then rebuild from the basics. |
| 9 | [brainstorm (claude-code-toolkit)](https://github.com/robertguss/claude-code-toolkit/tree/main/skills/brainstorm) | Split into stages: frame the problem, go wide, shift perspective, then narrow and check risks. |
| 10 | [brainstorm-ideas](https://github.com/borghei/Claude-Skills/blob/main/project-management/discovery/brainstorm-ideas/SKILL.md) | Product-team style: "How might we…" questions, then weighted scoring to pick a winner. |

### 2 skills about innovative websites

| # | Skill | Core move |
|---|---|---|
| 11 | [Top-Design](https://mcpmarket.com/tools/skills/top-design) (wondelai) | Awwwards / FWA standard. Scores a site out of 10: typography 25 %, composition 25 %, motion 20 %, colour 15 %, craft 15 %. Draws on agencies like Locomotive and Hello Monday. |
| 12 | [Frontend Design](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md) (Anthropic) | Ground the design in the subject, plan in ASCII wireframes first, spend boldness in one place only, avoid template tells. |

Skills 1-10 plus the two you named generated the concepts. Skills 11 and 12
judge them in Part 3.

---

## Part 2: the 10 concepts

Each concept shows: the skill and the move that produced it, the idea in one
line, the page map, wireframes (desktop, then phone), and honest pros and
cons.

---

### Concept 1 · The Medicine Cabinet

**Skill:** Drunk Claude, "hold my beer", intensity 0.6, mood chaotic.
**The drunk thought:** "Your website is a bathroom cabinet. Everybody snoops
in other people's cabinets. Let them."
**The sober idea:** The homepage is a cabinet with shelves. Each shelf is a
category. Each bottle, jar or box is an article. Opening the mirrored door is
the first thing you do.

**Page map**

```
/                cabinet (door closed → door open)
  ├─ shelf: Pills         aspirin, doxycycline
  ├─ shelf: Kitchen       orange juice, gelatin, carrot salad
  └─ shelf: Ideas         ray peat
/#/aspirin       article = the label of the bottle, read up close
/#/about         the note taped inside the door
```

**Desktop: home, door open**

```
┌──────────────────────────────────────────────────────────────────────┐
│ APOTHECARY                                        Articles   About   │
├──────────────────────────────────────────────────────────────────────┤
│   ┌──────────────────────────────┬──────────────────────────────┐    │
│   │ ░ mirror door (swung open) ░ │  PILLS                       │    │
│   │ ░                          ░ │  ┌────┐  ┌─────────┐         │    │
│   │ ░  note taped inside:      ░ │  │ASA │  │ DOXY    │         │    │
│   │ ░  "Nothing in here is     ░ │  │    │  │ 100 mg  │         │    │
│   │ ░   medical advice."       ░ │  └────┘  └─────────┘         │    │
│   │ ░  → About                 ░ │ ═════════════════════════════│    │
│   │ ░                          ░ │  KITCHEN                     │    │
│   │ ░                          ░ │  ┌──────┐ ┌─────┐ ┌───────┐  │    │
│   │ ░                          ░ │  │  OJ  │ │GELA-│ │CARROT │  │    │
│   │ ░                          ░ │  │ 1 L  │ │ TIN │ │ jar   │  │    │
│   │ ░                          ░ │  └──────┘ └─────┘ └───────┘  │    │
│   │ ░                          ░ │ ═════════════════════════════│    │
│   │ ░                          ░ │  IDEAS                       │    │
│   │ ░                          ░ │  ┌───────────────┐           │    │
│   │ ░                          ░ │  │ R. PEAT notes │           │    │
│   │ ░                          ░ │  └───────────────┘           │    │
│   └──────────────────────────────┴──────────────────────────────┘    │
│   hover a bottle → it tilts forward, shows title + reading time      │
└──────────────────────────────────────────────────────────────────────┘
```

**Desktop: article (the label)**

```
┌──────────────────────────────────────────────────────────────────────┐
│ ← back to the cabinet                                                │
│  ┌───────────────────────────────────────────────┐                   │
│  │  ASPIRIN                          Rx  No. 001 │   KEY FIGURE      │
│  │  Salix alba · white willow                    │   Half-life       │
│  │  C₉H₈O₄                       6 min read      │   15–20 min       │
│  ├───────────────────────────────────────────────┤                   │
│  │  From bark to tablet                          │   ON THIS SHELF   │
│  │  Willow bark contains salicin…                │   · Doxycycline   │
│  │                                               │                   │
│  │  What it does inside you                      │                   │
│  │  …                                            │                   │
│  │  ⚠ Who should avoid it   (printed like the    │                   │
│  │                           warning box on a    │                   │
│  │                           real pack insert)   │                   │
│  │  Sources ▸                                    │                   │
│  └───────────────────────────────────────────────┘                   │
└──────────────────────────────────────────────────────────────────────┘
```

**Phone**

```
┌──────────────────────┐
│ APOTHECARY       ☰   │
├──────────────────────┤
│ PILLS          2 →   │  shelves become
│ [ASA] [DOXY]         │  side-scrolling rows
│══════════════════════│
│ KITCHEN        3 →   │
│ [OJ] [GEL] [CARR…    │
│══════════════════════│
│ IDEAS          1 →   │
│ [R. PEAT]            │
└──────────────────────┘
```

**Pros:** Instantly memorable. Categories feel physical. Adding an article
means adding a bottle, which is fun.
**Cons:** Needs a drawn object per article (you already have specimens, so
this is extra work). A cabinet looks crowded past ~25 items. The metaphor
says "medicines", which is odd for carrot salad.

---

### Concept 2 · Facts, not articles

**Skill:** Lateral Thinking.
**Po:** "The website has no articles."
**Movement:** What is left if there are no articles? The single facts
inside them. "Platelets have no nucleus." "Glycine is about 1 in 3 amino
acids in gelatin."
**Principle:** The smallest unit is a fact card. Articles are one path
through a set of facts. Facts link across articles.
**Concept fan:** wider → every fact has a source; deeper → a fact can be
"certain / debated / fringe"; sideways → shared facts join articles
(prostaglandins join Aspirin and Ray Peat).

**Page map**

```
/                  wall of fact cards (shuffled daily)
/#/fact/platelets  one fact: claim, source, "appears in: Aspirin"
/#/aspirin         article = its facts in reading order, with prose between
/#/articles        classic list, for people who want it
```

**Desktop: home**

```
┌──────────────────────────────────────────────────────────────────────┐
│ APOTHECARY          Filter: [ all ▾ ]  [ certain ▾ ]    Articles ☰   │
├──────────────────────────────────────────────────────────────────────┤
│ ┌───────────────────┐ ┌──────────────────────┐ ┌───────────────────┐ │
│ │ Platelets have no │ │ Doxycycline was first│ │ One cup of OJ has │ │
│ │ nucleus, so one   │ │ found in a soil      │ │ about 124 mg of   │ │
│ │ aspirin affects   │ │ bacterium.           │ │ vitamin C.        │ │
│ │ them for 7-10 d.  │ │                      │ │                   │ │
│ │ ● certain         │ │ ● certain            │ │ ● certain         │ │
│ │ from ASPIRIN →    │ │ from DOXYCYCLINE →   │ │ from ORANGE JUICE→│ │
│ └───────────────────┘ └──────────────────────┘ └───────────────────┘ │
│ ┌──────────────────────────────┐ ┌─────────────────────────────────┐ │
│ │ Peat argued a warm body      │ │ Glycine may help people fall    │ │
│ │ (37 °C) signals a healthy    │ │ asleep faster.                  │ │
│ │ thyroid.                     │ │ ◐ debated                       │ │
│ │ ○ fringe                     │ │ from GELATIN →   also: PEAT →   │ │
│ │ from RAY PEAT →              │ └─────────────────────────────────┘ │
│ └──────────────────────────────┘                                     │
│                         [ show 12 more facts ]                       │
└──────────────────────────────────────────────────────────────────────┘
```

**Desktop: article**

```
┌──────────────────────────────────────────────────────────────────────┐
│ ASPIRIN, THE WILLOW'S LONG SHADOW                  6 min · 7 facts   │
├───────────────────────────────────────────────┬──────────────────────┤
│ Willow bark contains salicin…                 │ FACTS IN THIS PIECE  │
│                                               │ 1 ● salicin → acid   │
│ ┌ FACT ─────────────────────────────────────┐ │ 2 ● Bayer 1899       │
│ │ Aspirin blocks COX-1 and COX-2 for good.  │ │ 3 ● COX block ◀ here │
│ │ ● certain · Vane 1971                     │ │ 4 ● platelets        │
│ │ also in: RAY PEAT (prostaglandins) →      │ │ 5 ◐ daily dose       │
│ └───────────────────────────────────────────┘ │ 6 ● Reye's syndrome  │
│                                               │                      │
│ The block is permanent for each enzyme…       │                      │
└───────────────────────────────────────────────┴──────────────────────┘
```

**Phone**

```
┌──────────────────────┐
│ APOTHECARY  [filter] │
├──────────────────────┤
│ ┌──────────────────┐ │
│ │ Platelets have no│ │  one card per screen,
│ │ nucleus…         │ │  swipe up for the next
│ │ ● certain        │ │
│ │ ASPIRIN →        │ │
│ └──────────────────┘ │
│        ⌄ next        │
└──────────────────────┘
```

**Pros:** Fits your "certain vs unproven" honesty perfectly. Great for
sharing single facts. Creates links between articles for free.
**Cons:** Needs a new data field (facts with a certainty label). Writing
effort goes up. Some readers just want the article and nothing else.

---

### Concept 3 · The Timeline Spine

**Skill:** Oblique Strategies. Cards drawn: *"Use an old idea"*, *"Only a
part, not the whole"*, *"Emphasise the flaws"*, *"Look at the order in which
you do things"*.
**Reading the cards:** The oldest idea on the site is the dates. Aspirin
1897, Vane 1971, the 2022 aspirin advice change, Anna Atkins 1843. "Emphasise
the flaws" = show where science changed its mind.
**The idea:** One long vertical timeline is the homepage. Every article
hangs off the years it touches. Moments where advice was reversed are
marked in red.

**Page map**

```
/               timeline, 1843 → today
/#/aspirin      article; its own dates shown as a mini timeline on top
/#/articles     alphabetical fallback
```

**Desktop: home**

```
┌──────────────────────────────────────────────────────────────────────┐
│ APOTHECARY                 jump to: 1800s  1900s  1950+  today       │
├──────────────────────────────────────────────────────────────────────┤
│                          │                                           │
│   1843  Anna Atkins ─────●  (about the site)                         │
│                          │                                           │
│   1897  Hoffmann ────────●───── ASPIRIN, the willow's long shadow    │
│         acetylates       │      6 min · NSAID                        │
│         salicylic acid   │                                           │
│                          │                                           │
│   1948  ─────────────────●───── DOXYCYCLINE, the soil's antibiotic   │
│         tetracyclines    │      first tetracycline from soil         │
│         from soil        │                                           │
│                          │                                           │
│   1971  Vane: how ───────●───── ASPIRIN (again)                      │
│         aspirin works    │                                           │
│                          │                                           │
│   1970s Ray Peat ────────●───── RAY PEAT and the warm body           │
│         starts writing   │                                           │
│                          │                                           │
│   2022  ✕ ADVICE ────────◆───── ASPIRIN: daily dose no longer        │
│         REVERSED         │      advised for healthy over-60s         │
│                          │                                           │
│   today ─────────────────●───── ORANGE JUICE · GELATIN · CARROT      │
│                          │      (still being argued)                 │
└──────────────────────────────────────────────────────────────────────┘
  ● = event   ◆ = science changed its mind
```

**Desktop: article**

```
┌──────────────────────────────────────────────────────────────────────┐
│ 1897 ●──────── 1971 ●────────────────────────── 2022 ◆   ASPIRIN     │
│      tablet         mechanism                   advice reversed      │
├──────────────────────────────────────────────────────────────────────┤
│  Aspirin, the willow's long shadow                                   │
│  (normal article; each section is pinned to its year on the bar)     │
└──────────────────────────────────────────────────────────────────────┘
```

**Phone**

```
┌──────────────────────┐
│ APOTHECARY           │
├──────────────────────┤
│ 1843 ●               │
│      │ Atkins        │
│ 1897 ●               │
│      │ ASPIRIN  →    │
│ 1948 ●               │
│      │ DOXY  →       │
│ 2022 ◆               │
│      │ reversed!     │
└──────────────────────┘
```

**Pros:** Tells a story nobody else tells. The red "reversed" marks show
honesty. Works well with herbarium dates and accession numbers.
**Cons:** Food articles (carrot, OJ) have weak dates and crowd at "today".
Hard to find one article quickly without the fallback list.

---

### Concept 4 · The Prescription Pad

**Skill:** Creative Director. Methods: SIT "task unification" (make one
existing part do a second job) + bisociation (pharmacy x recipe card).
**Insight:** People trust recipe cards and pack inserts because they always
look the same.
**The idea:** Every article is one card with the same fixed boxes:
*Take · What it does · Evidence · Watch out · Sources*. The card header does
a second job as navigation: tap "Watch out" on any card and you jump to the
same box on the next card.

**Page map**

```
/               stack of pads (one per article), fanned out
/#/aspirin      the pad, full size
/#/aspirin?box=watch   jump straight to a box
```

**Desktop: home**

```
┌──────────────────────────────────────────────────────────────────────┐
│ APOTHECARY                                           About           │
├──────────────────────────────────────────────────────────────────────┤
│    ┌───────────────┐                                                 │
│    │ Rx ASPIRIN    ├───────────┐                                     │
│    │ Salix alba    │ Rx DOXY   ├───────────┐                         │
│    │ 6 min         │ Streptom. │ Rx OJ     ├───────────┐             │
│    └───────────────┤ 7 min     │ Citrus    │ Rx GELATIN├──────┐      │
│                    └───────────┤ 5 min     │ Bos taurus│ Rx … │      │
│                                └───────────┤ 5 min     │      │      │
│                                            └───────────┴──────┘      │
│         ← drag the fan →     or   [ see all as a list ]              │
└──────────────────────────────────────────────────────────────────────┘
```

**Desktop: article (the pad)**

```
┌──────────────────────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ Rx  ASPIRIN                     No. 001 · 6 min · C₉H₈O₄        │  │
│  │ White willow · Salix alba                                      │  │
│  ├──────┬───────────────┬──────────┬─────────────┬────────────────┤  │
│  │ TAKE │ WHAT IT DOES  │ EVIDENCE │ ⚠ WATCH OUT │ SOURCES        │  │
│  ├──────┴───────────────┴──────────┴─────────────┴────────────────┤  │
│  │ WHAT IT DOES                                                   │  │
│  │ Blocks COX-1 and COX-2 for good. Platelets can't rebuild them… │  │
│  │                                                                │  │
│  │ EVIDENCE                     ● strong   ◐ mixed   ○ weak       │  │
│  │ Pain & fever ●   Daily heart prevention ◐                      │  │
│  │                                                                │  │
│  │ ⚠ WATCH OUT                                                    │  │
│  │ Children with viruses · ulcers · bleeding disorders            │  │
│  ├────────────────────────────────────────────────────────────────┤  │
│  │ ← prev pad: —            next pad: DOXYCYCLINE → (same box)    │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

**Phone**

```
┌──────────────────────┐
│ Rx ASPIRIN     6 min │
├──────────────────────┤
│[Take][Does][Evid][⚠]│ ← sticky tab bar
├──────────────────────┤
│ WHAT IT DOES         │
│ Blocks COX…          │
│                      │
│ ⚠ WATCH OUT          │
│ …                    │
└──────────────────────┘
```

**Pros:** Very fast to scan. Same boxes everywhere make comparing easy.
Honest "evidence" box. Scales to hundreds of articles.
**Cons:** Articles must be rewritten into fixed boxes. Ray Peat (a person)
and carrot salad (a recipe) don't fit a prescription shape. Looks medical,
which raises the "is this advice?" question.

---

### Concept 5 · The Depth Dial

**Skills:** TRIZ + first principles.
**The trade-off:** More depth makes the page slower to skim. More skimming
removes depth.
**TRIZ fix, separation in condition:** Don't pick one. Each article exists
at three depths and the reader chooses: **Glance** (one line + key figure),
**Gist** (one paragraph per section), **Full** (everything + sources).
**First principles check:** The one thing a reader truly needs is the
answer to "should I care about this?" Glance gives that in 5 seconds.

**Page map**

```
/                    all articles at Glance depth
/#/aspirin           article, remembers your last depth
/#/aspirin?d=gist    shareable depth
```

**Desktop: home (Glance)**

```
┌──────────────────────────────────────────────────────────────────────┐
│ APOTHECARY                   Depth:  (●)Glance  ( )Gist  ( )Full     │
├──────────────────────────────────────────────────────────────────────┤
│  ASPIRIN                                           Half-life         │
│  A willow-bark drug that thins blood for a week.   15–20 min    →    │
│ ──────────────────────────────────────────────────────────────────── │
│  DOXYCYCLINE                                       Half-life         │
│  A soil-bacteria antibiotic; low doses calm skin.  18–22 h      →    │
│ ──────────────────────────────────────────────────────────────────── │
│  ORANGE JUICE                                      Vit C / cup       │
│  Sugar, potassium and vitamin C in one glass.      124 mg       →    │
│ ──────────────────────────────────────────────────────────────────── │
│  GELATIN                                           Glycine share     │
│  Balances meat's amino acids; may help sleep.      ≈ 1 in 3     →    │
│ ──────────────────────────────────────────────────────────────────── │
│  RAY PEAT · CARROT SALAD …                                           │
└──────────────────────────────────────────────────────────────────────┘
```

**Desktop: article, dial moves from Gist to Full**

```
┌──────────────────────────────────────────────────────────────────────┐
│ ASPIRIN                      Depth:  ( )Glance  (●)Gist  ( )Full     │
│ ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁  2 of 6 min                      │
├──────────────────────────────────────────────────────────────────────┤
│  From bark to tablet                                                 │
│  Bayer turned bitter willow bark into a gentler pill in 1899.        │
│                                           [ + read this part fully ] │
│                                                                      │
│  What it does inside you                                             │
│  It blocks two enzymes for good; platelets can't replace them.       │
│  ┌ expanded ────────────────────────────────────────────────────┐    │
│  │ Aspirin blocks two enzymes, COX-1 and COX-2, which make      │    │
│  │ prostaglandins… (full text slides open in place)             │    │
│  └──────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  Why the advice changed                                              │
│  Healthy over-60s are no longer told to start a daily dose.          │
│                                           [ + read this part fully ] │
└──────────────────────────────────────────────────────────────────────┘
```

**Phone**

```
┌──────────────────────┐
│ ASPIRIN              │
│ [Glance|●Gist|Full]  │ ← segmented control,
├──────────────────────┤   sticks to the top
│ From bark to tablet  │
│ Bayer turned…    [+] │
│                      │
│ What it does     [+] │
│ …                    │
└──────────────────────┘
```

**Pros:** Solves a real reading problem. Great on phones. Works for every
article type. Easy to extend.
**Cons:** Needs a one-line and a one-paragraph summary per section (new
writing). The dial is an extra control people must notice.

---

### Concept 6 · Start from the question

**Skill:** Flux. Assumptions listed and flipped:
- "People arrive wanting to learn about a substance" → *they arrive with a
  question*
- "Articles are the unit" → *answers are the unit*
- "Navigation is by topic" → *navigation is by curiosity*

**Reframe chosen:** "How might a reader who has never heard of Ray Peat end
up reading him?" Answer: through a question they already have.
**The idea:** The homepage is a list of plain questions. Each question
opens the part of an article that answers it.

**Page map**

```
/                          questions, grouped loosely
/#/q/why-no-aspirin-kids   answer card → opens Aspirin at that section
/#/aspirin                 full article (questions listed at the end)
```

**Desktop: home**

```
┌──────────────────────────────────────────────────────────────────────┐
│ APOTHECARY                                                           │
│                                                                      │
│      What are you wondering about?   [ type a question…        ]    │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│  ABOUT MEDICINES                  ABOUT FOOD                         │
│  › Why can't kids take aspirin?   › Is orange juice just sugar?      │
│  › Why did daily aspirin advice   › What does gelatin add that       │
│    change?                          meat doesn't?                    │
│  › Why take doxycycline with a    › Why would anyone eat raw         │
│    full glass of water?             carrots for hormones?            │
│                                                                      │
│  ABOUT THE BODY                                                      │
│  › Is a warm body a healthy body?                                    │
│  › Can an amino acid help you sleep?                                 │
└──────────────────────────────────────────────────────────────────────┘
```

**Desktop: answer card**

```
┌──────────────────────────────────────────────────────────────────────┐
│  Why can't kids take aspirin?                                        │
│ ──────────────────────────────────────────────────────────────────── │
│  Short answer: it's linked to Reye's syndrome, a rare swelling of    │
│  the liver and brain, when given during a viral illness.             │
│                                                                      │
│  From: ASPIRIN, the willow's long shadow · section 4                 │
│  [ read the whole article → ]                                        │
│                                                                      │
│  People also wondered                                                │
│  › Why did daily aspirin advice change?                              │
│  › How long does one aspirin affect the blood?                       │
└──────────────────────────────────────────────────────────────────────┘
```

**Phone**

```
┌──────────────────────┐
│ What are you         │
│ wondering about?     │
│ [ search…         ]  │
├──────────────────────┤
│ › Why can't kids…    │
│ › Is OJ just sugar?  │
│ › Warm body = …?     │
└──────────────────────┘
```

**Pros:** Matches how people actually search (Google, voice). Strong for
SEO (search-engine traffic). New readers find the site through questions.
**Cons:** Question lists feel like FAQ pages if written lazily. Risk of
looking like medical advice ("Can I…?"), so questions must stay "why/what",
never "should I". Needs the question field.

---

### Concept 7 · The Food ↔ Drug Map

**Skill:** Creative Thinking for Research, Janusian thinking.
**Two opposites held as true at once:** "Orange juice is a food" and
"Orange juice is a drug". Both are true; it's a dose question.
**The idea:** A two-axis map is the homepage. Left-right: food ↔ drug.
Bottom-top: ancient ↔ modern. Every article is a specimen pinned where it
belongs. Readers see the whole collection as one landscape.

**Page map**

```
/               the map
/#/aspirin      article; a mini-map in the corner shows where it sits
/#/articles     list fallback (for screen readers and phones)
```

**Desktop: home**

```
┌──────────────────────────────────────────────────────────────────────┐
│ APOTHECARY                                          List view ☰      │
├──────────────────────────────────────────────────────────────────────┤
│  MODERN                                                              │
│    ▲                                                                 │
│    │                                              ✿ DOXYCYCLINE      │
│    │              ✿ RAY PEAT                         (1967)          │
│    │                (1970s, ideas)                                   │
│    │                                                                 │
│    │                                                                 │
│    │   ✿ ORANGE JUICE          ✿ GELATIN                             │
│    │     (daily food)            (food, used                         │
│    │                              like a supplement)   ✿ ASPIRIN     │
│    │   ✿ CARROT SALAD                                   (bark→pill)  │
│    │                                                                 │
│  ANCIENT ───────────────────────────────────────────────────────▶    │
│        FOOD                    SUPPLEMENT                 DRUG       │
│                                                                      │
│  hover a specimen → card with title, key figure, 1-line summary      │
└──────────────────────────────────────────────────────────────────────┘
```

**Article: corner mini-map**

```
┌───────────────────────────────────────────────┬──────────────────────┐
│ GELATIN AND THE GLYCINE QUESTION              │ ┌──────────────────┐ │
│                                               │ │      ·     ·     │ │
│ (normal article)                              │ │  ·   ✿ you  ·    │ │
│                                               │ │ food ─────── drug│ │
│                                               │ └──────────────────┘ │
│                                               │ Nearest: OJ, Carrot  │
└───────────────────────────────────────────────┴──────────────────────┘
```

**Phone**

```
┌──────────────────────┐
│ FOOD ───────── DRUG  │ the map becomes one
│ ✿OJ ✿CAR ✿GEL   ✿ASA│ horizontal strip you
│ ◀ swipe          ▶   │ swipe; list below
├──────────────────────┤
│ ✿ Aspirin      6 min │
│ ✿ Doxycycline  7 min │
└──────────────────────┘
```

**Pros:** Teaches the core idea of the whole site in one picture. Beautiful
with the herbarium specimens. Invites exploring.
**Cons:** Placement is opinion; people may argue. Crowds after ~30 items.
Weak on phones without the list fallback.

---

### Concept 8 · The Museum Walk

**Skills:** claude-brainstorm (SCAMPER: **A**dapt) + brainstorm-ideas
("How might we make 6 articles feel like a complete visit?").
**Adapt from:** a natural-history museum. Rooms, a floor plan, a set route,
a gift-shop exit.
**The idea:** Articles are grouped into rooms. Each room has a short wall
text. You walk room to room in a set order, or jump using the floor plan.

**Page map**

```
/                        entrance hall + floor plan
/#/room/bark-and-soil    Room I   Aspirin, Doxycycline
/#/room/kitchen          Room II  Orange juice, Gelatin, Carrot salad
/#/room/heretic          Room III Ray Peat
/#/aspirin               exhibit (article); "next exhibit →" at the end
```

**Desktop: home (floor plan)**

```
┌──────────────────────────────────────────────────────────────────────┐
│ APOTHECARY · a museum of everyday biology                            │
├──────────────────────────────────────────────────────────────────────┤
│   ┌──────────────────────┬──────────────────────┬─────────────────┐  │
│   │ ROOM I               │ ROOM II              │ ROOM III        │  │
│   │ Bark & Soil          │ The Kitchen          │ The Heretic     │  │
│   │                      │                      │                 │  │
│   │ ✿ Aspirin            │ ✿ Orange juice       │ ✿ Ray Peat      │  │
│   │ ✿ Doxycycline        │ ✿ Gelatin            │                 │  │
│   │                      │ ✿ Carrot salad       │                 │  │
│   │ Drugs found in       │ Foods people use     │ One man's big   │  │
│   │ nature               │ like medicine        │ theory          │  │
│   └─────────┬────────────┴───────────┬──────────┴────────┬────────┘  │
│             │ →                      │ →                 │           │
│   ┌─────────┴────────────────────────┴───────────────────┴───────┐  │
│   │ ENTRANCE          [ Start the walk → ]     35 min in total    │  │
│   └──────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

**Desktop: room**

```
┌──────────────────────────────────────────────────────────────────────┐
│ ROOM I · BARK & SOIL                          I ● ─── II ○ ─── III ○ │
├──────────────────────────────────────────────────────────────────────┤
│  Wall text: Two of the world's most used drugs were first found in   │
│  a riverbank tree and a spoon of dirt.                               │
│                                                                      │
│   ┌────────────────────────────┐   ┌────────────────────────────┐    │
│   │ [specimen drawing]         │   │ [specimen drawing]         │    │
│   │ EXHIBIT 1                  │   │ EXHIBIT 2                  │    │
│   │ Aspirin                    │   │ Doxycycline                │    │
│   │ Salix alba · 6 min         │   │ Streptomyces · 7 min       │    │
│   └────────────────────────────┘   └────────────────────────────┘    │
│                                          [ next room: Kitchen → ]    │
└──────────────────────────────────────────────────────────────────────┘
```

**Phone**

```
┌──────────────────────┐
│ I ● ── II ○ ── III ○ │
├──────────────────────┤
│ ROOM I               │
│ Bark & Soil          │
│ Two of the world's…  │
│ ┌──────────────────┐ │
│ │ ✿ Aspirin   6 min│ │
│ └──────────────────┘ │
│ ┌──────────────────┐ │
│ │ ✿ Doxy      7 min│ │
│ └──────────────────┘ │
│ [ next room → ]      │
└──────────────────────┘
```

**Pros:** Gives the collection a curated story. Rooms are simple
categories in costume, so it scales well (add a room). Fits the herbarium
look.
**Cons:** One more click before reading. Rooms need wall texts. "The
Heretic" as a room name is a strong editorial stance on Ray Peat.

---

### Concept 9 · The Accession Register

**Skill:** thinking-via-negativa.
**What we removed:** hero image, cards, categories, drawings on the home
page, the style switcher from the main view. What survived: a ruled ledger.
**The idea:** Home is a single dense table, like a herbarium's accession
book. One row per article. Sort by any column. The article page is equally
plain: text, one key figure, sources.

**Page map**

```
/              the register (sortable table)
/#/aspirin     article
/#/about       about
```

**Desktop: home**

```
┌──────────────────────────────────────────────────────────────────────┐
│ APOTHECARY — Register of specimens                        About      │
├──────┬─────────────────────────────┬──────────────┬──────────┬───────┤
│ No.▾ │ Title                       │ Kind         │ Key fig. │ Min   │
├──────┼─────────────────────────────┼──────────────┼──────────┼───────┤
│ 001  │ Aspirin, the willow's long  │ NSAID        │ t½ 15–20 │  6    │
│      │ shadow · Salix alba         │              │ min      │       │
├──────┼─────────────────────────────┼──────────────┼──────────┼───────┤
│ 002  │ Ray Peat and the warm body  │ Theory       │ 37.0 °C  │  8    │
│      │ Glandula thyreoidea         │              │          │       │
├──────┼─────────────────────────────┼──────────────┼──────────┼───────┤
│ 003  │ Doxycycline, the soil's     │ Antibiotic   │ t½ 18–22 │  7    │
│      │ antibiotic · Streptomyces   │              │ h        │       │
├──────┼─────────────────────────────┼──────────────┼──────────┼───────┤
│ 004  │ The case for a glass of OJ  │ Food         │ 124 mg C │  5    │
├──────┼─────────────────────────────┼──────────────┼──────────┼───────┤
│ 005  │ Gelatin and the glycine q.  │ Food         │ ≈1 in 3  │  5    │
├──────┼─────────────────────────────┼──────────────┼──────────┼───────┤
│ 006  │ The raw carrot salad        │ Food         │ 2.8 g    │  4    │
└──────┴─────────────────────────────┴──────────────┴──────────┴───────┘
  6 specimens · 35 min of reading · last entry 2026-09-21
```

**Desktop: article**

```
┌──────────────────────────────────────────────────────────────────────┐
│ ← Register                                           No. 001         │
│                                                                      │
│              Aspirin, the willow's long shadow                       │
│              Salix alba · NSAID · 6 min                              │
│                                                                      │
│              From bark to tablet                                     │
│              Willow bark contains salicin…                           │
│              (one column, ~65 characters wide, nothing else)         │
│                                                                      │
│              Sources                                                 │
│              1. Vane JR. 1971…                                       │
│                                                                      │
│              ← 000                                 002 Ray Peat →    │
└──────────────────────────────────────────────────────────────────────┘
```

**Phone**

```
┌──────────────────────┐
│ Register     sort ▾  │
├──────────────────────┤
│ 001 Aspirin      6′  │
│     NSAID · 15 min   │
│──────────────────────│
│ 002 Ray Peat     8′  │
│     Theory · 37 °C   │
│──────────────────────│
│ 003 Doxycycline  7′  │
└──────────────────────┘
```

**Pros:** Fastest to find anything. Cheapest to build and to keep up.
Scales to 500 articles. Very honest. The three visual styles can still
dress it.
**Cons:** No wow on its own; the design has to carry all the charm.
Newcomers get no guidance about where to start.

---

### Concept 10 · Six Lenses

**Skills:** claude-brainstorm (Six Thinking Hats) + claude-code-toolkit
(perspective shifts).
**The hats, turned into lenses:** History (white: facts) · Mechanism
(blue: how it works) · Evidence (green: what trials show) · Risk (black:
caution) · Everyday use (yellow: benefits) · Controversy (red: feelings,
arguments).
**The idea:** Every article is split into the same six lenses. You can
read one article through all lenses, **or** read one lens across all
articles ("show me every Risk section"). It's a grid you can walk in two
directions.

**Page map**

```
/                   the grid (articles × lenses)
/#/aspirin          one row: an article, all lenses
/#/lens/risk        one column: every article's risk section
```

**Desktop: home (the grid)**

```
┌──────────────────────────────────────────────────────────────────────┐
│ APOTHECARY           read across ⟶ an article · down ⟱ a lens        │
├───────────────┬─────────┬──────────┬──────────┬────────┬────────┬────┤
│               │ History │Mechanism │ Evidence │ Risk   │ Use    │Arg.│
├───────────────┼─────────┼──────────┼──────────┼────────┼────────┼────┤
│ Aspirin       │ 1897 ▪  │ COX ▪    │ ● ◐      │ Reye ▪ │ pain ▪ │ ▪  │
│ Doxycycline   │ soil ▪  │ ribo. ▪  │ ●        │ sun ▪  │ skin ▪ │ ·  │
│ Orange juice  │ ·       │ sugar ▪  │ ◐        │ teeth ▪│ vit C ▪│ ▪  │
│ Gelatin       │ ·       │ glycine ▪│ ◐        │ ·      │ sleep ▪│ ▪  │
│ Carrot salad  │ Peat ▪  │ fibre ▪  │ ○        │ ·      │ recipe▪│ ▪  │
│ Ray Peat      │ bio ▪   │ thyroid ▪│ ○        │ ▪      │ diet ▪ │ ▪  │
└───────────────┴─────────┴──────────┴──────────┴────────┴────────┴────┘
  ▪ = section exists (click)   · = nothing yet   ● ◐ ○ = evidence strength
```

**Desktop: one lens across all articles**

```
┌──────────────────────────────────────────────────────────────────────┐
│ LENS: RISK                     History Mechanism Evidence [Risk] Use │
├──────────────────────────────────────────────────────────────────────┤
│  ASPIRIN                                                             │
│  Children with a viral illness, ulcers, bleeding disorders…          │
│  → full article                                                      │
│ ──────────────────────────────────────────────────────────────────── │
│  DOXYCYCLINE                                                         │
│  Take upright with water; avoid strong sun…                          │
│  → full article                                                      │
│ ──────────────────────────────────────────────────────────────────── │
│  ORANGE JUICE                                                        │
│  Acid and sugar are hard on teeth…                                   │
└──────────────────────────────────────────────────────────────────────┘
```

**Phone**

```
┌──────────────────────┐
│ [Article] [Lens]     │ ← toggle what you
├──────────────────────┤   browse by
│ Lens: Risk        ▾  │
│ ─────────────────────│
│ ASPIRIN              │
│ Children with…       │
│ ─────────────────────│
│ DOXYCYCLINE          │
│ Take upright…        │
└──────────────────────┘
```

**Pros:** The most powerful for comparing. The empty cells (·) show gaps,
so the grid doubles as your writing plan. Strong for returning readers.
**Cons:** Every article must be rewritten into six fixed parts. The grid
looks like a spreadsheet unless the design is strong. Six columns don't fit
a phone, so the phone needs its own pattern.

---

## Part 3: judging with the two website skills

**Frontend Design** asks: is it grounded in the subject, is boldness spent
in one place, does it avoid template tells?
**Top-Design** asks: would the structure give typography, composition and
motion room to shine?

Scores out of 5 (5 = best). "Effort" is reversed: 5 = least work.

| # | Concept | Find fast | Scales to 100+ | Reading comfort | Fits herbarium | Wow | Effort (5 = easy) | Total /30 |
|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 1 | Medicine Cabinet | 3 | 2 | 3 | 3 | 5 | 2 | **18** |
| 2 | Facts, not articles | 3 | 4 | 3 | 3 | 4 | 2 | **19** |
| 3 | Timeline Spine | 2 | 3 | 4 | 4 | 4 | 3 | **20** |
| 4 | Prescription Pad | 4 | 5 | 4 | 2 | 3 | 2 | **20** |
| 5 | Depth Dial | 4 | 5 | 5 | 4 | 3 | 3 | **24** |
| 6 | Start from the question | 5 | 4 | 4 | 2 | 3 | 3 | **21** |
| 7 | Food ↔ Drug Map | 3 | 2 | 3 | 5 | 5 | 3 | **21** |
| 8 | Museum Walk | 3 | 4 | 4 | 5 | 4 | 3 | **23** |
| 9 | Accession Register | 5 | 5 | 5 | 5 | 2 | 5 | **27** |
| 10 | Six Lenses | 4 | 4 | 3 | 3 | 4 | 1 | **19** |

### Recommendation

Build on **9 · Accession Register** as the backbone, and spend the
boldness in one place (Frontend Design's rule):

1. **Home = the Register (9).** Fastest to use, cheapest to maintain, and it
   already fits all three herbarium styles. The styles carry the charm.
2. **One bold moment = the Food ↔ Drug Map (7)** as a second view of the
   same register ("Table | Map" toggle). It's the one picture that explains
   what Apothecary is about.
3. **Articles get the Depth Dial (5).** It solves the real reading problem
   and works on phones.
4. **Later, when there are 20+ articles:** add questions (6) for search
   traffic, and rooms (8) if the collection needs a guided route.

Skip for now: 1, 4 and 10. They force every article into a fixed shape,
which Ray Peat and the carrot salad won't fit.

### New data this plan needs

| Field | Used by | Example |
|---|---|---|
| `no` | Register | `"001"` |
| `glance` | Depth Dial, Register | `"A willow-bark drug that thins blood for a week."` |
| `gist` per section | Depth Dial | one sentence per section |
| `map: { food: 0-1, age: 0-1 }` | Map | aspirin `{ food: 0.9, age: 0.3 }` |

## Sources

- https://github.com/KorroAi/drunk-claude
- https://github.com/ysskrishna/ai-agent-skills/blob/main/skills/lateral-thinking/SKILL.md
- https://github.com/jakedahn/oblique-skill
- https://github.com/smixs/creative-director-skill
- https://github.com/athola/claude-night-market/blob/master/plugins/tome/skills/triz/SKILL.md
- https://github.com/simota/agent-skills/blob/main/flux/SKILL.md
- https://github.com/Orchestra-Research/AI-Research-SKILLs/blob/main/21-research-ideation/creative-thinking-for-research/SKILL.md
- https://github.com/MadeByTokens/claude-brainstorm
- https://github.com/tjboudreaux/cc-thinking-skills
- https://github.com/robertguss/claude-code-toolkit/tree/main/skills/brainstorm
- https://github.com/borghei/Claude-Skills/blob/main/project-management/discovery/brainstorm-ideas/SKILL.md
- https://mcpmarket.com/tools/skills/top-design
- https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md
