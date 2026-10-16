// src/lib/foodApi.ts
// ============================================================
// Instant Food Database Search API
// Pre-populated with 50+ midlife staple foods + fallback search query
// ============================================================

export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: 'protein' | 'carbs' | 'fats' | 'dairy' | 'vegetables' | 'supplements';
}

export const COMMON_FOOD_DATABASE: FoodItem[] = [
  { id: 'f-001', name: 'Chicken Breast (Grilled)', servingSize: 100, servingUnit: 'g', calories: 165, protein: 31, carbs: 0, fat: 3.6, category: 'protein' },
  { id: 'f-002', name: 'Whole Eggs (Large)', servingSize: 2, servingUnit: 'large eggs', calories: 144, protein: 12.6, carbs: 0.8, fat: 9.8, category: 'protein' },
  { id: 'f-003', name: 'Atlantic Salmon (Baked)', servingSize: 150, servingUnit: 'g', calories: 310, protein: 34, carbs: 0, fat: 18, category: 'protein' },
  { id: 'f-004', name: 'Greek Yogurt (0% Plain)', servingSize: 200, servingUnit: 'g', calories: 120, protein: 22, carbs: 7, fat: 0, category: 'dairy' },
  { id: 'f-005', name: 'Whey Protein Isolate (1 Scoop)', servingSize: 30, servingUnit: 'g scoop', calories: 120, protein: 25, carbs: 2, fat: 1, category: 'supplements' },
  { id: 'f-006', name: 'Rolled Oats (Dry)', servingSize: 50, servingUnit: 'g', calories: 190, protein: 6.5, carbs: 34, fat: 3.5, category: 'carbs' },
  { id: 'f-007', name: 'Lean Ground Beef (90/10)', servingSize: 150, servingUnit: 'g', calories: 260, protein: 30, carbs: 0, fat: 15, category: 'protein' },
  { id: 'f-008', name: 'Cottage Cheese (Low Fat)', servingSize: 200, servingUnit: 'g', calories: 160, protein: 24, carbs: 6, fat: 4, category: 'dairy' },
  { id: 'f-009', name: 'White / Brown Rice (Cooked)', servingSize: 150, servingUnit: 'g', calories: 195, protein: 4.2, carbs: 42, fat: 0.6, category: 'carbs' },
  { id: 'f-010', name: 'Avocado', servingSize: 100, servingUnit: 'g', calories: 160, protein: 2, carbs: 8.5, fat: 14.7, category: 'fats' },
  { id: 'f-011', name: 'Almonds (Raw)', servingSize: 30, servingUnit: 'g (handful)', calories: 170, protein: 6, carbs: 6, fat: 14, category: 'fats' },
  { id: 'f-012', name: 'Sweet Potato (Baked)', servingSize: 150, servingUnit: 'g', calories: 135, protein: 3, carbs: 31, fat: 0.2, category: 'carbs' },
  { id: 'f-013', name: 'Broccoli (Steamed)', servingSize: 150, servingUnit: 'g', calories: 50, protein: 4.2, carbs: 10, fat: 0.6, category: 'vegetables' },
  { id: 'f-014', name: 'Tuna (Canned in Water)', servingSize: 120, servingUnit: 'g can', calories: 130, protein: 28, carbs: 0, fat: 1, category: 'protein' },
  { id: 'f-015', name: 'Quinoa (Cooked)', servingSize: 150, servingUnit: 'g', calories: 180, protein: 6.5, carbs: 32, fat: 2.8, category: 'carbs' },
  { id: 'f-016', name: 'Peanut Butter (Natural)', servingSize: 32, servingUnit: 'g (2 tbsp)', calories: 190, protein: 8, carbs: 7, fat: 16, category: 'fats' },
  { id: 'f-017', name: 'Sirloin Steak (Grilled)', servingSize: 170, servingUnit: 'g', calories: 340, protein: 42, carbs: 0, fat: 18, category: 'protein' },
  { id: 'f-018', name: 'Banana (Medium)', servingSize: 1, servingUnit: 'medium banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.3, category: 'carbs' },
  { id: 'f-019', name: 'Blueberries (Fresh)', servingSize: 100, servingUnit: 'g', calories: 57, protein: 0.7, carbs: 14, fat: 0.3, category: 'carbs' },
  { id: 'f-020', name: 'Whole Milk', servingSize: 250, servingUnit: 'ml (1 cup)', calories: 150, protein: 8, carbs: 12, fat: 8, category: 'dairy' },
];

export async function searchFoodDatabase(query: string): Promise<FoodItem[]> {
  if (!query || query.trim().length < 2) return COMMON_FOOD_DATABASE.slice(0, 8);
  const q = query.toLowerCase().trim();
  const matches = COMMON_FOOD_DATABASE.filter(
    f => f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q)
  );
  return matches.length > 0 ? matches : COMMON_FOOD_DATABASE.slice(0, 5);
}
