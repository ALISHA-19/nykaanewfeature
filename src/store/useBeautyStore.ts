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
  swappedProducts: Record<string, string>;
  actionedScenarios: Record<string, string>; // scenarioId -> status label

  setIntentQuery: (q: string) => void;
  processIntent: (q: string) => void;
  activateRoutine: (routineId: string) => void;
  dismissScenario: (scenarioId: string) => void;
  markScenarioActioned: (scenarioId: string, label: string) => void;
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
  actionedScenarios: {},

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

  markScenarioActioned: (scenarioId, label) => {
    set(s => ({ actionedScenarios: { ...s.actionedScenarios, [scenarioId]: label } }));
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

  reorderProduct: (productId) => {
    set(s => ({
      reorderQueue: [...s.reorderQueue, productId],
      inventory: s.inventory.map(item =>
        item.productId === productId ? { ...item, remainingPercent: 100 } : item
      ),
    }));
  },

  swapProduct: (fromId, toId) => {
    set(s => {
      const newSwaps = { ...s.swappedProducts, [fromId]: toId };
      // Update active routine steps to use the new product
      const updatedRoutine = s.activeRoutine ? {
        ...s.activeRoutine,
        steps: s.activeRoutine.steps.map(step =>
          step.productId === fromId ? { ...step, productId: toId } : step
        ),
      } : null;
      return { swappedProducts: newSwaps, activeRoutine: updatedRoutine };
    });
  },

  executeScenarioAction: (scenarioId) => {
    const state = get();
    const scenario = state.scenarios.find(s => s.id === scenarioId);
    if (!scenario) return { action: 'none' };

    switch (scenario.type) {
      case 'swap': // Winter Dryness - swap gel to cream
        state.swapProduct('p1', 'p2');
        state.dismissScenario(scenarioId);
        return { action: 'swap', data: { from: 'p1', to: 'p2' } };

      case 'guard': // Allergy guard - show blocked product
        return { action: 'guard', data: { productId: scenario.relatedProductIds[0] } };

      case 'alert': // Sunscreen low - reorder
        return { action: 'reorder', data: { productId: scenario.relatedProductIds[0] } };

      case 'nudge': // Climate nudge - swap oils
        state.swapProduct('p8', 'p9');
        state.dismissScenario(scenarioId);
        return { action: 'swap', data: { from: 'p8', to: 'p9' } };

      case 'intent': // Date night
        state.activateRoutine('r3');
        state.dismissScenario(scenarioId);
        return { action: 'routine', data: { routineId: 'r3' } };

      case 'goal': // Acne goal
        state.activateRoutine('r2');
        state.dismissScenario(scenarioId);
        return { action: 'routine', data: { routineId: 'r2' } };

      case 'shade': // Shade match
        return { action: 'shade', data: { shade: state.userProfile.shadeMatch } };

      case 'conflict': // Ingredient conflict
        return { action: 'conflict', data: { products: scenario.relatedProductIds } };

      case 'budget': // Budget swap
        return { action: 'budget', data: { from: 'p3', to: 'p4' } };

      case 'calendar': // Wedding
        state.activateRoutine('r1');
        state.dismissScenario(scenarioId);
        return { action: 'routine', data: { routineId: 'r1' } };

      default:
        return { action: 'none' };
    }
  },
}));
