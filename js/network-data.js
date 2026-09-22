// The knowledge web behind the network layouts (11–23).
//
// TERMS are the shared nouns articles point at. Nobody links them by hand:
// js/network.js finds every place an article's text uses one of a term's
// words, so the web grows as articles are written. A term without its own
// article is shown as "not written yet", like an unresolved link in Obsidian.
//
// Everything else here is hand-made and restates what an article says,
// always with the section it comes from ([slug, section index], 0-based).
window.NETWORK = (() => {
  "use strict";

  // kind: what sort of thing a term is. Drives colours, the index columns
  // and the graph filters.
  const KINDS = {
    article: { name: "Articles", one: "Article" },
    molecule: { name: "Molecules & mechanisms", one: "Molecule or mechanism" },
    body: { name: "Body", one: "Part of the body" },
    condition: { name: "Health & conditions", one: "Health or condition" },
    food: { name: "Foods & supplements", one: "Food or supplement" },
    person: { name: "People & places", one: "Person, place or organisation" },
    evidence: { name: "Evidence", one: "Kind of evidence" },
  };

  // key, name, kind, words (matched as whole words, case-insensitive), def.
  // Articles match on their own words too, so one article naming another
  // links them.
  const TERMS = [
    // articles (def comes from the article's own summary)
    { key: "aspirin", name: "Aspirin", kind: "article", words: ["aspirin"] },
    { key: "ray-peat", name: "Ray Peat", kind: "article", words: ["Ray Peat", "Peat"] },
    { key: "doxycycline", name: "Doxycycline", kind: "article", words: ["doxycycline"] },
    { key: "orange-juice", name: "Orange juice", kind: "article", words: ["orange juice"] },
    { key: "gelatin", name: "Gelatin", kind: "article", words: ["gelatin"] },
    { key: "carrot-salad", name: "Raw carrot salad", kind: "article", words: ["carrot", "carrots"] },

    // molecules & mechanisms
    { key: "salicin", name: "Salicin", kind: "molecule", words: ["salicin"], def: "A bitter compound in willow bark. The body turns it into salicylic acid." },
    { key: "salicylic-acid", name: "Salicylic acid", kind: "molecule", words: ["salicylic acid"], def: "Eases pain and fever but burns the stomach. Aspirin is a gentler form of it." },
    { key: "cox", name: "COX enzymes", kind: "molecule", words: ["COX-1", "COX-2"], def: "Two enzymes that make prostaglandins. Aspirin blocks both." },
    { key: "prostaglandins", name: "Prostaglandins", kind: "molecule", words: ["prostaglandins"], def: "Signalling molecules behind pain, fever and swelling." },
    { key: "enzymes", name: "Enzymes", kind: "molecule", words: ["enzyme", "enzymes"], def: "Proteins that make chemical reactions happen. Several drugs work by blocking one." },
    { key: "hormones", name: "Hormones", kind: "molecule", words: ["hormone", "hormones"], def: "Chemical messengers carried in the blood, such as thyroid hormone or oestrogen." },
    { key: "oestrogen", name: "Oestrogen", kind: "molecule", words: ["oestrogen"], def: "A sex hormone. Ray Peat believed an excess of it causes inflammation." },
    { key: "ribosome", name: "Ribosomes", kind: "molecule", words: ["ribosome", "ribosomes"], def: "Small machines inside cells that build proteins." },
    { key: "proteins", name: "Proteins", kind: "molecule", words: ["protein", "proteins"], def: "Long chains of amino acids that build and run the body." },
    { key: "tetracyclines", name: "Tetracyclines", kind: "molecule", words: ["tetracycline", "chlortetracycline"], def: "A family of antibiotics. The first one came from a soil bacterium in 1945." },
    { key: "mmp", name: "Matrix metalloproteinases", kind: "molecule", words: ["matrix metalloproteinases"], def: "Enzymes that break down tissue. Low-dose doxycycline blocks them." },
    { key: "collagen", name: "Collagen", kind: "molecule", words: ["collagen"], def: "The protein that holds skin, tendons and bones together. Cooked, it becomes gelatin." },
    { key: "glycine", name: "Glycine", kind: "molecule", words: ["glycine"], def: "The smallest amino acid. Every third building block of collagen is glycine." },
    { key: "methionine", name: "Methionine", kind: "molecule", words: ["methionine"], def: "An amino acid found in large amounts in muscle meat." },
    { key: "sugar", name: "Sugar", kind: "molecule", words: ["sugar", "sucrose", "glucose", "fructose"], def: "Quick fuel for cells. Juice and honey are rich in it." },
    { key: "vitamin-c", name: "Vitamin C", kind: "molecule", words: ["vitamin C"], def: "A vitamin the body can't make. One cup of orange juice covers most adults' daily need." },
    { key: "potassium", name: "Potassium", kind: "molecule", words: ["potassium"], def: "A mineral the heart and muscles depend on. Orange juice is a rich source." },
    { key: "fibre", name: "Fibre", kind: "molecule", words: ["fibre"], def: "The part of plants the gut can't digest. It feeds gut bacteria and slows sugar absorption." },
    { key: "beta-carotene", name: "Beta-carotene", kind: "molecule", words: ["beta-carotene", "vitamin A"], def: "The orange pigment in carrots, which the body turns into vitamin A." },
    { key: "hesperidin", name: "Hesperidin", kind: "molecule", words: ["hesperidin"], def: "A plant compound found in orange pulp." },
    { key: "seed-oils", name: "Seed oils", kind: "food", words: ["seed oils", "polyunsaturated"], def: "Oils pressed from seeds, rich in polyunsaturated fat. Ray Peat argued against them." },

    // body
    { key: "stomach", name: "Stomach", kind: "body", words: ["stomach"], def: "Where digestion starts. Salicylic acid irritates it." },
    { key: "gut", name: "Gut", kind: "body", words: ["gut", "digestion"], def: "The intestines, home to the gut bacteria." },
    { key: "blood", name: "Blood & clotting", kind: "body", words: ["blood", "bleeding", "clots"], def: "Platelets in the blood start clots. Aspirin makes them less sticky." },
    { key: "platelets", name: "Platelets", kind: "body", words: ["platelets", "platelet's"], def: "Cell fragments without a nucleus that start blood clots." },
    { key: "heart", name: "Heart", kind: "body", words: ["heart"], def: "The muscle that pumps blood. Heart disease is where aspirin advice changed." },
    { key: "thyroid", name: "Thyroid", kind: "body", words: ["thyroid"], def: "A gland in the neck. Its hormone sets the pace of the body's energy use." },
    { key: "skin", name: "Skin", kind: "body", words: ["skin"], def: "Held together by collagen. Doxycycline can make it burn easily in the sun." },
    { key: "teeth", name: "Teeth & gums", kind: "body", words: ["teeth", "gum"], def: "Low-dose doxycycline treats gum disease; full doses can stain children's growing teeth." },
    { key: "bones", name: "Bones & tendons", kind: "body", words: ["bones", "bone", "tendons", "joints"], def: "Rich in collagen, which is why gelatin is made from them." },
    { key: "liver", name: "Liver & brain", kind: "body", words: ["liver", "brain"], def: "Both swell in Reye's syndrome, the reason children shouldn't take aspirin for a viral illness." },
    { key: "temperature", name: "Body temperature", kind: "body", words: ["temperature"], def: "Ray Peat used it as a thyroid check; glycine may help sleep by lowering it slightly." },
    { key: "metabolism", name: "Metabolism", kind: "body", words: ["metabolism", "energy production"], def: "All the chemistry that turns food into energy and body." },
    { key: "bacteria", name: "Bacteria", kind: "body", words: ["bacteria", "bacterial", "bacterium"], def: "Single-celled life. Some cause infections, others live in the gut and help." },

    // health & conditions
    { key: "pain-fever", name: "Pain & fever", kind: "condition", words: ["pain", "fever"], def: "Both are driven partly by prostaglandins, which aspirin reduces." },
    { key: "inflammation", name: "Inflammation", kind: "condition", words: ["inflammation", "swelling"], def: "The body's heat, redness and swelling response to harm." },
    { key: "heart-disease", name: "Heart disease", kind: "condition", words: ["heart disease", "heart attacks"], def: "Where daily aspirin was once advised for everyone, and now isn't." },
    { key: "reye", name: "Reye's syndrome", kind: "condition", words: ["Reye's syndrome"], def: "A rare swelling of the liver and brain linked to aspirin in children with a viral illness." },
    { key: "ulcers", name: "Ulcers", kind: "condition", words: ["ulcers"], def: "Open sores, in the stomach or, from a stuck tablet, the throat." },
    { key: "infections", name: "Infections", kind: "condition", words: ["infections", "Lyme disease", "malaria"], def: "Illnesses caused by germs. Doxycycline treats several kinds." },
    { key: "acne-rosacea", name: "Acne & rosacea", kind: "condition", words: ["acne", "rosacea"], def: "Skin conditions that doxycycline treats, rosacea even at a low dose." },
    { key: "gum-disease", name: "Gum disease", kind: "condition", words: ["gum disease"], def: "Dentists treat it with doxycycline at a dose too low to kill germs." },
    { key: "diabetes", name: "Type 2 diabetes", kind: "condition", words: ["type 2 diabetes"], def: "Linked in large studies to a high intake of sugary drinks." },
    { key: "kidney", name: "Kidney disease", kind: "condition", words: ["kidney disease"], def: "People with it should ask before drinking potassium-rich juice every day." },
    { key: "sleep", name: "Sleep", kind: "condition", words: ["sleep", "rested"], def: "A small study found glycine before bed helps people feel rested." },
    { key: "children", name: "Children", kind: "condition", words: ["children", "teenagers"], def: "Both aspirin and doxycycline come with special warnings for children." },
    { key: "pregnancy", name: "Pregnancy", kind: "condition", words: ["pregnant"], def: "Doxycycline is usually avoided in pregnancy because it can stain growing teeth." },
    { key: "sun", name: "Sunlight", kind: "condition", words: ["sun"], def: "Doxycycline can make skin burn easily in it." },

    // foods & supplements
    { key: "milk", name: "Milk & cheese", kind: "food", words: ["milk", "cheese"], def: "Ray Peat favoured them; their calcium binds doxycycline." },
    { key: "calcium-iron", name: "Calcium & iron", kind: "food", words: ["calcium", "iron"], def: "Minerals that bind doxycycline in the gut." },
    { key: "antacids", name: "Antacids", kind: "food", words: ["antacids"], def: "Stomach remedies that bind doxycycline." },
    { key: "honey", name: "Honey", kind: "food", words: ["honey"], def: "One of the sugars Ray Peat favoured." },
    { key: "eggs", name: "Eggs", kind: "food", words: ["eggs"], def: "On Ray Peat's list of foods." },
    { key: "shellfish", name: "Shellfish", kind: "food", words: ["shellfish"], def: "On Ray Peat's list of foods." },
    { key: "starch", name: "Starch", kind: "food", words: ["starch"], def: "Ray Peat preferred sugar to large amounts of it." },
    { key: "salt", name: "Salt", kind: "food", words: ["salt"], def: "Added to the carrot salad and, by some, to orange juice." },
    { key: "coconut-oil", name: "Coconut oil", kind: "food", words: ["coconut oil"], def: "Part of the raw carrot salad recipe." },
    { key: "vinegar", name: "Vinegar", kind: "food", words: ["vinegar"], def: "Part of the raw carrot salad recipe." },
    { key: "bone-broth", name: "Bone broth", kind: "food", words: ["bone broth"], def: "A traditional source of gelatin." },

    // people, places, organisations
    { key: "hoffmann", name: "Felix Hoffmann", kind: "person", words: ["Felix Hoffmann"], def: "The Bayer chemist who made acetylsalicylic acid in 1897." },
    { key: "bayer", name: "Bayer", kind: "person", words: ["Bayer"], def: "The German company that sold Aspirin from 1899." },
    { key: "vane", name: "John Vane", kind: "person", words: ["John Vane"], def: "Showed in 1971 how aspirin works, and later shared a Nobel Prize." },
    { key: "uspstf", name: "US Preventive Services Task Force", kind: "person", words: ["US Preventive Services Task Force"], def: "Changed the daily-aspirin advice for adults over 60 in 2022." },
    { key: "barnes", name: "Broda Barnes", kind: "person", words: ["Broda Barnes"], def: "The physician whose temperature method Ray Peat borrowed." },
    { key: "duggar", name: "Benjamin Duggar", kind: "person", words: ["Benjamin Duggar"], def: "Found the golden soil bacterium behind the tetracyclines in 1945." },
    { key: "missouri", name: "Missouri", kind: "person", words: ["Missouri"], def: "Where the soil sample behind doxycycline was dug up." },
    { key: "usda", name: "USDA", kind: "person", words: ["USDA"], def: "The US Department of Agriculture, source of the nutrient figures." },

    // evidence
    { key: "trials", name: "Controlled trials", kind: "evidence", words: ["trials", "trial"], def: "Tests in people with a comparison group: the strongest kind of evidence." },
    { key: "animal-studies", name: "Animal studies", kind: "evidence", words: ["animal studies"], def: "Useful for ideas, but results often don't carry over to people." },
    { key: "large-studies", name: "Large studies", kind: "evidence", words: ["large studies"], def: "Studies that follow many people. They show links, not always causes." },
    { key: "small-study", name: "Small study", kind: "evidence", words: ["small Japanese study"], def: "A study with few people. A promising sign, not proof." },
  ];

  // Typed links between two things, each backed by one article section.
  //   together  works well together, or is recommended together
  //   apart     keep apart (they interfere)
  //   caution   be careful with this person or situation
  //   against   one side argues against the other
  //   replaced  advice that changed
  const RELATIONS = [
    { a: "ray-peat", b: "orange-juice", type: "together", at: ["ray-peat", 2], note: "Ray Peat recommended orange juice." },
    { a: "ray-peat", b: "gelatin", type: "together", at: ["ray-peat", 2], note: "Ray Peat favoured gelatin." },
    { a: "ray-peat", b: "milk", type: "together", at: ["ray-peat", 2], note: "Ray Peat favoured milk and cheese." },
    { a: "ray-peat", b: "honey", type: "together", at: ["ray-peat", 2], note: "Ray Peat favoured honey." },
    { a: "ray-peat", b: "carrot-salad", type: "together", at: ["carrot-salad", 1], note: "The raw carrot salad comes from Ray Peat's writing." },
    { a: "orange-juice", b: "salt", type: "together", at: ["orange-juice", 1], note: "Peat's readers sometimes add a pinch of salt to orange juice." },
    { a: "gelatin", b: "orange-juice", type: "together", at: ["gelatin", 3], note: "Gelatin gummies are often made with fruit juice." },
    { a: "carrot-salad", b: "coconut-oil", type: "together", at: ["carrot-salad", 0], note: "Coconut oil is part of the recipe." },
    { a: "carrot-salad", b: "vinegar", type: "together", at: ["carrot-salad", 0], note: "Vinegar is part of the recipe." },
    { a: "carrot-salad", b: "salt", type: "together", at: ["carrot-salad", 0], note: "A pinch of salt is part of the recipe." },
    { a: "doxycycline", b: "milk", type: "apart", at: ["doxycycline", 3], note: "Milk binds doxycycline. Keep them a few hours apart." },
    { a: "doxycycline", b: "calcium-iron", type: "apart", at: ["doxycycline", 3], note: "Calcium and iron bind doxycycline. Keep them a few hours apart." },
    { a: "doxycycline", b: "antacids", type: "apart", at: ["doxycycline", 3], note: "Antacids bind doxycycline. Keep them a few hours apart." },
    { a: "doxycycline", b: "sun", type: "caution", at: ["doxycycline", 3], note: "Doxycycline can make skin burn easily in the sun." },
    { a: "doxycycline", b: "children", type: "caution", at: ["doxycycline", 3], note: "Usually not for children under eight: it can stain growing teeth." },
    { a: "doxycycline", b: "pregnancy", type: "caution", at: ["doxycycline", 3], note: "Usually not taken in pregnancy: it can stain growing teeth." },
    { a: "aspirin", b: "children", type: "caution", at: ["aspirin", 3], note: "Not for children and teenagers with a viral illness (Reye's syndrome)." },
    { a: "aspirin", b: "ulcers", type: "caution", at: ["aspirin", 3], note: "People with stomach ulcers should avoid aspirin." },
    { a: "aspirin", b: "blood", type: "caution", at: ["aspirin", 3], note: "People with bleeding disorders should avoid aspirin." },
    { a: "orange-juice", b: "kidney", type: "caution", at: ["orange-juice", 3], note: "With kidney disease, ask about potassium before drinking juice daily." },
    { a: "ray-peat", b: "seed-oils", type: "against", at: ["ray-peat", 2], note: "Peat argued seed oils slow metabolism. Some mainstream research disagrees." },
    { a: "ray-peat", b: "starch", type: "against", at: ["ray-peat", 2], note: "Peat preferred sugar to large amounts of starch." },
    { a: "aspirin", b: "heart-disease", type: "replaced", at: ["aspirin", 2], note: "Daily aspirin for healthy adults was the advice for decades. In 2022 it changed for people 60 and over." },
  ];

  const RELATION_TYPES = {
    together: { name: "Gets on with", mark: "—" },
    apart: { name: "Keep apart", mark: "✗" },
    caution: { name: "Be careful with", mark: "⚠" },
    against: { name: "Argues against", mark: "↯" },
    replaced: { name: "Advice changed", mark: "↻" },
  };

  // 4 · Transit Map. Rows are lines; col is a station's column, shared by
  // every line it sits on, so interchanges line up vertically.
  const LINES = [
    { key: "gut", name: "Gut line", stations: ["aspirin", "stomach", "carrot-salad", "fibre", "bacteria"] },
    { key: "pain", name: "Pain line", stations: ["willow", "salicin", "salicylic-acid", "aspirin", "cox", "prostaglandins", "pain-fever"] },
    { key: "heart", name: "Heart line", stations: ["platelets", "aspirin", "heart-disease", "seed-oils", "ray-peat"] },
    { key: "sleep", name: "Sleep line", stations: ["ray-peat", "temperature", "glycine", "gelatin"] },
    { key: "metabolism", name: "Energy line", stations: ["thyroid", "ray-peat", "sugar", "orange-juice", "gelatin"] },
    { key: "minerals", name: "Mineral line", stations: ["doxycycline", "calcium-iron", "milk", "ray-peat", "potassium", "orange-juice"] },
    { key: "infection", name: "Infection line", stations: ["soil", "doxycycline", "acne-rosacea", "gum-disease", "sun"] },
  ];
  const STATION_COLS = {
    willow: 0, salicin: 1, soil: 1, "salicylic-acid": 2, platelets: 2, aspirin: 3, doxycycline: 3,
    stomach: 4, cox: 4, "prostaglandins": 5, "heart-disease": 5, thyroid: 5, "calcium-iron": 5, "acne-rosacea": 5,
    "carrot-salad": 6, "seed-oils": 6, milk: 6, "gum-disease": 6, "pain-fever": 6.9,
    "ray-peat": 7, fibre: 7.6, temperature: 8, sugar: 8, potassium: 8, sun: 8, bacteria: 8.8,
    glycine: 9, "orange-juice": 9, gelatin: 10,
  };

  // 8 · Family Tree. Where each article's substance came from.
  const TREE = [
    {
      name: "Plants",
      children: [
        { name: "White willow", latin: "Salix alba", children: [{ key: "salicin", children: [{ key: "salicylic-acid", children: [{ key: "aspirin", year: "1897" }] }] }] },
        { name: "Sweet orange", latin: "Citrus × sinensis", children: [{ key: "vitamin-c", children: [{ key: "orange-juice" }] }] },
        { name: "Carrot", latin: "Daucus carota", children: [{ key: "fibre", children: [{ key: "carrot-salad" }] }] },
      ],
    },
    {
      name: "Microbes",
      children: [
        { name: "Golden soil bacterium", latin: "Streptomyces aureofaciens", note: "Missouri, 1945", children: [{ key: "tetracyclines", children: [{ key: "doxycycline", year: "1967" }] }] },
      ],
    },
    {
      name: "Animals",
      children: [
        { name: "Cattle", latin: "Bos taurus", children: [{ key: "collagen", children: [{ key: "gelatin" }] }] },
        { name: "The human body", latin: "Glandula thyreoidea", children: [{ key: "thyroid", children: [{ key: "ray-peat", year: "1936–2022" }] }] },
      ],
    },
  ];
  // Stations and tree nodes that aren't terms.
  const EXTRA_NAMES = {
    willow: { name: "Willow bark", href: "#/aspirin/sec-0" },
    soil: { name: "Soil bacteria", href: "#/doxycycline/sec-0" },
  };

  // 7 · Abstraction Ladder. Groups above the articles; below them, each
  // article climbs down into its own chemistry.
  const RUNGS = [
    { key: "everything", name: "Everything in the collection", parent: null, blurb: "Six things people take, eat or believe for their health." },
    { key: "medicines", name: "Medicines", parent: "everything", blurb: "Made or sold as drugs, with a dose." },
    { key: "foods", name: "Foods used like medicine", parent: "everything", blurb: "Everyday foods with a following that believes they do more than feed you." },
    { key: "ideas", name: "Ideas about the body", parent: "everything", blurb: "Theories rather than things you can buy." },
    { key: "living-medicines", name: "Medicines first found in living things", parent: "medicines", members: ["aspirin", "doxycycline"], blurb: "A riverbank tree and a spoon of farm soil." },
    { key: "enzyme-blockers", name: "Drugs that work by blocking an enzyme", parent: "medicines", members: ["aspirin", "doxycycline"], blurb: "Aspirin blocks COX; low-dose doxycycline blocks tissue-breaking enzymes." },
    { key: "peat-foods", name: "Foods Ray Peat recommended", parent: "foods", members: ["orange-juice", "gelatin", "carrot-salad"], blurb: "Each arrived in the kitchen through his writing." },
    { key: "metabolism-ideas", name: "Ideas about metabolism", parent: "ideas", members: ["ray-peat"], blurb: "The belief that health means a high rate of energy production in every cell." },
  ];
  const LADDER = {
    aspirin: { up: ["living-medicines", "medicines", "everything"], down: ["salicylic-acid", "cox", "prostaglandins"] },
    doxycycline: { up: ["living-medicines", "medicines", "everything"], down: ["tetracyclines", "ribosome", "proteins"] },
    "orange-juice": { up: ["peat-foods", "foods", "everything"], down: ["sugar", "potassium", "vitamin-c"] },
    gelatin: { up: ["peat-foods", "foods", "everything"], down: ["collagen", "glycine", "methionine"] },
    "carrot-salad": { up: ["peat-foods", "foods", "everything"], down: ["fibre", "bacteria", "beta-carotene"] },
    "ray-peat": { up: ["metabolism-ideas", "ideas", "everything"], down: ["thyroid", "hormones", "temperature"] },
  };

  // 10 · Body Map. Hotspots on the outline, each showing a body term.
  // x, y in the 200 × 440 drawing.
  const BODY = [
    { key: "liver", x: 100, y: 34, label: "Brain & liver" },
    { key: "teeth", x: 100, y: 62, label: "Teeth & gums" },
    { key: "thyroid", x: 100, y: 92, label: "Thyroid" },
    { key: "heart", x: 112, y: 138, label: "Heart" },
    { key: "blood", x: 60, y: 146, label: "Blood" },
    { key: "stomach", x: 92, y: 186, label: "Stomach" },
    { key: "gut", x: 104, y: 222, label: "Gut" },
    { key: "skin", x: 150, y: 204, label: "Skin" },
    { key: "bones", x: 80, y: 340, label: "Bones & tendons" },
  ];

  // 11 · Day Wheel. Minutes after midnight, or a range.
  const DAY = [
    { from: 420, label: "On waking", text: "Ray Peat's check: a morning temperature near 37 °C and a pulse of 75–85.", at: ["ray-peat", 1] },
    { from: 480, label: "Breakfast", text: "Peat's readers often drink orange juice with meals, sometimes with a pinch of salt.", at: ["orange-juice", 1] },
    { from: 630, label: "Between meals", text: "The raw carrot salad is often eaten between meals.", at: ["carrot-salad", 0] },
    { from: 660, to: 900, label: "Strong sun", text: "On doxycycline, skin can burn easily in the sun.", at: ["doxycycline", 3] },
    { from: 780, label: "Lunch", text: "A small glass of juice with food behaves differently from a litre on an empty stomach.", at: ["orange-juice", 2] },
    { from: 1350, label: "Before bed", text: "In a small study, 3 g of glycine before bed helped people feel better rested.", at: ["gelatin", 2] },
  ];
  // Things that run on a clock longer or shorter than a day.
  const BEYOND = [
    { span: "15–20 min", text: "Aspirin's half-life in the blood.", at: ["aspirin", 1] },
    { span: "30 min", text: "Stay upright after swallowing doxycycline.", at: ["doxycycline", 3] },
    { span: "a few hours", text: "Keep milk, calcium, iron and antacids apart from a doxycycline dose.", at: ["doxycycline", 3] },
    { span: "18–22 h", text: "Doxycycline's half-life.", at: ["doxycycline", 1] },
    { span: "7–10 days", text: "One aspirin dose affects a platelet for its whole life.", at: ["aspirin", 1] },
  ];

  // 12 · Argument Map. Claims are fact ids from concepts-data.js.
  //   supports · contradicts · questions (casts doubt) · qualifies (adds a
  //   condition) · replaced. Every link reads "from … to".
  const ARGUMENTS = [
    {
      title: "Seed oils",
      links: [{ from: "peat-seed-oils-counter", to: "peat-seed-oils", type: "contradicts" }],
      extra: { "peat-seed-oils-counter": { text: "Some mainstream research contradicts Peat on seed oils and heart disease.", level: "debated", slug: "ray-peat", section: 3 } },
    },
    {
      title: "Orange juice as fuel",
      links: [
        { from: "oj-diabetes", to: "oj-metabolism", type: "contradicts" },
        { from: "oj-dose", to: "oj-diabetes", type: "qualifies" },
      ],
      extra: { "oj-dose": { text: "A small glass with food behaves differently from a litre on an empty stomach.", level: "debated", slug: "orange-juice", section: 2 } },
    },
    {
      title: "Gelatin and glycine",
      links: [
        { from: "gelatin-glycine", to: "gelatin-balance", type: "supports" },
        { from: "gelatin-incomplete", to: "gelatin-balance", type: "qualifies" },
      ],
    },
    {
      title: "The raw carrot salad",
      links: [{ from: "carrot-fibre", to: "carrot-toxins", type: "supports" }],
      note: "Fibre's benefits are certain; the toxin-and-oestrogen part has never been tested on this salad.",
    },
    {
      title: "Checking the thyroid at home",
      links: [{ from: "peat-evidence", to: "peat-temperature", type: "questions" }],
      note: "The method is borrowed from Broda Barnes and rests on reasoning, not trials.",
    },
    {
      title: "Daily aspirin",
      links: [{ from: "aspirin-old-advice", to: "aspirin-daily", type: "replaced" }],
      extra: { "aspirin-old-advice": { text: "Healthy adults should take a daily baby aspirin to prevent heart attacks.", level: "fringe", slug: "aspirin", section: 2, old: true } },
    },
  ];

  const ARG_TYPES = {
    supports: { name: "supports", mark: "→" },
    contradicts: { name: "contradicts", mark: "✗" },
    questions: { name: "casts doubt on", mark: "?" },
    qualifies: { name: "adds a condition to", mark: "⋯" },
    replaced: { name: "was replaced by", mark: "↻" },
  };

  // 6 · My Shelf. What a reader might have at home.
  const SHELF = ["aspirin", "doxycycline", "orange-juice", "gelatin", "carrot-salad", "milk", "calcium-iron", "antacids", "honey", "salt"];

  // 1 · Seating Plan. Guests around the table, in seating order.
  const GUESTS = ["ray-peat", "orange-juice", "honey", "salt", "carrot-salad", "coconut-oil", "vinegar", "gelatin", "milk", "calcium-iron", "antacids", "doxycycline", "sun", "children", "aspirin", "heart-disease", "seed-oils", "starch"];

  return {
    KINDS, TERMS, RELATIONS, RELATION_TYPES, LINES, STATION_COLS, TREE, EXTRA_NAMES,
    RUNGS, LADDER, BODY, DAY, BEYOND, ARGUMENTS, ARG_TYPES, SHELF, GUESTS,
  };
})();
