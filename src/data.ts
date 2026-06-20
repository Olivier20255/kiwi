import { Category, Product } from "./types";

export const CATEGORIES: Category[] = [
  {
    id: "cat-clothing",
    name: "Clothing",
    slug: "clothing",
    description: "Sleek tailored coats, heavyweight knits, and daily pieces.",
    subcategories: [
      { id: "cat-outerwear", name: "Outerwear", slug: "outerwear", parentId: "cat-clothing" },
      { id: "cat-tops", name: "Tops", slug: "tops", parentId: "cat-clothing" },
      { id: "cat-pants", name: "Pants", slug: "pants", parentId: "cat-clothing" }
    ]
  },
  {
    id: "cat-shoes",
    name: "Shoes",
    slug: "shoes",
    description: "A selection of premium leather shoes, structural boots, and luxury sneakers.",
    subcategories: [
      { id: "cat-boots", name: "Boots", slug: "boots", parentId: "cat-shoes" },
      { id: "cat-sneakers", name: "Sneakers", slug: "sneakers", parentId: "cat-shoes" }
    ]
  },
  {
    id: "cat-bags",
    name: "Bags",
    slug: "bags",
    description: "Sculptural handbags, matte carryalls, and crossbodies.",
    subcategories: [
      { id: "cat-totes", name: "Totes", slug: "totes", parentId: "cat-bags" },
      { id: "cat-minibags", name: "Mini Bags", slug: "mini-bags", parentId: "cat-bags" }
    ]
  },
  {
    id: "cat-accessories",
    name: "Accessories",
    slug: "accessories",
    description: "Statement eyewear, modern sterling silver, and tactile accents.",
    subcategories: [
      { id: "cat-eyewear", name: "Eyewear", slug: "eyewear", parentId: "cat-accessories" },
      { id: "cat-jewelry", name: "Jewelry", slug: "jewelry", parentId: "cat-accessories" }
    ]
  }
];

