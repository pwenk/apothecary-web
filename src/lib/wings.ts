/** The six wings of the house, in walking order. Day wings come first; the last two are "after hours". */
export type WingId = "apothecary" | "pantry" | "signals" | "schools" | "attraction" | "pleasure";

export type Wing = {
  id: WingId;
  numeral: string;
  name: string;
  tagline: string;
  intro: string;
  side: "day" | "night";
  /** Reading order inside the wing. Pieces not listed here follow, sorted by title. */
  order: string[];
};

export const WINGS: Wing[] = [
  {
    id: "apothecary",
    numeral: "I",
    name: "The Apothecary",
    tagline: "How drugs, hormones and peptides do what they do.",
    intro:
      "Every pill is a key and every hormone is a hand on a dial. Here we open the bottles, read the small print on the receptors, and find out why a willow tree, a soil sample and a Gila monster ended up in your medicine cabinet.",
    side: "day",
    order: [
      "aspirin",
      "doxycycline",
      "ivermectin",
      "pau-darco",
      "cabergoline",
      "tadalafil",
      "androsterone",
      "dopamine",
      "prolactin",
      "serotonin",
      "oxytocin",
      "testosterone",
      "cortisol",
      "peptides",
      "bioregulators",
      "bpc-157",
      "melanocortins",
      "glp-1",
    ],
  },
  {
    id: "pantry",
    numeral: "II",
    name: "The Pantry",
    tagline: "What is really inside the food.",
    intro:
      "A banana is a battery, a vitamin pill and a small chemistry set in a yellow jacket. Each food here is read three ways: the fuel, the sparks, and the secret guests nobody puts on the label.",
    side: "day",
    order: [
      "how-to-read-a-food",
      "banana",
      "orange",
      "milk",
      "egg",
      "coffee",
      "gelatin",
      "carrot",
      "honey",
      "oyster",
      "cacao",
    ],
  },
  {
    id: "signals",
    numeral: "III",
    name: "Signals",
    tagline: "Patterns in the body worth noticing.",
    intro:
      "The body rarely shouts. It taps on the glass, the same tap, for months. These pages teach you the taps worth answering, and what a good doctor checks when you do.",
    side: "day",
    order: ["adhd", "cancer-signs", "low-thyroid", "low-testosterone"],
  },
  {
    id: "schools",
    numeral: "IV",
    name: "Schools",
    tagline: "Whole worldviews, read generously and checked honestly.",
    intro:
      "Some thinkers hand you a fact. Ray Peat and Jack Kruse hand you a universe. We walk through each one the way a guest walks through a strange house: admiring the furniture, testing the floorboards.",
    side: "day",
    order: [
      "ray-peat",
      "peat-sugar-and-thyroid",
      "peat-pufa",
      "peat-stress-hormones",
      "peat-what-holds-up",
      "jack-kruse",
      "kruse-light",
      "kruse-cold",
      "kruse-deuterium-and-leptin",
      "kruse-what-holds-up",
    ],
  },
  {
    id: "attraction",
    numeral: "V",
    name: "Attraction",
    tagline: "Evolution, status, scent and seduction.",
    intro:
      "Why that face, that voice, that walk across the room? Evolution wrote the first draft of desire. Pickup artists tried to hack it, scientists tried to replicate it, and most of them got something wrong.",
    side: "night",
    order: [
      "what-is-attractive",
      "the-ovulation-shift",
      "dominance-and-prestige",
      "scent",
      "the-game-revisited",
      "chase-hughes",
    ],
  },
  {
    id: "pleasure",
    numeral: "VI",
    name: "Pleasure",
    tagline: "Polarity, surrender and the bedroom.",
    intro:
      "The lights go down here. Masculine and feminine, the strange freedom of being tied, old Taoist bedroom secrets and the quiet things that stop you from having any of it.",
    side: "night",
    order: [
      "polarity",
      "the-masculine",
      "the-feminine",
      "surrender",
      "shibari",
      "taoist-bedroom",
      "sex-god-method",
      "xans",
      "what-stops-you",
    ],
  },
];

export const WING_IDS = WINGS.map((w) => w.id);

export function getWing(id: string): Wing | undefined {
  return WINGS.find((w) => w.id === id);
}

export const EVIDENCE = {
  strong: { label: "Strong evidence", short: "Strong", note: "Large human trials or clinical guidelines agree." },
  mixed: { label: "Mixed evidence", short: "Mixed", note: "Some good human data, some disagreement." },
  thin: { label: "Thin evidence", short: "Thin", note: "Mostly animal, lab or small studies, or anecdotes." },
  fringe: { label: "A school of thought", short: "School", note: "Ideas outside the mainstream, explained on their own terms." },
} as const;

export type Evidence = keyof typeof EVIDENCE;
