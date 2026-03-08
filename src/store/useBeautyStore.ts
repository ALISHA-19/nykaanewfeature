import { create } from 'zustand';
import {
  products, routines, scenarios, mockWeather, ingredientConflicts,
  type Product, type Routine, type Scenario, type InventoryItem, type WeatherData,
} from '@/data/mockDatabase';

interface UserProfile {
  name: string;
  skinType: string;
  goals: string[];
  allergies: string[];
  preferredTier: 'budget' | 'mid' | 'luxury';
  shadeMatch: string;
}

interface BeautyState {
  userProfile: UserProfile;
  inventory: InventoryItem[];
  activeRoutine: Routine | null;
  allRoutines: Routine[];
  allProducts: Product[];
  scenarios: Scenario[];
  weather: WeatherData;
  intentQuery: string;
  reorderQueue: string[];
  swappedProducts: Record<string, string>; // originalId -> newId

  setIntentQuery: (q: string) => void;
  processIntent: (q: string) => void;
  activateRoutine: (routineId: string) => void;
  dismissScenario: (scenarioId: string) => void;
  checkReplenishment: () => InventoryItem[];
  validateIngredients: (productId: string) => { safe: boolean; reason?: string };
  recommendAlternatives: (productId: string) => Product[];
  getProductById: (id: string) => Product | undefined;
  reorderProduct: (productId: string) => void;
  swapProduct: (fromId: string, toId: string) => void;
  executeScenarioAction: (scenarioId: string) => { action: string; data?: any };
}

export const useBeautyStore = create<BeautyState>((set, get) => ({
  userProfile: {
    name: 'Aria',
    skinType: 'dry',
    goals: ['Hormonal Acne', 'Brightening'],
    allergies: ['Fragrance'],
    preferredTier: 'luxury',
    shadeMatch: 'MAC NC35',
  },

  inventory: [
    { productId: 'p1', purchaseDate: '2025-12-01', remainingPercent: 65, usageRatePerDay: 1.2 },
    { productId: 'p3', purchaseDate: '2025-11-15', remainingPercent: 40, usageRatePerDay: 0.8 },
    { productId: 'p5', purchaseDate: '2026-01-10', remainingPercent: 10, usageRatePerDay: 3 },
    { productId: 'p8', purchaseDate: '2025-10-20', remainingPercent: 25, usageRatePerDay: 1.5 },
    { productId: 'p13', purchaseDate: '2026-02-01', remainingPercent: 72, usageRatePerDay: 0.9 },
  ],

  activeRoutine: routines[0],
  allRoutines: routines,
  allProducts: products,
  scenarios: scenarios,
  weather: mockWeather,
  intentQuery: '',
  reorderQueue: [],
  swappedProducts: {},

  setIntentQuery: (q) => set({ intentQuery: q }),

  processIntent: (q) => {
    const lower = q.toLowerCase();
    const state = get();
    if (lower.includes('acne') || lower.includes('breakout')) {
      const r = state.allRoutines.find(r => r.goal === 'Hormonal Acne');
      if (r) set({ activeRoutine: r, intentQuery: q });
    } else if (lower.includes('date') || lower.includes('glam') || lower.includes('night out')) {
      const r = state.allRoutines.find(r => r.goal === 'Date Night');
      if (r) set({ activeRoutine: r, intentQuery: q });
    } else if (lower.includes('dry') || lower.includes('hydrat') || lower.includes('winter') || lower.includes('dull')) {
      const r = state.allRoutines.find(r => r.goal === 'Dry Skin Relief');
      if (r) set({ activeRoutine: r, intentQuery: q });
    }
    set({ intentQuery: q });
  },

  activateRoutine: (routineId) => {
    const r = get().allRoutines.find(r => r.id === routineId);
    if (r) set({ activeRoutine: r });
  },

  dismissScenario: (scenarioId) => {
    set(s => ({ scenarios: s.scenarios.map(sc => sc.id === scenarioId ? { ...sc, active: false } : sc) }));
  },

  checkReplenishment: () => {
    return get().inventory.filter(item => item.remainingPercent < 15);
  },

  validateIngredients: (productId) => {
    const product = get().allProducts.find(p => p.id === productId);
    if (!product) return { safe: true };
    const { allergies } = get().userProfile;
    const blocked = product.ingredients.filter(i => allergies.some(a => i.toLowerCase().includes(a.toLowerCase())));
    if (blocked.length > 0) return { safe: false, reason: `Contains allergen: ${blocked.join(', ')}` };

    // Check conflicts with active routine
    const routine = get().activeRoutine;
    if (routine) {
      const routineProducts = routine.steps.map(s => get().allProducts.find(p => p.id === s.productId)).filter(Boolean) as Product[];
      const routineIngredients = routineProducts.flatMap(p => p.ingredients);
      for (const ing of product.ingredients) {
        const conflicts = ingredientConflicts[ing];
        if (conflicts) {
          const found = routineIngredients.filter(ri => conflicts.includes(ri));
          if (found.length > 0) return { safe: false, reason: `${ing} conflicts with ${found.join(', ')} in your routine` };
        }
      }
    }
    return { safe: true };
  },

  recommendAlternatives: (productId) => {
    const product = get().allProducts.find(p => p.id === productId);
    if (!product) return [];
    return get().allProducts.filter(p =>
      p.id !== productId &&
      p.category === product.category &&
      p.tier !== product.tier
    ).slice(0, 3);
  },

  getProductById: (id) => get().allProducts.find(p => p.id === id),
}));
