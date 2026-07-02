export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number; // starting price in FCFA
  priceLabel?: string; // for ranges like "2 000 - 5 000 F"
  emoji: string;
};

export type MenuCategory = {
  id: string;
  title: string;
  emoji: string;
  items: MenuItem[];
};

export const menu: MenuCategory[] = [
  {
    id: "petit-dejeuner",
    title: "Petit Déjeuner",
    emoji: "☕",
    items: [
      {
        id: "pdj-cafe-matinal",
        name: "Café Matinal",
        description: "Café chaud maison",
        price: 500,
        emoji: "☕",
      },
      {
        id: "pdj-cafe-lait-pain",
        name: "Café au Lait + Pain",
        description: "Café au lait et pain frais",
        price: 1000,
        emoji: "☕",
      },
      {
        id: "pdj-cafe-lait-pain-oeuf",
        name: "Café au Lait + Pain + Œuf",
        description: "Café au lait, pain frais et œuf",
        price: 1500,
        emoji: "🍳",
      },
    ],
  },
  {
    id: "spaghetti",
    title: "Spaghetti",
    emoji: "🍝",
    items: [
      {
        id: "spa-boeuf",
        name: "Spaghetti + Viande de Bœuf",
        description: "Sauce tomate maison, viande de bœuf",
        price: 1500,
        emoji: "🍝",
      },
      {
        id: "spa-boeuf-oeuf",
        name: "Spaghetti + Viande de Bœuf + Œuf",
        description: "Sauce tomate, viande de bœuf et œuf",
        price: 2000,
        emoji: "🍝",
      },
      {
        id: "spa-poulet-oeuf",
        name: "Spaghetti + Cuisse de Poulet + Œuf",
        description: "Sauce tomate, cuisse de poulet et œuf",
        price: 2500,
        emoji: "🍝",
      },
    ],
  },
  {
    id: "attieke",
    title: "Attiéké",
    emoji: "🐟",
    items: [
      {
        id: "att-chiencha",
        name: "Attiéké + Alloco + Chiencha",
        description: "Semoule de manioc, alloco, poisson Chiencha",
        price: 2000,
        priceLabel: "2 000 – 5 000 FCFA",
        emoji: "🐟",
      },
      {
        id: "att-tilapia",
        name: "Attiéké + Alloco + Tilapia",
        description: "Semoule de manioc, alloco, tilapia grillé",
        price: 2500,
        priceLabel: "2 500 – 10 000 FCFA",
        emoji: "🐟",
      },
    ],
  },
  {
    id: "couscous",
    title: "Couscous",
    emoji: "🍗",
    items: [
      {
        id: "cous-poulet",
        name: "Couscous + Cuisse de Poulet",
        description: "Couscous moelleux, cuisse de poulet grillée",
        price: 2000,
        emoji: "🍗",
      },
      {
        id: "cous-poulet-oeuf",
        name: "Couscous + Cuisse de Poulet + Œuf",
        description: "Couscous, cuisse de poulet et œuf",
        price: 2500,
        emoji: "🍗",
      },
    ],
  },
  {
    id: "riz-cantonne",
    title: "Riz Cantonné",
    emoji: "🍚",
    items: [
      {
        id: "riz-poulet",
        name: "Riz Cantonné + Cuisse de Poulet",
        description: "Riz sauté aux légumes, cuisse de poulet",
        price: 2000,
        emoji: "🍚",
      },
      {
        id: "riz-poulet-oeuf",
        name: "Riz Cantonné + Cuisse de Poulet + Œuf",
        description: "Riz sauté aux légumes, poulet et œuf",
        price: 2500,
        emoji: "🍚",
      },
    ],
  },
  {
    id: "boissons",
    title: "Jus & Boissons",
    emoji: "🥤",
    items: [
      {
        id: "jus-bissape",
        name: "Jus de Bissape",
        description: "Jus de bissape frais, Bio Premium Qualité",
        price: 1500,
        emoji: "🌺",
      },
      {
        id: "jus-baobab-1000",
        name: "Jus de Baobab (petit)",
        description: "Jus de baobab naturel, Bio Premium",
        price: 1000,
        emoji: "🥭",
      },
      {
        id: "jus-baobab-2500",
        name: "Jus de Baobab (grand)",
        description: "Grand format, Jus de baobab Bio Premium",
        price: 2500,
        emoji: "🥭",
      },
      {
        id: "jus-citron-1000",
        name: "Jus de Citron (petit)",
        description: "Citronnade fraîche, Bio Premium Qualité",
        price: 1000,
        emoji: "🍋",
      },
      {
        id: "jus-citron-2500",
        name: "Jus de Citron (grand)",
        description: "Grand format, Citronnade Bio Premium",
        price: 2500,
        emoji: "🍋",
      },
      {
        id: "jus-tamarin",
        name: "Jus de Tamarin",
        description: "Jus de tamarin glacé, Bio Premium Qualité",
        price: 500,
        emoji: "🥃",
      },
      {
        id: "yaourt",
        name: "Yaourt Nature",
        description: "Yaourt maison frais et onctueux",
        price: 500,
        emoji: "🥛",
      },
      {
        id: "degue",
        name: "Dégué",
        description: "Boisson mil et yaourt, fraîche",
        price: 500,
        emoji: "🥤",
      },
      {
        id: "galidossi",
        name: "Galidossi",
        description: "Boisson traditionnelle rafraîchissante",
        price: 500,
        emoji: "🥤",
      },
      {
        id: "arachide",
        name: "Arachide Glacée",
        description: "Cacahuètes grillées et glacées",
        price: 300,
        emoji: "🥜",
      },
    ],
  },
];

export const CONTACT = {
  phone: "+228 91 62 72 07",      // T-Money
  phoneAlt: "+228 96 59 89 89",   // Flooz
  whatsapp: "22896598989",         // WhatsApp commandes (Flooz)
  floozNumber: "96598989",
  tmoneyNumber: "91627207",
  address: "Klikamé, près de la station T Oil — Lomé, Togo",
  hours: "Lundi au Samedi — dès 06h00",
};
