// src/pages/workouts/ExerciseLibrary.tsx

import { useState, useMemo } from 'react';
import { Search, X, Video } from 'lucide-react';
import DEMO_EXERCISES from '../../data/exercises';
import { LEVEL_LABELS, EQUIPMENT_LABELS, titleCase } from '../../lib/utils';
import type { ExerciseCategory, FitnessLevel } from '../../types';

const CATEGORIES: { value: ExerciseCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'chest', label: 'Chest' },
  { value: 'back', label: 'Back' },
  { value: 'shoulders', label: 'Shoulders' },
  { value: 'arms', label: 'Arms' },
  { value: 'legs', label: 'Legs' },
  { value: 'core', label: 'Core' },
  { value: 'full_body', label: 'Full Body' },
  { value: 'mobility', label: 'Mobility' },
];

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'var(--clr-success)',
  intermediate: 'var(--clr-warning)',
  advanced: 'var(--clr-danger)',
};

function ExerciseDetailModal({ exercise, onClose }: { exercise: any; onClose: () => void }) {
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center', backdropFilter: 'blur(4px)',
      padding: '1rem',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--clr-bg-2)', borderRadius: 'var(--radius-2xl)', padding: '1.5rem',
        width: '100%', maxWidth: 560, maxHeight: '85vh', overflowY: 'auto',
        border: '1px solid var(--clr-border)',
        animation: 'fadeIn 0.3s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: '0.5rem' }}>{exercise.name}</h2>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-neutral">{titleCase(exercise.category)}</span>
              <span className="badge" style={{ background: `rgba(${DIFFICULTY_COLORS[exercise.difficulty] === 'var(--clr-success)' ? '34,212,122' : DIFFICULTY_COLORS[exercise.difficulty] === 'var(--clr-warning)' ? '245,166,35' : '239,68,68'},0.12)`, color: DIFFICULTY_COLORS[exercise.difficulty], border: `1px solid ${DIFFICULTY_COLORS[exercise.difficulty]}30` }}>
                {LEVEL_LABELS[exercise.difficulty]}
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'var(--clr-bg-3)', border: 'none', borderRadius: 'var(--radius-md)', padding: '0.5rem', cursor: 'pointer', color: 'var(--clr-text-2)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Video demonstration or placeholder */}
        {exercise.video_url ? (
          <div style={{
            marginBottom: '1.5rem',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            background: '#0F1117',
            border: '1px solid rgba(232,160,32,0.3)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            position: 'relative',
          }}>
            <video
              src={exercise.video_url}
              controls
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: '100%',
                maxHeight: '340px',
                objectFit: 'contain',
                display: 'block',
                background: '#000',
              }}
            />
            <div style={{
              position: 'absolute', top: 12, right: 12,
              background: 'rgba(15,17,23,0.85)', backdropFilter: 'blur(6px)',
              color: 'var(--clr-primary)', padding: '0.25rem 0.6rem',
              borderRadius: 'var(--radius-sm)', fontSize: '11px', fontWeight: 800,
              letterSpacing: '0.04em', border: '1px solid rgba(232,160,32,0.4)',
              pointerEvents: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem',
            }}>
              <Video size={13} /> FORM DEMO
            </div>
          </div>
        ) : (
          <div className="exercise-image-placeholder" style={{ marginBottom: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💪</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-text-3)' }}>Exercise demonstration</div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Sets', value: exercise.default_sets },
            { label: 'Reps', value: exercise.default_reps },
            { label: 'Rest', value: `${exercise.rest_seconds}s` },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: 'var(--clr-bg-3)', borderRadius: 'var(--radius-md)', padding: '0.75rem', textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--clr-primary)' }}>{value}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Muscles */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--clr-text-2)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Muscles Worked
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {exercise.muscle_groups.map((m: string) => (
              <span key={m} className="badge badge-primary">{titleCase(m)}</span>
            ))}
          </div>
        </div>

        {/* Equipment */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--clr-text-2)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Equipment
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {exercise.equipment.map((e: string) => (
              <span key={e} className="badge badge-neutral">{EQUIPMENT_LABELS[e] || titleCase(e)}</span>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--clr-text-2)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Instructions
          </div>
          <ol style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {exercise.instructions.map((step: string, i: number) => (
              <li key={i} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                <span style={{
                  width: 24, height: 24, background: 'var(--grad-primary)',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 'var(--text-xs)', fontWeight: 800, color: '#0F1117', flexShrink: 0, marginTop: 2,
                }}>
                  {i + 1}
                </span>
                <span style={{ color: 'var(--clr-text-2)', lineHeight: 1.7, fontSize: 'var(--text-sm)' }}>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Safety */}
        {exercise.safety_notes && (
          <div style={{ padding: '1rem', background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--clr-warning)', marginBottom: '0.375rem' }}>⚠️ Safety Note</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-text-2)', lineHeight: 1.6 }}>{exercise.safety_notes}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExerciseLibrary() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ExerciseCategory | 'all'>('all');
  const [difficulty, setDifficulty] = useState<FitnessLevel | 'all'>('all');
  const [selectedExercise, setSelectedExercise] = useState<any>(null);

  const filtered = useMemo(() => {
    return DEMO_EXERCISES.filter(e => {
      if (search && !e.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (category !== 'all' && e.category !== category) return false;
      if (difficulty !== 'all' && e.difficulty !== difficulty) return false;
      return true;
    });
  }, [search, category, difficulty]);

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900, marginBottom: '0.5rem' }}>Exercise Library</h1>
        <p style={{ color: 'var(--clr-text-2)' }}>{DEMO_EXERCISES.length} exercises with full instructions</p>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--clr-text-3)' }} />
        <input
          className="form-input"
          style={{ paddingLeft: '2.75rem' }}
          placeholder="Search exercises..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          id="exercise-search"
        />
        {search && (
          <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clr-text-3)' }}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', marginBottom: '1rem', paddingBottom: '0.5rem' }}>
        {CATEGORIES.map(cat => (
          <button key={cat.value} onClick={() => setCategory(cat.value as ExerciseCategory | 'all')}
            className={`badge ${category === cat.value ? 'badge-primary' : 'badge-neutral'}`}
            style={{ cursor: 'pointer', border: 'none', whiteSpace: 'nowrap', padding: '0.5rem 0.875rem', fontSize: 'var(--text-sm)' }}>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Difficulty filter */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {(['all', 'beginner', 'intermediate', 'advanced'] as const).map(d => (
          <button key={d} onClick={() => setDifficulty(d as any)}
            className={`badge ${difficulty === d ? 'badge-primary' : 'badge-neutral'}`}
            style={{ cursor: 'pointer', border: 'none', padding: '0.4rem 0.75rem', fontSize: 'var(--text-xs)' }}>
            {d === 'all' ? 'All Levels' : LEVEL_LABELS[d]}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-text-3)', marginBottom: '1rem' }}>
        Showing {filtered.length} exercise{filtered.length !== 1 ? 's' : ''}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><Search size={28} /></div>
          <div className="empty-title">No exercises found</div>
          <div className="empty-desc">Try adjusting your filters or search term.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
          {filtered.map(exercise => (
            <div
              key={exercise.id}
              className="card card-interactive"
              onClick={() => setSelectedExercise(exercise)}
              style={{ cursor: 'pointer' }}
            >
              {/* Placeholder image */}
              <div style={{
                height: 100, background: 'var(--clr-bg-3)', borderRadius: 'var(--radius-md)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '0.875rem', fontSize: '2.5rem',
              }}>
                {exercise.category === 'chest' ? '💪' : exercise.category === 'back' ? '🏋️' : exercise.category === 'legs' ? '🦵' : exercise.category === 'core' ? '🎯' : exercise.category === 'mobility' ? '🧘' : '🏋️'}
              </div>

              <div style={{ fontWeight: 700, marginBottom: '0.375rem' }}>{exercise.name}</div>
              <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '0.625rem', alignItems: 'center' }}>
                <span className="badge badge-neutral" style={{ fontSize: '10px' }}>{titleCase(exercise.category)}</span>
                <span className="badge" style={{ fontSize: '10px', color: DIFFICULTY_COLORS[exercise.difficulty] }}>{LEVEL_LABELS[exercise.difficulty]}</span>
                {exercise.video_url && (
                  <span className="badge badge-primary" style={{ fontSize: '10px', display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '0.15rem 0.45rem' }}>
                    <Video size={10} /> Video
                  </span>
                )}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)' }}>
                {exercise.default_sets} sets × {exercise.default_reps} reps
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedExercise && (
        <ExerciseDetailModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />
      )}
    </div>
  );
}
