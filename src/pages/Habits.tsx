// src/pages/Habits.tsx

import { useState } from 'react';
import { Check, Flame, TrendingUp, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface Habit {
  id: string;
  name: string;
  icon: string;
  description: string;
  completed: boolean;
  streak: number;
}

const DEFAULT_HABITS: Habit[] = [
  { id: 'h1', name: 'Complete Workout', icon: '💪', description: 'Do your scheduled workout for today', completed: true, streak: 7 },
  { id: 'h2', name: 'Hit Protein Goal', icon: '🥩', description: 'Reach your daily protein target', completed: true, streak: 5 },
  { id: 'h3', name: 'Drink Enough Water', icon: '💧', description: 'Reach your daily water intake goal', completed: false, streak: 3 },
  { id: 'h4', name: 'Step Goal', icon: '👟', description: 'Walk 8,000+ steps today', completed: false, streak: 2 },
  { id: 'h5', name: 'Get Quality Sleep', icon: '😴', description: 'Sleep 7+ hours tonight', completed: false, streak: 4 },
  { id: 'h6', name: 'Mobility Work', icon: '🧘', description: 'Do 10 min of stretching or mobility work', completed: false, streak: 1 },
];

// Simulated last 7 days history
const LAST_7_DAYS = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (6 - i));
  return {
    date: d,
    label: format(d, 'EEE'),
    completed: i < 5 ? Math.random() > 0.3 : i < 6,
  };
});

export default function Habits() {
  const [habits, setHabits] = useState<Habit[]>(DEFAULT_HABITS);
  const completed = habits.filter(h => h.completed).length;
  const total = habits.length;
  const pct = Math.round((completed / total) * 100);

  const toggleHabit = (id: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h;
      const next = { ...h, completed: !h.completed };
      if (next.completed) toast.success(`✓ ${h.name}`);
      return next;
    }));
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: 760, margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900, marginBottom: '0.5rem' }}>Daily Habits</h1>
        <p style={{ color: 'var(--clr-text-2)' }}>
          {format(new Date(), 'EEEE, MMMM d')} — Small wins compound into big results.
        </p>
      </div>

      {/* Today's summary */}
      <div className="card card-gold" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Today's Progress</div>
            <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 900, fontFamily: 'var(--font-display)' }}>
              {completed} <span style={{ color: 'var(--clr-text-3)', fontWeight: 400, fontSize: 'var(--text-xl)' }}>/ {total}</span>
            </div>
          </div>
          <div style={{ position: 'relative', width: 72, height: 72 }}>
            <svg width={72} height={72} viewBox="0 0 72 72" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx={36} cy={36} r={30} fill="none" stroke="var(--clr-bg-4)" strokeWidth={7} />
              <circle cx={36} cy={36} r={30} fill="none" stroke="var(--clr-primary)" strokeWidth={7}
                strokeDasharray={`${(pct / 100) * 2 * Math.PI * 30} ${2 * Math.PI * 30}`} strokeLinecap="round" />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--clr-primary)', fontSize: 'var(--text-sm)' }}>
              {pct}%
            </div>
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        {completed === total && (
          <div style={{ marginTop: '0.75rem', textAlign: 'center', color: 'var(--clr-success)', fontWeight: 700 }}>
            🎉 All habits complete! Excellent work today.
          </div>
        )}
      </div>

      {/* Weekly consistency */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
          <Calendar size={18} color="var(--clr-primary)" />
          <h3 style={{ fontWeight: 700 }}>This Week</h3>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {LAST_7_DAYS.map(day => (
            <div key={day.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: day.completed ? 'var(--clr-success)' : 'var(--clr-bg-4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `2px solid ${day.completed ? 'var(--clr-success)' : 'var(--clr-border)'}`,
              }}>
                {day.completed && <Check size={16} color="white" />}
              </div>
              <span style={{ fontSize: '11px', color: 'var(--clr-text-3)', fontWeight: 600 }}>{day.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Habit list */}
      <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: '1rem' }}>Today's Habits</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {habits.map(habit => (
          <button
            key={habit.id}
            onClick={() => toggleHabit(habit.id)}
            className={`habit-item ${habit.completed ? 'completed' : ''}`}
            style={{ border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
          >
            <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{habit.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: 'var(--clr-text)', marginBottom: '0.125rem', textDecoration: habit.completed ? 'line-through' : 'none', opacity: habit.completed ? 0.7 : 1 }}>
                {habit.name}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)' }}>{habit.description}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
              <div className="habit-check">
                {habit.completed && <Check size={14} color="white" />}
              </div>
              {habit.streak > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '10px', color: 'var(--clr-primary)', fontWeight: 700 }}>
                  🔥{habit.streak}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1.5rem' }}>
        {[
          { icon: <Flame size={18} color="var(--clr-primary)" />, label: 'Best Streak', value: '7 days' },
          { icon: <TrendingUp size={18} color="var(--clr-success)" />, label: 'This Week', value: `${Math.round((LAST_7_DAYS.filter(d => d.completed).length / 7) * 100)}%` },
          { icon: <Check size={18} color="var(--clr-info)" />, label: 'Total Done', value: '47' },
        ].map(({ icon, label, value }) => (
          <div key={label} className="stat-card" style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>{icon}</div>
            <div style={{ fontSize: 'var(--text-xl)', fontWeight: 800 }}>{value}</div>
            <div className="stat-label" style={{ marginTop: '0.25rem' }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
