// src/data/workoutPrograms.ts
// ============================================================
// Demo workout programs — 3 structured programs for development.
// Rule-based assignment happens in programSelector.ts
// ============================================================

import type { WorkoutProgram } from '../types';
import DEMO_EXERCISES from './exercises';

const ex = (id: string) => DEMO_EXERCISES.find(e => e.id === id)!;

export const DEMO_PROGRAMS: WorkoutProgram[] = [
  // ============================================================
  // PROGRAM 1: 3-Day Full Body Beginner (Home/Dumbbells)
  // ============================================================
  {
    id: 'prog-001',
    name: '3-Day Full Body Starter',
    description:
      'The perfect program for men returning to fitness. Three full-body workouts per week using dumbbells, with built-in rest and recovery. No complicated moves — just proven basics that work.',
    level: 'beginner',
    goal: 'improve_fitness',
    days_per_week: 3,
    duration_weeks: 8,
    is_system: true,
    days: [
      {
        id: 'day-001-1',
        program_id: 'prog-001',
        day_number: 1,
        name: 'Workout A — Full Body',
        focus: 'Full Body Strength',
        is_rest_day: false,
        exercises: [
          { id: 'we-001', program_day_id: 'day-001-1', exercise_id: 'ex-007', exercise: ex('ex-007'), sets: 3, reps: '10-12', rest_seconds: 90, order_index: 1 },
          { id: 'we-002', program_day_id: 'day-001-1', exercise_id: 'ex-002', exercise: ex('ex-002'), sets: 3, reps: '10-12', rest_seconds: 90, order_index: 2 },
          { id: 'we-003', program_day_id: 'day-001-1', exercise_id: 'ex-004', exercise: ex('ex-004'), sets: 3, reps: '10-12', rest_seconds: 90, order_index: 3 },
          { id: 'we-004', program_day_id: 'day-001-1', exercise_id: 'ex-008', exercise: ex('ex-008'), sets: 3, reps: '10-12', rest_seconds: 90, order_index: 4 },
          { id: 'we-005', program_day_id: 'day-001-1', exercise_id: 'ex-011', exercise: ex('ex-011'), sets: 3, reps: '10-12', rest_seconds: 90, order_index: 5 },
          { id: 'we-006', program_day_id: 'day-001-1', exercise_id: 'ex-016', exercise: ex('ex-016'), sets: 3, reps: '30-45 seconds', rest_seconds: 60, order_index: 6 },
        ],
      },
      {
        id: 'day-001-2',
        program_id: 'prog-001',
        day_number: 2,
        name: 'Rest & Recovery',
        focus: 'Active Recovery',
        is_rest_day: true,
        exercises: [],
      },
      {
        id: 'day-001-3',
        program_id: 'prog-001',
        day_number: 3,
        name: 'Workout B — Full Body',
        focus: 'Full Body Strength',
        is_rest_day: false,
        exercises: [
          { id: 'we-007', program_day_id: 'day-001-3', exercise_id: 'ex-010', exercise: ex('ex-010'), sets: 3, reps: '10 each leg', rest_seconds: 90, order_index: 1 },
          { id: 'we-008', program_day_id: 'day-001-3', exercise_id: 'ex-001', exercise: ex('ex-001'), sets: 3, reps: '10-15', rest_seconds: 60, order_index: 2 },
          { id: 'we-009', program_day_id: 'day-001-3', exercise_id: 'ex-026', exercise: ex('ex-026'), sets: 3, reps: '10-12', rest_seconds: 90, order_index: 3 },
          { id: 'we-010', program_day_id: 'day-001-3', exercise_id: 'ex-030', exercise: ex('ex-030'), sets: 3, reps: '15', rest_seconds: 60, order_index: 4 },
          { id: 'we-011', program_day_id: 'day-001-3', exercise_id: 'ex-012', exercise: ex('ex-012'), sets: 3, reps: '12-15', rest_seconds: 60, order_index: 5 },
          { id: 'we-012', program_day_id: 'day-001-3', exercise_id: 'ex-017', exercise: ex('ex-017'), sets: 3, reps: '8 each side', rest_seconds: 60, order_index: 6 },
        ],
      },
      {
        id: 'day-001-4',
        program_id: 'prog-001',
        day_number: 4,
        name: 'Rest & Recovery',
        focus: 'Active Recovery',
        is_rest_day: true,
        exercises: [],
      },
      {
        id: 'day-001-5',
        program_id: 'prog-001',
        day_number: 5,
        name: 'Workout C — Full Body',
        focus: 'Full Body Strength',
        is_rest_day: false,
        exercises: [
          { id: 'we-013', program_day_id: 'day-001-5', exercise_id: 'ex-009', exercise: ex('ex-009'), sets: 3, reps: '15-20', rest_seconds: 60, order_index: 1 },
          { id: 'we-014', program_day_id: 'day-001-5', exercise_id: 'ex-027', exercise: ex('ex-027'), sets: 3, reps: '10-12', rest_seconds: 90, order_index: 2 },
          { id: 'we-015', program_day_id: 'day-001-5', exercise_id: 'ex-029', exercise: ex('ex-029'), sets: 3, reps: '12-15', rest_seconds: 60, order_index: 3 },
          { id: 'we-016', program_day_id: 'day-001-5', exercise_id: 'ex-028', exercise: ex('ex-028'), sets: 3, reps: '10 each leg', rest_seconds: 60, order_index: 4 },
          { id: 'we-017', program_day_id: 'day-001-5', exercise_id: 'ex-013', exercise: ex('ex-013'), sets: 3, reps: '10-12', rest_seconds: 60, order_index: 5 },
          { id: 'we-018', program_day_id: 'day-001-5', exercise_id: 'ex-019', exercise: ex('ex-019'), sets: 3, reps: '8 each side', rest_seconds: 60, order_index: 6 },
        ],
      },
      {
        id: 'day-001-6',
        program_id: 'prog-001',
        day_number: 6,
        name: 'Rest',
        focus: 'Rest',
        is_rest_day: true,
        exercises: [],
      },
      {
        id: 'day-001-7',
        program_id: 'prog-001',
        day_number: 7,
        name: 'Rest',
        focus: 'Rest',
        is_rest_day: true,
        exercises: [],
      },
    ],
    created_at: new Date().toISOString(),
  },

  // ============================================================
  // PROGRAM 2: 4-Day Fat Loss Program (Gym)
  // ============================================================
  {
    id: 'prog-002',
    name: '4-Day Fat Loss Builder',
    description:
      'A proven 4-day upper/lower split designed to build lean muscle while burning fat. Ideal for men with access to a gym who want visible results in 12 weeks.',
    level: 'intermediate',
    goal: 'lose_fat',
    days_per_week: 4,
    duration_weeks: 12,
    is_system: true,
    days: [
      {
        id: 'day-002-1',
        program_id: 'prog-002',
        day_number: 1,
        name: 'Upper Body A',
        focus: 'Chest & Back',
        is_rest_day: false,
        exercises: [
          { id: 'we-019', program_day_id: 'day-002-1', exercise_id: 'ex-002', exercise: ex('ex-002'), sets: 4, reps: '8-10', rest_seconds: 90, order_index: 1 },
          { id: 'we-020', program_day_id: 'day-002-1', exercise_id: 'ex-006', exercise: ex('ex-006'), sets: 4, reps: '8-10', rest_seconds: 90, order_index: 2 },
          { id: 'we-021', program_day_id: 'day-002-1', exercise_id: 'ex-011', exercise: ex('ex-011'), sets: 3, reps: '10-12', rest_seconds: 90, order_index: 3 },
          { id: 'we-022', program_day_id: 'day-002-1', exercise_id: 'ex-013', exercise: ex('ex-013'), sets: 3, reps: '10-12', rest_seconds: 60, order_index: 4 },
          { id: 'we-023', program_day_id: 'day-002-1', exercise_id: 'ex-014', exercise: ex('ex-014'), sets: 3, reps: '10-12', rest_seconds: 60, order_index: 5 },
          { id: 'we-024', program_day_id: 'day-002-1', exercise_id: 'ex-018', exercise: ex('ex-018'), sets: 3, reps: '20', rest_seconds: 45, order_index: 6 },
        ],
      },
      {
        id: 'day-002-2',
        program_id: 'prog-002',
        day_number: 2,
        name: 'Lower Body A',
        focus: 'Quads & Glutes',
        is_rest_day: false,
        exercises: [
          { id: 'we-025', program_day_id: 'day-002-2', exercise_id: 'ex-007', exercise: ex('ex-007'), sets: 4, reps: '10-12', rest_seconds: 90, order_index: 1 },
          { id: 'we-026', program_day_id: 'day-002-2', exercise_id: 'ex-008', exercise: ex('ex-008'), sets: 4, reps: '10-12', rest_seconds: 90, order_index: 2 },
          { id: 'we-027', program_day_id: 'day-002-2', exercise_id: 'ex-010', exercise: ex('ex-010'), sets: 3, reps: '10 each leg', rest_seconds: 90, order_index: 3 },
          { id: 'we-028', program_day_id: 'day-002-2', exercise_id: 'ex-030', exercise: ex('ex-030'), sets: 3, reps: '15', rest_seconds: 60, order_index: 4 },
          { id: 'we-029', program_day_id: 'day-002-2', exercise_id: 'ex-016', exercise: ex('ex-016'), sets: 3, reps: '45-60 seconds', rest_seconds: 60, order_index: 5 },
        ],
      },
      {
        id: 'day-002-3',
        program_id: 'prog-002',
        day_number: 3,
        name: 'Rest',
        focus: 'Rest',
        is_rest_day: true,
        exercises: [],
      },
      {
        id: 'day-002-4',
        program_id: 'prog-002',
        day_number: 4,
        name: 'Upper Body B',
        focus: 'Shoulders & Arms',
        is_rest_day: false,
        exercises: [
          { id: 'we-030', program_day_id: 'day-002-4', exercise_id: 'ex-001', exercise: ex('ex-001'), sets: 4, reps: '12-15', rest_seconds: 60, order_index: 1 },
          { id: 'we-031', program_day_id: 'day-002-4', exercise_id: 'ex-026', exercise: ex('ex-026'), sets: 4, reps: '10-12', rest_seconds: 90, order_index: 2 },
          { id: 'we-032', program_day_id: 'day-002-4', exercise_id: 'ex-012', exercise: ex('ex-012'), sets: 3, reps: '12-15', rest_seconds: 60, order_index: 3 },
          { id: 'we-033', program_day_id: 'day-002-4', exercise_id: 'ex-015', exercise: ex('ex-015'), sets: 3, reps: '10-12', rest_seconds: 60, order_index: 4 },
          { id: 'we-034', program_day_id: 'day-002-4', exercise_id: 'ex-019', exercise: ex('ex-019'), sets: 3, reps: '8 each side', rest_seconds: 60, order_index: 5 },
        ],
      },
      {
        id: 'day-002-5',
        program_id: 'prog-002',
        day_number: 5,
        name: 'Lower Body B',
        focus: 'Hamstrings & Power',
        is_rest_day: false,
        exercises: [
          { id: 'we-035', program_day_id: 'day-002-5', exercise_id: 'ex-020', exercise: ex('ex-020'), sets: 4, reps: '10-12', rest_seconds: 90, order_index: 1 },
          { id: 'we-036', program_day_id: 'day-002-5', exercise_id: 'ex-028', exercise: ex('ex-028'), sets: 3, reps: '12 each leg', rest_seconds: 90, order_index: 2 },
          { id: 'we-037', program_day_id: 'day-002-5', exercise_id: 'ex-022', exercise: ex('ex-022'), sets: 3, reps: '15', rest_seconds: 90, order_index: 3 },
          { id: 'we-038', program_day_id: 'day-002-5', exercise_id: 'ex-017', exercise: ex('ex-017'), sets: 3, reps: '8 each side', rest_seconds: 60, order_index: 4 },
          { id: 'we-039', program_day_id: 'day-002-5', exercise_id: 'ex-016', exercise: ex('ex-016'), sets: 3, reps: '45-60 seconds', rest_seconds: 60, order_index: 5 },
        ],
      },
      {
        id: 'day-002-6',
        program_id: 'prog-002',
        day_number: 6,
        name: 'Rest',
        focus: 'Rest',
        is_rest_day: true,
        exercises: [],
      },
      {
        id: 'day-002-7',
        program_id: 'prog-002',
        day_number: 7,
        name: 'Rest',
        focus: 'Rest',
        is_rest_day: true,
        exercises: [],
      },
    ],
    created_at: new Date().toISOString(),
  },

  // ============================================================
  // PROGRAM 3: 3-Day Strength Builder
  // ============================================================
  {
    id: 'prog-003',
    name: '3-Day Strength Builder',
    description:
      'A classic 3-day strength program for intermediate men who want to build real, functional strength. Focuses on heavy compound lifts with progressive overload.',
    level: 'intermediate',
    goal: 'increase_strength',
    days_per_week: 3,
    duration_weeks: 10,
    is_system: true,
    days: [
      {
        id: 'day-003-1',
        program_id: 'prog-003',
        day_number: 1,
        name: 'Heavy Strength A',
        focus: 'Chest, Back & Core',
        is_rest_day: false,
        exercises: [
          { id: 'we-040', program_day_id: 'day-003-1', exercise_id: 'ex-002', exercise: ex('ex-002'), sets: 4, reps: '6-8', rest_seconds: 120, order_index: 1 },
          { id: 'we-041', program_day_id: 'day-003-1', exercise_id: 'ex-006', exercise: ex('ex-006'), sets: 4, reps: '6-8', rest_seconds: 120, order_index: 2 },
          { id: 'we-042', program_day_id: 'day-003-1', exercise_id: 'ex-011', exercise: ex('ex-011'), sets: 3, reps: '8-10', rest_seconds: 90, order_index: 3 },
          { id: 'we-043', program_day_id: 'day-003-1', exercise_id: 'ex-004', exercise: ex('ex-004'), sets: 3, reps: '8-10', rest_seconds: 90, order_index: 4 },
          { id: 'we-044', program_day_id: 'day-003-1', exercise_id: 'ex-016', exercise: ex('ex-016'), sets: 3, reps: '45-60 seconds', rest_seconds: 60, order_index: 5 },
        ],
      },
      {
        id: 'day-003-2',
        program_id: 'prog-003',
        day_number: 2,
        name: 'Rest & Mobility',
        focus: 'Active Recovery',
        is_rest_day: true,
        exercises: [],
      },
      {
        id: 'day-003-3',
        program_id: 'prog-003',
        day_number: 3,
        name: 'Heavy Strength B',
        focus: 'Legs & Power',
        is_rest_day: false,
        exercises: [
          { id: 'we-045', program_day_id: 'day-003-3', exercise_id: 'ex-007', exercise: ex('ex-007'), sets: 4, reps: '8-10', rest_seconds: 120, order_index: 1 },
          { id: 'we-046', program_day_id: 'day-003-3', exercise_id: 'ex-008', exercise: ex('ex-008'), sets: 4, reps: '8-10', rest_seconds: 120, order_index: 2 },
          { id: 'we-047', program_day_id: 'day-003-3', exercise_id: 'ex-010', exercise: ex('ex-010'), sets: 3, reps: '10-12', rest_seconds: 90, order_index: 3 },
          { id: 'we-048', program_day_id: 'day-003-3', exercise_id: 'ex-030', exercise: ex('ex-030'), sets: 3, reps: '15', rest_seconds: 60, order_index: 4 },
          { id: 'we-049', program_day_id: 'day-003-3', exercise_id: 'ex-017', exercise: ex('ex-017'), sets: 3, reps: '8 each side', rest_seconds: 60, order_index: 5 },
        ],
      },
      {
        id: 'day-003-4',
        program_id: 'prog-003',
        day_number: 4,
        name: 'Rest',
        focus: 'Rest',
        is_rest_day: true,
        exercises: [],
      },
      {
        id: 'day-003-5',
        program_id: 'prog-003',
        day_number: 5,
        name: 'Heavy Strength C',
        focus: 'Shoulders & Arms',
        is_rest_day: false,
        exercises: [
          { id: 'we-050', program_day_id: 'day-003-5', exercise_id: 'ex-020', exercise: ex('ex-020'), sets: 4, reps: '8-10', rest_seconds: 120, order_index: 1 },
          { id: 'we-051', program_day_id: 'day-003-5', exercise_id: 'ex-012', exercise: ex('ex-012'), sets: 3, reps: '10-12', rest_seconds: 90, order_index: 2 },
          { id: 'we-052', program_day_id: 'day-003-5', exercise_id: 'ex-013', exercise: ex('ex-013'), sets: 3, reps: '8-10', rest_seconds: 60, order_index: 3 },
          { id: 'we-053', program_day_id: 'day-003-5', exercise_id: 'ex-015', exercise: ex('ex-015'), sets: 3, reps: '10-12', rest_seconds: 60, order_index: 4 },
          { id: 'we-054', program_day_id: 'day-003-5', exercise_id: 'ex-019', exercise: ex('ex-019'), sets: 3, reps: '8 each side', rest_seconds: 60, order_index: 5 },
        ],
      },
      {
        id: 'day-003-6',
        program_id: 'prog-003',
        day_number: 6,
        name: 'Rest',
        focus: 'Rest',
        is_rest_day: true,
        exercises: [],
      },
      {
        id: 'day-003-7',
        program_id: 'prog-003',
        day_number: 7,
        name: 'Rest',
        focus: 'Rest',
        is_rest_day: true,
        exercises: [],
      },
    ],
    created_at: new Date().toISOString(),
  },
];

// ---- Rule-based program selector ----

export function selectProgram(profile: {
  goal: string;
  fitness_level: string;
  training_days_per_week: number;
  equipment: string[];
}): WorkoutProgram {
  const { goal, fitness_level, training_days_per_week } = profile;

  // Beginners always get the 3-day starter
  if (fitness_level === 'beginner') {
    return DEMO_PROGRAMS[0]; // 3-Day Full Body Starter
  }

  // Strength-focused intermediates
  if (
    (goal === 'increase_strength' || goal === 'build_muscle') &&
    fitness_level !== 'beginner'
  ) {
    return DEMO_PROGRAMS[2]; // 3-Day Strength Builder
  }

  // Fat loss + 4 days/week
  if (goal === 'lose_fat' && training_days_per_week >= 4) {
    return DEMO_PROGRAMS[1]; // 4-Day Fat Loss Builder
  }

  // Default fallback
  return DEMO_PROGRAMS[0];
}

export default DEMO_PROGRAMS;
