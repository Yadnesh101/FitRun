// src/pages/workouts/WarmupTimer.tsx

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Play, Pause, SkipForward, RotateCcw, Dumbbell, Shield, CheckCircle2, ChevronLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

interface WarmupExercise {
  id: string;
  name: string;
  durationSeconds: number;
  focus: string;
  cue: string;
  icon: string;
}

const WARMUP_ROUTINE: WarmupExercise[] = [
  {
    id: 'w-01',
    name: 'Cat-Cow Spinal Rotations',
    durationSeconds: 60,
    focus: 'Spine & Lower Back Mobility',
    cue: 'Inhale while arching your back and lifting head; exhale while rounding spine toward ceiling.',
    icon: '🧘‍♂️',
  },
  {
    id: 'w-02',
    name: 'Thoracic Windmills',
    durationSeconds: 60,
    focus: 'Mid-Back & Shoulder Mobility',
    cue: 'Lie on side with knees stacked, rotate upper arm open toward floor while tracking hand with eyes.',
    icon: '🔄',
  },
  {
    id: 'w-03',
    name: 'World\'s Greatest Stretch',
    durationSeconds: 60,
    focus: 'Hip Flexor & Hamstrings',
    cue: 'Step forward into deep lunge, place inside elbow near ankle, then rotate arm up to sky. 30s per side.',
    icon: '🏃‍♂️',
  },
  {
    id: 'w-04',
    name: 'Arm Circles & Hugs',
    durationSeconds: 60,
    focus: 'Shoulders & Chest Warmup',
    cue: 'Perform 10 forward arm circles, 10 backward circles, then alternating chest hugs.',
    icon: '🙆‍♂️',
  },
  {
    id: 'w-05',
    name: 'Bodyweight Ankle & Squat Hold',
    durationSeconds: 60,
    focus: 'Ankle Mobility & Quad Activation',
    cue: 'Sink into deep squat position holding onto a doorframe or post, gently shift weight side to side.',
    icon: '🦵',
  },
];

