// Article content. Each entry carries the same fields so every style can
// pick the details it wants to show (formula, Latin name, key figure…).
window.ARTICLES = [
  {
    slug: "aspirin",
    title: "Aspirin, the willow's long shadow",
    dek: "How a bitter bark became the most studied drug on earth, and why doctors now prescribe it more carefully.",
    kind: "NSAID · salicylate",
    latin: "Salix alba",
    common: "White willow",
    formula: "C₉H₈O₄",
    figure: { label: "Half-life", value: "15–20 min" },
    minutes: 6,
    sections: [
      {
        h: "From bark to tablet",
        p: [
          "Willow bark contains salicin, a bitter compound the body converts into salicylic acid. Salicylic acid eases pain and fever, but it also burns the stomach. In 1897 Felix Hoffmann, a chemist at Bayer, attached an acetyl group to it. The result, acetylsalicylic acid, was gentler to swallow. Bayer sold it as Aspirin from 1899.",
        ],
      },
      {
        h: "What it does inside you",
        p: [
          "Aspirin blocks two enzymes, COX-1 and COX-2, which make prostaglandins: signalling molecules behind pain, fever and swelling. John Vane showed this in 1971 and later shared a Nobel Prize for it.",
          "The block is permanent for each enzyme it touches. Most cells simply build new enzymes. Platelets, the cell fragments that start blood clots, cannot, because they have no nucleus. One small dose therefore thins the blood for the platelet's whole life, about seven to ten days.",
        ],
      },
      {
        h: "Why the advice changed",
        p: [
          "For decades many healthy adults took a daily baby aspirin to prevent heart attacks. Large trials later showed the bleeding risk often cancels the benefit for people without heart disease. In 2022 the US Preventive Services Task Force advised adults aged 60 and over not to start daily aspirin for that purpose. People who already have heart disease are a different case, and their doctor should make the call.",
        ],
      },
      {
        h: "Who should avoid it",
        p: [
          "Children and teenagers with a viral illness should not take aspirin, because it is linked to Reye's syndrome, a rare swelling of the liver and brain. People with stomach ulcers, bleeding disorders or an aspirin allergy should also avoid it.",
        ],
      },
    ],
    refs: [
      "Vane JR. Inhibition of prostaglandin synthesis as a mechanism of action for aspirin-like drugs. Nature New Biology, 1971.",
      "US Preventive Services Task Force. Aspirin use to prevent cardiovascular disease: recommendation statement. JAMA, 2022.",
      "Jeffreys D. Aspirin: The Remarkable Story of a Wonder Drug. Bloomsbury, 2004.",
    ],
  },
  {
    slug: "ray-peat",
    title: "Ray Peat and the warm body",
    dek: "A biologist's case for sugar, thyroid and saturated fat, and what the evidence says about it.",
    kind: "Physiology · theory",
    latin: "Glandula thyreoidea",
    common: "Thyroid gland",
    formula: "C₁₅H₁₁I₄NO₄",
    figure: { label: "Target temp", value: "37.0 °C" },
    minutes: 8,
    sections: [
      {
        h: "Who he was",
        p: [
          "Raymond Peat (1936–2022) earned a PhD in biology from the University of Oregon and spent fifty years writing newsletters and essays on hormones and metabolism. He never ran large clinical trials. His influence came from his writing, which built a devoted following online.",
        ],
      },
      {
        h: "The core idea",
        p: [
          "Peat believed good health means a high rate of energy production in every cell, driven mainly by thyroid hormone. He suggested checking it at home with two numbers: a morning body temperature near 37 °C (98.6 °F) and a resting pulse around 75–85 beats per minute. He borrowed the temperature method from the physician Broda Barnes.",
        ],
      },
      {
        h: "What he told people to eat",
        p: [
          "Peat favoured milk, cheese, eggs, fruit, orange juice, honey, gelatin and shellfish. He argued against polyunsaturated oils, such as those from seeds, because he believed they slow metabolism as they oxidise. He saw sugar as a clean fuel and preferred it to large amounts of starch.",
        ],
      },
      {
        h: "Reading him carefully",
        p: [
          "Many of Peat's claims rest on animal studies, older papers and his own reasoning, not on controlled trials in people. Some mainstream research contradicts him, for example on seed oils and heart disease. His writing is a rich source of questions. Treat it as a starting point for your own reading, and talk to a doctor before changing any medication or hormone.",
        ],
      },
    ],
    refs: [
      "Peat R. Generative Energy: Restoring the Wholeness of Life. 1994.",
      "Barnes BO, Galton L. Hypothyroidism: The Unsuspected Illness. Crowell, 1976.",
      "Archive of essays at raypeat.com.",
    ],
  },
  {
    slug: "doxycycline",
    title: "Doxycycline, the soil's antibiotic",
    dek: "A drug descended from a bacterium in Missouri dirt, with a second life at doses too low to kill germs.",
    kind: "Antibiotic · tetracycline",
    latin: "Streptomyces aureofaciens",
    common: "Golden soil bacterium",
    formula: "C₂₂H₂₄N₂O₈",
    figure: { label: "Half-life", value: "18–22 h" },
    minutes: 7,
    sections: [
      {
        h: "Where it comes from",
        p: [
          "In 1945 the botanist Benjamin Duggar found a golden-coloured bacterium in a soil sample from Missouri. It produced chlortetracycline, the first tetracycline antibiotic. Doxycycline is a later, semi-synthetic member of that family, approved in the United States in 1967.",
        ],
      },
      {
        h: "How it works",
        p: [
          "Bacteria build proteins on small machines called ribosomes. Doxycycline sticks to part of the bacterial ribosome and stops it adding new building blocks. The bacteria stop growing, and the immune system clears them. Doctors use it for chest infections, Lyme disease, acne and some tropical infections, and as malaria prevention for travellers.",
        ],
      },
      {
        h: "The low-dose trick",
        p: [
          "At 20 mg twice a day, far below an antibiotic dose, doxycycline still blocks enzymes called matrix metalloproteinases, which break down tissue. Dentists use this dose for gum disease. A 40 mg slow-release form treats the redness and bumps of rosacea.",
        ],
      },
      {
        h: "Taking it well",
        p: [
          "Swallow it with a full glass of water and stay upright for at least 30 minutes, since a tablet stuck in the throat can cause painful ulcers. Keep milk, calcium, iron and antacids a few hours apart from the dose because they bind the drug. It can make skin burn easily in the sun. Children under eight and pregnant women usually should not take it, because it can stain growing teeth.",
        ],
      },
    ],
    refs: [
      "Duggar BM. Aureomycin: a product of the continuing search for new antibiotics. Annals of the New York Academy of Sciences, 1948.",
      "Golub LM et al. Host modulation with tetracyclines and their chemically modified analogues. Current Opinion in Dentistry, 1992.",
      "US FDA prescribing information for doxycycline hyclate.",
    ],
  },
  {
    slug: "orange-juice",
    title: "The case for a glass of orange juice",
    dek: "Sugar, potassium and vitamin C in one cup, and why juice divides nutritionists.",
    kind: "Food · fruit",
    latin: "Citrus × sinensis",
    common: "Sweet orange",
    formula: "C₆H₈O₆",
    figure: { label: "Vitamin C per cup", value: "124 mg" },
    minutes: 5,
    sections: [
      {
        h: "What is in a cup",
        p: [
          "A 240 ml cup of fresh orange juice holds about 112 kcal, 21 g of sugar, 124 mg of vitamin C and nearly 500 mg of potassium, according to USDA data. That vitamin C is more than the daily need of most adults. The sugar is a mix of sucrose, glucose and fructose.",
        ],
      },
      {
        h: "Why Peat's readers drink it",
        p: [
          "Ray Peat recommended orange juice as a source of easy sugar and potassium to support metabolism. His followers often drink it with meals, sometimes with a pinch of salt.",
        ],
      },
      {
        h: "The other side",
        p: [
          "Juice has none of the fibre that slows sugar absorption in whole fruit, and it is easy to drink a lot of it quickly. Several large studies link high intake of sugary drinks, including juice, with weight gain and type 2 diabetes. A small glass with food behaves differently from a litre on an empty stomach.",
        ],
      },
      {
        h: "Choosing a juice",
        p: [
          "Fresh-squeezed or not-from-concentrate juice keeps more flavour. Juice with pulp adds a little fibre and the plant compound hesperidin. People on some medications, or with kidney disease, should ask about potassium before drinking it daily.",
        ],
      },
    ],
    refs: [
      "USDA FoodData Central. Orange juice, raw.",
      "Imamura F et al. Consumption of sugar sweetened beverages, artificially sweetened beverages, and fruit juice and incidence of type 2 diabetes. BMJ, 2015.",
    ],
  },
  {
    slug: "gelatin",
    title: "Gelatin and the glycine question",
    dek: "Why an old kitchen staple made from bones and skin is back in fashion.",
    kind: "Food · protein",
    latin: "Bos taurus",
    common: "Cattle collagen",
    formula: "C₂H₅NO₂",
    figure: { label: "Glycine share", value: "≈ 1 in 3" },
    minutes: 5,
    sections: [
      {
        h: "What gelatin is",
        p: [
          "Gelatin is cooked collagen, the protein that holds skin, tendons and bones together. Collagen repeats one pattern over and over, and every third building block in that pattern is glycine, the smallest amino acid. That makes gelatin one of the richest food sources of glycine.",
        ],
      },
      {
        h: "The balance argument",
        p: [
          "Muscle meat is rich in another amino acid, methionine. Our ancestors ate the whole animal, including skin and joints, and so took in more glycine alongside it. Ray Peat and others argue that adding gelatin or bone broth restores that balance. Animal studies support parts of this idea, but it has not been proven in people.",
        ],
      },
      {
        h: "Glycine and sleep",
        p: [
          "In a small Japanese study, 3 g of glycine taken before bed helped volunteers feel better rested the next day. Glycine may help by slightly lowering core body temperature, which is part of falling asleep.",
        ],
      },
      {
        h: "Using it",
        p: [
          "Bone broth, gummies made with fruit juice, or a spoon of powdered gelatin in a hot drink are the common routes. Collagen peptides dissolve in cold liquid too. Gelatin is not a complete protein, so it works as an addition to meals, not a replacement.",
        ],
      },
    ],
    refs: [
      "Yamadera W et al. Glycine ingestion improves subjective sleep quality in human volunteers. Sleep and Biological Rhythms, 2007.",
      "Meléndez-Hevia E et al. A weak link in metabolism: the metabolic capacity for glycine biosynthesis does not satisfy the need for collagen synthesis. Journal of Biosciences, 2009.",
    ],
  },
  {
    slug: "carrot-salad",
    title: "The raw carrot salad",
    dek: "A folk remedy from the pro-metabolic crowd: grated carrot, coconut oil, vinegar and salt.",
    kind: "Food · vegetable",
    latin: "Daucus carota",
    common: "Carrot",
    formula: "C₄₀H₅₆",
    figure: { label: "Fibre per 100 g", value: "2.8 g" },
    minutes: 4,
    sections: [
      {
        h: "The recipe",
        p: [
          "Grate one medium raw carrot into long strips. Add a teaspoon of coconut oil, a splash of vinegar and a pinch of salt. Many people eat it daily, often between meals.",
        ],
      },
      {
        h: "The claim",
        p: [
          "Ray Peat suggested that raw carrot fibre passes through the gut without being digested and carries irritants with it, such as bacterial toxins and excess oestrogen. He believed this lowers inflammation and helps hormone balance. The idea is plausible, but no controlled trial has tested this exact salad.",
        ],
      },
      {
        h: "What is certain",
        p: [
          "100 g of raw carrot has about 41 kcal, 2.8 g of fibre and over 8 mg of beta-carotene, which the body turns into vitamin A. Fibre in general feeds healthy gut bacteria and keeps digestion regular. Eating a raw vegetable every day is good advice, whatever you believe about the rest.",
        ],
      },
    ],
    refs: [
      "USDA FoodData Central. Carrots, raw.",
      "Peat R. Newsletter: Tissue-bound estrogen in aging. 1997.",
    ],
  },
];
