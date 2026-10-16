// src/pages/workouts/WorkoutPrograms.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Clock, Calendar, ChevronRight, Trophy, Play, Check, Shield, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { DEMO_PROGRAMS, selectProgram } from '../../data/workoutPrograms';
import { GOAL_LABELS, LEVEL_LABELS } from '../../lib/utils';
import type { WorkoutProgram } from '../../types';
import Button from '../../components/ui/Button';
import CustomWorkoutBuilder from '../../components/workout/CustomWorkoutBuilder';
import toast from 'react-hot-toast';

function ProgramCard({
  program,
  isActive,
  onSelect,
  onStart,
}: {
  program: WorkoutProgram;
  isActive: boolean;
  onSelect: () => void;
  onStart: () => void;
}) {
  const levelColors: Record<string, string> = {
    beginner: 'var(--clr-success)',
    intermediate: 'var(--clr-warning)',
    advanced: 'var(--clr-danger)',
  };

  return (
    <div
      className={`card ${isActive ? 'card-gold' : ''}`}
      style={{
        padding: '1.5rem',
        border: isActive ? '1px solid rgba(232,160,32,0.4)' : '1px solid var(--clr-border)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          {isActive && (
            <div style={{ marginBottom: '0.5rem' }}>
              <span className="badge badge-primary">✓ Active Program</span>
            </div>
          )}
          <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, marginBottom: '0.375rem' }}>{program.name}</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span className="badge badge-neutral">{LEVEL_LABELS[program.level]}</span>
            <span className="badge badge-neutral">{GOAL_LABELS[program.goal]}</span>
          </div>
        </div>
        <div style={{ width: 48, height: 48, background: 'rgba(232,160,32,0.12)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Dumbbell size={24} color="var(--clr-primary)" />
        </div>
      </div>

      <p style={{ color: 'var(--clr-text-2)', fontSize: 'var(--text-sm)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
        {program.description}
      </p>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--clr-text-2)', fontSize: 'var(--text-sm)' }}>
          <Calendar size={14} /> {program.days_per_week} days/week
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--clr-text-2)', fontSize: 'var(--text-sm)' }}>
          <Clock size={14} /> {program.duration_weeks} weeks
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: 'var(--text-sm)' }}>
          <div style={{ width: 8, height: 8, background: levelColors[program.level], borderRadius: '50%' }} />
          <span style={{ color: levelColors[program.level], fontWeight: 600 }}>{LEVEL_LABELS[program.level]}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <Button size="md" onClick={onStart}>
          <Play size={16} /> Start Today's Workout
        </Button>
        {!isActive && (
          <Button variant="secondary" size="md" onClick={onSelect}>
            <Check size={16} /> Switch to This Program
          </Button>
        )}
      </div>
    </div>
  );
}

export default function WorkoutPrograms() {
  const { profile, updateProfile } = useAuth();
  const navigate = useNavigate();

  const defaultProgram = profile ? selectProgram({
    goal: profile.goal,
    fitness_level: profile.fitness_level,
    training_days_per_week: profile.training_days_per_week,
    equipment: profile.equipment,
  }) : DEMO_PROGRAMS[0];

  const [programsList, setProgramsList] = useState<WorkoutProgram[]>(DEMO_PROGRAMS);
  const [activeProgramId, setActiveProgramId] = useState<string>(defaultProgram.id);
  const [showBuilder, setShowBuilder] = useState(false);

  const handleSelectProgram = (program: WorkoutProgram) => {
    setActiveProgramId(program.id);
    if (updateProfile) {
      updateProfile({
        goal: program.goal as any,
        fitness_level: program.level as any,
        training_days_per_week: program.days_per_week,
      });
    }
    toast.success(`Switched active plan to ${program.name}!`);
  };

  const handleCustomProgramCreated = (newProgram: WorkoutProgram) => {
    setProgramsList(prev => [newProgram, ...prev]);
    setActiveProgramId(newProgram.id);
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900, marginBottom: '0.5rem' }}>Workout Programs</h1>
          <p style={{ color: 'var(--clr-text-2)' }}>
            Structured programs built for men 40+. Choose a program or build your own custom routine.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button variant="secondary" onClick={() => navigate('/workouts/warmup')}>
            <Shield size={18} /> 5-Min Joint Warmup Timer
          </Button>
          <Button onClick={() => setShowBuilder(true)} id="create-custom-workout-btn">
            <Plus size={18} /> Build Custom Workout
          </Button>
        </div>
      </div>

      {/* Recommended Banner */}
      <div style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem', background: 'rgba(232,160,32,0.06)', border: '1px solid rgba(232,160,32,0.2)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Trophy size={20} color="var(--clr-primary)" />
        <div>
          <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>
            Recommended Program: <span style={{ color: 'var(--clr-primary)' }}>{defaultProgram.name}</span>
          </div>
          <div style={{ color: 'var(--clr-text-3)', fontSize: 'var(--text-xs)' }}>
            Selected for your fitness level ({profile?.fitness_level || 'beginner'}) and goals
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {programsList.map(program => (
          <ProgramCard
            key={program.id}
            program={program}
            isActive={program.id === activeProgramId}
            onSelect={() => handleSelectProgram(program)}
            onStart={() => navigate(`/workouts/player/${program.id}`)}
          />
        ))}
      </div>

      {/* Exercise Library Link */}
      <div className="card" style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
        onClick={() => navigate('/exercises')}>
        <div>
          <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Exercise Library</div>
          <div style={{ color: 'var(--clr-text-2)', fontSize: 'var(--text-sm)' }}>Browse all 30+ exercises with instructions & form cues</div>
        </div>
        <ChevronRight size={20} color="var(--clr-text-3)" />
      </div>

      {/* Custom Workout Builder Modal */}
      <CustomWorkoutBuilder
        isOpen={showBuilder}
        onClose={() => setShowBuilder(false)}
        onSave={handleCustomProgramCreated}
      />
    </div>
  );
}
