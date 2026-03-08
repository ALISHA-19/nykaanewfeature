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
  usageRatePerDay: number; // percent per day
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
  {
    id: 'p1', name: 'Hydra Gel Cleanser', brand: 'CeraVe', category: 'cleanser',
    ingredients: ['Hyaluronic Acid', 'Ceramides', 'Glycerin'],
    price: 16, tier: 'budget', skinTypes: ['oily', 'combination'], concerns: ['hydration'],
    description: 'Lightweight gel cleanser that maintains skin barrier.',
  },
  {
    id: 'p2', name: 'Rich Cream Cleanser', brand: 'La Mer', category: 'cleanser',
    ingredients: ['Miracle Broth', 'Lime Tea Extract', 'Shea Butter'],
    price: 95, tier: 'luxury', skinTypes: ['dry', 'sensitive'], concerns: ['hydration', 'barrier repair'],
    description: 'Ultra-rich cream cleanser for dry winter skin.',
  },
  {
    id: 'p3', name: 'Vitamin C Serum', brand: 'Skinceuticals', category: 'serum',
    ingredients: ['L-Ascorbic Acid', 'Vitamin E', 'Ferulic Acid'],
    price: 166, tier: 'luxury', skinTypes: ['all'], concerns: ['brightening', 'anti-aging'],
    description: 'Gold-standard Vitamin C serum for radiance.',
  },
  {
    id: 'p4', name: 'Niacinamide Serum', brand: 'The Ordinary', category: 'serum',
    ingredients: ['Niacinamide', 'Zinc PCA'],
    price: 6, tier: 'budget', skinTypes: ['oily', 'combination'], concerns: ['pores', 'oil control'],
    description: 'Affordable pore-minimizing serum.',
  },
  {
    id: 'p5', name: 'SPF 50 Mineral Sunscreen', brand: 'Supergoop', category: 'sunscreen',
    ingredients: ['Zinc Oxide', 'Titanium Dioxide', 'Vitamin E'],
    price: 36, tier: 'mid', skinTypes: ['all'], concerns: ['sun protection'],
    description: 'Lightweight mineral sunscreen, no white cast.',
  },
  {
    id: 'p6', name: 'Retinol Renewal Serum', brand: 'Paula\'s Choice', category: 'serum',
    ingredients: ['Retinol', 'Peptides', 'Vitamin C'],
    price: 38, tier: 'mid', skinTypes: ['normal', 'combination'], concerns: ['anti-aging', 'texture'],
    description: 'Gentle retinol for evening use. Do not mix with strong actives.',
  },
  {
    id: 'p7', name: 'BHA Liquid Exfoliant', brand: 'Paula\'s Choice', category: 'exfoliant',
    ingredients: ['Salicylic Acid', 'Green Tea Extract'],
    price: 32, tier: 'mid', skinTypes: ['oily', 'combination'], concerns: ['acne', 'pores'],
    description: 'Cult-favorite BHA for unclogging pores.',
  },
  {
    id: 'p8', name: 'Jasmine Hair Oil', brand: 'Moroccanoil', category: 'oil',
    ingredients: ['Argan Oil', 'Jasmine Extract', 'Fragrance'],
    price: 48, tier: 'mid', skinTypes: ['all'], concerns: ['hair hydration'],
    description: 'Rich nourishing hair oil. Contains fragrance.',
  },
  {
    id: 'p9', name: 'Light Argan Mist', brand: 'Moroccanoil', category: 'oil',
    ingredients: ['Argan Oil', 'Cyclomethicone'],
    price: 34, tier: 'mid', skinTypes: ['all'], concerns: ['hair hydration'],
    description: 'Lightweight spray oil ideal for humid climates.',
  },
  {
    id: 'p10', name: 'Studio Fix Foundation NC35', brand: 'MAC', category: 'foundation',
    ingredients: ['Silica', 'Dimethicone', 'Iron Oxides'],
    price: 40, tier: 'mid', skinTypes: ['all'], concerns: ['coverage'],
    description: 'Medium-to-full coverage foundation. Shade NC35.',
  },
  {
    id: 'p11', name: 'Matte Lip Kit — Date Night', brand: 'Charlotte Tilbury', category: 'makeup',
    ingredients: ['Jojoba Oil', 'Vitamin E', 'Iron Oxides'],
    price: 34, tier: 'mid', skinTypes: ['all'], concerns: ['makeup'],
    description: 'Iconic matte lip in Pillow Talk shade.',
  },
  {
    id: 'p12', name: 'Setting Spray — Date Night', brand: 'Urban Decay', category: 'makeup',
    ingredients: ['Aloe Vera', 'Green Tea Extract'],
    price: 33, tier: 'mid', skinTypes: ['all'], concerns: ['makeup longevity'],
    description: 'All Nighter setting spray for 16-hour wear.',
  },
  {
    id: 'p13', name: 'Barrier Repair Moisturizer', brand: 'Dr. Jart+', category: 'moisturizer',
    ingredients: ['Ceramides', 'Madecassoside', 'Shea Butter'],
    price: 52, tier: 'mid', skinTypes: ['dry', 'sensitive'], concerns: ['barrier repair', 'hydration'],
    description: 'Ceramide-rich cream to restore damaged barriers.',
  },
  {
    id: 'p14', name: 'Azelaic Acid Suspension', brand: 'The Ordinary', category: 'serum',
    ingredients: ['Azelaic Acid'],
    price: 8, tier: 'budget', skinTypes: ['all'], concerns: ['acne', 'redness'],
    description: 'Gentle multi-tasker for acne and uneven skin tone.',
  },
  {
    id: 'p15', name: 'Fragrance Serum Elixir', brand: 'Dior', category: 'serum',
    ingredients: ['Rose Extract', 'Fragrance', 'Glycerin'],
    price: 120, tier: 'luxury', skinTypes: ['normal'], concerns: ['hydration'],
    description: 'Luxurious fragranced serum. Not for sensitive skin.',
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
      { order: 3, productId: 'p13', timeOfDay: 'both', instruction: 'Press into skin, don\'t rub' },
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
