// src/types/index.ts
// ============================================================
// Central TypeScript type definitions for Fit For Midlife Men
// ============================================================

// ---- Auth & User ----

export interface UserProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name?: string;
  age: number;
  height_cm: number;
  weight_kg: number;
  goal: FitnessGoal;
  secondary_goals: FitnessGoal[];
  fitness_level: FitnessLevel;
  training_location: TrainingLocation;
  equipment: EquipmentType[];
  training_days_per_week: number;
  workout_duration_minutes: number;
  activity_level: ActivityLevel;
  avg_daily_steps?: number;
  sleep_hours?: number;
  has_medical_conditions: boolean;
  medical_notes?: string;
  onboarding_completed: boolean;
  is_admin: boolean;
  plan?: 'free' | 'pro' | 'annual';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export type FitnessGoal =
  | 'lose_fat'
  | 'build_muscle'
  | 'increase_strength'
  | 'improve_fitness'
  | 'maintain';

export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';

export type TrainingLocation = 'home' | 'gym' | 'both';

export type EquipmentType =
  | 'none'
  | 'dumbbells'
  | 'resistance_bands'
  | 'bench'
  | 'barbell'
  | 'pull_up_bar'
  | 'kettlebell'
  | 'cable_machine'
  | 'full_gym';

export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';

// ---- Exercises ----

export type ExerciseCategory =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'arms'
  | 'legs'
  | 'core'
  | 'full_body'
  | 'mobility';

export type MuscleGroup =
  | 'chest'
  | 'upper_back'
  | 'lower_back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'quadriceps'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'abs'
  | 'obliques'
  | 'hip_flexors'
  | 'full_body';

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  muscle_groups: MuscleGroup[];
  difficulty: FitnessLevel;
  equipment: EquipmentType[];
  instructions: string[];
  default_sets: number;
  default_reps: string; // e.g. "8-12" or "10"
  rest_seconds: number;
  video_url?: string;
  thumbnail_url?: string;
  safety_notes?: string;
  is_active: boolean;
  created_at: string;
}

// ---- Workout Programs ----

export interface WorkoutProgram {
  id: string;
  name: string;
  description: string;
  level: FitnessLevel;
  goal: FitnessGoal;
  days_per_week: number;
  duration_weeks: number;
  is_system: boolean;
  created_by?: string;
  days: WorkoutProgramDay[];
  created_at: string;
}

export interface WorkoutProgramDay {
  id: string;
  program_id: string;
  day_number: number;
  name: string;
  focus: string;
  is_rest_day: boolean;
  exercises: WorkoutExercise[];
}

export interface WorkoutExercise {
  id: string;
  program_day_id: string;
  exercise_id: string;
  exercise: Exercise;
  sets: number;
  reps: string;
  rest_seconds: number;
  order_index: number;
  notes?: string;
}

// ---- Workout Sessions ----

export interface WorkoutSession {
  id: string;
  user_id: string;
  program_id?: string;
  program_day_id?: string;
  program?: WorkoutProgram;
  program_day?: WorkoutProgramDay;
  started_at: string;
  completed_at?: string;
  duration_seconds?: number;
  notes?: string;
  sets: WorkoutSet[];
}

export interface WorkoutSet {
  id: string;
  session_id: string;
  exercise_id: string;
  exercise?: Exercise;
  set_number: number;
  weight_kg?: number;
  reps?: number;
  completed: boolean;
  created_at: string;
}

// ---- Progress ----

export interface ProgressMeasurement {
  id: string;
  user_id: string;
  weight_kg?: number;
  waist_cm?: number;
  body_fat_pct?: number;
  notes?: string;
  measured_at: string;
  created_at: string;
}

// ---- Habits ----

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  target_value?: number;
  unit?: string;
  is_active: boolean;
  order_index: number;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  logged_date: string; // YYYY-MM-DD
  value?: number;
  completed: boolean;
  created_at: string;
}

// ---- Nutrition ----

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface Food {
  id: string;
  name: string;
  brand?: string;
  serving_size: number;
  serving_unit: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  is_verified: boolean;
}

export interface MealEntry {
  id: string;
  user_id: string;
  meal_type: MealType;
  logged_date: string; // YYYY-MM-DD
  name: string;
  foods?: FoodItem[];
  total_calories: number;
  total_protein_g: number;
  total_carbs_g: number;
  total_fat_g: number;
  created_at: string;
}

export interface FoodItem {
  food_id: string;
  food_name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

export interface WaterLog {
  id: string;
  user_id: string;
  amount_ml: number;
  logged_at: string;
}

export interface NutritionTargets {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  water_ml: number;
}

// ---- Meal Plans ----

export interface MealPlan {
  id: string;
  user_id: string;
  name: string;
  week_start: string; // ISO date
  is_active: boolean;
  items: MealPlanItem[];
  created_at: string;
}

export interface MealPlanItem {
  id: string;
  meal_plan_id: string;
  day_of_week: number; // 0=Sun ... 6=Sat
  meal_type: MealType;
  meal_data: {
    name: string;
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    ingredients?: string[];
    instructions?: string;
    prep_time_minutes?: number;
  };
}

// ---- Subscription ----

export type SubscriptionPlan = 'free' | 'pro' | 'annual';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing';

export interface Subscription {
  id: string;
  user_id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  current_period_end?: string;
  created_at: string;
}

// ---- AI Coach ----

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AIContext {
  profile: UserProfile | null;
  recentWorkouts: WorkoutSession[];
  currentProgram: WorkoutProgram | null;
}

// ---- Notifications ----

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: 'workout' | 'nutrition' | 'progress' | 'system';
  read: boolean;
  created_at: string;
}

// ---- Dashboard ----

export interface DashboardStats {
  streak: number;
  totalWorkouts: number;
  weeklyWorkouts: number;
  weeklyMinutes: number;
  weightChange: number | null;
  todayHabitsCompleted: number;
  totalHabits: number;
}