export const PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Minimalist Double-Breasted Wool Overcoat",
    slug: "minimalist-double-breasted-wool-overcoat",
    description: "Crafted from a rich, heavyweight wool blend, this structural double-breasted overcoat features oversized peak lapels, drop shoulders, and a relaxed, editorial drape. Fully lined in silky cupro with deep welt pockets.",
    basePrice: 420.00,
    categoryId: "cat-outerwear",
    isFeatured: true,
    isArchived: false,
    variants: [
      { id: "v1-1", productId: "prod-1", sku: "KW-WO-CHA-SM", color: "Charcoal Black", size: "S", stockQuantity: 8 },
      { id: "v1-2", productId: "prod-1", sku: "KW-WO-CHA-MD", color: "Charcoal Black", size: "M", stockQuantity: 15 },
      { id: "v1-3", productId: "prod-1", sku: "KW-WO-CHA-LG", color: "Charcoal Black", size: "L", stockQuantity: 4 },
      { id: "v1-4", productId: "prod-1", sku: "KW-WO-OLV-SM", color: "Sage Olive", size: "S", stockQuantity: 5 },
      { id: "v1-5", productId: "prod-1", sku: "KW-WO-OLV-MD", color: "Sage Olive", size: "M", stockQuantity: 10 },
      { id: "v1-6", productId: "prod-1", sku: "KW-WO-CRM-MD", color: "Raw Cream", size: "M", stockQuantity: 6 },
      { id: "v1-7", productId: "prod-1", sku: "KW-WO-CRM-LG", color: "Raw Cream", size: "L", stockQuantity: 3 }
    ],
    images: [
      {
        id: "img-1-1",
        productId: "prod-1",
        url: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=1000",
        altText: "Charcoal Black wool overcoat master view",
        order: 0
      },
      {
        id: "img-1-2",
        productId: "prod-1",
        url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=1000",
        altText: "Charcoal Black coat detail",
        order: 1
      },
      {
        id: "img-1-3",
        productId: "prod-1",
        url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=1000",
        altText: "Sage Olive model look",
        order: 2
      }
    ],
    reviews: [
      {
        id: "r-1",
        productId: "prod-1",
        userId: "user-1",
        userName: "Gavin T.",
        rating: 5,
        comment: "Absolutely incredible tailoring. Fits like high-end couture. Heavy enough for freezing winters but drops elegantly.",
        createdAt: "2026-05-10"
      },
      {
        id: "r-2",
        productId: "prod-1",
        userId: "user-2",
        userName: "Elena R.",
        rating: 4,
        comment: "The Raw Cream fabric feels extremely soft. Slightly oversized; if you want a snug fit I'd recommend sizing down.",
        createdAt: "2026-06-03"
      }
    ],
    createdAt: "2026-01-15"
  },
  {
    id: "prod-2",
    name: "Sleek Washed Calfskin Trench Jacket",
    slug: "sleek-washed-calfskin-trench-jacket",
    description: "Designed with unmatched visual texture, our hand-washed calfskin trench combines lightweight mobility with standard motorcycle hardware. Featuring an adjustable belted waist, silver industrial grade double zippers, and storm flaps.",
    basePrice: 580.00,
    categoryId: "cat-outerwear",
    isFeatured: true,
    isArchived: false,
    variants: [
      { id: "v2-1", productId: "prod-2", sku: "KW-LT-BLK-SM", color: "Obsidian Black", size: "S", stockQuantity: 3 },
      { id: "v2-2", productId: "prod-2", sku: "KW-LT-BLK-MD", color: "Obsidian Black", size: "M", stockQuantity: 7 },
      { id: "v2-3", productId: "prod-2", sku: "KW-LT-BLK-LG", color: "Obsidian Black", size: "L", stockQuantity: 5 },
      { id: "v2-4", productId: "prod-2", sku: "KW-LT-TAN-MD", color: "Saddle Tan", size: "M", stockQuantity: 4 }
    ],
    images: [
      {
        id: "img-2-1",
        productId: "prod-2",
        url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=1000",
        altText: "Obsidian Black calfskin trench",
        order: 0
      },
      {
        id: "img-2-2",
        productId: "prod-2",
        url: "https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?auto=format&fit=crop&q=80&w=1000",
        altText: "Close-up hardware details",
        order: 1
      }
    ],
    reviews: [
      {
        id: "r-3",
        productId: "prod-2",
        userId: "user-3",
        userName: "Marcus K.",
        rating: 5,
        comment: "This jacket is a masterpiece. Smells incredible, the leather has this nuanced vintage patina right out of the box.",
        createdAt: "2026-04-18"
      }
    ],
    createdAt: "2026-02-12"
  },
  {
    id: "prod-3",
    name: "Tactical Pleated Uniform Cargo",
    slug: "tactical-pleated-uniform-cargo",
    description: "Merging military utility with formal tailoring, these pants are built from double-woven Japanese cotton gabardine. Double pleats on the thigh lead into expansive inset 3D pockets, topped with adjustable ankle strap toggles.",
    basePrice: 195.00,
    categoryId: "cat-pants",
    isFeatured: false,
    isArchived: false,
    variants: [
      { id: "v3-1", productId: "prod-3", sku: "KW-CP-SLT-28", color: "Slate Grey", size: "28", stockQuantity: 12 },
      { id: "v3-2", productId: "prod-3", sku: "KW-CP-SLT-30", color: "Slate Grey", size: "30", stockQuantity: 22 },
      { id: "v3-3", productId: "prod-3", sku: "KW-CP-SLT-32", color: "Slate Grey", size: "32", stockQuantity: 18 },
      { id: "v3-4", productId: "prod-3", sku: "KW-CP-SLT-34", color: "Slate Grey", size: "34", stockQuantity: 5 },
      { id: "v3-5", productId: "prod-3", sku: "KW-CP-KHK-30", color: "Dry Khaki", size: "30", stockQuantity: 10 },
      { id: "v3-6", productId: "prod-3", sku: "KW-CP-KHK-32", color: "Dry Khaki", size: "32", stockQuantity: 12 }
    ],
    images: [
      {
        id: "img-3-1",
        productId: "prod-3",
        url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=1000",
        altText: "Slate Grey cargos model stance",
        order: 0
      },
      {
        id: "img-3-2",
        productId: "prod-3",
        url: "https://images.unsplash.com/photo-1517462964-21fdcec3f25b?auto=format&fit=crop&q=80&w=1000",
        altText: "Reverse utilitarian look",
        order: 1
      }
    ],
    reviews: [
      {
        id: "r-4",
        productId: "prod-3",
        userId: "user-4",
        userName: "Kenji Y.",
        rating: 5,
        comment: "Excellent drape and very strong fabric. The adjustable cuffs allow me to style them cropped or stacked over bulky boots.",
        createdAt: "2026-05-23"
      }
    ],
    createdAt: "2026-03-01"
  },
  {
    id: "prod-4",
    name: "Lug-Sole Leather Square-Toe Boot",
    slug: "lug-sole-leather-square-toe-boot",
    description: "Engineered with a sharp, geometric square toe and custom stacked leather heel, this premium calfskin boot sits atop a heavy-duty Comando rubber lug outsole. Hand-lasted in Portugal with an interior lateral metallic zipper.",
    basePrice: 320.00,
    categoryId: "cat-boots",
    isFeatured: true,
    isArchived: false,
    variants: [
      { id: "v4-1", productId: "prod-4", sku: "KW-BT-BLK-40", color: "Pitch Black", size: "40", stockQuantity: 4 },
      { id: "v4-2", productId: "prod-4", sku: "KW-BT-BLK-41", color: "Pitch Black", size: "41", stockQuantity: 8 },
      { id: "v4-3", productId: "prod-4", sku: "KW-BT-BLK-42", color: "Pitch Black", size: "42", stockQuantity: 14 },
      { id: "v4-4", productId: "prod-4", sku: "KW-BT-BLK-43", color: "Pitch Black", size: "43", stockQuantity: 10 },
      { id: "v4-5", productId: "prod-4", sku: "KW-BT-BLK-44", color: "Pitch Black", size: "44", stockQuantity: 5 },
      { id: "v4-6", productId: "prod-4", sku: "KW-BT-CRM-41", color: "Buttermilk", size: "41", stockQuantity: 3 },
      { id: "v4-7", productId: "prod-4", sku: "KW-BT-CRM-42", color: "Buttermilk", size: "42", stockQuantity: 6 }
    ],
    images: [
      {
        id: "img-4-1",
        productId: "prod-4",
        url: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=1000",
        altText: "Pitch Black square-toe boots",
        order: 0
      },
      {
        id: "img-4-2",
        productId: "prod-4",
        url: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&q=80&w=1000",
        altText: "Buttermilk boots detailed texture",
        order: 1
      }
    ],
    reviews: [
      {
        id: "r-5",
        productId: "prod-4",
        userId: "user-5",
        userName: "Chloe P.",
        rating: 5,
        comment: "Absolutely stunning. Standard luxury level hardware. Give them 2-3 wears to fully break in the leather around ankle.",
        createdAt: "2026-02-18"
      }
    ],
    createdAt: "2026-01-20"
  },
  {
    id: "prod-5",
    name: "Elements Speckled Knit Trainer",
    slug: "elements-speckled-knit-trainer",
    description: "An innovative, ultra-breathable sneaker knit with dynamic stretch zones, high contrast speckled weave patterns, and a cushioned architectural EVA midsole. Perfect blend of urban technical utility and day-to-day comfort.",
    basePrice: 160.00,
    categoryId: "cat-sneakers",
    isFeatured: false,
    isArchived: false,
    variants: [
      { id: "v5-1", productId: "prod-5", sku: "KW-SN-OAT-41", color: "Oatmeal Grey", size: "41", stockQuantity: 12 },
      { id: "v5-2", productId: "prod-5", sku: "KW-SN-OAT-42", color: "Oatmeal Grey", size: "42", stockQuantity: 20 },
      { id: "v5-3", productId: "prod-5", sku: "KW-SN-OAT-43", color: "Oatmeal Grey", size: "43", stockQuantity: 15 },
      { id: "v5-4", productId: "prod-5", sku: "KW-SN-BLK-42", color: "Carbon Black", size: "42", stockQuantity: 8 }
    ],
    images: [
      {
        id: "img-5-1",
        productId: "prod-5",
        url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=1000",
        altText: "Elements Trainer Side Profile",
        order: 0
      },
      {
        id: "img-5-2",
        productId: "prod-5",
        url: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=1000",
        altText: "Architectural sole look",
        order: 1
      }
    ],
    reviews: [
      {
        id: "r-6",
        productId: "prod-5",
        userId: "user-6",
        userName: "Nate W.",
        rating: 4,
        comment: "Super light! Feels like walking on air. Speckled design is unique and hides dirt easily.",
        createdAt: "2026-05-30"
      }
    ],
    createdAt: "2026-03-10"
  },
  {
    id: "prod-6",
    name: "Architectural Matte Shoulder Bag",
    slug: "architectural-matte-shoulder-bag",
    description: "An elegant, structural, boxy shoulder bag constructed with full-grain rubberized matte leather. Boasting geometric silver hinges, a hidden magnetic closure, and dual internal accordion sleeves designed for meticulous organization.",
    basePrice: 280.00,
    categoryId: "cat-minibags",
    isFeatured: true,
    isArchived: false,
    variants: [
      { id: "v6-1", productId: "prod-6", sku: "KW-BG-MAT-OS", color: "Matte Black", size: "OS", stockQuantity: 3 },
      { id: "v6-2", productId: "prod-6", sku: "KW-BG-SAV-OS", color: "Savour Matcha", size: "OS", stockQuantity: 4 }
    ],
    images: [
      {
        id: "img-6-1",
        productId: "prod-6",
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=1000",
        altText: "Sleek Matte Black shoulder bag front",
        order: 0
      },
      {
        id: "img-6-2",
        productId: "prod-6",
        url: "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=1000",
        altText: "Savour Matcha bag on styling setting",
        order: 1
      }
    ],
    reviews: [
      {
        id: "r-7",
        productId: "prod-6",
        userId: "user-7",
        userName: "Isabella L.",
        rating: 5,
        comment: "Minimalist dream. The clasp snaps tight with an extremely nice mechanical 'click'. The rubberized feel is very tactile and scratch resistant.",
        createdAt: "2026-06-01"
      }
    ],
    createdAt: "2026-01-05"
  },
  {
    id: "prod-7",
    name: "Heavyweight 550GSM Loopback Hoodie",
    slug: "heavyweight-550gsm-loopback-hoodie",
    description: "Our core staple hoodie is constructed of extremely dense 550GSM organic loopback French cotton terry. Built with double-lined hood, no drawstrings for a clean architectural neck profile, rib cuffs, and heavy side ribbing.",
    basePrice: 150.00,
    categoryId: "cat-tops",
    isFeatured: false,
    isArchived: false,
    variants: [
      { id: "v7-1", productId: "prod-7", sku: "KW-HD-CHO-SM", color: "Cacao Chocolate", size: "S", stockQuantity: 10 },
      { id: "v7-2", productId: "prod-7", sku: "KW-HD-CHO-MD", color: "Cacao Chocolate", size: "M", stockQuantity: 18 },
      { id: "v7-3", productId: "prod-7", sku: "KW-HD-CHO-LG", color: "Cacao Chocolate", size: "L", stockQuantity: 12 },
      { id: "v7-4", productId: "prod-7", sku: "KW-HD-OWH-MD", color: "Off White", size: "M", stockQuantity: 15 },
      { id: "v7-5", productId: "prod-7", sku: "KW-HD-OWH-XL", color: "Off White", size: "XL", stockQuantity: 7 }
    ],
    images: [
      {
        id: "img-7-1",
        productId: "prod-7",
        url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1000",
        altText: "Cacao Chocolate loopback hoodie product shot",
        order: 0
      },
      {
        id: "img-7-2",
        productId: "prod-7",
        url: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=1000",
        altText: "Loopback texture detailing close up",
        order: 1
      }
    ],
    reviews: [
      {
        id: "r-8",
        productId: "prod-7",
        userId: "user-8",
        userName: "David M.",
        rating: 5,
        comment: "This is the best hoodie on the market. Incredibly heavy, drops so nicely with none of the cheap polyester shine. A pure luxury basic.",
        createdAt: "2026-05-10"
      }
    ],
    createdAt: "2026-04-02"
  },
  {
    id: "prod-8",
    name: "Aero Titanium Angular Sunglasses",
    slug: "aero-titanium-angular-sunglasses",
    description: "Extremely light frame forged from high-tech aerospace titanium with surgical acetate visual temples. Features anti-scratch 100% UVA/UVB protection tinted glass, a rigid bridge structure, and custom Kiwi insignia nose pad engravings.",
    basePrice: 220.00,
    categoryId: "cat-eyewear",
    isFeatured: true,
    isArchived: false,
    variants: [
      { id: "v8-1", productId: "prod-8", sku: "KW-SG-CHR-OS", color: "Charcoal Tint", size: "OS", stockQuantity: 9 },
      { id: "v8-2", productId: "prod-8", sku: "KW-SG-AMB-OS", color: "Amber Warmth", size: "OS", stockQuantity: 6 }
    ],
    images: [
      {
        id: "img-8-1",
        productId: "prod-8",
        url: "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&q=80&w=1000",
        altText: "Aero Titanium Sunglasses",
        order: 0
      },
      {
        id: "img-8-2",
        productId: "prod-8",
        url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=1000",
        altText: "Sunglasses and accessories editorial table",
        order: 1
      }
    ],
    reviews: [
      {
        id: "r-9",
        productId: "prod-8",
        userId: "user-9",
        userName: "Yoko S.",
        rating: 5,
        comment: "Astonishingly lightweight. Hardly notice you are wearing them, but the structural design is very strong and edgy.",
        createdAt: "2026-06-05"
      }
    ],
    createdAt: "2026-05-01"
  }
];