export default function WarmupTimer() {
  const { programId } = useParams();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(WARMUP_ROUTINE[0].durationSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentStep = WARMUP_ROUTINE[currentIndex];

  useEffect(() => {
    let timer: any = null;
    if (isRunning && secondsRemaining > 0) {
      timer = setInterval(() => setSecondsRemaining(prev => prev - 1), 1000);
    } else if (secondsRemaining === 0 && isRunning) {
      if (currentIndex < WARMUP_ROUTINE.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSecondsRemaining(WARMUP_ROUTINE[currentIndex + 1].durationSeconds);
        toast.success(`Next: ${WARMUP_ROUTINE[currentIndex + 1].name}`);
      } else {
        setIsRunning(false);
        setIsFinished(true);
        toast.success('🎉 5-Minute Warmup Complete! Joints lubricated & ready to lift!');
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, secondsRemaining, currentIndex]);

  const handleToggleTimer = () => setIsRunning(!isRunning);

  const handleSkip = () => {
    if (currentIndex < WARMUP_ROUTINE.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSecondsRemaining(WARMUP_ROUTINE[currentIndex + 1].durationSeconds);
    } else {
      setIsFinished(true);
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentIndex(0);
    setSecondsRemaining(WARMUP_ROUTINE[0].durationSeconds);
    setIsFinished(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const totalCompletedSeconds = WARMUP_ROUTINE.slice(0, currentIndex).reduce((acc, x) => acc + x.durationSeconds, 0) + (currentStep.durationSeconds - secondsRemaining);
  const overallProgressPct = Math.min(100, Math.round((totalCompletedSeconds / 300) * 100));

  return (
    <div style={{ padding: '1.5rem', maxWidth: 640, margin: '0 auto' }}>
      {/* Top bar */}
      <button
        onClick={() => navigate(programId ? `/workouts/player/${programId}` : '/workouts')}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', background: 'none', border: 'none', color: 'var(--clr-text-3)', cursor: 'pointer', fontSize: 'var(--text-sm)', marginBottom: '1.5rem' }}
      >
        <ChevronLeft size={18} /> Back to Workouts
      </button>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ width: 44, height: 44, background: 'rgba(232,160,32,0.12)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Shield size={24} color="var(--clr-primary)" />
        </div>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>5-Min Joint Warmup</h1>
          <p style={{ color: 'var(--clr-text-3)', fontSize: 'var(--text-xs)' }}>
            Essential midlife joint lubrication & spine mobility before strength training
          </p>
        </div>
      </div>

      {/* Routine Progress Bar */}
      <div style={{ background: 'var(--clr-bg-4)', height: 8, borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: '1.5rem' }}>
        <div style={{ width: `${overallProgressPct}%`, background: 'var(--grad-primary)', height: '100%', transition: 'width 0.3s' }} />
      </div>

      {/* Main Exercise Card */}
      {isFinished ? (
        <div className="card card-gold animate-fade-in" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ width: 64, height: 64, background: 'rgba(34,212,122,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <CheckCircle2 size={36} color="var(--clr-success)" />
          </div>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 900, marginBottom: '0.5rem' }}>Joints Ready to Lift!</h2>
          <p style={{ color: 'var(--clr-text-2)', fontSize: 'var(--text-sm)', marginBottom: '1.5rem' }}>
            Your core temperature is elevated, synovial fluid is active, and your shoulders & hips are open.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button variant="secondary" block onClick={handleReset}>
              <RotateCcw size={16} /> Repeat Warmup
            </Button>
            <Button block onClick={() => navigate(programId ? `/workouts/player/${programId}` : '/workouts')}>
              <Dumbbell size={18} /> Start Main Workout
            </Button>
          </div>
        </div>
      ) : (
        <div className="card card-gold" style={{ padding: '2rem', textAlign: 'center', marginBottom: '1.5rem', position: 'relative' }}>
          <div style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--clr-primary)', fontWeight: 700, marginBottom: '0.5rem' }}>
            Exercise {currentIndex + 1} of {WARMUP_ROUTINE.length}
          </div>

          <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>{currentStep.icon}</div>

          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: '0.25rem' }}>{currentStep.name}</h2>
          <div className="badge badge-neutral" style={{ margin: '0 auto 1.25rem', display: 'inline-block' }}>
            Focus: {currentStep.focus}
          </div>

          {/* Large Countdown Timer */}
          <div style={{
            fontSize: '3.5rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: isRunning ? 'var(--clr-primary)' : 'var(--clr-text-2)',
            background: 'var(--clr-bg-3)', borderRadius: 'var(--radius-xl)', padding: '0.5rem 1.5rem', display: 'inline-block',
            marginBottom: '1.5rem', border: '1px solid var(--clr-border)',
          }}>
            {formatTime(secondsRemaining)}
          </div>

          {/* Form Cue */}
          <p style={{ color: 'var(--clr-text-2)', fontSize: 'var(--text-sm)', lineHeight: 1.6, background: 'rgba(0,0,0,0.2)', padding: '0.875rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            💡 <strong>Technique Cue:</strong> {currentStep.cue}
          </p>

          {/* Timer Control Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <Button size="lg" onClick={handleToggleTimer} style={{ minWidth: 140 }}>
              {isRunning ? <><Pause size={20} /> Pause</> : <><Play size={20} /> {secondsRemaining < currentStep.durationSeconds ? 'Resume' : 'Start Timer'}</>}
            </Button>
            <Button variant="secondary" size="lg" onClick={handleSkip}>
              <SkipForward size={20} /> Skip
            </Button>
            <Button variant="ghost" size="lg" onClick={handleReset}>
              <RotateCcw size={20} />
            </Button>
          </div>
        </div>
      )}

      {/* Routine Overview List */}
      <div className="card">
        <h3 style={{ fontWeight: 700, fontSize: 'var(--text-base)', marginBottom: '1rem' }}>Warmup Routine Breakdown</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {WARMUP_ROUTINE.map((ex, idx) => (
            <div key={ex.id} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-md)',
              background: idx === currentIndex ? 'rgba(232,160,32,0.1)' : 'var(--clr-bg-3)',
              border: idx === currentIndex ? '1px solid rgba(232,160,32,0.3)' : '1px solid transparent',
            }}>
              <span style={{ fontSize: '1.25rem' }}>{ex.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: idx === currentIndex ? 'var(--clr-primary)' : 'var(--clr-text)' }}>
                  {ex.name}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)' }}>{ex.focus}</div>
              </div>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--clr-text-3)' }}>{ex.durationSeconds}s</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
