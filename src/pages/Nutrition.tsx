// src/pages/Nutrition.tsx

import { useState, useEffect } from 'react';
import { Plus, Droplets, X, Check, Search, Sparkles, Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { calculateNutritionTargets } from '../lib/utils';
import { searchFoodDatabase, type FoodItem } from '../lib/foodApi';
import AIMealScannerModal from '../components/nutrition/AIMealScannerModal';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

// ---- Types ----
interface MealEntry {
  id: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// ---- Demo meal data ----
const DEMO_MEALS: MealEntry[] = [
  { id: 'm1', meal_type: 'breakfast', name: 'Greek Yogurt + Berries + Granola', calories: 380, protein: 28, carbs: 45, fat: 9 },
  { id: 'm2', meal_type: 'lunch', name: 'Grilled Chicken + Brown Rice + Broccoli', calories: 520, protein: 52, carbs: 48, fat: 12 },
];

// ---- Macro colors ----
const MACRO_COLORS = {
  protein: 'var(--clr-info)',
  carbs: 'var(--clr-warning)',
  fat: 'var(--clr-danger)',
};

function NutritionRing({ calories, target }: { calories: number; target: number }) {
  const pct = Math.min((calories / target) * 100, 100);
  const radius = 70;
  const circ = 2 * Math.PI * radius;
  const dash = (pct / 100) * circ;

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={168} height={168} viewBox="0 0 168 168" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={84} cy={84} r={radius} fill="none" stroke="var(--clr-bg-4)" strokeWidth={12} />
        <circle cx={84} cy={84} r={radius} fill="none" stroke="var(--clr-primary)" strokeWidth={12}
          strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.8s ease' }} />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 900, fontFamily: 'var(--font-display)', lineHeight: 1 }}>{calories}</div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)', fontWeight: 600 }}>of {target} kcal</div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-primary)', fontWeight: 700 }}>{Math.round(pct)}%</div>
      </div>
    </div>
  );
}

