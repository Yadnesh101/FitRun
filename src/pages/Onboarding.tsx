// src/pages/Onboarding.tsx
// ============================================================
// Multi-step onboarding wizard — collects user profile info
// and assigns a personalized workout program.
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dumbbell, ChevronRight, ChevronLeft, Check, AlertTriangle,
  Target, Activity, MapPin, Calendar, Heart,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { GOAL_LABELS, LEVEL_LABELS, LOCATION_LABELS, EQUIPMENT_LABELS, ACTIVITY_LABELS } from '../lib/utils';
import type { FitnessGoal, FitnessLevel, TrainingLocation, EquipmentType, ActivityLevel } from '../types';
import toast from 'react-hot-toast';

// ============================================================
// Step data types
// ============================================================

interface OnboardingData {
  first_name: string;
  age: string;
  height_cm: string;
  weight_kg: string;
  goal: FitnessGoal | '';
  secondary_goals: FitnessGoal[];
  fitness_level: FitnessLevel | '';
  training_location: TrainingLocation | '';
  equipment: EquipmentType[];
  training_days_per_week: number;
  workout_duration_minutes: number;
  activity_level: ActivityLevel | '';
  avg_daily_steps: string;
  sleep_hours: string;
  has_medical_conditions: boolean | null;
  medical_notes: string;
}

const initialData: OnboardingData = {
  first_name: '',
  age: '',
  height_cm: '',
  weight_kg: '',
  goal: '',
  secondary_goals: [],
  fitness_level: '',
  training_location: '',
  equipment: [],
  training_days_per_week: 3,
  workout_duration_minutes: 45,
  activity_level: '',
  avg_daily_steps: '',
  sleep_hours: '',
  has_medical_conditions: null,
  medical_notes: '',
};

const TOTAL_STEPS = 7;

// ============================================================
// Step Components
// ============================================================

// ---- Step 1: Basic Info ----
function StepBasicInfo({ data, onChange, errors }: any) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div style={{ width: 36, height: 36, background: 'rgba(232,160,32,0.12)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={18} color="var(--clr-primary)" />
          </div>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>Tell Us About Yourself</h2>
        </div>
        <p style={{ color: 'var(--clr-text-2)' }}>We'll use this to personalize your program.</p>
      </div>

      <Input id="ob-first-name" label="First Name" placeholder="John" value={data.first_name}
        onChange={e => onChange({ first_name: e.target.value })} error={errors.first_name} required />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Input id="ob-age" label="Age" type="number" placeholder="45" value={data.age}
          onChange={e => onChange({ age: e.target.value })} error={errors.age} required />
        <Select id="ob-activity" label="Activity Level" required
          value={data.activity_level}
          onChange={e => onChange({ activity_level: e.target.value as ActivityLevel })}
          error={errors.activity_level}
          placeholder="Select..."
          options={Object.entries(ACTIVITY_LABELS).map(([v, l]) => ({ value: v, label: l.split(' (')[0] }))}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Input id="ob-height" label="Height (cm)" type="number" placeholder="178" value={data.height_cm}
          onChange={e => onChange({ height_cm: e.target.value })} error={errors.height_cm} required />
        <Input id="ob-weight" label="Weight (lbs)" type="number" placeholder="195" value={data.weight_kg}
          onChange={e => onChange({ weight_kg: e.target.value })} error={errors.weight_kg} required />
      </div>

      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)', lineHeight: 1.6 }}>
        Height and weight are used to calculate general fitness estimates. All information is private and secure.
      </p>
    </div>
  );
}

