// src/lib/utils.ts
// ============================================================
// Shared utility functions
// ============================================================

import { clsx, type ClassValue } from 'clsx';
import { format, formatDistanceToNow, parseISO, differenceInDays, startOfWeek, endOfWeek } from 'date-fns';

// ---- CSS class merging ----

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// ---- Date utilities ----

export function formatDate(date: string | Date, pattern = 'MMM d, yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, pattern);
}

export function formatRelative(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function toISODate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

export function weekStart(): Date {
  return startOfWeek(new Date(), { weekStartsOn: 1 });
}

export function weekEnd(): Date {
  return endOfWeek(new Date(), { weekStartsOn: 1 });
}

export function daysSince(dateStr: string): number {
  return differenceInDays(new Date(), parseISO(dateStr));
}

// ---- Greeting ----

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

// ---- Number formatting ----

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  if (s === 0) return `${m}m`;
  return `${m}m ${s}s`;
}

export function formatWeight(kg: number, unit: 'kg' | 'lbs' = 'lbs'): string {
  if (unit === 'lbs') {
    return `${(kg * 2.20462).toFixed(1)} lbs`;
  }
  return `${kg.toFixed(1)} kg`;
}

export function kgToLbs(kg: number): number {
  return parseFloat((kg * 2.20462).toFixed(1));
}

export function lbsToKg(lbs: number): number {
  return parseFloat((lbs / 2.20462).toFixed(2));
}

export function cmToFeetInches(cm: number): string {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}'${inches}"`;
}

// ---- BMR & Nutrition targets ----

/**
 * Mifflin-St Jeor BMR for men.
 * weight in kg, height in cm, age in years.
 */
export function calculateBMR(weight_kg: number, height_cm: number, age: number): number {
  return Math.round(10 * weight_kg + 6.25 * height_cm - 5 * age + 5);
}

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
};

export function calculateTDEE(bmr: number, activity: keyof typeof ACTIVITY_MULTIPLIERS): number {
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activity]);
}

export function calculateNutritionTargets(
  weight_kg: number,
  height_cm: number,
  age: number,
  activity: keyof typeof ACTIVITY_MULTIPLIERS,
  goal: 'lose_fat' | 'build_muscle' | 'increase_strength' | 'improve_fitness' | 'maintain'
): { calories: number; protein_g: number; carbs_g: number; fat_g: number; water_ml: number } {
  const bmr = calculateBMR(weight_kg, height_cm, age);
  const tdee = calculateTDEE(bmr, activity);

  let calorieAdjust = 0;
  if (goal === 'lose_fat') calorieAdjust = -400;
  if (goal === 'build_muscle') calorieAdjust = 300;

  const calories = tdee + calorieAdjust;
  const protein_g = Math.round(weight_kg * 1.8); // ~0.8g/lb
  const fat_g = Math.round(calories * 0.3 / 9);
  const carbs_g = Math.round((calories - protein_g * 4 - fat_g * 9) / 4);
  const water_ml = Math.round(weight_kg * 35); // 35ml per kg bodyweight

  return { calories, protein_g, carbs_g, fat_g, water_ml };
}

// ---- String utilities ----

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function titleCase(str: string): string {
  return str
    .split(/[\s_-]+/)
    .map(capitalize)
    .join(' ');
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural || singular + 's');
}

// ---- Goal labels ----

export const GOAL_LABELS: Record<string, string> = {
  lose_fat: 'Lose Body Fat',
  build_muscle: 'Build Muscle',
  increase_strength: 'Increase Strength',
  improve_fitness: 'Improve Fitness',
  maintain: 'Maintain Current Fitness',
};

export const LEVEL_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export const LOCATION_LABELS: Record<string, string> = {
  home: 'Home',
  gym: 'Gym',
  both: 'Home & Gym',
};

export const EQUIPMENT_LABELS: Record<string, string> = {
  none: 'No Equipment (Bodyweight)',
  dumbbells: 'Dumbbells',
  resistance_bands: 'Resistance Bands',
  bench: 'Bench',
  barbell: 'Barbell',
  pull_up_bar: 'Pull-Up Bar',
  kettlebell: 'Kettlebell',
  cable_machine: 'Cable Machine',
  full_gym: 'Full Gym Access',
};

export const ACTIVITY_LABELS: Record<string, string> = {
  sedentary: 'Sedentary (desk job, little exercise)',
  lightly_active: 'Lightly Active (light exercise 1-3 days/wk)',
  moderately_active: 'Moderately Active (moderate exercise 3-5 days/wk)',
  very_active: 'Very Active (hard exercise 6-7 days/wk)',
};
