import ring from "../assets/ring.jpg";
import necklace from "../assets/necklace.jpg";
import bracelet from "../assets/bracelet.jpg";
import earrings from "../assets/earrings.jpg";
import solitaire from "../assets/solitaire.jpg";
import lifestyle from "../assets/lifestyle.jpg";

export const images = { ring, necklace, bracelet, earrings, solitaire, lifestyle };

export const METALS = ["18k Yellow Gold", "Rose Gold", "Platinum"];

export const CATEGORIES = ["Rings", "Necklaces", "Bracelets", "Earrings", "Bespoke Solitaires"];

export const PRODUCTS = [
  {
    id: "eternelle-solitaire",
    name: "Éternelle Solitaire Ring",
    category: "Rings",
    price: 4850,
    image: ring,
    description: "A 1.2ct round brilliant diamond held aloft in a whisper-thin four-claw setting with hidden gallery pavé.",
    bestseller: true,
    carat: "1.20 ct",
    color: "D",
    clarity: "VVS1",
    cut: "Ideal",
    certification: "GIA"
  },
  {
    id: "verdant-drop",
    name: "Verdant Emerald Drop",
    category: "Necklaces",
    price: 2390,
    image: necklace,
    description: "A pear-cut Colombian emerald suspended from a delicate cable chain with diamond accents.",
    bestseller: true,
    carat: "1.85 ct",
    color: "Vivid Green",
    clarity: "VS1",
    cut: "Pear Brilliant",
    certification: "SSEF"
  },
  {
    id: "riviera-tennis",
    name: "Riviera Tennis Bracelet",
    category: "Bracelets",
    price: 7600,
    image: bracelet,
    description: "Fifty-two hand-matched diamonds set in a continuous line of fluid light with double security clasp.",
    bestseller: true,
    carat: "6.50 ctw",
    color: "E-F",
    clarity: "VS1",
    cut: "Ideal",
    certification: "IGI"
  },
  {
    id: "perle-lumiere",
    name: "Perle Lumière Earrings",
    category: "Earrings",
    price: 3150,
    image: earrings,
    description: "South Sea pearls crowned with pavé diamond petals and delicate platinum drop mounts.",
    bestseller: true,
    carat: "1.40 ctw",
    color: "E",
    clarity: "VVS2",
    cut: "Round Brilliant",
    certification: "GIA"
  },
  {
    id: "oceane-sapphire",
    name: "Océane Sapphire Solitaire",
    category: "Bespoke Solitaires",
    price: 18900,
    image: solitaire,
    description: "A 4.1ct unheated Ceylon royal sapphire framed by a halo of brilliant-cut diamonds.",
    highJewelry: true,
    bestseller: true,
    carat: "4.10 ct",
    color: "Royal Blue",
    clarity: "Eye Clean",
    cut: "Cushion",
    certification: "GIA & Gübelin"
  },
  {
    id: "stacking-trio",
    name: "Aura Stacking Trio",
    category: "Rings",
    price: 1280,
    image: lifestyle,
    description: "Three slender bands — polished, twisted and beaded — designed to be worn together or solo.",
    carat: "0.45 ctw",
    color: "F",
    clarity: "VS2",
    cut: "Round",
    certification: "IGI"
  },
  {
    id: "halo-pendant",
    name: "Halo Diamond Pendant",
    category: "Necklaces",
    price: 3640,
    image: necklace,
    description: "A cushion-cut center stone encircled by micro-pavé diamonds on an 18-inch wheat chain.",
    carat: "1.50 ct",
    color: "E",
    clarity: "VVS1",
    cut: "Cushion Modified",
    certification: "GIA"
  },
  {
    id: "bangle-sculpt",
    name: "Sculpt Gold Bangle",
    category: "Bracelets",
    price: 2150,
    image: lifestyle,
    description: "A hand-forged bangle with a softly hammered surface and hidden push-button clasp.",
    carat: "0.35 ctw",
    color: "G",
    clarity: "VS1",
    cut: "Brilliant",
    certification: "Hallmarked"
  },
  {
    id: "celeste-studs",
    name: "Céleste Diamond Studs",
    category: "Earrings",
    price: 2780,
    image: earrings,
    description: "Matched 0.5ct each diamonds in a classic 3-prong martini setting designed to sit flush.",
    carat: "1.00 ctw",
    color: "D",
    clarity: "VVS2",
    cut: "Hearts & Arrows",
    certification: "GIA"
  },
  {
    id: "imperatrice",
    name: "Impératrice Diamond Ring",
    category: "Bespoke Solitaires",
    price: 32500,
    image: ring,
    description: "A 3.05ct D-flawless diamond with tapered baguette shoulders, handcrafted to order.",
    highJewelry: true,
    carat: "3.05 ct",
    color: "D (Flawless)",
    clarity: "IF",
    cut: "Triple Excellent",
    certification: "GIA Dossier"
  },
  {
    id: "nuit-riviere",
    name: "Nuit Rivière Necklace",
    category: "Necklaces",
    price: 45000,
    image: bracelet,
    description: "A graduated rivière of 87 diamonds totalling 22 carats in articulated platinum settings.",
    highJewelry: true,
    carat: "22.0 ctw",
    color: "E-F",
    clarity: "VVS",
    cut: "Graduated Riviera",
    certification: "GIA Master"
  },
  {
    id: "aube-hoops",
    name: "Aube Pavé Hoops",
    category: "Earrings",
    price: 1890,
    image: earrings,
    description: "Everyday luxury hoops lined with an inside-out row of micro-pavé diamonds.",
    carat: "0.85 ctw",
    color: "F",
    clarity: "VS1",
    cut: "Round",
    certification: "IGI"
  }
];

export const getProduct = (id) => PRODUCTS.find((p) => p.id === id);

export const CURRENCIES = {
  USD: { symbol: "$", rate: 1 },
  EUR: { symbol: "€", rate: 0.92 },
  GBP: { symbol: "£", rate: 0.79 },
  INR: { symbol: "₹", rate: 83 }
};