// ---- Step 2: Goals ----
function StepGoals({ data, onChange }: any) {
  const goals = Object.entries(GOAL_LABELS) as [FitnessGoal, string][];
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div style={{ width: 36, height: 36, background: 'rgba(232,160,32,0.12)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Target size={18} color="var(--clr-primary)" />
          </div>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>What's Your Main Goal?</h2>
        </div>
        <p style={{ color: 'var(--clr-text-2)' }}>Choose one primary goal. You can add secondary goals too.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {goals.map(([value, label]) => {
          const isSelected = data.goal === value;
          return (
            <button
              key={value}
              onClick={() => onChange({ goal: value })}
              className={`checkbox-card ${isSelected ? 'selected' : ''}`}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '0.875rem 1.125rem',
                background: isSelected ? 'rgba(232,160,32,0.15)' : 'var(--clr-bg-3)',
                border: isSelected ? '1.5px solid var(--clr-primary)' : '1.5px solid rgba(255,255,255,0.15)',
                boxShadow: isSelected ? '0 0 10px rgba(232,160,32,0.2)' : 'none',
              }}
            >
              <div className={`radio-icon ${isSelected ? 'selected' : ''}`} style={{
                borderColor: isSelected ? 'var(--clr-primary)' : 'rgba(255,255,255,0.4)',
              }} />
              <span style={{ fontWeight: 600, color: isSelected ? '#FFFFFF' : 'var(--clr-text)', fontSize: 'var(--text-base)' }}>{label}</span>
              {isSelected && <Check size={18} color="var(--clr-primary)" style={{ marginLeft: 'auto' }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---- Step 3: Fitness Level ----
function StepFitnessLevel({ data, onChange }: any) {
  const levels = [
    { value: 'beginner', label: 'Beginner', desc: 'New to exercise or returning after 2+ years off' },
    { value: 'intermediate', label: 'Intermediate', desc: 'Working out regularly for 6+ months' },
    { value: 'advanced', label: 'Advanced', desc: 'Consistent training for 2+ years' },
  ];
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div style={{ width: 36, height: 36, background: 'rgba(232,160,32,0.12)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Dumbbell size={18} color="var(--clr-primary)" />
          </div>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>Your Fitness Level</h2>
        </div>
        <p style={{ color: 'var(--clr-text-2)' }}>Be honest — it helps us match you to the right program.</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {levels.map(({ value, label, desc }) => {
          const sel = data.fitness_level === value;
          return (
            <button key={value} onClick={() => onChange({ fitness_level: value as FitnessLevel })}
              className={`checkbox-card ${sel ? 'selected' : ''}`}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '0.875rem 1.125rem',
                background: sel ? 'rgba(232,160,32,0.15)' : 'var(--clr-bg-3)',
                border: sel ? '1.5px solid var(--clr-primary)' : '1.5px solid rgba(255,255,255,0.15)',
                boxShadow: sel ? '0 0 10px rgba(232,160,32,0.2)' : 'none',
              }}>
              <div className={`radio-icon ${sel ? 'selected' : ''}`} style={{
                borderColor: sel ? 'var(--clr-primary)' : 'rgba(255,255,255,0.4)',
              }} />
              <div>
                <div style={{ fontWeight: 700, color: sel ? '#FFFFFF' : 'var(--clr-text)', fontSize: 'var(--text-base)' }}>{label}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: sel ? 'rgba(255,255,255,0.85)' : 'var(--clr-text-2)' }}>{desc}</div>
              </div>
              {sel && <Check size={18} color="var(--clr-primary)" style={{ marginLeft: 'auto', flexShrink: 0 }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---- Step 4: Training Setup ----
function StepTrainingSetup({ data, onChange }: any) {
  const equipment = Object.entries(EQUIPMENT_LABELS) as [EquipmentType, string][];
  const toggleEquip = (eq: EquipmentType) => {
    const current = data.equipment as EquipmentType[];
    if (current.includes(eq)) {
      onChange({ equipment: current.filter((e: EquipmentType) => e !== eq) });
    } else {
      onChange({ equipment: [...current, eq] });
    }
  };
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div style={{ width: 36, height: 36, background: 'rgba(232,160,32,0.12)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={18} color="var(--clr-primary)" />
          </div>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>Where Will You Train?</h2>
        </div>
        <p style={{ color: 'var(--clr-text-2)' }}>Select your training location and available equipment.</p>
      </div>

      {/* Location */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--clr-text)', marginBottom: '0.75rem' }}>Training Location</div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {Object.entries(LOCATION_LABELS).map(([value, label]) => {
            const sel = data.training_location === value;
            return (
              <button key={value} onClick={() => onChange({ training_location: value as TrainingLocation })}
                className={`badge ${sel ? 'badge-primary' : 'badge-neutral'}`}
                style={{
                  cursor: 'pointer',
                  border: sel ? '1.5px solid var(--clr-primary)' : '1px solid rgba(255,255,255,0.15)',
                  padding: '0.625rem 1.25rem',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 700,
                  color: sel ? 'var(--clr-primary)' : 'var(--clr-text)',
                  background: sel ? 'rgba(232,160,32,0.15)' : 'var(--clr-bg-3)',
                }}>
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Equipment */}
      <div>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--clr-text)', marginBottom: '0.75rem' }}>
          Equipment Available <span style={{ fontWeight: 400, color: 'var(--clr-text-2)' }}>(select all that apply)</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.625rem' }}>
          {equipment.map(([value, label]) => {
            const sel = (data.equipment as EquipmentType[]).includes(value);
            return (
              <button key={value} onClick={() => toggleEquip(value)}
                className={`checkbox-card ${sel ? 'selected' : ''}`}
                style={{
                  padding: '0.75rem 0.875rem',
                  background: sel ? 'rgba(232,160,32,0.15)' : 'var(--clr-bg-3)',
                  border: sel ? '1.5px solid var(--clr-primary)' : '1.5px solid rgba(255,255,255,0.15)',
                  boxShadow: sel ? '0 0 10px rgba(232,160,32,0.2)' : 'none',
                }}>
                <div className={`check-icon ${sel ? 'selected' : ''}`} style={{
                  borderColor: sel ? 'var(--clr-primary)' : 'rgba(255,255,255,0.4)',
                  background: sel ? 'var(--clr-primary)' : 'var(--clr-bg-2)',
                }}>
                  {sel && <Check size={12} color="#0F1117" strokeWidth={3} />}
                </div>
                <span style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: sel ? 700 : 500,
                  color: sel ? '#FFFFFF' : 'var(--clr-text)',
                }}>{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---- Step 5: Schedule ----
function StepSchedule({ data, onChange }: any) {
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div style={{ width: 36, height: 36, background: 'rgba(232,160,32,0.12)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={18} color="var(--clr-primary)" />
          </div>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>Your Training Schedule</h2>
        </div>
        <p style={{ color: 'var(--clr-text-2)' }}>Be realistic — consistency beats intensity every time.</p>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--clr-text-2)', marginBottom: '0.75rem' }}>
          Days per week <span style={{ color: 'var(--clr-primary)', fontWeight: 800 }}>{data.training_days_per_week}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          {[2, 3, 4, 5].map(d => {
            const sel = data.training_days_per_week === d;
            return (
              <button key={d} onClick={() => onChange({ training_days_per_week: d })}
                style={{
                  width: 60, height: 60, borderRadius: 'var(--radius-lg)',
                  border: sel ? '2px solid var(--clr-primary)' : '2px solid var(--clr-border)',
                  background: sel ? 'rgba(232,160,32,0.12)' : 'var(--clr-bg-3)',
                  color: sel ? 'var(--clr-primary)' : 'var(--clr-text)',
                  fontWeight: 800, fontSize: 'var(--text-xl)', cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}>
                {d}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--clr-text-2)', marginBottom: '0.75rem' }}>
          Workout duration
        </div>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          {[15, 20, 30, 45, 60].map(m => {
            const sel = data.workout_duration_minutes === m;
            return (
              <button key={m} onClick={() => onChange({ workout_duration_minutes: m })}
                style={{
                  padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)',
                  border: sel ? '2px solid var(--clr-primary)' : '2px solid var(--clr-border)',
                  background: sel ? 'rgba(232,160,32,0.12)' : 'var(--clr-bg-3)',
                  color: sel ? 'var(--clr-primary)' : 'var(--clr-text)',
                  fontWeight: 700, cursor: 'pointer', transition: 'all var(--transition-fast)',
                }}>
                {m} min
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---- Step 6: Lifestyle ----
function StepLifestyle({ data, onChange }: any) {
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div style={{ width: 36, height: 36, background: 'rgba(232,160,32,0.12)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Heart size={18} color="var(--clr-primary)" />
          </div>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>Lifestyle & Health</h2>
        </div>
        <p style={{ color: 'var(--clr-text-2)' }}>Optional — helps us give better recommendations.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Input id="ob-steps" label="Daily Steps (avg)" type="number" placeholder="7000"
            value={data.avg_daily_steps} onChange={e => onChange({ avg_daily_steps: e.target.value })} />
          <Input id="ob-sleep" label="Hours of Sleep" type="number" placeholder="7" step="0.5"
            value={data.sleep_hours} onChange={e => onChange({ sleep_hours: e.target.value })} />
        </div>

        {/* Medical question */}
        <div style={{
          background: 'rgba(245, 166, 35, 0.06)', border: '1px solid rgba(245, 166, 35, 0.2)',
          borderRadius: 'var(--radius-lg)', padding: '1.25rem',
        }}>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
            <AlertTriangle size={20} color="var(--clr-warning)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Important Health Question</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-text-2)', lineHeight: 1.6 }}>
                Do you have any medical conditions, recent injuries, or physical limitations that affect your ability to exercise?
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {[{ val: false, label: 'No' }, { val: true, label: 'Yes' }].map(({ val, label }) => {
              const sel = data.has_medical_conditions === val;
              return (
                <button key={label} onClick={() => onChange({ has_medical_conditions: val })}
                  style={{
                    flex: 1, padding: '0.625rem', borderRadius: 'var(--radius-md)',
                    border: sel ? '2px solid var(--clr-primary)' : '2px solid var(--clr-border)',
                    background: sel ? 'rgba(232,160,32,0.12)' : 'var(--clr-bg-3)',
                    color: sel ? 'var(--clr-primary)' : 'var(--clr-text)',
                    fontWeight: 700, cursor: 'pointer',
                  }}>
                  {label}
                </button>
              );
            })}
          </div>

          {data.has_medical_conditions === true && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(239,68,68,0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-danger)', fontWeight: 600, marginBottom: '0.5rem' }}>
                ⚕️ Please consult a qualified healthcare professional before starting or changing your exercise program.
              </p>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-text-2)', marginBottom: '0.75rem', lineHeight: 1.6 }}>
                This app provides general fitness guidance only and is not a substitute for medical advice.
                If cleared by your healthcare provider, this program may be appropriate for you.
              </p>
              <textarea
                className="form-input"
                rows={2}
                placeholder="Optionally describe your condition or limitation (not shared with anyone)..."
                value={data.medical_notes}
                onChange={e => onChange({ medical_notes: e.target.value })}
                style={{ resize: 'vertical' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---- Step 7: Summary & Launch ----
function StepReady({ data }: { data: OnboardingData }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: 80, height: 80, background: 'var(--grad-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
        <Dumbbell size={40} color="#0F1117" />
      </div>
      <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900, marginBottom: '0.75rem' }}>
        You're All Set, {data.first_name || 'Champion'}!
      </h2>
      <p style={{ color: 'var(--clr-text-2)', marginBottom: '2rem', lineHeight: 1.7 }}>
        We've built a personalized program based on your goals. Your journey to getting stronger,
        leaner, and more energetic starts now.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left', background: 'var(--clr-bg-3)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', marginBottom: '2rem' }}>
        {[
          { icon: '🎯', label: 'Goal', value: GOAL_LABELS[data.goal as FitnessGoal] || '—' },
          { icon: '💪', label: 'Level', value: LEVEL_LABELS[data.fitness_level as string] || '—' },
          { icon: '📅', label: 'Schedule', value: `${data.training_days_per_week} days/week, ${data.workout_duration_minutes} min` },
          { icon: '📍', label: 'Location', value: LOCATION_LABELS[data.training_location as string] || '—' },
        ].map(({ icon, label, value }) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--clr-text-3)', fontSize: 'var(--text-sm)' }}>{icon} {label}</span>
            <span style={{ fontWeight: 600, color: 'var(--clr-text)' }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Main Onboarding Component
// ============================================================

export default function Onboarding() {
  const { updateProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const update = (partial: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...partial }));
  };

  const validateStep = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 1) {
      if (!data.first_name.trim()) e.first_name = 'First name is required';
      if (!data.age) e.age = 'Age is required';
      else if (Number(data.age) < 18 || Number(data.age) > 100) e.age = 'Enter a valid age';
      if (!data.height_cm) e.height_cm = 'Height is required';
      if (!data.weight_kg) e.weight_kg = 'Weight is required';
      if (!data.activity_level) e.activity_level = 'Please select your activity level';
    }
    if (step === 2 && !data.goal) e.goal = 'Please select a goal';
    if (step === 3 && !data.fitness_level) e.fitness_level = 'Please select your level';
    if (step === 4 && !data.training_location) e.location = 'Please select a location';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    setStep(s => Math.min(s + 1, TOTAL_STEPS));
  };

  const prev = () => setStep(s => Math.max(s - 1, 1));

  const handleFinish = async () => {
    setSaving(true);
    const profileData = {
      first_name: data.first_name,
      age: Number(data.age),
      height_cm: Number(data.height_cm),
      weight_kg: Number(data.weight_kg) / 2.20462, // convert lbs to kg for storage
      goal: data.goal as any,
      secondary_goals: data.secondary_goals,
      fitness_level: data.fitness_level as any,
      training_location: data.training_location as any,
      equipment: data.equipment,
      training_days_per_week: data.training_days_per_week,
      workout_duration_minutes: data.workout_duration_minutes,
      activity_level: data.activity_level as any,
      avg_daily_steps: data.avg_daily_steps ? Number(data.avg_daily_steps) : undefined,
      sleep_hours: data.sleep_hours ? Number(data.sleep_hours) : undefined,
      has_medical_conditions: data.has_medical_conditions ?? false,
      medical_notes: data.medical_notes,
      onboarding_completed: true,
    };

    const { error } = await updateProfile(profileData);
    setSaving(false);
    if (error) {
      toast.error('Could not save profile. Please try again.');
    } else {
      toast.success('Profile saved! Welcome to Fit Midlife.');
      navigate('/dashboard');
    }
  };

  const progress = (step / TOTAL_STEPS) * 100;

  return (
    <div className="onboarding-container">
      <div className="onboarding-card animate-fade-in">
        {/* Progress bar */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-text-3)' }}>
              Step {step} of {TOTAL_STEPS}
            </span>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-primary)', fontWeight: 600 }}>
              {Math.round(progress)}%
            </span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Step content */}
        <div style={{ minHeight: 380 }}>
          {step === 1 && <StepBasicInfo data={data} onChange={update} errors={errors} />}
          {step === 2 && <StepGoals data={data} onChange={update} errors={errors} />}
          {step === 3 && <StepFitnessLevel data={data} onChange={update} errors={errors} />}
          {step === 4 && <StepTrainingSetup data={data} onChange={update} errors={errors} />}
          {step === 5 && <StepSchedule data={data} onChange={update} errors={errors} />}
          {step === 6 && <StepLifestyle data={data} onChange={update} errors={errors} />}
          {step === 7 && <StepReady data={data} />}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          {step > 1 && (
            <Button variant="secondary" onClick={prev} style={{ flex: 'none' }}>
              <ChevronLeft size={18} /> Back
            </Button>
          )}
          {step < TOTAL_STEPS ? (
            <Button onClick={next} block>
              Continue <ChevronRight size={18} />
            </Button>
          ) : (
            <Button onClick={handleFinish} loading={saving} block size="lg">
              <Dumbbell size={20} /> Launch My Program
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