function MacroBar({ label, current, target, color }: { label: string; current: number; target: number; color: string }) {
  const pct = Math.min((current / target) * 100, 100);
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--clr-text-2)' }}>{label}</span>
        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--clr-text)' }}>{current}g / {target}g</span>
      </div>
      <div className="progress-bar" style={{ height: 6 }}>
        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function AddMealModal({ mealType, onClose, onAdd }: { mealType: string; onClose: () => void; onAdd: (m: Omit<MealEntry, 'id'>) => void }) {
  const [form, setForm] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' });
  const [foodQuery, setFoodQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    searchFoodDatabase(foodQuery).then(res => setSearchResults(res));
  }, [foodQuery]);

  const handleSelectFood = (food: FoodItem) => {
    setForm({
      name: food.name,
      calories: String(food.calories),
      protein: String(food.protein),
      carbs: String(food.carbs),
      fat: String(food.fat),
    });
    setFoodQuery(food.name);
    setShowDropdown(false);
    toast.success(`Selected ${food.name} (${food.calories} kcal)`);
  };

  const handleAdd = () => {
    if (!form.name || !form.calories) { toast.error('Name and calories are required'); return; }
    onAdd({
      meal_type: mealType as any,
      name: form.name,
      calories: Number(form.calories),
      protein: Number(form.protein) || 0,
      carbs: Number(form.carbs) || 0,
      fat: Number(form.fat) || 0,
    });
    onClose();
    toast.success('Meal logged!');
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', backdropFilter: 'blur(4px)', padding: '1rem' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'var(--clr-bg-2)', borderRadius: 'var(--radius-2xl)', padding: '1.5rem', width: '100%', maxWidth: 480, border: '1px solid var(--clr-border)', animation: 'fadeIn 0.3s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, textTransform: 'capitalize' }}>Log {mealType}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clr-text-2)' }}><X size={20} /></button>
        </div>

        {/* Instant Food Database Search */}
        <div className="form-group" style={{ position: 'relative', marginBottom: '1rem' }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <Sparkles size={14} color="var(--clr-primary)" /> Instant Food Database Search
          </label>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--clr-text-3)" style={{ position: 'absolute', left: 12, top: 12 }} />
            <input
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search staples (e.g., Chicken breast, Salmon, Eggs, Oats...)"
              value={foodQuery}
              onChange={e => {
                setFoodQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
            />
          </div>

          {showDropdown && searchResults.length > 0 && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10,
              background: 'var(--clr-bg-3)', border: '1px solid var(--clr-border)',
              borderRadius: 'var(--radius-md)', maxHeight: 180, overflowY: 'auto', marginTop: 4,
              boxShadow: 'var(--shadow-lg)',
            }}>
              {searchResults.map(food => (
                <div
                  key={food.id}
                  onClick={() => handleSelectFood(food)}
                  style={{
                    padding: '0.625rem 0.875rem', cursor: 'pointer', borderBottom: '1px solid var(--clr-border)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--text-xs)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--clr-bg-4)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--clr-text)' }}>{food.name}</span>
                    <span style={{ color: 'var(--clr-text-3)', marginLeft: 6 }}>({food.servingSize}{food.servingUnit})</span>
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--clr-primary)' }}>{food.calories} kcal</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label required">Meal Description</label>
            <input className="form-input" placeholder="e.g. Grilled salmon with vegetables" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label required">Calories</label>
              <input className="form-input" type="number" placeholder="450" value={form.calories} onChange={e => setForm(p => ({ ...p, calories: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Protein (g)</label>
              <input className="form-input" type="number" placeholder="40" value={form.protein} onChange={e => setForm(p => ({ ...p, protein: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Carbs (g)</label>
              <input className="form-input" type="number" placeholder="45" value={form.carbs} onChange={e => setForm(p => ({ ...p, carbs: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Fat (g)</label>
              <input className="form-input" type="number" placeholder="12" value={form.fat} onChange={e => setForm(p => ({ ...p, fat: e.target.value }))} />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="secondary" onClick={onClose} block>Cancel</Button>
          <Button onClick={handleAdd} block id="add-meal-btn"><Check size={16} /> Log Meal</Button>
        </div>
      </div>
    </div>
  );
}

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
const MEAL_ICONS: Record<string, string> = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎' };

export default function Nutrition() {
  const { profile } = useAuth();
  const [meals, setMeals] = useState<MealEntry[]>(DEMO_MEALS);
  const [waterMl, setWaterMl] = useState(1800);
  const [addingMeal, setAddingMeal] = useState<string | null>(null);
  const [showPhotoScanner, setShowPhotoScanner] = useState(false);

  const targets = profile ? calculateNutritionTargets(
    profile.weight_kg,
    profile.height_cm,
    profile.age,
    profile.activity_level as any,
    profile.goal as any
  ) : { calories: 2200, protein_g: 180, carbs_g: 220, fat_g: 65, water_ml: 2800 };

  const totals = meals.reduce(
    (acc, m) => ({
      calories: acc.calories + m.calories,
      protein: acc.protein + m.protein,
      carbs: acc.carbs + m.carbs,
      fat: acc.fat + m.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const handleAddMeal = (meal: Omit<MealEntry, 'id'>) => {
    setMeals(prev => [...prev, { ...meal, id: `meal-${Date.now()}` }]);
  };

  const handleAddWater = (amount: number) => {
    setWaterMl(prev => Math.min(prev + amount, 5000));
    toast.success(`+${amount}ml water logged!`);
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900, marginBottom: '0.5rem' }}>Nutrition</h1>
          <p style={{ color: 'var(--clr-text-2)' }}>Target macros calculated for your age, weight, and fitness goal.</p>
        </div>

        {/* AI Photo Scanner CTA Button */}
        <Button onClick={() => setShowPhotoScanner(true)} className="animate-pulse-glow" id="scan-meal-photo-btn">
          <Camera size={18} /> Snap / Scan Meal Photo AI
        </Button>
      </div>

      {/* Primary summary card */}
      <div className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', alignItems: 'center' }}>
          {/* Ring */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <NutritionRing calories={totals.calories} target={targets.calories} />
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)', marginTop: '0.75rem', textAlign: 'center' }}>
              Target: {targets.calories} kcal/day
            </div>
          </div>

          {/* Macro bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <MacroBar label="Protein" current={totals.protein} target={targets.protein_g} color={MACRO_COLORS.protein} />
            <MacroBar label="Carbohydrates" current={totals.carbs} target={targets.carbs_g} color={MACRO_COLORS.carbs} />
            <MacroBar label="Healthy Fats" current={totals.fat} target={targets.fat_g} color={MACRO_COLORS.fat} />
          </div>
        </div>
      </div>

      {/* Water Tracking */}
      <div className="card" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 48, height: 48, background: 'rgba(59,130,246,0.12)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Droplets size={24} color="var(--clr-info)" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 'var(--text-lg)' }}>Hydration Tracker</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-text-2)' }}>
              {waterMl} ml / {targets.water_ml} ml ({Math.round((waterMl / targets.water_ml) * 100)}%)
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[250, 500].map(amt => (
            <Button key={amt} variant="secondary" size="sm" onClick={() => handleAddWater(amt)}>
              +${amt}ml
            </Button>
          ))}
        </div>
      </div>

      {/* Meals by Type */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {MEAL_TYPES.map(type => {
          const typeMeals = meals.filter(m => m.meal_type === type);
          const typeCals = typeMeals.reduce((acc, m) => acc + m.calories, 0);

          return (
            <div key={type} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: typeMeals.length > 0 ? '1rem' : '0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>{MEAL_ICONS[type]}</span>
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, textTransform: 'capitalize' }}>{type}</h3>
                  {typeCals > 0 && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-text-3)' }}>({typeCals} kcal)</span>}
                </div>
                <Button size="sm" variant="ghost" onClick={() => setAddingMeal(type)} id={`add-${type}-btn`}>
                  <Plus size={16} /> Add Food
                </Button>
              </div>

              {typeMeals.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {typeMeals.map(m => (
                    <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.625rem 0.875rem', background: 'var(--clr-bg-3)', borderRadius: 'var(--radius-md)' }}>
                      <span style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>{m.name}</span>
                      <div style={{ display: 'flex', gap: '0.875rem', fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)' }}>
                        <span>P: {m.protein}g</span>
                        <span>C: {m.carbs}g</span>
                        <span>F: {m.fat}g</span>
                        <strong style={{ color: 'var(--clr-primary)' }}>{m.calories} kcal</strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {addingMeal && (
        <AddMealModal mealType={addingMeal} onClose={() => setAddingMeal(null)} onAdd={handleAddMeal} />
      )}

      {/* AI Photo Scanner Modal */}
      <AIMealScannerModal
        isOpen={showPhotoScanner}
        onClose={() => setShowPhotoScanner(false)}
        onLogMeal={handleAddMeal}
      />
    </div>
  );
}
