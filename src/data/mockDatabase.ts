export type NykaaCategory = 'Makeup' | 'Skin' | 'Hair' | 'Appliances' | 'Bath & Body' | 'Natural' | 'Mom & Baby' | 'Health & Wellness' | 'Men' | 'Fragrance' | 'Lingerie & Accessories';

export const nykaaCategories: NykaaCategory[] = [
  'Makeup', 'Skin', 'Hair', 'Appliances', 'Bath & Body', 'Natural', 'Mom & Baby', 'Health & Wellness', 'Men', 'Fragrance', 'Lingerie & Accessories',
];

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  nykaaCategory: NykaaCategory;
  ingredients: string[];
  price: number;
  mrp: number;
  rating: number;
  ratingCount: number;
  reviewCount: number;
  tier: 'budget' | 'mid' | 'luxury';
  skinTypes: string[];
  concerns: string[];
  imageUrl?: string;
  description: string;
}

export interface RoutineStep {
  order: number;
  productId: string;
  timeOfDay: 'morning' | 'evening' | 'both';
  instruction: string;
}

export interface Routine {
  id: string;
  name: string;
  description: string;
  steps: RoutineStep[];
  goal: string;
  skinType: string;
}

export interface InventoryItem {
  productId: string;
  purchaseDate: string;
  remainingPercent: number;
  usageRatePerDay: number;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  uvIndex: number;
  condition: string;
}

export interface Scenario {
  id: string;
  title: string;
  type: 'swap' | 'alert' | 'guard' | 'nudge' | 'intent' | 'goal' | 'shade' | 'conflict' | 'budget' | 'calendar';
  description: string;
  active: boolean;
  severity: 'info' | 'warning' | 'success' | 'critical';
  actionLabel?: string;
  relatedProductIds: string[];
}

