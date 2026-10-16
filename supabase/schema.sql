-- ============================================================
-- FIT FOR MIDLIFE MEN — Production Supabase PostgreSQL Schema
-- Database schema with Row Level Security (RLS) policies & triggers
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. PROFILES TABLE (linked to auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT,
  age INTEGER NOT NULL CHECK (age >= 18 AND age <= 120),
  height_cm NUMERIC(5,2) NOT NULL DEFAULT 178,
  weight_kg NUMERIC(5,2) NOT NULL DEFAULT 85,
  goal TEXT NOT NULL DEFAULT 'improve_fitness',
  secondary_goals TEXT[] DEFAULT '{}',
  fitness_level TEXT NOT NULL DEFAULT 'beginner',
  training_location TEXT NOT NULL DEFAULT 'home',
  equipment TEXT[] DEFAULT '{"dumbbells"}',
  training_days_per_week INTEGER NOT NULL DEFAULT 3 CHECK (training_days_per_week BETWEEN 1 AND 7),
  workout_duration_minutes INTEGER NOT NULL DEFAULT 45 CHECK (workout_duration_minutes BETWEEN 10 AND 120),
  activity_level TEXT NOT NULL DEFAULT 'lightly_active',
  avg_daily_steps INTEGER DEFAULT 7000,
  sleep_hours NUMERIC(3,1) DEFAULT 7.0,
  has_medical_conditions BOOLEAN NOT NULL DEFAULT false,
  medical_notes TEXT,
  onboarding_completed BOOLEAN NOT NULL DEFAULT true,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  plan TEXT NOT NULL DEFAULT 'free',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 2. EXERCISES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.exercises (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  muscle_groups TEXT[] NOT NULL,
  secondary_muscles TEXT[] DEFAULT '{}',
  difficulty TEXT NOT NULL DEFAULT 'beginner',
  equipment TEXT NOT NULL DEFAULT 'none',
  instructions TEXT[] NOT NULL,
  default_sets INTEGER NOT NULL DEFAULT 3,
  default_reps TEXT NOT NULL DEFAULT '10-12',
  rest_seconds INTEGER NOT NULL DEFAULT 60,
  video_url TEXT,
  thumbnail_url TEXT,
  safety_notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 3. WORKOUT PROGRAMS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.workout_programs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  level TEXT NOT NULL,
  goal TEXT NOT NULL,
  days_per_week INTEGER NOT NULL,
  duration_weeks INTEGER NOT NULL,
  is_system BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.workout_program_days (
  id TEXT PRIMARY KEY,
  program_id TEXT NOT NULL REFERENCES public.workout_programs(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  name TEXT NOT NULL,
  focus TEXT NOT NULL,
  is_rest_day BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS public.workout_exercises (
  id TEXT PRIMARY KEY,
  program_day_id TEXT NOT NULL REFERENCES public.workout_program_days(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL REFERENCES public.exercises(id) ON DELETE RESTRICT,
  sets INTEGER NOT NULL DEFAULT 3,
  reps TEXT NOT NULL DEFAULT '10-12',
  rest_seconds INTEGER NOT NULL DEFAULT 60,
  order_index INTEGER NOT NULL DEFAULT 1,
  notes TEXT
);

-- ============================================================
-- 4. WORKOUT SESSIONS & LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.workout_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id TEXT REFERENCES public.workout_programs(id) ON DELETE SET NULL,
  program_day_id TEXT REFERENCES public.workout_program_days(id) ON DELETE SET NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  duration_seconds INTEGER DEFAULT 0,
  notes TEXT,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.workout_sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES public.workout_sessions(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL REFERENCES public.exercises(id) ON DELETE RESTRICT,
  set_number INTEGER NOT NULL,
  weight_kg NUMERIC(6,2) NOT NULL DEFAULT 0,
  reps INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 5. PROGRESS & BODY MEASUREMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.progress_measurements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  weight_kg NUMERIC(5,2) NOT NULL,
  waist_cm NUMERIC(5,2),
  body_fat_pct NUMERIC(4,1),
  chest_cm NUMERIC(5,2),
  arms_cm NUMERIC(5,2),
  notes TEXT,
  measured_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 6. HABITS & HABIT LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '⚡',
  target_value INTEGER NOT NULL DEFAULT 1,
  unit TEXT NOT NULL DEFAULT 'times',
  is_active BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.habit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  logged_date DATE NOT NULL DEFAULT CURRENT_DATE,
  value INTEGER NOT NULL DEFAULT 1,
  completed BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(habit_id, logged_date)
);

-- ============================================================
-- 7. NUTRITION & MEAL LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  logged_date DATE NOT NULL DEFAULT CURRENT_DATE,
  name TEXT NOT NULL,
  calories INTEGER NOT NULL DEFAULT 0,
  protein_g INTEGER NOT NULL DEFAULT 0,
  carbs_g INTEGER NOT NULL DEFAULT 0,
  fat_g INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.water_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  logged_date DATE NOT NULL DEFAULT CURRENT_DATE,
  amount_ml INTEGER NOT NULL DEFAULT 250,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_program_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Exercises policies (Public read, admin write)
CREATE POLICY "Anyone can view exercises" ON public.exercises FOR SELECT USING (true);

-- Workout programs policies (Public read system programs)
CREATE POLICY "Anyone can view system programs" ON public.workout_programs FOR SELECT USING (true);
CREATE POLICY "Anyone can view program days" ON public.workout_program_days FOR SELECT USING (true);
CREATE POLICY "Anyone can view workout exercises" ON public.workout_exercises FOR SELECT USING (true);

-- Workout sessions policies
CREATE POLICY "Users manage own workout sessions" ON public.workout_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own workout sets" ON public.workout_sets FOR ALL USING (
  EXISTS (SELECT 1 FROM public.workout_sessions s WHERE s.id = workout_sets.session_id AND s.user_id = auth.uid())
);

-- Progress measurements policies
CREATE POLICY "Users manage own measurements" ON public.progress_measurements FOR ALL USING (auth.uid() = user_id);

-- Habits & Habit logs policies
CREATE POLICY "Users manage own habits" ON public.habits FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own habit logs" ON public.habit_logs FOR ALL USING (auth.uid() = user_id);

-- Nutrition policies
CREATE POLICY "Users manage own meals" ON public.meals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own water logs" ON public.water_logs FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- 9. AUTOMATIC NEW USER TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name, age, goal, fitness_level)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'Friend'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'age')::integer, 45),
    COALESCE(NEW.raw_user_meta_data->>'goal', 'improve_fitness'),
    COALESCE(NEW.raw_user_meta_data->>'fitness_level', 'beginner')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution on auth.users sign up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
