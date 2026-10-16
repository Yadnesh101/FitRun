import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dumbbell, Flame, Droplets, Zap, TrendingUp,
  CheckCircle2, ChevronRight, Clock, BarChart3, Play,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getGreeting } from '../lib/utils';
import { selectProgram, DEMO_PROGRAMS } from '../data/workoutPrograms';
import Button from '../components/ui/Button';

// ============================================================
// Demo data (will come from Supabase in production)
// ============================================================

const useDemoStats = () => {
  return useMemo(() => ({
    streak: 7,
    totalWorkouts: 12,
    weeklyWorkouts: 2,
    weeklyMinutes: 74,
    weightChange: -1.4, // lbs lost this week
    todayHabitsCompleted: 3,
    totalHabits: 6,
    caloriesLogged: 1840,
    caloriesTarget: 2200,
    proteinLogged: 145,
    proteinTarget: 185,
    waterLogged: 1800,
    waterTarget: 2800,
    stepsToday: 6240,
    stepsTarget: 8000,
  }), []);
};

// ============================================================
// Components
// ============================================================

function StreakBadge({ count }: { count: number }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
      background: 'rgba(232,160,32,0.12)', border: '1px solid rgba(232,160,32,0.25)',
      borderRadius: 'var(--radius-full)', padding: '0.375rem 0.875rem',
      color: 'var(--clr-primary)', fontSize: 'var(--text-sm)', fontWeight: 700,
    }}>
      🔥 {count} day streak
    </div>
  );
}

function ProgressRing({ value, max, color, size = 80, label, sublabel }: {
  value: number; max: number; color: string; size?: number; label: string; sublabel?: string;
}) {
  const pct = Math.min((value / max) * 100, 100);
  const radius = (size - 8) / 2;
  const circ = 2 * Math.PI * radius;
  const dash = (pct / 100) * circ;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--clr-bg-4)" strokeWidth={7} />
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={7}
            strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.6s ease' }} />
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--clr-text)' }}>
            {Math.round(pct)}%
          </span>
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--clr-text)' }}>{label}</div>
        {sublabel && <div style={{ fontSize: '11px', color: 'var(--clr-text-3)' }}>{sublabel}</div>}
      </div>
    </div>
  );
}

function TodayWorkoutCard({ program, onStart }: { program: any; onStart: () => void }) {
  const today = new Date().getDay(); // 0=Sun
  // Map to program day (1-indexed, week-based)
  const dayIndex = (today === 0 ? 6 : today - 1) % (program?.days?.length || 7);
  const programDay = program?.days?.[dayIndex];

  if (!programDay || programDay.is_rest_day) {
    return (
      <div className="card card-gold" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <Flame size={20} color="var(--clr-primary)" />
          <h3 style={{ fontWeight: 700, fontSize: 'var(--text-lg)' }}>Today's Plan</h3>
        </div>
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>😴</div>
          <div style={{ fontWeight: 700, fontSize: 'var(--text-xl)', marginBottom: '0.25rem' }}>Rest Day</div>
          <div style={{ color: 'var(--clr-text-2)', fontSize: 'var(--text-sm)' }}>
            Recovery is part of the program. Stay hydrated and stretch if possible.
          </div>
        </div>
      </div>
    );
  }

  const exercises = programDay.exercises || [];
  const estimatedTime = exercises.reduce((acc: number, e: any) => acc + (e.sets * (e.rest_seconds + 45)), 0);

  return (
    <div className="card card-gold" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Dumbbell size={20} color="var(--clr-primary)" />
          <div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              Today's Workout
            </div>
            <h3 style={{ fontWeight: 800, fontSize: 'var(--text-xl)' }}>{programDay.name}</h3>
          </div>
        </div>
        <span className="badge badge-primary">{programDay.focus}</span>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--clr-text-2)', fontSize: 'var(--text-sm)' }}>
          <Clock size={14} /> ~{Math.round(estimatedTime / 60)} min
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--clr-text-2)', fontSize: 'var(--text-sm)' }}>
          <BarChart3 size={14} /> {exercises.length} exercises
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        {exercises.slice(0, 4).map((ex: any) => (
          <div key={ex.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0', borderBottom: '1px solid var(--clr-border)' }}>
            <div style={{ width: 8, height: 8, background: 'var(--clr-primary)', borderRadius: '50%', flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 'var(--text-sm)', color: 'var(--clr-text)' }}>{ex.exercise?.name}</span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)' }}>{ex.sets}×{ex.reps}</span>
          </div>
        ))}
        {exercises.length > 4 && (
          <div style={{ padding: '0.5rem 0', fontSize: 'var(--text-sm)', color: 'var(--clr-text-3)', textAlign: 'center' }}>
            +{exercises.length - 4} more exercises
          </div>
        )}
      </div>

      <Button onClick={onStart} block size="lg" className="animate-pulse-glow" id="start-workout-btn">
        <Play size={20} /> Start Workout
      </Button>
    </div>
  );
}