// ── Products ──
export const products: Product[] = [
  // ─── SKIN ───
  {
    id: 'p1', name: 'Hydra Gel Cleanser', brand: 'CeraVe', category: 'cleanser', nykaaCategory: 'Skin',
    ingredients: ['Hyaluronic Acid', 'Ceramides', 'Glycerin'],
    price: 16, tier: 'budget', skinTypes: ['oily', 'combination'], concerns: ['hydration'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/tr:w-344,h-344,cm-pad_resize/2/8/2892035CERAV00000007_1.jpg',
    description: 'Lightweight gel cleanser that maintains skin barrier.',
  },
  {
    id: 'p2', name: 'Rich Cream Cleanser', brand: 'La Mer', category: 'cleanser', nykaaCategory: 'Skin',
    ingredients: ['Miracle Broth', 'Lime Tea Extract', 'Shea Butter'],
    price: 95, tier: 'luxury', skinTypes: ['dry', 'sensitive'], concerns: ['hydration', 'barrier repair'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/tr:w-344,h-344,cm-pad_resize/5/1/5192623LANEI00000340_1.jpg',
    description: 'Ultra-rich cream cleanser for dry winter skin.',
  },
  {
    id: 'p3', name: 'Vitamin C Serum', brand: 'Skinceuticals', category: 'serum', nykaaCategory: 'Skin',
    ingredients: ['L-Ascorbic Acid', 'Vitamin E', 'Ferulic Acid'],
    price: 166, tier: 'luxury', skinTypes: ['all'], concerns: ['brightening', 'anti-aging'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/tr:w-344,h-344,cm-pad_resize/3/9/394e9c5MINIM00000008_a.jpg',
    description: 'Gold-standard Vitamin C serum for radiance.',
  },
  {
    id: 'p4', name: 'Niacinamide Serum', brand: 'The Ordinary', category: 'serum', nykaaCategory: 'Skin',
    ingredients: ['Niacinamide', 'Zinc PCA'],
    price: 6, tier: 'budget', skinTypes: ['oily', 'combination'], concerns: ['pores', 'oil control'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/8/8/88a48a1THECI00000026_1.jpg?tr=w-344,h-344,cm-pad_resize',
    description: 'Affordable pore-minimizing serum.',
  },
  {
    id: 'p5', name: 'SPF 50 Mineral Sunscreen', brand: 'Supergoop', category: 'sunscreen', nykaaCategory: 'Skin',
    ingredients: ['Zinc Oxide', 'Titanium Dioxide', 'Vitamin E'],
    price: 36, tier: 'mid', skinTypes: ['all'], concerns: ['sun protection'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/tr:w-344,h-344,cm-pad_resize/6/8/68674ef816218022976_1.jpg',
    description: 'Lightweight mineral sunscreen, no white cast.',
  },
  {
    id: 'p6', name: 'Retinol Renewal Serum', brand: "Paula's Choice", category: 'serum', nykaaCategory: 'Skin',
    ingredients: ['Retinol', 'Peptides', 'Vitamin C'],
    price: 38, tier: 'mid', skinTypes: ['normal', 'combination'], concerns: ['anti-aging', 'texture'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/tr:w-344,h-344,cm-pad_resize/3/b/3b927f1PAULA00000019_1.jpg',
    description: 'Gentle retinol for evening use. Do not mix with strong actives.',
  },
  {
    id: 'p7', name: 'BHA Liquid Exfoliant', brand: "Paula's Choice", category: 'exfoliant', nykaaCategory: 'Skin',
    ingredients: ['Salicylic Acid', 'Green Tea Extract'],
    price: 32, tier: 'mid', skinTypes: ['oily', 'combination'], concerns: ['acne', 'pores'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/tr:w-344,h-344,cm-pad_resize/0/c/0cf373fPAULA00000011_1a.jpg',
    description: 'Cult-favorite BHA for unclogging pores.',
  },
  {
    id: 'p13', name: 'Barrier Repair Moisturizer', brand: 'Dr. Jart+', category: 'moisturizer', nykaaCategory: 'Skin',
    ingredients: ['Ceramides', 'Madecassoside', 'Shea Butter'],
    price: 52, tier: 'mid', skinTypes: ['dry', 'sensitive'], concerns: ['barrier repair', 'hydration'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/tr:w-344,h-344,cm-pad_resize/4/9/4935a968809844993101_1.jpg',
    description: 'Ceramide-rich cream to restore damaged barriers.',
  },
  {
    id: 'p14', name: 'Azelaic Acid Suspension', brand: 'The Ordinary', category: 'serum', nykaaCategory: 'Skin',
    ingredients: ['Azelaic Acid'],
    price: 8, tier: 'budget', skinTypes: ['all'], concerns: ['acne', 'redness'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/tr:w-344,h-344,cm-pad_resize/2/f/2f64156769915195682_1.jpg',
    description: 'Gentle multi-tasker for acne and uneven skin tone.',
  },
  {
    id: 'p15', name: 'Fragrance Serum Elixir', brand: 'Dior', category: 'serum', nykaaCategory: 'Skin',
    ingredients: ['Rose Extract', 'Fragrance', 'Glycerin'],
    price: 120, tier: 'luxury', skinTypes: ['normal'], concerns: ['hydration'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/tr:w-344,h-344,cm-pad_resize/4/b/4bb7f10887167485495_1.jpg',
    description: 'Luxurious fragranced serum. Not for sensitive skin.',
  },

  // ─── HAIR ───
  {
    id: 'p8', name: 'Jasmine Hair Oil', brand: 'Moroccanoil', category: 'oil', nykaaCategory: 'Hair',
    ingredients: ['Argan Oil', 'Jasmine Extract', 'Fragrance'],
    price: 48, tier: 'mid', skinTypes: ['all'], concerns: ['hair hydration'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/tr:w-344,h-344,cm-pad_resize/a/7/a7f9cef290011521011_1711231.jpg',
    description: 'Rich nourishing hair oil. Contains fragrance.',
  },
  {
    id: 'p9', name: 'Light Argan Mist', brand: 'Moroccanoil', category: 'oil', nykaaCategory: 'Hair',
    ingredients: ['Argan Oil', 'Cyclomethicone'],
    price: 34, tier: 'mid', skinTypes: ['all'], concerns: ['hair hydration'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/tr:w-344,h-344,cm-pad_resize/a/7/a7f9cef7290011521653_1711231.jpg',
    description: 'Lightweight spray oil ideal for humid climates.',
  },
  {
    id: 'h1', name: 'Anti-Hairfall Shampoo', brand: "L'Oréal Professionnel", category: 'shampoo', nykaaCategory: 'Hair',
    ingredients: ['Aminexil', 'Omega-6', 'Biotin'],
    price: 22, tier: 'mid', skinTypes: ['all'], concerns: ['hair fall'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/tr:w-344,h-344,cm-pad_resize/2/0/20344a2LP_v8901526102327_v1.jpg',
    description: 'Strengthens hair from root to tip, reduces hair fall.',
  },
  {
    id: 'h2', name: 'Keratin Smooth Conditioner', brand: 'TRESemmé', category: 'conditioner', nykaaCategory: 'Hair',
    ingredients: ['Keratin', 'Argan Oil', 'Marula Oil'],
    price: 8, tier: 'budget', skinTypes: ['all'], concerns: ['frizz control'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/tr:w-344,h-344,cm-pad_resize/6/c/6c1a17c8901030655852_0.jpg',
    description: 'Salon-smooth finish with keratin protein complex.',
  },
  {
    id: 'h3', name: 'Onion Hair Mask', brand: 'WOW Skin Science', category: 'mask', nykaaCategory: 'Hair',
    ingredients: ['Red Onion Seed Oil', 'Black Seed Oil', 'Pro-Vitamin B5'],
    price: 12, tier: 'budget', skinTypes: ['all'], concerns: ['hair growth'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/tr:w-344,h-344,cm-pad_resize/b/d/bd00d77WOWXX00000029_1.jpg',
    description: 'Deep conditioning mask that promotes hair growth.',
  },

  // ─── MAKEUP ───
  {
    id: 'p10', name: 'Studio Fix Foundation NC35', brand: 'MAC', category: 'foundation', nykaaCategory: 'Makeup',
    ingredients: ['Silica', 'Dimethicone', 'Iron Oxides'],
    price: 40, tier: 'mid', skinTypes: ['all'], concerns: ['coverage'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/e/7/e76fbdfMACXX00001523_1.jpg?tr=w-344,h-344,cm-pad_resize',
    description: 'Medium-to-full coverage foundation. Shade NC35.',
  },
  {
    id: 'p11', name: 'Matte Lip Kit — Date Night', brand: 'Charlotte Tilbury', category: 'makeup', nykaaCategory: 'Makeup',
    ingredients: ['Jojoba Oil', 'Vitamin E', 'Iron Oxides'],
    price: 34, tier: 'mid', skinTypes: ['all'], concerns: ['makeup'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/tr:w-344,h-344,cm-pad_resize/5/8/58f72865060542728485_1.jpg',
    description: 'Iconic matte lip in Pillow Talk shade.',
  },
  {
    id: 'p12', name: 'Setting Spray — Date Night', brand: 'Urban Decay', category: 'makeup', nykaaCategory: 'Makeup',
    ingredients: ['Aloe Vera', 'Green Tea Extract'],
    price: 33, tier: 'mid', skinTypes: ['all'], concerns: ['makeup longevity'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/tr:w-344,h-344,cm-pad_resize/6/2/62b7d6eURBAP00000046_1.png',
    description: 'All Nighter setting spray for 16-hour wear.',
  },
  {
    id: 'm1', name: 'Colossal Kajal', brand: 'Maybelline', category: 'makeup', nykaaCategory: 'Makeup',
    ingredients: ['Carbon Black', 'Castor Oil', 'Vitamin E'],
    price: 4, tier: 'budget', skinTypes: ['all'], concerns: ['eye makeup'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/tr:w-344,h-344,cm-pad_resize/a/3/a398c606946537005757-newadd_1.jpg',
    description: 'Intense black kajal, 24-hour smudge-proof.',
  },
  {
    id: 'm2', name: 'Fit Me Compact Powder', brand: 'Maybelline', category: 'makeup', nykaaCategory: 'Makeup',
    ingredients: ['Silica', 'Talc', 'Zinc Stearate'],
    price: 7, tier: 'budget', skinTypes: ['oily', 'combination'], concerns: ['oil control'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/tr:w-344,h-344,cm-pad_resize/c/c/cc52d3141554433784-new25_1.jpg',
    description: 'Poreless, matte finish. Shade 230 Natural Buff.',
  },
  {
    id: 'm3', name: 'Lash Sensational Mascara', brand: 'Maybelline', category: 'makeup', nykaaCategory: 'Makeup',
    ingredients: ['Beeswax', 'Carnauba Wax', 'Iron Oxides'],
    price: 10, tier: 'budget', skinTypes: ['all'], concerns: ['lash volume'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/0/0/00bbb89MAYBE00000375_1.jpg?tr=w-344,h-344,cm-pad_resize',
    description: 'Fan-out fanning brush for a full-fan effect.',
  },

  // ─── BATH & BODY ───
  {
    id: 'bb1', name: 'Japanese Cherry Blossom Shower Gel', brand: 'Bath & Body Works', category: 'body-wash', nykaaCategory: 'Bath & Body',
    ingredients: ['Aloe Leaf Juice', 'Shea Butter', 'Vitamin E'],
    price: 14, tier: 'mid', skinTypes: ['all'], concerns: ['body cleansing'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/tr:w-344,h-344,cm-pad_resize/f/9/f9157ba667559118718.jpg',
    description: 'Rich lathering shower gel with iconic cherry blossom scent.',
  },
  {
    id: 'bb2', name: 'Cocoa Butter Body Lotion', brand: 'Vaseline', category: 'body-lotion', nykaaCategory: 'Bath & Body',
    ingredients: ['Cocoa Butter', 'Micro-Droplets of Vaseline Jelly', 'Glycerin'],
    price: 6, tier: 'budget', skinTypes: ['dry'], concerns: ['body moisturizing'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/tr:w-344,h-344,cm-pad_resize/1/7/17def8f27441_H-8901030971921.jpg',
    description: 'Deep moisture for dry, rough skin. 48-hour lock-in.',
  },
  {
    id: 'bb3', name: 'Coffee Body Scrub', brand: 'mCaffeine', category: 'body-wash', nykaaCategory: 'Bath & Body',
    ingredients: ['Arabica Coffee', 'Coconut Oil', 'Vitamin E'],
    price: 10, tier: 'budget', skinTypes: ['all'], concerns: ['exfoliation', 'tan removal'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/tr:w-344,h-344,cm-pad_resize/1/1/1185643NYKMCF0000002_01.jpg',
    description: 'Exfoliating body scrub that removes tan and dead skin.',
  },

  // ─── NATURAL ───
  {
    id: 'n1', name: 'Kumkumadi Tailam Face Oil', brand: 'Kama Ayurveda', category: 'oil', nykaaCategory: 'Natural',
    ingredients: ['Saffron', 'Sesame Oil', 'Vetiver'],
    price: 35, tier: 'mid', skinTypes: ['all'], concerns: ['brightening', 'anti-aging'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/tr:w-344,h-344,cm-pad_resize/e/2/e228029KAMAA00000347_v1.jpg',
    description: 'Ayurvedic miracle oil for glowing, youthful skin.',
  },
  {
    id: 'n2', name: 'Aloe Vera Gel', brand: 'Khadi Natural', category: 'moisturizer', nykaaCategory: 'Natural',
    ingredients: ['Aloe Vera Extract', 'Vitamin E'],
    price: 5, tier: 'budget', skinTypes: ['all'], concerns: ['soothing', 'hydration'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/tr:w-344,h-344,cm-pad_resize/c/d/cdf7081KHAAC00000008_1a.jpg',
    description: 'Pure aloe gel for face, body, and hair.',
  },
  {
    id: 'n3', name: 'Rose Water Toner', brand: 'Forest Essentials', category: 'toner', nykaaCategory: 'Natural',
    ingredients: ['Steam-Distilled Rose Water', 'Glycerin'],
    price: 18, tier: 'mid', skinTypes: ['all'], concerns: ['toning', 'refreshing'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/tr:w-344,h-344,cm-pad_resize/a/0/a0cf8738904153391751_1.jpg',
    description: 'Pure rose water to hydrate and tone skin naturally.',
  },

  // ─── MOM & BABY ───
  {
    id: 'mb1', name: 'Baby Gentle Wash', brand: 'Mamaearth', category: 'baby-care', nykaaCategory: 'Mom & Baby',
    ingredients: ['Oat Protein', 'Coconut-Based Cleansers', 'Calendula'],
    price: 8, tier: 'budget', skinTypes: ['sensitive'], concerns: ['gentle cleansing'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/tr:w-344,h-344,cm-pad_resize/7/e/7e77c2bMAMAE00000871_1.jpg',
    description: 'Tear-free, toxin-free wash for delicate baby skin.',
  },
  {
    id: 'mb2', name: 'Stretch Mark Cream', brand: 'Bio-Oil', category: 'moisturizer', nykaaCategory: 'Mom & Baby',
    ingredients: ['PurCellin Oil', 'Vitamin A', 'Calendula Oil'],
    price: 15, tier: 'mid', skinTypes: ['all'], concerns: ['stretch marks'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/tr:w-344,h-344,cm-pad_resize/9/f/9fc94ceNYBO000000001-n1.jpg',
    description: 'Clinically proven to improve appearance of stretch marks.',
  },
  {
    id: 'mb3', name: 'Baby Sunscreen SPF 30', brand: 'Cetaphil Baby', category: 'sunscreen', nykaaCategory: 'Mom & Baby',
    ingredients: ['Zinc Oxide', 'Organic Sunflower Oil', 'Vitamin E'],
    price: 12, tier: 'mid', skinTypes: ['sensitive'], concerns: ['sun protection'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/tr:w-344,h-344,cm-pad_resize/9/f/9f1f6bfAVEEN00000021_1a.jpg',
    description: 'Mineral sunscreen safe for babies 6 months and up.',
  },

  // ─── HEALTH & WELLNESS ───
  {
    id: 'hw1', name: 'Biotin Hair Gummies', brand: 'Sugar Bear Hair', category: 'supplement', nykaaCategory: 'Health & Wellness',
    ingredients: ['Biotin', 'Folic Acid', 'Vitamin D'],
    price: 30, tier: 'mid', skinTypes: ['all'], concerns: ['hair growth'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/tr:w-344,h-344,cm-pad_resize/1/e/1e8365aNYKKPA0000010_1.jpg',
    description: 'Tasty gummy vitamins for thicker, longer hair.',
  },
  {
    id: 'hw2', name: 'Collagen Powder', brand: 'Vital Proteins', category: 'supplement', nykaaCategory: 'Health & Wellness',
    ingredients: ['Bovine Collagen Peptides', 'Vitamin C', 'Hyaluronic Acid'],
    price: 45, tier: 'mid', skinTypes: ['all'], concerns: ['skin elasticity', 'joint health'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/tr:w-344,h-344,cm-pad_resize/5/8/58403b9IL00317_0910_1.jpg',
    description: 'Grass-fed collagen peptides for skin, hair, nails & joints.',
  },
  {
    id: 'hw3', name: 'Omega-3 Fish Oil', brand: 'HealthKart', category: 'supplement', nykaaCategory: 'Health & Wellness',
    ingredients: ['EPA', 'DHA', 'Vitamin E'],
    price: 12, tier: 'budget', skinTypes: ['all'], concerns: ['heart health', 'skin health'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/tr:w-344,h-344,cm-pad_resize/a/y/ayurslim-offer-pack-3-1_1_.jpg',
    description: 'High-potency fish oil for overall wellness.',
  },

  // ─── MEN ───
  {
    id: 'mn1', name: 'Charcoal Face Wash', brand: 'Bombay Shaving Company', category: 'cleanser', nykaaCategory: 'Men',
    ingredients: ['Activated Charcoal', 'Tea Tree Oil', 'Aloe Vera'],
    price: 8, tier: 'budget', skinTypes: ['oily'], concerns: ['deep cleansing', 'oil control'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/tr:w-344,h-344,cm-pad_resize/8/e/8eeaaad655172771762_01.jpg',
    description: 'Deep-cleansing charcoal face wash for men.',
  },
  {
    id: 'mn2', name: 'Beard Growth Oil', brand: 'Ustraa', category: 'oil', nykaaCategory: 'Men',
    ingredients: ['Redensyl', 'Jojoba Oil', 'Vitamin E'],
    price: 10, tier: 'budget', skinTypes: ['all'], concerns: ['beard growth'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/tr:w-344,h-344,cm-pad_resize/a/0/a05d9a68904223819161_1.jpg',
    description: 'Promotes thicker, fuller beard growth in 8 weeks.',
  },
  {
    id: 'mn3', name: 'Anti-Acne Face Moisturizer', brand: 'Man Matters', category: 'moisturizer', nykaaCategory: 'Men',
    ingredients: ['Niacinamide', 'Salicylic Acid', 'Tea Tree Oil'],
    price: 12, tier: 'budget', skinTypes: ['oily', 'combination'], concerns: ['acne', 'oil control'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/tr:w-344,h-344,cm-pad_resize/6/5/65ec92fMANMA00000016_1.jpg',
    description: 'Lightweight moisturizer that fights acne without greasiness.',
  },

  // ─── FRAGRANCE ───
  {
    id: 'f1', name: 'Black Opium EDP', brand: 'YSL', category: 'perfume', nykaaCategory: 'Fragrance',
    ingredients: ['Black Coffee', 'White Flowers', 'Vanilla'],
    price: 95, tier: 'luxury', skinTypes: ['all'], concerns: ['fragrance'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/tr:w-344,h-344,cm-pad_resize/b/2/b2d22863614274076202_1.jpg',
    description: "Rock'n'roll meets sweetness — addictive coffee-vanilla scent.",
  },
  {
    id: 'f2', name: 'Sauvage EDT', brand: 'Dior', category: 'perfume', nykaaCategory: 'Fragrance',
    ingredients: ['Bergamot', 'Ambroxan', 'Pepper'],
    price: 110, tier: 'luxury', skinTypes: ['all'], concerns: ['fragrance'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/tr:w-344,h-344,cm-pad_resize/d/b/db992ab3348901368247.jpg',
    description: 'Fresh, raw, noble. The iconic men\'s fragrance.',
  },
  {
    id: 'f3', name: 'Cherry Blossom Body Mist', brand: 'The Body Shop', category: 'perfume', nykaaCategory: 'Fragrance',
    ingredients: ['Cherry Blossom Extract', 'Alcohol Denat.'],
    price: 12, tier: 'budget', skinTypes: ['all'], concerns: ['light fragrance'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/tr:w-344,h-344,cm-pad_resize/1/e/1e24349E000308_1.jpg',
    description: 'Light, floral everyday body mist.',
  },

  // ─── APPLIANCES ───
  {
    id: 'a1', name: 'Ionic Hair Dryer 2200W', brand: 'Philips', category: 'hair-tool', nykaaCategory: 'Appliances',
    ingredients: ['Ionic Technology', 'Ceramic Heating'],
    price: 35, tier: 'mid', skinTypes: ['all'], concerns: ['hair styling'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/tr:w-344,h-344,cm-pad_resize/8/b/8bb0891NYPHILIPS0032_1.jpg',
    description: 'Fast-dry with ionic tech for frizz-free results.',
  },
  {
    id: 'a2', name: 'Keratin Protect Straightener', brand: 'Philips', category: 'hair-tool', nykaaCategory: 'Appliances',
    ingredients: ['Keratin-Infused Plates', 'Ceramic Coating'],
    price: 55, tier: 'mid', skinTypes: ['all'], concerns: ['hair straightening'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/tr:w-344,h-344,cm-pad_resize/3/4/340ec41PHIAA00000192_1.jpg',
    description: 'Infuses keratin while styling. Up to 230°C.',
  },
  {
    id: 'a3', name: 'Facial Cleansing Brush', brand: 'FOREO Luna', category: 'hair-tool', nykaaCategory: 'Appliances',
    ingredients: ['Silicone Touchpoints', 'T-Sonic Pulsations'],
    price: 80, tier: 'luxury', skinTypes: ['all'], concerns: ['deep cleansing'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/tr:w-344,h-344,cm-pad_resize/b/6/b651ee77350092139427_1.jpg',
    description: 'Silicone facial brush — 99.5% of dirt & oil removed.',
  },

  // ─── LINGERIE & ACCESSORIES ───
  {
    id: 'la1', name: 'Everyday Cotton Bralette', brand: 'Nykd by Nykaa', category: 'lingerie', nykaaCategory: 'Lingerie & Accessories',
    ingredients: ['95% Cotton', '5% Spandex'],
    price: 14, tier: 'budget', skinTypes: ['all'], concerns: ['comfort'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/tr:w-344,h-344,cm-pad_resize/4/f/4f42baf8904245706586_1.jpg',
    description: 'Soft cotton bralette for everyday comfort. Wire-free.',
  },
  {
    id: 'la2', name: 'Silk Sleep Mask', brand: 'Nykaa', category: 'accessory', nykaaCategory: 'Lingerie & Accessories',
    ingredients: ['100% Mulberry Silk'],
    price: 10, tier: 'budget', skinTypes: ['all'], concerns: ['sleep quality'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/tr:w-344,h-344,cm-pad_resize/0/a/0a3ad36NYBRONSON0060_1.jpg',
    description: 'Pure silk sleep mask — gentle on skin and lashes.',
  },
  {
    id: 'la3', name: 'Jade Face Roller', brand: 'Nykaa Naturals', category: 'accessory', nykaaCategory: 'Lingerie & Accessories',
    ingredients: ['Natural Jade Stone'],
    price: 15, tier: 'mid', skinTypes: ['all'], concerns: ['de-puffing', 'lymphatic drainage'],
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/tr:w-344,h-344,cm-pad_resize/f/1/f138990THEAC00000484ab_ab1.jpg',
    description: 'Dual-ended jade roller for face and under-eye.',
  },
];

// ── Pre-built routines ──
export const routines: Routine[] = [
  {
    id: 'r1', name: 'Winter Hydration Routine', description: 'Rich, protective routine for cold, dry weather.',
    goal: 'Dry Skin Relief', skinType: 'dry',
    steps: [
      { order: 1, productId: 'p2', timeOfDay: 'both', instruction: 'Massage onto damp skin for 60s' },
      { order: 2, productId: 'p3', timeOfDay: 'morning', instruction: 'Apply 4 drops to face and neck' },
      { order: 3, productId: 'p13', timeOfDay: 'both', instruction: "Press into skin, don't rub" },
      { order: 4, productId: 'p5', timeOfDay: 'morning', instruction: 'Apply generously as final step' },
    ],
  },
  {
    id: 'r2', name: 'Hormonal Acne Protocol', description: '3-step BHA-based routine targeting hormonal breakouts.',
    goal: 'Hormonal Acne', skinType: 'oily',
    steps: [
      { order: 1, productId: 'p1', timeOfDay: 'both', instruction: 'Double cleanse in the evening' },
      { order: 2, productId: 'p7', timeOfDay: 'evening', instruction: 'Apply with cotton pad, avoid eyes' },
      { order: 3, productId: 'p14', timeOfDay: 'morning', instruction: 'Apply thin layer to affected areas' },
    ],
  },
  {
    id: 'r3', name: 'Date Night Glam', description: 'Curated set for a flawless evening look.',
    goal: 'Date Night', skinType: 'all',
    steps: [
      { order: 1, productId: 'p10', timeOfDay: 'evening', instruction: 'Apply with damp beauty sponge' },
      { order: 2, productId: 'p11', timeOfDay: 'evening', instruction: 'Line and fill lips' },
      { order: 3, productId: 'p12', timeOfDay: 'evening', instruction: 'Hold 6 inches away, mist in X pattern' },
    ],
  },
];

// ── Ingredient safety data ──
export const ingredientConflicts: Record<string, string[]> = {
  'Retinol': ['Vitamin C', 'AHA', 'BHA', 'Benzoyl Peroxide'],
  'Vitamin C': ['Retinol', 'Niacinamide'],
  'AHA': ['Retinol', 'Vitamin C'],
  'BHA': ['Retinol'],
};

// ── Mock weather ──
export const mockWeather: WeatherData = {
  temperature: 28,
  humidity: 82,
  uvIndex: 7,
  condition: 'Humid & Warm',
};

// ── 10 Pre-loaded scenarios ──
export const scenarios: Scenario[] = [
  {
    id: 's1', title: 'Winter Dryness Detected', type: 'swap',
    description: 'Your skin profile shows "Dry." We\'ve swapped your Gel Cleanser → Rich Cream Cleanser for winter.',
    active: true, severity: 'success', relatedProductIds: ['p1', 'p2'],
    actionLabel: 'View Swap',
  },
  {
    id: 's2', title: 'Allergy Guard: Fragrance Blocked', type: 'guard',
    description: 'Fragrance Serum Elixir by Dior has been blocked — contains "Fragrance," which is on your allergy list.',
    active: true, severity: 'critical', relatedProductIds: ['p15'],
    actionLabel: 'View Details',
  },
  {
    id: 's3', title: 'Sunscreen Running Low', type: 'alert',
    description: 'Your Supergoop SPF 50 is at 10% remaining. At your usage rate, you have ~3 days left.',
    active: true, severity: 'warning', relatedProductIds: ['p5'],
    actionLabel: 'Reorder Now',
  },
  {
    id: 's4', title: 'Climate Nudge: Switch to Lighter Oil', type: 'nudge',
    description: 'Humidity is above 80%. We recommend switching from Jasmine Hair Oil → Light Argan Mist.',
    active: true, severity: 'info', relatedProductIds: ['p8', 'p9'],
    actionLabel: 'Apply Swap',
  },
  {
    id: 's5', title: 'Date Night Intent Activated', type: 'intent',
    description: 'Your "Date Night Glam" routine has been curated: Foundation, Lip Kit, Setting Spray.',
    active: true, severity: 'success', relatedProductIds: ['p10', 'p11', 'p12'],
    actionLabel: 'View Routine',
  },
  {
    id: 's6', title: 'Acne Goal: BHA Routine Ready', type: 'goal',
    description: 'Based on your "Hormonal Acne" goal, a 3-step BHA protocol has been generated.',
    active: true, severity: 'success', relatedProductIds: ['p1', 'p7', 'p14'],
    actionLabel: 'Start Routine',
  },
  {
    id: 's7', title: 'Shade Match: MAC NC35', type: 'shade',
    description: 'Digital Twin analysis matched you to MAC Studio Fix NC35 — warm undertone, medium depth.',
    active: true, severity: 'info', relatedProductIds: ['p10'],
    actionLabel: 'View Match',
  },
  {
    id: 's8', title: 'Ingredient Conflict Detected', type: 'conflict',
    description: 'Adding Retinol Renewal Serum alongside your Vitamin C Serum creates an active conflict. Use on alternate nights.',
    active: true, severity: 'warning', relatedProductIds: ['p6', 'p3'],
    actionLabel: 'Resolve',
  },
  {
    id: 's9', title: 'Budget Smart-Swap Available', type: 'budget',
    description: 'You selected Skinceuticals Vitamin C ($166). The Ordinary offers a similar formula for $6.',
    active: true, severity: 'info', relatedProductIds: ['p3', 'p4'],
    actionLabel: 'See Dupe',
  },
  {
    id: 's10', title: 'Wedding in 10 Days', type: 'calendar',
    description: 'Your wedding is in 10 days. A "Wedding-Ready" prep routine with express delivery has been assembled.',
    active: true, severity: 'success', relatedProductIds: ['p10', 'p13', 'p3'],
    actionLabel: 'View Plan',
  },
];
