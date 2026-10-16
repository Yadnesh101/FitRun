// src/components/workout/CustomWorkoutBuilder.tsx

import { useState } from 'react';
import { Plus, Trash2, Dumbbell, Save, X, Search } from 'lucide-react';
import DEMO_EXERCISES from '../../data/exercises';
import type { Exercise, WorkoutProgram, WorkoutProgramDay } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import toast from 'react-hot-toast';

interface CustomWorkoutBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newProgram: WorkoutProgram) => void;
}

export default function CustomWorkoutBuilder({ isOpen, onClose, onSave }: CustomWorkoutBuilderProps) {
  const [workoutName, setWorkoutName] = useState('My Custom Routine');
  const [description, setDescription] = useState('Personalized workout routine built for my specific equipment and targets.');
  const [selectedExercises, setSelectedExercises] = useState<Array<{
    exercise: Exercise;
    sets: number;
    reps: string;
    restSeconds: number;
  }>>([
    { exercise: DEMO_EXERCISES[0], sets: 3, reps: '10-12', restSeconds: 60 },
    { exercise: DEMO_EXERCISES[1], sets: 3, reps: '10-12', restSeconds: 90 },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  if (!isOpen) return null;

  const filteredExercises = DEMO_EXERCISES.filter(ex =>
    ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ex.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddExercise = (exercise: Exercise) => {
    setSelectedExercises(prev => [...prev, { exercise, sets: 3, reps: '10-12', restSeconds: 60 }]);
    setShowPicker(false);
    toast.success(`Added ${exercise.name} to routine`);
  };

  const handleRemoveExercise = (index: number) => {
    setSelectedExercises(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateSets = (index: number, delta: number) => {
    setSelectedExercises(prev => prev.map((item, i) => i === index ? { ...item, sets: Math.max(1, item.sets + delta) } : item));
  };

  const handleUpdateReps = (index: number, reps: string) => {
    setSelectedExercises(prev => prev.map((item, i) => i === index ? { ...item, reps } : item));
  };

  const handleSaveRoutine = () => {
    if (!workoutName.trim()) {
      toast.error('Please enter a routine name');
      return;
    }
    if (selectedExercises.length === 0) {
      toast.error('Please add at least one exercise to your routine');
      return;
    }

    const programId = `custom-prog-${Date.now()}`;
    const dayId = `custom-day-${Date.now()}`;

    const customDay: WorkoutProgramDay = {
      id: dayId,
      program_id: programId,
      day_number: 1,
      name: workoutName,
      focus: 'Custom Strength',
      is_rest_day: false,
      exercises: selectedExercises.map((item, idx) => ({
        id: `custom-we-${idx}-${Date.now()}`,
        program_day_id: dayId,
        exercise_id: item.exercise.id,
        exercise: item.exercise,
        sets: item.sets,
        reps: item.reps,
        rest_seconds: item.restSeconds,
        order_index: idx + 1,
      })),
    };

    const newProgram: WorkoutProgram = {
      id: programId,
      name: workoutName,
      description,
      level: 'intermediate',
      goal: 'improve_fitness',
      days_per_week: 3,
      duration_weeks: 4,
      is_system: false,
      days: [customDay],
      created_at: new Date().toISOString(),
    };

    onSave(newProgram);
    toast.success(`🎉 Custom Routine "${workoutName}" created!`);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1100,
      background: 'rgba(9, 11, 16, 0.85)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
    }}>
      <div className="card card-gold animate-fade-in" style={{ maxWidth: 640, width: '100%', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{ width: 38, height: 38, background: 'var(--grad-primary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Dumbbell size={20} color="#0F1117" />
            </div>
            <div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>Custom Workout Builder</h3>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)' }}>Build and save your own tailored routine</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--clr-text-3)', cursor: 'pointer', padding: '0.25rem' }}>
            <X size={20} />
          </button>
        </div>

        {/* Routine Title & Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '1.5rem' }}>
          <Input
            id="custom-name"
            label="Routine Name"
            value={workoutName}
            onChange={e => setWorkoutName(e.target.value)}
            placeholder="e.g. Saturday Arm & Core Blast"
            required
          />
          <Input
            id="custom-desc"
            label="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="e.g. Short dumbbell routine focused on arms and posture"
          />
        </div>

        {/* Selected Exercises List */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--clr-text-2)' }}>
              Exercises ({selectedExercises.length})
            </h4>
            <Button size="sm" variant="secondary" onClick={() => setShowPicker(true)}>
              <Plus size={14} /> Add Exercise
            </Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {selectedExercises.map((item, idx) => (
              <div key={idx} style={{
                display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem 1rem',
                background: 'var(--clr-bg-3)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-md)',
              }}>
                <span style={{ fontWeight: 800, color: 'var(--clr-primary)', fontSize: 'var(--text-sm)' }}>#{idx + 1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{item.exercise.name}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)' }}>{item.exercise.category} • {item.exercise.equipment}</div>
                </div>

                {/* Sets Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: 'var(--clr-bg-4)', borderRadius: 'var(--radius-sm)', padding: '0.25rem 0.5rem' }}>
                  <button type="button" onClick={() => handleUpdateSets(idx, -1)} style={{ background: 'none', border: 'none', color: 'var(--clr-text)', cursor: 'pointer' }}>-</button>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>{item.sets} sets</span>
                  <button type="button" onClick={() => handleUpdateSets(idx, 1)} style={{ background: 'none', border: 'none', color: 'var(--clr-text)', cursor: 'pointer' }}>+</button>
                </div>

                {/* Reps Selector */}
                <select
                  value={item.reps}
                  onChange={e => handleUpdateReps(idx, e.target.value)}
                  style={{ background: 'var(--clr-bg-4)', border: '1px solid var(--clr-border)', color: 'var(--clr-text)', fontSize: 'var(--text-xs)', borderRadius: 'var(--radius-sm)', padding: '0.25rem 0.5rem' }}
                >
                  <option value="8-10">8-10 reps</option>
                  <option value="10-12">10-12 reps</option>
                  <option value="12-15">12-15 reps</option>
                  <option value="30s">30s hold</option>
                </select>

                {/* Trash */}
                <button type="button" onClick={() => handleRemoveExercise(idx)} style={{ background: 'none', border: 'none', color: 'var(--clr-danger)', cursor: 'pointer', padding: '0.25rem' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Exercise Picker Modal inside */}
        {showPicker && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 1200,
            background: 'rgba(0,0,0,0.8)', padding: '1.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div className="card" style={{ maxWidth: 500, width: '100%', maxHeight: '80vh', overflowY: 'auto', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ fontWeight: 800, fontSize: 'var(--text-lg)' }}>Select Exercise</h4>
                <button onClick={() => setShowPicker(false)} style={{ background: 'none', border: 'none', color: 'var(--clr-text-3)', cursor: 'pointer' }}><X size={18} /></button>
              </div>

              <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <Search size={16} color="var(--clr-text-3)" style={{ position: 'absolute', left: 12, top: 12 }} />
                <input
                  type="text"
                  placeholder="Search exercises..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '0.625rem 0.875rem 0.625rem 2.5rem', background: 'var(--clr-bg-3)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-md)', color: 'var(--clr-text)', fontSize: 'var(--text-sm)' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {filteredExercises.map(ex => (
                  <div
                    key={ex.id}
                    onClick={() => handleAddExercise(ex)}
                    style={{
                      padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--clr-bg-3)',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
                      border: '1px solid var(--clr-border)', transition: 'background var(--transition-fast)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--clr-bg-4)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'var(--clr-bg-3)')}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{ex.name}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)' }}>{ex.category} • {ex.equipment}</div>
                    </div>
                    <Plus size={16} color="var(--clr-primary)" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="secondary" block onClick={onClose}>
            Cancel
          </Button>
          <Button block onClick={handleSaveRoutine} id="save-custom-workout">
            <Save size={18} /> Save & Start Custom Routine
          </Button>
        </div>
      </div>
    </div>
  );
}