// ============================================================
// Main Dashboard
// ============================================================

export default function Dashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const stats = useDemoStats();
  const program = profile ? selectProgram({
    goal: profile.goal,
    fitness_level: profile.fitness_level,
    training_days_per_week: profile.training_days_per_week,
    equipment: profile.equipment,
  }) : DEMO_PROGRAMS[0];

  const dayNumber = 12; // demo

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>

      {/* ---- Header ---- */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-text-3)', fontWeight: 500, marginBottom: '0.25rem' }}>
            {getGreeting()},
          </div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900, lineHeight: 1.1 }}>
            {profile?.first_name ?? 'Champion'} 💪
          </h1>
          <div style={{ color: 'var(--clr-text-2)', marginTop: '0.375rem', fontSize: 'var(--text-sm)' }}>
            You're on day <strong style={{ color: 'var(--clr-primary)' }}>{dayNumber}</strong> of your fitness journey.
          </div>
        </div>
        <StreakBadge count={stats.streak} />
      </div>

      {/* ---- Today's Workout ---- */}
      <div style={{ marginBottom: '1.5rem' }}>
        <TodayWorkoutCard program={program} onStart={() => {
          const today = new Date().getDay();
          const dayIndex = (today === 0 ? 6 : today - 1) % (program?.days?.length || 7);
          const dayId = program?.days?.[dayIndex]?.id;
          navigate(`/workouts/player/${program.id}/${dayId}`);
        }} />
      </div>

      {/* ---- Daily Progress ---- */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="section-header" style={{ marginBottom: '1.25rem' }}>
          <h2 className="section-title">Daily Progress</h2>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1rem' }}>
          <ProgressRing value={stats.caloriesLogged} max={stats.caloriesTarget} color="var(--clr-primary)" label="Calories" sublabel={`${stats.caloriesLogged} / ${stats.caloriesTarget}`} />
          <ProgressRing value={stats.proteinLogged} max={stats.proteinTarget} color="var(--clr-info)" label="Protein" sublabel={`${stats.proteinLogged}g / ${stats.proteinTarget}g`} />
          <ProgressRing value={stats.waterLogged} max={stats.waterTarget} color="var(--clr-success)" label="Water" sublabel={`${(stats.waterLogged / 1000).toFixed(1)}L / ${(stats.waterTarget / 1000).toFixed(1)}L`} />
          <ProgressRing value={stats.stepsToday} max={stats.stepsTarget} color="var(--clr-warning)" label="Steps" sublabel={`${stats.stepsToday.toLocaleString()} / ${stats.stepsTarget.toLocaleString()}`} />
        </div>
      </div>

      {/* ---- Weekly Stats ---- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { icon: <Dumbbell size={20} color="var(--clr-primary)" />, label: 'Workouts This Week', value: stats.weeklyWorkouts, unit: 'sessions' },
          { icon: <Clock size={20} color="var(--clr-info)" />, label: 'Active Minutes', value: stats.weeklyMinutes, unit: 'min' },
          { icon: <TrendingUp size={20} color="var(--clr-success)" />, label: 'Weight Change', value: `${stats.weightChange > 0 ? '+' : ''}${stats.weightChange}`, unit: 'lbs' },
          { icon: <Flame size={20} color="var(--clr-warning)" />, label: 'Current Streak', value: stats.streak, unit: 'days' },
        ].map(({ icon, label, value, unit }) => (
          <div key={label} className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
              {icon}
              <span className="stat-label">{label}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.375rem' }}>
              <span className="stat-value" style={{ fontSize: 'var(--text-2xl)' }}>{value}</span>
              <span className="stat-unit">{unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ---- Quick Actions ---- */}
      <div>
        <h2 className="section-title" style={{ marginBottom: '1rem' }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
          {[
            { icon: <TrendingUp size={20} />, label: 'Log Weight', path: '/progress', color: 'var(--clr-success)' },
            { icon: <Droplets size={20} />, label: 'Log Water', path: '/nutrition', color: 'var(--clr-info)' },
            { icon: <CheckCircle2 size={20} />, label: 'Habits', path: '/habits', color: 'var(--clr-warning)' },
            { icon: <Zap size={20} />, label: 'Fit Coach', path: '/fit-coach', color: 'var(--clr-primary)' },
          ].map(({ icon, label, path, color }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className="card card-interactive"
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.25rem', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: `rgba(${color === 'var(--clr-primary)' ? '232,160,32' : color === 'var(--clr-success)' ? '34,212,122' : color === 'var(--clr-info)' ? '59,130,246' : '245,166,35'},0.12)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
                {icon}
              </div>
              <span style={{ fontWeight: 600, color: 'var(--clr-text)', flex: 1 }}>{label}</span>
              <ChevronRight size={16} color="var(--clr-text-3)" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
