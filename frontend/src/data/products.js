const products = [
  /* ================= GIFT HAMPERS ================= */
  {
    id: "1",
    name: "Royal Kashmiri Gift Hamper",
    price: 3499,
    category: "Gift Hampers",
    image: "/images/royalkashmiri.png",
    description:
      "A premium gift hamper featuring authentic Kashmiri crafts and delicacies.",
  },
  {
    id: "2",
    name: "Premium Wedding Gift Hamper",
    price: 4999,
    category: "Gift Hampers",
    image: "/images/premiumwedding.png",
    description: "Hand-packed dry fruits sourced directly from Kashmir valley.",
  },
  {
    id: "3",
    name: "Dry Fruits Treasure Box",
    price: 2299,
    category: "Gift Hampers",
    image: "/images/dryfruittreasure.png",
    description: "Hand-packed dry fruits sourced directly from Kashmir valley.",
  },
  {
    id: "4",
    name: "Kashmiri Honey & Walnut Gift Box",
    price: 3599,
    category: "Gift Hampers",
    image: "/images/kashmirihoney.png",
    description: "Hand-packed dry fruits sourced directly from Kashmir valley.",
  },
  {
    id: "5",
    name: "Deluxe Saffron & Almond Hamper",
    price: 2799,
    category: "Gift Hampers",
    image: "/images/deluxesaffron.png",
    description: "Hand-packed dry fruits sourced directly from Kashmir valley.",
  },
  {
    id: "6",
    name: "Grand Heritage Gift Box",
    price: 5499,
    category: "Gift Hampers",
    image: "/images/grandheritage.png",
    description: "Hand-packed dry fruits sourced directly from Kashmir valley.",
  },
  {
    id: "7",
    name: "Kashmiri Honey & Walnut Gift Box",
    price: 3599,
    category: "Gift Hampers",
    image: "/images/kashmiriwalnut.png",
    description: "Hand-packed dry fruits sourced directly from Kashmir valley.",
  },
  {
    id: "8",
    name: "Grand Heritage Gift Box",
    price: 5499,
    category: "Gift Hampers",
    image: "/images/grandgift.png",
    description: "Hand-packed dry fruits sourced directly from Kashmir valley.",
  },
  {
    id: "9",
    name: "Kashmiri Festive Gift Hamper",
    price: 3299,
    category: "Gift Hampers",
    image: "/images/kashmirifestive.png",
    description: "Hand-packed dry fruits sourced directly from Kashmir valley.",
  },

  /* ================= PASHMINA ================= */
  {
    id: "10",
    name: "Kani Weave Wool Shawl",
    price: 1999,
    category: "Pashmina Shawls",
    image: "/images/kaniweave.png",
    description:
      "Authentic handwoven Pashmina shawl made by Kashmiri artisans.",
  },
  {
    id: "11",
    name: "Zari Wool Dorukha Jaaldar Shawl",
    price: 2604,
    category: "Pashmina Shawls",
    image: "/images/dorukhashwal.png",
    description:
      "Soft, warm and elegant shawl crafted using traditional techniques.",
  },
  {
    id: "12",
    name: "Dub Palla Ari Hand Embroidery Wool Shawl",
    price: 3422,
    category: "Pashmina Shawls",
    image: "/images/dubpalla.png",
    description:
      "Soft, warm and elegant shawl crafted using traditional techniques.",
  },
  {
    id: "13",
    name: "Handloom Pashmina Checks Shawl",
    price: 13650,
    category: "Pashmina Shawls",
    image: "/images/pashminahandloom.png",
    description:
      "Soft, warm and elegant shawl crafted using traditional techniques.",
  },
  {
    id: "14",
    name: "Potpourri Jama Raw Silk Shawl",
    price: 4012,
    category: "Pashmina Shawls",
    image: "/images/potpurijama.png",
    description:
      "Soft, warm and elegant shawl crafted using traditional techniques.",
  },
  {
    id: "15",
    name: "Chinar Dor Kani Wool Shawl – Toosh Offwhite",
    price: 4012,
    category: "Pashmina Shawls",
    image: "/images/chinador.png",
    description:
      "Soft, warm and elegant shawl crafted using traditional techniques.",
  },
  {
    id: "16",
    name: "Bada Dor Kani Weave Shawl – Astral Blue",
    price: 4012,
    category: "Pashmina Shawls",
    image: "/images/badador.png",
    description:
      "Soft, warm and elegant shawl crafted using traditional techniques.",
  },
  {
    id: "17",
    name: "Ambi Jama Kalamkari Shawl",
    price: 7670,
    category: "Pashmina Shawls",
    image: "/images/kalamkarishawl.png",
    description:
      "Soft, warm and elegant shawl crafted using traditional techniques.",
  },
  {
    id: "18",
    name: "Jalaal Kani Antique Wool Shawl ",
    price: 3776,
    category: "Pashmina Shawls",
    image: "/images/anique.png",
    description:
      "Soft, warm and elegant shawl crafted using traditional techniques.",
  },

  /* ================= DRY FRUITS ================= */
  {
    id: "19",
    name: "Kashmiri Mamra Badam",
    price: 650,
    category: "Dry Fruits",
    image: "/images/kashmirimamrabadam.png",
    description: "Crunchy premium almonds sourced from Kashmir.",
  },
  {
    id: "20",
    name: "Kashmiri Walnut Kernels",
    price: 550,
    category: "Dry Fruits",
    image: "/images/kashmiriwalnutkernels.png",
    description: "Fresh organic walnuts with rich taste and nutrients.",
  },
  {
    id: "21",
    name: "Chilgoza Pine nut with Shell",
    price: 1499,
    category: "Dry Fruits",
    image: "/images/chilgozapinenuts.png",
    description: "Fresh organic walnuts with rich taste and nutrients.",
  },
  {
    id: "22",
    name: "Dried Figs/Anjeer",
    price: 550,
    category: "Dry Fruits",
    image: "/images/driedfigs.png",
    description: "Fresh organic walnuts with rich taste and nutrients.",
  },
  {
    id: "23",
    name: "Dried Apricot Khubani(Seedless)",
    price: 425,
    category: "Dry Fruits",
    image: "/images/driedapricotkhubani.png",
    description: "Fresh organic walnuts with rich taste and nutrients.",
  },
  {
    id: "24",
    name: "Black Kishmish/Black Raisins",
    price: 450,
    category: "Dry Fruits",
    image: "/images/lackkishmish.png",
    description: "Fresh organic walnuts with rich taste and nutrients.",
  },
  {
    id: "25",
    name: "Kashmiri Pistachios",
    price: 650,
    category: "Dry Fruits",
    image: "/images/kashmiripistachos.png",
    description: "Fresh organic walnuts with rich taste and nutrients.",
  },
  {
    id: "26",
    name: "Golden Kishmish/Golden Raisins",
    price: 400,
    category: "Dry Fruits",
    image: "/images/goldenkishmish.png",
    description: "Fresh organic walnuts with rich taste and nutrients.",
  },
  {
    id: "27",
    name: "Mixed Dry Fruits",
    price: 750,
    category: "Dry Fruits",
    image: "/images/mixeddryfruits.png",
    description: "Fresh organic walnuts with rich taste and nutrients.",
  },

  /* ================= HANDICRAFTS (MORE PRODUCTS) ================= */
  {
    id: "28",
    name: "Imperial Garnet Shah Abbas Carpet",
    price: 22799,
    category: "Handicrafts",
    image: "/images/imperialgarnet.jpg",
    description:
      "Hand-carved walnut wood jewelry box crafted by skilled artisans.",
  },
  {
    id: "29",
    name: "Teal Sapphire Tabriz Wool-Silk Carpet",
    price: 33199,
    category: "Handicrafts",
    image: "/images/tealsaphire.jpg",
    description:
      "Traditional papier mache artwork with intricate hand painting.",
  },
  {
    id: "30",
    name: "Sea Blue Mashhad Wool-Silk Carpet",
    price: 34199,
    category: "Handicrafts",
    image: "/images/seabluemashhad.jpg",
    description:
      "Traditional papier mache artwork with intricate hand painting.",
  },
  {
    id: "31",
    name: "Antique-White-Arak Carpet",
    price: 45199,
    category: "Handicrafts",
    image: "/images/Antique-White-Arak.jpg",
    description:
      "Traditional papier mache artwork with intricate hand painting.",
  },
  {
    id: "32",
    name: "Alhambra Green Mousel Carpet",
    price: 23199,
    category: "Handicrafts",
    image: "/images/alhambragreenmousel.jpg",
    description:
      "Traditional papier mache artwork with intricate hand painting.",
  },
  {
    id: "33",
    name: "Amberglow-Ahar Carpet",
    price: 38500,
    category: "Handicrafts",
    image: "/images/Amberglow-Ahar.jpg",
    description:
      "Traditional papier mache artwork with intricate hand painting.",
  },
  {
    id: "34",
    name: "Angora-Kerman-Lavar Carpet",
    price: 43086,
    category: "Handicrafts",
    image: "/images/Angora-Kerman-Lavar.jpg",
    description:
      "Traditional papier mache artwork with intricate hand painting.",
  },
  {
    id: "35",
    name: "Blueberry Qum Wool-Silk Carpet",
    price: 68000,
    category: "Handicrafts",
    image: "/images/blueberryqum.jpg",
    description:
      "Traditional papier mache artwork with intricate hand painting.",
  },
  {
    id: "36",
    name: "Cherry Red Wool-Silk Carpet",
    price: 21500,
    category: "Handicrafts",
    image: "/images/cherryred.jpg",
    description:
      "Traditional papier mache artwork with intricate hand painting.",
  },
  {
    id: "37",
    name: "Lyons Bluenain Carpet",
    price: 20000,
    category: "Handicrafts",
    image: "/images/lyonsbluenain.jpg",
    description:
      "Traditional papier mache artwork with intricate hand painting.",
  },
  {
    id: "38",
    name: "Candle Holder",
    price: 450,
    category: "Handicrafts",
    image: "/images/candleholder.png",
    description:
      "Traditional papier mache artwork with intricate hand painting.",
  },
  {
    id: "39",
    name: "Coasters",
    price: 1300,
    category: "Handicrafts",
    image: "/images/coasters.png",
    description:
      "Traditional papier mache artwork with intricate hand painting.",
  },
  {
    id: "40",
    name: "Decorative Vase",
    price: 1500,
    category: "Handicrafts",
    image: "/images/decorativevase.png",
    description:
      "Traditional papier mache artwork with intricate hand painting.",
  },
  {
    id: "41",
    name: "Carved Elephant",
    price: 900,
    category: "Handicrafts",
    image: "/images/elephant.png",
    description:
      "Traditional papier mache artwork with intricate hand painting.",
  },
  {
    id: "42",
    name: "Floral Box",
    price: 1500,
    category: "Handicrafts",
    image: "/images/floralbox.png",
    description:
      "Traditional papier mache artwork with intricate hand painting.",
  },
  {
    id: "43",
    name: "Handicraft Box",
    price: 1100,
    category: "Handicrafts",
    image: "/images/handicraftbox.png",
    description:
      "Traditional papier mache artwork with intricate hand painting.",
  },
  {
    id: "44",
    name: "Jewellery Box",
    price: 1800,
    category: "Handicrafts",
    image: "/images/jwellerybox.png",
    description:
      "Traditional papier mache artwork with intricate hand painting.",
  },
  {
    id: "45",
    name: "Kashmiri Bowl",
    price: 1000,
    category: "Handicrafts",
    image: "/images/kashmiribowl.png",
    description:
      "Traditional papier mache artwork with intricate hand painting.",
  },
  {
    id: "46",
    name: "Pen Holder",
    price: 900,
    category: "Handicrafts",
    image: "/images/penholder.png",
    description:
      "Traditional papier mache artwork with intricate hand painting.",
  },
];

export default products;
