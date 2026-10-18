// src/pages/workouts/WorkoutPlayer.tsx
// ============================================================
// Workout Player — guides the user through exercises with
// set tracking, rest timer, and completion summary.
// ============================================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, Check, Clock,
  X, Trophy, Dumbbell, Play, Pause, SkipForward, Plus, Minus,
} from 'lucide-react';
import DEMO_PROGRAMS from '../../data/workoutPrograms';
import Button from '../../components/ui/Button';
import { formatDuration } from '../../lib/utils';
import type { WorkoutExercise } from '../../types';

// ============================================================
// Types
// ============================================================

interface SetRecord {
  weight: number;
  reps: number;
  completed: boolean;
}

type PlayerPhase = 'intro' | 'exercise' | 'rest' | 'complete';

// ============================================================
// Rest Timer Component
// ============================================================

function RestTimer({ seconds, onSkip, onComplete }: {
  seconds: number;
  onSkip: () => void;
  onComplete: () => void;
}) {
  const [remaining, setRemaining] = useState(seconds);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (paused || remaining <= 0) {
      if (remaining <= 0) onComplete();
      return;
    }
    const t = setTimeout(() => setRemaining(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining, paused, onComplete]);

  const pct = ((seconds - remaining) / seconds) * 100;
  const radius = 54;
  const circ = 2 * Math.PI * radius;
  const dash = (pct / 100) * circ;

  return (
    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '1.5rem' }}>
        Rest Period
      </div>

      <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <svg width={128} height={128} viewBox="0 0 128 128" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={64} cy={64} r={radius} fill="none" stroke="var(--clr-bg-4)" strokeWidth={8} />
          <circle cx={64} cy={64} r={radius} fill="none" stroke="var(--clr-primary)" strokeWidth={8}
            strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 1s linear' }} />
        </svg>
        <div style={{ position: 'absolute', textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--text-4xl)', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--clr-text)', lineHeight: 1 }}>
            {remaining}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)', fontWeight: 600 }}>seconds</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
        <Button variant="secondary" onClick={() => setPaused(p => !p)} size="sm">
          {paused ? <Play size={16} /> : <Pause size={16} />}
          {paused ? 'Resume' : 'Pause'}
        </Button>
        <Button onClick={onSkip} size="sm">
          <SkipForward size={16} /> Skip Rest
        </Button>
      </div>
    </div>
  );
}

// ============================================================
// Set Row Component
// ============================================================

