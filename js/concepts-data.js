// Extra fields the ten layout concepts need, keyed by article slug.
// Everything here restates what the article itself says; nothing new is
// claimed. Section numbers point into ARTICLES[n].sections (0-based).
//
//   no        register number
//   glance    one-line summary (Depth Dial, Register)
//   gist      one sentence per section (Depth Dial)
//   vessel    container drawn in the Medicine Cabinet
//   shelf     cabinet shelf        room   museum room
//   map       x: food 0 → drug 1, y: old 0 → new 1 (Food ↔ Drug Map)
//   lenses    which sections belong to which lens (Six Lenses, Prescription Pad)
//   facts     single claims with a certainty level (Facts, Six Lenses, Pad);
//             also = other articles the claim touches
//   events    dated moments (Timeline); reversal = science changed its mind
//   questions plain "why / what" questions a section answers
window.CONCEPTS = (() => {
  "use strict";

  const LEVELS = {
    certain: { label: "Well established", mark: "●" },
    debated: { label: "Debated", mark: "◐" },
    fringe: { label: "Unproven", mark: "○" },
  };

  const LENSES = [
    { key: "history", name: "History", blurb: "Where it came from" },
    { key: "how", name: "How it works", blurb: "What happens in the body" },
    { key: "evidence", name: "Evidence", blurb: "How sure we are, claim by claim" },
    { key: "use", name: "Everyday use", blurb: "How people take or eat it" },
    { key: "risk", name: "Risk", blurb: "Who should be careful" },
    { key: "debate", name: "Debate", blurb: "Where people disagree" },
  ];

  const SHELVES = [
    { key: "pills", name: "Pills", blurb: "Drugs first found in nature" },
    { key: "kitchen", name: "Kitchen", blurb: "Foods people use like medicine" },
    { key: "ideas", name: "Ideas", blurb: "Theories about the body" },
  ];

  const ROOMS = [
    {
      key: "bark-and-soil",
      numeral: "I",
      name: "Bark & Soil",
      blurb: "Drugs found in nature",
      wall: "Two of the most used drugs in the world were first found in a riverbank tree and a spoonful of farm soil. Both still carry the chemistry of the living thing they came from.",
    },
    {
      key: "kitchen",
      numeral: "II",
      name: "The Kitchen",
      blurb: "Foods people use like medicine",
      wall: "A glass of juice, a spoon of gelatin, a grated carrot. Ordinary foods, each with a following that believes it does more than feed you. Here is what is known and what is only hoped.",
    },
    {
      key: "theorist",
      numeral: "III",
      name: "The Theorist",
      blurb: "One biologist's big idea",
      wall: "Many of the foods in the Kitchen arrived here through one man's writing. This room is about him: what he believed, what he told people to eat, and how to read him carefully.",
    },
  ];

  const QUESTION_GROUPS = [
    { key: "medicines", name: "About medicines" },
    { key: "food", name: "About food" },
    { key: "body", name: "About the body" },
  ];

  const bySlug = {
    aspirin: {
      no: 1,
      glance: "A willow-bark drug that dampens platelets for their whole 7–10 day life.",
      gist: [
        "Bayer turned bitter willow-bark chemistry into a gentler pill and sold it from 1899.",
        "It blocks the COX enzymes for good, and platelets can't make new ones.",
        "Since 2022, healthy adults over 60 are advised not to start a daily dose for heart prevention.",
        "Children with a viral illness, and people with ulcers or bleeding problems, should avoid it.",
      ],
      vessel: "bottle",
      shelf: "pills",
      room: "bark-and-soil",
      map: { x: 0.88, y: 0.42 },
      lenses: { history: [0], how: [1], risk: [3], debate: [2] },
      facts: [
        { id: "aspirin-bayer", text: "Bayer began selling Aspirin in 1899, two years after Felix Hoffmann first made it.", level: "certain", section: 0, ref: 2 },
        { id: "aspirin-cox", text: "Aspirin permanently blocks the enzymes COX-1 and COX-2, which make prostaglandins.", level: "certain", section: 1, ref: 0 },
        { id: "aspirin-platelets", text: "Platelets have no nucleus, so one dose affects them for their whole 7–10 day life.", level: "certain", section: 1 },
        { id: "aspirin-daily", text: "For healthy people, the bleeding risk of daily aspirin often cancels its heart benefit.", level: "certain", section: 2, ref: 1 },
        { id: "aspirin-reye", text: "Aspirin during a viral illness in children is linked to Reye's syndrome.", level: "certain", section: 3 },
      ],
      events: [
        { year: 1897, label: "Hoffmann makes acetylsalicylic acid", section: 0 },
        { year: 1899, label: "Bayer sells it as Aspirin", section: 0 },
        { year: 1971, label: "John Vane shows how it works", section: 1 },
        { year: 2022, label: "Daily aspirin advice reversed for healthy over-60s", section: 2, reversal: true },
      ],
      questions: [
        { id: "aspirin-children", group: "medicines", q: "Why can't children take aspirin when they have a virus?", a: "It is linked to Reye's syndrome, a rare swelling of the liver and brain.", section: 3 },
        { id: "aspirin-daily", group: "medicines", q: "Why did the advice on daily aspirin change?", a: "Large trials showed that for people without heart disease, the bleeding risk often cancels the benefit.", section: 2 },
        { id: "aspirin-platelets", group: "body", q: "How long does one aspirin affect your blood?", a: "About seven to ten days: the whole life of the platelets it touches, because they can't rebuild the blocked enzyme.", section: 1 },
      ],
    },

    "ray-peat": {
      no: 2,
      glance: "A biologist's theory that a warm body and fast metabolism mean good health.",
      gist: [
        "A biology PhD who wrote about hormones for fifty years but never ran large trials.",
        "He judged health by energy in the cells, checked with morning temperature and pulse.",
        "He favoured milk, fruit, orange juice, gelatin and sugar, and avoided seed oils.",
        "Most of his claims rest on animal studies and reasoning, so read him as a source of questions.",
      ],
      vessel: "notebook",
      shelf: "ideas",
      room: "theorist",
      map: { x: 0.5, y: 0.8 },
      lenses: { history: [0], how: [1], use: [2], debate: [3] },
      facts: [
        { id: "peat-trials", text: "Ray Peat wrote about hormones for fifty years but never ran large clinical trials.", level: "certain", section: 0 },
        { id: "peat-temperature", text: "A morning temperature near 37 °C and a pulse of 75–85 show healthy thyroid function.", level: "fringe", section: 1, ref: 1 },
        { id: "peat-seed-oils", text: "Polyunsaturated seed oils slow the metabolism as they oxidise.", level: "fringe", section: 2 },
        { id: "peat-evidence", text: "Many of Peat's claims rest on animal studies and older papers, not trials in people.", level: "certain", section: 3 },
      ],
      events: [
        { year: 1936, label: "Raymond Peat is born", section: 0 },
        { year: 1976, label: "Broda Barnes publishes his book on hidden low thyroid", section: 1 },
        { year: 1994, label: "Peat publishes Generative Energy", section: 1 },
        { year: 2022, label: "Peat dies; his essays live on online", section: 0 },
      ],
      questions: [
        { id: "peat-warm", group: "body", q: "Is a warm body a healthy body?", a: "Peat thought so and used a morning temperature near 37 °C as a sign. It is his theory, not a tested rule.", section: 1 },
        { id: "peat-diet", group: "food", q: "What did Ray Peat tell people to eat?", a: "Milk, cheese, eggs, fruit, orange juice, honey, gelatin and shellfish, with few seed oils.", section: 2 },
        { id: "peat-evidence", group: "body", q: "How much evidence is behind Ray Peat's ideas?", a: "Mostly animal studies, older papers and his own reasoning. Some mainstream research contradicts him.", section: 3 },
      ],
    },

    doxycycline: {
      no: 3,
      glance: "A soil-bacteria antibiotic that also calms gums and skin at tiny doses.",
      gist: [
        "It descends from a golden bacterium found in Missouri soil in 1945.",
        "It jams the bacterial ribosome so germs stop building proteins.",
        "At doses too low to kill germs it still calms gum disease and rosacea.",
        "Take it upright with water, away from milk and iron, and mind the sun.",
      ],
      vessel: "box",
      shelf: "pills",
      room: "bark-and-soil",
      map: { x: 0.95, y: 0.86 },
      lenses: { history: [0], how: [1], use: [2], risk: [3] },
      facts: [
        { id: "doxy-soil", text: "The first tetracycline came from a golden bacterium in Missouri soil, found in 1945.", level: "certain", section: 0, ref: 0 },
        { id: "doxy-ribosome", text: "Doxycycline stops bacterial ribosomes from adding new building blocks to proteins.", level: "certain", section: 1 },
        { id: "doxy-low-dose", text: "At 20 mg twice a day it blocks tissue-breaking enzymes without acting as an antibiotic.", level: "certain", section: 2, ref: 1 },
        { id: "doxy-binding", text: "Milk, calcium, iron and antacids bind doxycycline, so they belong a few hours apart.", level: "certain", section: 3, ref: 2 },
      ],
      events: [
        { year: 1945, label: "Duggar finds a golden bacterium in Missouri soil", section: 0 },
        { year: 1948, label: "Aureomycin, the first tetracycline, is described", section: 0 },
        { year: 1967, label: "Doxycycline approved in the United States", section: 0 },
        { year: 1992, label: "Golub reviews low-dose tetracyclines for gum disease", section: 2 },
      ],
      questions: [
        { id: "doxy-water", group: "medicines", q: "Why take doxycycline with a full glass of water?", a: "A tablet stuck in the throat can cause painful ulcers, so swallow it with water and stay upright for 30 minutes.", section: 3 },
        { id: "doxy-low-dose", group: "medicines", q: "How can an antibiotic help at doses too low to kill germs?", a: "At 20 mg it still blocks enzymes that break down tissue, which helps gum disease and rosacea.", section: 2 },
        { id: "doxy-origin", group: "medicines", q: "Where did doxycycline come from?", a: "From the tetracycline family, which began with a bacterium in Missouri farm soil in 1945.", section: 0 },
      ],
    },

    "orange-juice": {
      no: 4,
      glance: "Sugar, potassium and a day's vitamin C in one cup, and a fight over sugar.",
      gist: [
        "One cup holds about 124 mg of vitamin C, 21 g of sugar and nearly 500 mg of potassium.",
        "Peat's readers drink it as easy sugar and potassium, often with meals.",
        "Without fibre it is easy to overdo, and large studies link sugary drinks to diabetes.",
        "Fresh or not-from-concentrate with pulp is best; ask about potassium if you take certain drugs.",
      ],
      vessel: "carton",
      shelf: "kitchen",
      room: "kitchen",
      map: { x: 0.14, y: 0.34 },
      lenses: { how: [0], use: [1, 3], debate: [2] },
      facts: [
        { id: "oj-cup", text: "One 240 ml cup holds about 124 mg of vitamin C and nearly 500 mg of potassium.", level: "certain", section: 0, ref: 0 },
        { id: "oj-metabolism", text: "Orange juice supports the metabolism as a source of easy sugar and potassium.", level: "fringe", section: 1, also: ["ray-peat"] },
        { id: "oj-diabetes", text: "Drinking a lot of juice raises the risk of weight gain and type 2 diabetes.", level: "debated", section: 2, ref: 1 },
      ],
      events: [{ year: 2015, label: "BMJ study links sugary drinks, including juice, to diabetes", section: 2 }],
      questions: [
        { id: "oj-sugar", group: "food", q: "Is orange juice just sugar?", a: "It has about 21 g of sugar per cup, but also a day's vitamin C and nearly 500 mg of potassium. It lacks the fibre of whole fruit.", section: 0 },
        { id: "oj-peat", group: "food", q: "Why do Ray Peat's readers drink orange juice?", a: "Peat saw it as easy sugar and potassium to support metabolism.", section: 1 },
      ],
    },

    gelatin: {
      no: 5,
      glance: "Cooked collagen, rich in glycine, the amino acid muscle meat lacks.",
      gist: [
        "It is cooked collagen, and every third building block in it is glycine.",
        "Some argue it balances the methionine in muscle meat; that is unproven in people.",
        "A small study found 3 g of glycine before bed helped people feel rested.",
        "Use broth, gummies or powder as an addition to meals, not a replacement.",
      ],
      vessel: "tin",
      shelf: "kitchen",
      room: "kitchen",
      map: { x: 0.38, y: 0.28 },
      lenses: { how: [0], debate: [1], use: [2, 3] },
      facts: [
        { id: "gelatin-glycine", text: "Every third building block in collagen is glycine.", level: "certain", section: 0 },
        { id: "gelatin-balance", text: "Adding gelatin balances the methionine people get from muscle meat.", level: "debated", section: 1, ref: 1, also: ["ray-peat"] },
        { id: "gelatin-sleep", text: "3 g of glycine before bed helps people feel better rested.", level: "debated", section: 2, ref: 0 },
        { id: "gelatin-incomplete", text: "Gelatin is not a complete protein and can't replace a meal.", level: "certain", section: 3 },
      ],
      events: [
        { year: 2007, label: "Japanese study: glycine before bed and sleep", section: 2 },
        { year: 2009, label: "Paper argues the body can't make enough glycine", section: 1 },
      ],
      questions: [
        { id: "gelatin-meat", group: "food", q: "What does gelatin add that meat doesn't?", a: "Lots of glycine. Muscle meat is rich in methionine instead; eating skin and joints used to balance it.", section: 1 },
        { id: "gelatin-sleep", group: "body", q: "Can an amino acid help you sleep?", a: "In one small study, 3 g of glycine before bed helped people feel better rested. It may work by lowering core temperature.", section: 2 },
      ],
    },

    "carrot-salad": {
      no: 6,
      glance: "Grated raw carrot with coconut oil and vinegar: a folk remedy with real fibre.",
      gist: [
        "Grate a raw carrot and add coconut oil, vinegar and salt.",
        "Peat claimed the fibre carries toxins and excess oestrogen out; no trial has tested it.",
        "It certainly gives fibre and beta-carotene, and a daily raw vegetable is good advice.",
      ],
      vessel: "jar",
      shelf: "kitchen",
      room: "kitchen",
      map: { x: 0.06, y: 0.16 },
      lenses: { how: [2], use: [0], debate: [1] },
      facts: [
        { id: "carrot-fibre", text: "100 g of raw carrot has 2.8 g of fibre and over 8 mg of beta-carotene.", level: "certain", section: 2, ref: 0 },
        { id: "carrot-toxins", text: "Raw carrot fibre carries bacterial toxins and excess oestrogen out of the gut.", level: "fringe", section: 1, ref: 1, also: ["ray-peat"] },
      ],
      events: [{ year: 1997, label: "Peat's newsletter on oestrogen and the gut", section: 1 }],
      questions: [
        { id: "carrot-hormones", group: "food", q: "Why would anyone eat a raw carrot for their hormones?", a: "Ray Peat suggested its fibre carries excess oestrogen and toxins out of the gut. No trial has tested it.", section: 1 },
        { id: "carrot-certain", group: "food", q: "What does a raw carrot give you for sure?", a: "Fibre and beta-carotene, which the body turns into vitamin A.", section: 2 },
      ],
    },
  };

  return { LEVELS, LENSES, SHELVES, ROOMS, QUESTION_GROUPS, bySlug };
})();
