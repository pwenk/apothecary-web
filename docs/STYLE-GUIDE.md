# Style guide for Patrick's two content houses

Read all of this before writing a word. Every piece is judged against it.

## Who reads and why
Patrick Wenk (German, writes in English, ADHD-fast reader, reads a page in a second or not at all). The essays are first for him, to truly understand a thing, then for people "doing their own thing" (creators, founders). Role models: Jamal Dinkoui's "Berbarian Wizard" Substack (mechanisms of drugs and hormones, explained like a lab partner who flirts), Jed McKenna, 4D Barbie (Ada), Kapil Gupta, Yohami (*Ku-no*), Chuck Palahniuk's true odd facts.

## The frame: "from above" (Yohami)
Write from above the topic, never from below it.
- Relaxed, amused certainty. The writer has nothing to prove and nothing to sell. No pleading, no hedging stacks, no "studies suggest that it may possibly…" chains. Say the evidence level once, plainly, then move on.
- Lead the reader like a good dancer leads: they feel taken somewhere, teased, and safe. You set the pace.
- Never moralise, never scold, never beg for agreement. State, show, smile.
- The body is the real clock and the real truth-teller. When in doubt, bring it back to sensation.
- Playful dominance of the material: you know where this goes; the reader doesn't yet.

## The flavour: cheesy and seductive, with loops
- **Seductive:** sensory verbs, a slow reveal, a wink. Molecules can flirt, enzymes can be jealous, hormones can sulk. Personify freely (Palahniuk, Moloch-style gods).
- **Cheesy is allowed** when it's self-aware: one line per section may be a groan-worthy pun or innuendo. Never two in a row.
- **Open loops (mandatory):**
  1. The first 2–3 lines open a question the reader needs closed ("Somewhere in your skull there's a hormone that switches off desire the second you climax. By the end of this page you'll know its name, why it's there, and the one drug that muzzles it.").
  2. Close that loop late, after a detour that pays.
  3. Each section ends with a small hook into the next.
  4. The last lines open the next essay's loop and name it (frontmatter `next`).
- Short paragraphs (1–4 sentences). One idea per paragraph. Vary rhythm: a long sentence, then a short one.

## Plain words (Zinsser: simplicity, brevity, clarity, humanity)
- Kill jargon. If a technical word is needed, explain it in one line the first time ("prolactin, the hormone that says 'enough'").
- Use numbers and real names (Felix Hoffmann, 1897), never vague "scientists".
- One analogy per section, at most. Make it physical (kitchens, cars, keys, bodies).

## Banned (these read as AI slop and Patrick hates them)
- "It's not X, it's Y" / "X isn't A — it's B" reframes and any negative-parallel antithesis.
- Staccato pairs used for rhythm ("Short. Punchy.", "No fluff. No filler.").
- Two parallel metaphors bolted together.
- Callback payoff lines that just repeat an earlier image for applause.
- "Let's dive in", "delve", "in today's world", "game-changer", "unlock", "journey", "tapestry", "testament", "navigate the complexities", "it's important to note", "in conclusion".
- Em-dash spam (max one per paragraph; prefer commas, colons, full stops).
- Lists of three adjectives. Rhetorical questions stacked more than two deep.

## Health and medicine rules (non-negotiable)
- Explain mechanisms, history, evidence and risks. **Never** give doses as instructions, never say "take X", never give cycles or protocols. If a source gives doses, you may say "studies used doses in the X range" only when it matters for understanding, never as advice.
- Mark evidence honestly with the frontmatter `evidence` field: `strong` (big human trials / guidelines), `mixed`, `thin` (animal, lab, anecdote, one small study), `fringe` (a school of thought outside mainstream).
- Separate what an author claims from what studies found. Ray Peat, Jack Kruse, Barbarian Wizard: present their ideas generously and accurately, then a short "What holds up / what doesn't" section.
- Each health piece ends with a short "Before you try anything" line in the voice (a doctor, bloodwork, interactions), not a legal disclaimer wall.
- Sources: 3–8 real, checkable links (PubMed, NIH ODS, FDA labels, NIDDK, Cochrane, guideline bodies, USDA FoodData Central, the author's own pages). Verify every URL you list with a search or fetch. Never invent a citation. Fewer sources beat fake ones.

## Sex, polarity, kink rules
- Adult, frank, sensual, psychological and physiological. Poetic where it serves (think David Deida's *The Way of the Superior Man*, Yohami's lowercase intimacy). No graphic porn description; write about what people feel and why, not a play-by-play.
- Consent is the floor, not the topic. Mention it the way a pilot mentions seatbelts: once, calmly, then fly.
- Safety where real (shibari: nerve compression, never rope over the inner upper arm without knowing why; breath play: just don't). Keep it short.
- Seduction material (Neil Strauss, Chase Hughes, Sex God Method, Taoist practices): extract what's true about attraction, say plainly where a tactic is manipulative or outdated (Strauss himself recanted much of *The Game* in *The Truth*), keep what respects both people.
- Quote sparingly: at most one short quote (under 15 words) per source, attributed. Paraphrase the rest in our own voice.

## Spirituality house (Aletheia) extra rules
- More stylised: may use lowercase passages, white space, one-line paragraphs, second person (Kapil Gupta), the farm-visitor scene (Jed McKenna), the Q&A turn (4D Barbie).
- Each essay kills **one false belief**. Structure: the belief stated as the reader holds it → the image (one concrete picture) → the turn → the quiet landing. No proof-stacking; point, don't argue.
- Patrick's own takes (given in the outline) are the spine. Never contradict them; sharpen them.

## Markdown format (every file)
```
---
title: "Prolactin, the hormone that says enough"
slug: prolactin
wing: apothecary            # apothecary | pantry | signals | schools | attraction | pleasure  (or for Aletheia: foundations | manifestation | beyond | teachers)
series: "Hormones of desire"  # optional
dek: "One sentence that makes them click."
minutes: 7
evidence: strong            # health pieces only: strong | mixed | thin | fringe
tags: [hormones, dopamine, sex]
next: dopamine              # slug of the essay this one's last lines tease
sources:
  - title: "NIDDK: Prolactinoma"
    url: "https://www.niddk.nih.gov/health-information/endocrine-diseases/prolactinoma"
---

Opening loop, 2–3 short paragraphs, no heading.

## Section heading (sentence case, can be playful)

Body…

> One pull quote per essay, our own line, the most tweetable sentence.

## Before you try anything        (health pieces)

…

Last lines open the next loop.
```
- 900–1600 words for essays (Pantry entries 500–900 plus data). Headings are sentence case. No H1 in the body (the title is the H1).
- Use `**bold**` sparingly for the one phrase a skimmer must catch per section.