function SetRow({ setNum, record, onChange }: {
  setNum: number;
  record: SetRecord;
  onChange: (r: SetRecord) => void;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 0.75rem',
      background: record.completed ? 'rgba(34,212,122,0.06)' : 'var(--clr-bg-3)',
      border: `1px solid ${record.completed ? 'rgba(34,212,122,0.25)' : 'var(--clr-border)'}`,
      borderRadius: 'var(--radius-md)', transition: 'all var(--transition-fast)',
      width: '100%', boxSizing: 'border-box',
    }}>
      <div style={{ width: 26, height: 26, background: 'var(--clr-bg-4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--clr-text-3)', flexShrink: 0 }}>
        {setNum}
      </div>

      <div style={{ flex: 1, display: 'flex', gap: '0.5rem', minWidth: 0 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '10px', color: 'var(--clr-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Weight (lbs)</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <button onClick={() => onChange({ ...record, weight: Math.max(0, record.weight - 5) })}
              aria-label="Decrease weight"
              style={{ width: 26, height: 26, background: 'var(--clr-bg-4)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--clr-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Minus size={11} />
            </button>
            <input type="number" value={record.weight} min={0} step={5}
              onChange={e => onChange({ ...record, weight: Number(e.target.value) })}
              style={{ width: '100%', maxWidth: 42, minWidth: 32, textAlign: 'center', background: 'var(--clr-bg-4)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-sm)', color: 'var(--clr-text)', fontSize: '13px', fontWeight: 700, padding: '0.2rem 0.1rem' }} />
            <button onClick={() => onChange({ ...record, weight: record.weight + 5 })}
              aria-label="Increase weight"
              style={{ width: 26, height: 26, background: 'var(--clr-bg-4)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--clr-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Plus size={11} />
            </button>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '10px', color: 'var(--clr-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Reps</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <button onClick={() => onChange({ ...record, reps: Math.max(0, record.reps - 1) })}
              aria-label="Decrease reps"
              style={{ width: 26, height: 26, background: 'var(--clr-bg-4)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--clr-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Minus size={11} />
            </button>
            <input type="number" value={record.reps} min={0}
              onChange={e => onChange({ ...record, reps: Number(e.target.value) })}
              style={{ width: '100%', maxWidth: 42, minWidth: 32, textAlign: 'center', background: 'var(--clr-bg-4)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-sm)', color: 'var(--clr-text)', fontSize: '13px', fontWeight: 700, padding: '0.2rem 0.1rem' }} />
            <button onClick={() => onChange({ ...record, reps: record.reps + 1 })}
              aria-label="Increase reps"
              style={{ width: 26, height: 26, background: 'var(--clr-bg-4)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--clr-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Plus size={11} />
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={() => onChange({ ...record, completed: !record.completed })}
        aria-label="Mark set complete"
        style={{
          width: 34, height: 34, borderRadius: 'var(--radius-md)',
          background: record.completed ? 'var(--clr-success)' : 'var(--clr-bg-4)',
          border: `2px solid ${record.completed ? 'var(--clr-success)' : 'var(--clr-border)'}`,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: record.completed ? 'white' : 'var(--clr-text-3)', flexShrink: 0,
          transition: 'all var(--transition-fast)',
        }}
      >
        <Check size={16} />
      </button>
    </div>
  );
}

// ============================================================
// Workout Complete Screen
// ============================================================

function WorkoutComplete({ duration, exerciseCount, totalSets, onFinish }: {
  duration: number; exerciseCount: number; totalSets: number; onFinish: () => void;
}) {
  return (
    <div style={{ textAlign: 'center', padding: '2rem 0' }} className="animate-confetti">
      <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🎉</div>
      <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900, marginBottom: '0.5rem' }}>
        Workout Complete!
      </h2>
      <p style={{ color: 'var(--clr-text-2)', marginBottom: '2rem' }}>
        Outstanding work. Recovery is part of the program — rest up!
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { icon: <Clock size={20} />, label: 'Duration', value: formatDuration(duration), color: 'var(--clr-primary)' },
          { icon: <Dumbbell size={20} />, label: 'Exercises', value: exerciseCount, color: 'var(--clr-info)' },
          { icon: <Trophy size={20} />, label: 'Sets Done', value: totalSets, color: 'var(--clr-success)' },
        ].map(({ icon, label, value, color }) => (
          <div key={label} style={{ background: 'var(--clr-bg-3)', borderRadius: 'var(--radius-lg)', padding: '1rem', border: `1px solid ${color}30` }}>
            <div style={{ color, marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>{icon}</div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 900, fontFamily: 'var(--font-display)' }}>{value}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{label}</div>
          </div>
        ))}
      </div>

      <Button onClick={onFinish} block size="lg" id="workout-finish-btn">
        <Check size={20} /> Finish & Save
      </Button>
    </div>
  );
}

// ============================================================
// Main Workout Player
// ============================================================

export default function WorkoutPlayer() {
  const { programId, dayId } = useParams<{ programId: string; dayId: string }>();
  const navigate = useNavigate();

  // Find program and day
  const program = DEMO_PROGRAMS.find(p => p.id === programId) || DEMO_PROGRAMS[0];
  const programDay = program.days.find(d => d.id === dayId) || program.days.find(d => !d.is_rest_day)!;
  const exercises = programDay?.exercises || [];

  // State
  const [phase, setPhase] = useState<PlayerPhase>('intro');
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(0);
  const [sets, setSets] = useState<Record<string, SetRecord[]>>({});
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);

  // Timer
  useEffect(() => {
    if (phase !== 'exercise' && phase !== 'rest') return;
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => clearInterval(t);
  }, [phase, startTime]);

  // Initialize sets for current exercise
  const currentExercise: WorkoutExercise | undefined = exercises[exerciseIndex];
  const exKey = currentExercise?.exercise_id || '';
  const exSets = sets[exKey] || [];

  useEffect(() => {
    if (!currentExercise) return;
    const key = currentExercise.exercise_id;
    if (!sets[key]) {
      setSets(prev => ({
        ...prev,
        [key]: Array.from({ length: currentExercise.sets }, () => ({ weight: 0, reps: 0, completed: false })),
      }));
    }
  }, [currentExercise?.exercise_id]);

  const updateSet = (idx: number, record: SetRecord) => {
    setSets(prev => ({
      ...prev,
      [exKey]: prev[exKey].map((s, i) => i === idx ? record : s),
    }));
  };

  const completeSet = () => {
    if (currentSet < (currentExercise?.sets || 0) - 1) {
      setCurrentSet(s => s + 1);
      setPhase('rest');
    } else {
      // All sets done — move to next exercise
      if (exerciseIndex < exercises.length - 1) {
        setExerciseIndex(i => i + 1);
        setCurrentSet(0);
        setPhase('rest');
      } else {
        setPhase('complete');
      }
    }
  };

  const totalSetsCompleted = Object.values(sets).reduce(
    (acc, setArr) => acc + setArr.filter(s => s.completed).length, 0
  );

  if (!programDay || programDay.is_rest_day) {
    return (
      <div style={{ padding: '1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😴</div>
        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: '0.75rem' }}>Rest Day</h2>
        <p style={{ color: 'var(--clr-text-2)', marginBottom: '2rem' }}>Today is a rest day. Take it easy!</p>
        <Button onClick={() => navigate('/workouts')}>Back to Programs</Button>
      </div>
    );
  }

  // ---- Intro screen ----
  if (phase === 'intro') {
    return (
      <div style={{ padding: '1rem 0.875rem calc(var(--bottom-nav-h) + 1.5rem)', maxWidth: 580, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        <button onClick={() => navigate('/workouts')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--clr-text-2)', cursor: 'pointer', marginBottom: '1.25rem', fontSize: 'var(--text-sm)' }}>
          <ChevronLeft size={16} /> Back to Programs
        </button>

        <div className="card" style={{ textAlign: 'center', padding: '1.75rem 1.25rem', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ width: 72, height: 72, background: 'var(--grad-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Dumbbell size={36} color="#0F1117" />
          </div>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 900, marginBottom: '0.5rem' }}>{programDay.name}</h2>
          <p style={{ color: 'var(--clr-text-2)', marginBottom: '2rem' }}>{programDay.focus}</p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 900, color: 'var(--clr-primary)' }}>{exercises.length}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Exercises</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 900, color: 'var(--clr-primary)' }}>
                ~{Math.round(exercises.reduce((a, e) => a + e.sets * (e.rest_seconds + 45), 0) / 60)}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Minutes</div>
            </div>
          </div>

          {/* Exercise list */}
          <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
            {exercises.map((ex, i) => (
              <div key={ex.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0', borderBottom: '1px solid var(--clr-border)' }}>
                <span style={{ width: 20, fontSize: 'var(--text-sm)', color: 'var(--clr-text-3)', fontWeight: 700 }}>{i + 1}.</span>
                <span style={{ flex: 1, fontSize: 'var(--text-sm)', fontWeight: 600 }}>{ex.exercise?.name}</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)' }}>{ex.sets}×{ex.reps}</span>
              </div>
            ))}
          </div>

          <Button onClick={() => setPhase('exercise')} block size="xl" id="begin-workout-btn" className="animate-pulse-glow">
            <Play size={24} /> Begin Workout
          </Button>
        </div>
      </div>
    );
  }

  // ---- Complete screen ----
  if (phase === 'complete') {
    return (
      <div style={{ padding: '1rem 0.875rem calc(var(--bottom-nav-h) + 1.5rem)', maxWidth: 580, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        <div className="card" style={{ padding: '1.75rem 1.25rem', width: '100%', boxSizing: 'border-box' }}>
          <WorkoutComplete
            duration={elapsed}
            exerciseCount={exercises.length}
            totalSets={totalSetsCompleted}
            onFinish={() => navigate('/dashboard')}
          />
        </div>
      </div>
    );
  }

  // ---- Rest screen ----
  if (phase === 'rest') {
    const nextEx = exerciseIndex < exercises.length - 1 ? exercises[exerciseIndex + 1].exercise : undefined;
    return (
      <div style={{ padding: '1rem 0.875rem calc(var(--bottom-nav-h) + 1.5rem)', maxWidth: 580, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        <div className="card" style={{ padding: '1.75rem 1.25rem', width: '100%', boxSizing: 'border-box' }}>
          <RestTimer
            seconds={currentExercise?.rest_seconds || 60}
            onSkip={() => setPhase('exercise')}
            onComplete={() => setPhase('exercise')}
          />
          {nextEx && (
            <div style={{ textAlign: 'center', marginTop: '1rem', padding: '0.75rem', background: 'var(--clr-bg-3)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)', marginBottom: '0.25rem' }}>Up Next</div>
              <div style={{ fontWeight: 700 }}>{nextEx.name}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---- Exercise screen ----
  if (!currentExercise) return null;

  return (
    <div style={{ padding: '1rem 0.875rem calc(var(--bottom-nav-h) + 1.5rem)', maxWidth: 580, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
      {/* Progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', width: '100%' }}>
        <button onClick={() => navigate('/workouts')} aria-label="Close workout" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clr-text-2)', padding: '0.25rem', display: 'flex', alignItems: 'center' }}>
          <X size={20} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)', marginBottom: '0.25rem' }}>
            Exercise {exerciseIndex + 1} of {exercises.length}
          </div>
          <div className="progress-bar" style={{ height: 4, width: '100%' }}>
            <div className="progress-fill" style={{ width: `${((exerciseIndex + 1) / exercises.length) * 100}%` }} />
          </div>
        </div>
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-text-3)', fontWeight: 600, flexShrink: 0 }}>
          {formatDuration(elapsed)}
        </div>
      </div>

      <div className="card" style={{ padding: '1.25rem 1rem', width: '100%', boxSizing: 'border-box' }}>
        {/* Exercise Video / Demonstration */}
        {currentExercise.exercise?.video_url ? (
          <div style={{
            marginBottom: '1.25rem',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            background: '#0F1117',
            border: '1px solid rgba(232,160,32,0.3)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            position: 'relative',
          }}>
            <video
              src={currentExercise.exercise.video_url}
              autoPlay
              loop
              muted
              playsInline
              controls
              style={{
                width: '100%',
                maxHeight: '260px',
                objectFit: 'contain',
                display: 'block',
                margin: '0 auto',
                background: '#000',
              }}
            />
          </div>
        ) : (
          <div style={{ height: 160, background: 'var(--clr-bg-3)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', fontSize: '3.5rem' }}>
            💪
          </div>
        )}

        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 900, marginBottom: '0.25rem' }}>
          {currentExercise.exercise?.name}
        </h2>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', color: 'var(--clr-text-2)', fontSize: 'var(--text-sm)' }}>
          <span><strong style={{ color: 'var(--clr-primary)' }}>{currentExercise.sets}</strong> sets</span>
          <span><strong style={{ color: 'var(--clr-primary)' }}>{currentExercise.reps}</strong> reps</span>
          <span><strong style={{ color: 'var(--clr-primary)' }}>{currentExercise.rest_seconds}s</strong> rest</span>
        </div>

        {/* Instructions */}
        {currentExercise.exercise?.instructions && (
          <div style={{ marginBottom: '1.25rem', padding: '0.875rem', background: 'var(--clr-bg-3)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--clr-text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
              Instructions
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-text-2)', lineHeight: 1.7 }}>
              {currentExercise.exercise.instructions[0]}
            </p>
          </div>
        )}

        {/* Sets */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--clr-text-2)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Track Your Sets
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {exSets.map((set, i) => (
              <SetRow key={i} setNum={i + 1} record={set} onChange={r => updateSet(i, r)} />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {exerciseIndex > 0 && (
            <Button variant="secondary" onClick={() => { setExerciseIndex(i => i - 1); setCurrentSet(0); }}
              style={{ flex: 'none' }}>
              <ChevronLeft size={18} />
            </Button>
          )}
          <Button onClick={completeSet} block size="lg" id="complete-set-btn">
            <Check size={20} />
            {currentSet < (currentExercise.sets - 1) ? `Complete Set ${currentSet + 1}` : 'Finish Exercise'}
          </Button>
        </div>
      </div>
    </div>
  );
}
