// src/pages/Landing.tsx
// ============================================================
// Premium marketing landing page for Fit For Midlife Men
// ============================================================

import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Dumbbell, ChevronRight, Check, Play, TrendingUp,
  ChevronDown, ArrowRight, Activity, Target,
} from 'lucide-react';

// ============================================================
// Navigation
// ============================================================

function LandingNav() {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      padding: '1rem 1.5rem',
      background: 'rgba(15,17,23,0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{ maxWidth: 'var(--content-max-w)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 38, height: 38, background: 'var(--grad-primary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Dumbbell size={20} color="#0F1117" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', letterSpacing: '0.04em', background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              FIT MIDLIFE
            </div>
          </div>
        </div>

        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {['How It Works', 'Workouts', 'Nutrition', 'Pricing'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-text-2)', fontWeight: 500, transition: 'color var(--transition-fast)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--clr-text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--clr-text-2)')}>
              {item}
            </a>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Link to="/auth/login" className="btn btn-ghost btn-sm hide-mobile">Sign In</Link>
          <Link to="/auth/signup" className="btn btn-primary btn-sm" id="nav-cta-btn">Start Free</Link>
        </div>
      </div>
    </nav>
  );
}

// ============================================================
// Hero
// ============================================================

function Hero() {
  return (
    <section className="hero" style={{ paddingTop: '80px' }}>
      {/* Background decoration */}
      <div style={{ position: 'absolute', top: '10%', right: '-5%', width: '500px', height: '500px', background: 'radial-gradient(ellipse, rgba(232,160,32,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: '400px', height: '400px', background: 'radial-gradient(ellipse, rgba(59,130,246,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="container" style={{ padding: '5rem 1.5rem' }}>
        <div className="hero-content animate-fade-in">
          <div className="hero-eyebrow">
            <Dumbbell size={14} /> Built for men 40+
          </div>

          <h1 className="hero-title">
            GET STRONGER,<br />
            LEANER &{' '}
            <span style={{ background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              MORE ENERGETIC
            </span>
            <br />AFTER 40.
          </h1>

          <p className="hero-subtitle">
            A simple fitness system built for men 40+ who want structured workouts,
            better nutrition, and measurable progress — without the confusion.
          </p>

          <div className="hero-ctas">
            <Link to="/auth/signup" className="btn btn-primary btn-xl glow-on-hover" id="hero-primary-cta">
              Start Your Fitness Journey <ArrowRight size={20} />
            </Link>
            <a href="#how-it-works" className="btn btn-secondary btn-lg">
              <Play size={18} /> See How It Works
            </a>
          </div>

          <div className="hero-stats stagger">
            {[
              { value: '40+', label: 'Exercises in library' },
              { value: '3', label: 'Structured programs' },
              { value: '100%', label: 'Free to start' },
            ].map(({ value, label }) => (
              <div key={label} className="hero-stat-item animate-fade-in">
                <div className="hero-stat-value">{value}</div>
                <div className="hero-stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Why Section
// ============================================================

function WhySection() {
  const points = [
    {
      icon: '🔬',
      title: 'Your Body Has Changed',
      desc: 'After 40, testosterone levels decline, recovery slows, and muscle loss accelerates. A generic workout from YouTube or a 25-year-old trainer simply won\'t deliver the same results.'
    },
    {
      icon: '⚡',
      title: 'You Need a Smarter Approach',
      desc: 'Strategic training — not more intensity — is the key after 40. Smart exercise selection, proper recovery, and adequate protein intake produce real results without the injuries.'
    },
    {
      icon: '🎯',
      title: 'Consistency Over Intensity',
      desc: 'The men who transform their bodies at 40, 50, and 60 aren\'t training the hardest. They\'re training consistently. Fit Midlife helps you build the habits and structure that make consistency automatic.'
    },
  ];

  return (
    <section className="landing-section" id="how-it-works">
      <div className="container">
        <div className="landing-section-header">
          <span className="section-eyebrow">Why Different</span>
          <h2 className="section-headline">
            Fitness After 40 Needs a{' '}
            <span style={{ background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Different Approach</span>
          </h2>
          <p className="section-subheadline">
            What works at 25 doesn't always work at 45. Here's why our approach is built specifically for your body and life stage.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {points.map(({ icon, title, desc }) => (
            <div key={title} className="feature-card animate-fade-in">
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{icon}</div>
              <h3 className="feature-card-title">{title}</h3>
              <p className="feature-card-desc">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// How It Works
// ============================================================

function HowItWorksSection() {
  const steps = [
    { num: '01', icon: <Target size={28} />, title: 'Tell Us About Yourself', desc: 'Complete a quick onboarding to share your goals, fitness level, available equipment, and schedule. No gym required.' },
    { num: '02', icon: <Dumbbell size={28} />, title: 'Get Your Program', desc: 'Receive a personalized workout program matched to your goals, experience, and available time. Everything is explained clearly.' },
    { num: '03', icon: <Activity size={28} />, title: 'Follow & Track', desc: 'Follow your program with step-by-step exercise guidance. Track your sets, reps, and weights to see progress over time.' },
    { num: '04', icon: <TrendingUp size={28} />, title: 'See Real Results', desc: 'Track your body measurements and strength gains. Watch your progress charts grow as you build the body you want.' },
  ];

  return (
    <section className="landing-section alt-bg">
      <div className="container">
        <div className="landing-section-header">
          <span className="section-eyebrow">The Process</span>
          <h2 className="section-headline">Simple. Structured. Effective.</h2>
          <p className="section-subheadline">No complicated plans. No information overload. Just a clear system that works.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
          {steps.map(({ num, icon, title, desc }) => (
            <div key={num} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: 56, height: 56, background: 'rgba(232,160,32,0.1)', border: '1px solid rgba(232,160,32,0.2)',
                  borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--clr-primary)', flexShrink: 0,
                }}>
                  {icon}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 900, color: 'var(--clr-bg-4)' }}>
                  {num}
                </div>
              </div>
              <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800 }}>{title}</h3>
              <p style={{ color: 'var(--clr-text-2)', lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Features Sections (Workouts & Nutrition)
// ============================================================

function WorkoutFeaturesSection() {
  const features = [
    '3 structured programs for different goals',
    'Step-by-step exercise instructions',
    'Built-in rest timer',
    'Track weight, sets, and reps',
    'Workout history and streaks',
    'Home & gym-friendly options',
  ];

  return (
    <section className="landing-section" id="workouts">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          <div>
            <span className="section-eyebrow">Workouts</span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: '1rem' }}>
              Structured Programs That Actually Work
            </h2>
            <p style={{ color: 'var(--clr-text-2)', lineHeight: 1.8, marginBottom: '2rem' }}>
              Not random workouts. Structured, progressive programs designed for men 40+ with clear instructions and built-in progression. Follow the plan, track your results.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              {features.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 22, height: 22, background: 'rgba(232,160,32,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={13} color="var(--clr-primary)" />
                  </div>
                  <span style={{ color: 'var(--clr-text-2)', fontSize: 'var(--text-sm)' }}>{f}</span>
                </div>
              ))}
            </div>
            <Link to="/auth/signup" className="btn btn-primary btn-lg" id="workout-feature-cta">
              View Programs <ChevronRight size={18} />
            </Link>
          </div>
          <div>
            {/* App screenshot mockup */}
            <div style={{ background: 'var(--clr-bg-2)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-2xl)', padding: '1.5rem', boxShadow: 'var(--shadow-xl)' }}>
              <div style={{ background: 'var(--clr-bg-3)', borderRadius: 'var(--radius-xl)', padding: '1.25rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Today's Workout</div>
                <div style={{ fontWeight: 800, fontSize: 'var(--text-xl)', marginBottom: '0.25rem' }}>Full Body Strength A</div>
                <div style={{ color: 'var(--clr-text-3)', fontSize: 'var(--text-sm)', display: 'flex', gap: '1rem' }}>
                  <span>~42 min</span><span>6 exercises</span>
                </div>
              </div>
              {['Goblet Squat', 'Dumbbell Chest Press', 'Dumbbell Row', 'Romanian Deadlift'].map((ex, i) => (
                <div key={ex} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0', borderBottom: '1px solid var(--clr-border)' }}>
                  <div style={{ width: 24, height: 24, background: 'var(--grad-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800, color: '#0F1117', flexShrink: 0 }}>{i + 1}</div>
                  <span style={{ flex: 1, fontSize: 'var(--text-sm)', fontWeight: 500 }}>{ex}</span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)' }}>3×10</span>
                </div>
              ))}
              <button style={{ marginTop: '1rem', width: '100%', padding: '0.875rem', background: 'var(--grad-primary)', border: 'none', borderRadius: 'var(--radius-lg)', fontWeight: 800, color: '#0F1117', fontSize: 'var(--text-base)', cursor: 'pointer' }}>
                ▶ Start Workout
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NutritionFeaturesSection() {
  return (
    <section className="landing-section alt-bg" id="nutrition">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          <div style={{ order: 1 }}>
            {/* Nutrition card mockup */}
            <div style={{ background: 'var(--clr-bg-2)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-2xl)', padding: '1.5rem', boxShadow: 'var(--shadow-xl)' }}>
              <div style={{ fontWeight: 800, fontSize: 'var(--text-lg)', marginBottom: '0.25rem' }}>Today's Nutrition</div>
              <div style={{ color: 'var(--clr-text-3)', fontSize: 'var(--text-sm)', marginBottom: '1.5rem' }}>Monday, October 5</div>
              {[
                { label: 'Calories', current: 1840, target: 2200, color: 'var(--clr-primary)' },
                { label: 'Protein', current: 145, target: 185, unit: 'g', color: 'var(--clr-info)' },
                { label: 'Water', current: 1.8, target: 2.8, unit: 'L', color: 'var(--clr-success)' },
              ].map(({ label, current, target, unit, color }) => (
                <div key={label} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem', fontSize: 'var(--text-sm)' }}>
                    <span style={{ fontWeight: 600 }}>{label}</span>
                    <span style={{ color: 'var(--clr-text-3)' }}>{current}{unit || ''} / {target}{unit || ''}</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--clr-bg-4)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min((current / target) * 100, 100)}%`, background: color, borderRadius: 'var(--radius-full)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <span className="section-eyebrow">Nutrition</span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: '1rem' }}>
              Simple Nutrition Tracking Built for Real Life
            </h2>
            <p style={{ color: 'var(--clr-text-2)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              No complicated calorie counting apps. Just clear daily targets for calories, protein, and water based on your goals — and a simple log to track your meals.
            </p>
            <p style={{ color: 'var(--clr-text-3)', fontSize: 'var(--text-sm)', lineHeight: 1.7, padding: '0.875rem', background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 'var(--radius-md)' }}>
              <strong style={{ color: 'var(--clr-info)' }}>Note:</strong> Calorie and macro estimates are general guidelines, not medical prescriptions. Consult a registered dietitian for personalized nutrition advice.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Testimonials (Placeholder — clearly marked)
// ============================================================

function TestimonialsSection() {
  const placeholders = [
    { initials: 'M.R.', name: 'Mike R.', age: 47, text: '[Placeholder] Real testimonials from actual customers will be added here once the product launches and we have genuine user feedback to share.' },
    { initials: 'D.T.', name: 'David T.', age: 52, text: '[Placeholder] We do not fabricate testimonials. This space is reserved for authentic reviews from real members of the Fit Midlife community.' },
    { initials: 'J.C.', name: 'James C.', age: 44, text: '[Placeholder] When real members share their experiences, those genuine stories will appear here. We believe in honest marketing.' },
  ];

  return (
    <section className="landing-section">
      <div className="container">
        <div className="landing-section-header">
          <span className="section-eyebrow">Community</span>
          <h2 className="section-headline">Men Transforming After 40</h2>
          <p className="section-subheadline">
            Real stories from real people — testimonials will appear here once members share their genuine experiences.
          </p>
          <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', color: 'var(--clr-warning)', marginTop: '0.75rem' }}>
            ⚠️ These are placeholder cards — not real testimonials
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {placeholders.map(({ initials, name, age, text }) => (
            <div key={name} className="feature-card">
              <div style={{ display: 'flex', gap: '0.875rem', marginBottom: '1rem', alignItems: 'center' }}>
                <div className="avatar avatar-md">{initials}</div>
                <div>
                  <div style={{ fontWeight: 700 }}>{name}</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-text-3)' }}>Age {age}</div>
                </div>
              </div>
              <p style={{ color: 'var(--clr-text-3)', lineHeight: 1.7, fontSize: 'var(--text-sm)', fontStyle: 'italic' }}>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Pricing
// ============================================================

function PricingSection() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      desc: 'Get started with the basics',
      features: ['3-Day Starter Program', 'Exercise library', 'Basic progress tracking', 'Habit tracker'],
      cta: 'Start Free',
      href: '/auth/signup',
      highlight: false,
    },
    {
      name: 'Pro',
      price: '$19.99',
      period: '/month',
      desc: 'Everything you need to transform',
      features: ['All workout programs', 'Personalized program', 'Full nutrition tools', 'AI Fit Coach', 'Advanced progress charts', 'Priority support'],
      cta: 'Get Pro',
      href: '/auth/signup',
      highlight: true,
      badge: 'Most Popular',
    },
    {
      name: 'Annual',
      price: '$149',
      period: '/year',
      desc: 'Best value — save $90',
      features: ['Everything in Pro', 'Save $90/year', 'Early access to new features', 'Annual progress review'],
      cta: 'Get Annual',
      href: '/auth/signup',
      highlight: false,
    },
  ];

  return (
    <section className="landing-section alt-bg" id="pricing">
      <div className="container">
        <div className="landing-section-header">
          <span className="section-eyebrow">Pricing</span>
          <h2 className="section-headline">Simple, Transparent Pricing</h2>
          <p className="section-subheadline">Start free. Upgrade when you're ready. Cancel any time.</p>
          <div style={{ display: 'inline-block', marginTop: '0.75rem', padding: '0.5rem 1rem', background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', color: 'var(--clr-warning)' }}>
            ⚠️ Paid plans coming soon — all features currently free during beta
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', maxWidth: 880, margin: '0 auto' }}>
          {plans.map(({ name, price, period, desc, features, cta, href, highlight, badge }) => (
            <div key={name} className="feature-card" style={{ border: highlight ? '2px solid var(--clr-primary)' : '1px solid var(--clr-border)', position: 'relative', background: highlight ? 'linear-gradient(145deg, rgba(232,160,32,0.06) 0%, var(--clr-bg-2) 100%)' : undefined }}>
              {badge && (
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)' }}>
                  <span className="badge badge-primary" style={{ whiteSpace: 'nowrap' }}>{badge}</span>
                </div>
              )}
              <div style={{ fontWeight: 800, fontSize: 'var(--text-xl)', marginBottom: '0.25rem' }}>{name}</div>
              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 900, color: highlight ? 'var(--clr-primary)' : 'var(--clr-text)' }}>{price}</span>
                <span style={{ color: 'var(--clr-text-3)', fontSize: 'var(--text-sm)' }}>{period}</span>
              </div>
              <p style={{ color: 'var(--clr-text-3)', fontSize: 'var(--text-sm)', marginBottom: '1.5rem' }}>{desc}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '2rem' }}>
                {features.map(f => (
                  <div key={f} style={{ display: 'flex', gap: '0.625rem', alignItems: 'flex-start' }}>
                    <Check size={15} color={highlight ? 'var(--clr-primary)' : 'var(--clr-success)'} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-text-2)' }}>{f}</span>
                  </div>
                ))}
              </div>
              <Link to={href} className={`btn ${highlight ? 'btn-primary' : 'btn-secondary'} btn-block`} id={`pricing-${name.toLowerCase()}-btn`}>
                {cta} <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// FAQ
// ============================================================

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    { q: 'Do I need gym equipment?', a: 'No! We have programs designed for home workouts with minimal equipment — even bodyweight-only. When setting up your profile, you tell us what equipment you have and we match you to the right program.' },
    { q: 'Is this suitable if I have injuries or health conditions?', a: 'This app provides general fitness information for healthy adults. If you have medical conditions, injuries, or health concerns, we strongly recommend consulting with a qualified healthcare professional before starting or changing any exercise program. The app will also ask you about this during onboarding.' },
    { q: 'How is this different from other fitness apps?', a: 'Fit Midlife is built specifically for men 40+. The programs account for age-related changes in recovery, hormones, and movement. We focus on sustainable, joint-friendly training — not beating yourself into the ground.' },
    { q: 'How long until I see results?', a: 'Most men notice improved energy within 2-3 weeks. Visible changes in strength and body composition typically appear in 6-12 weeks with consistent training and nutrition. Results vary based on consistency, diet, sleep, and individual factors.' },
    { q: 'Can I cancel anytime?', a: 'Yes. You can cancel your subscription at any time, and you\'ll retain access until the end of your billing period. No hidden fees or complicated cancellation processes.' },
    { q: 'Is this medical advice?', a: 'No. Fit Midlife is a general fitness and wellness application. Nothing in the app should be interpreted as medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional for medical concerns.' },
  ];

  return (
    <section className="landing-section" id="faq">
      <div className="container" style={{ maxWidth: 720 }}>
        <div className="landing-section-header">
          <span className="section-eyebrow">FAQ</span>
          <h2 className="section-headline">Common Questions</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map(({ q, a }, i) => (
            <div key={q} style={{ border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <button onClick={() => setOpen(open === i ? null : i)}
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', background: open === i ? 'var(--clr-bg-2)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', gap: '1rem' }}>
                <span style={{ fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--clr-text)' }}>{q}</span>
                <ChevronDown size={18} color="var(--clr-text-3)" style={{ flexShrink: 0, transform: open === i ? 'rotate(180deg)' : 'none', transition: 'transform var(--transition-fast)' }} />
              </button>
              {open === i && (
                <div style={{ padding: '0 1.5rem 1.25rem', color: 'var(--clr-text-2)', lineHeight: 1.8, fontSize: 'var(--text-sm)', borderTop: '1px solid var(--clr-border)', paddingTop: '1rem', background: 'var(--clr-bg-2)' }}>
                  {a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Final CTA
// ============================================================

function FinalCTA() {
  return (
    <section style={{ padding: 'var(--sp-20) 0', background: 'var(--clr-bg-2)' }}>
      <div className="container" style={{ textAlign: 'center', maxWidth: 640 }}>
        <div style={{ width: 72, height: 72, background: 'var(--grad-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <Dumbbell size={36} color="#0F1117" />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, marginBottom: '1rem' }}>
          Your Best Chapter{' '}
          <span style={{ background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Starts Now
          </span>
        </h2>
        <p style={{ color: 'var(--clr-text-2)', lineHeight: 1.8, marginBottom: '2.5rem', fontSize: 'var(--text-lg)' }}>
          Join men who are getting stronger, leaner, and more energetic after 40. Start free today — no credit card required.
        </p>
        <Link to="/auth/signup" className="btn btn-primary btn-xl glow-on-hover" id="final-cta-btn">
          Start Your Fitness Journey <ArrowRight size={22} />
        </Link>
        <p style={{ color: 'var(--clr-text-3)', fontSize: 'var(--text-sm)', marginTop: '1rem' }}>
          Free to start · No credit card required
        </p>
      </div>
    </section>
  );
}

// ============================================================
// Footer
// ============================================================

function Footer() {
  return (
    <footer style={{ background: 'var(--clr-bg)', borderTop: '1px solid var(--clr-border)', padding: '3rem 1.5rem 2rem' }}>
      <div style={{ maxWidth: 'var(--content-max-w)', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-xl)', background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '0.75rem' }}>
              FIT MIDLIFE
            </div>
            <p style={{ color: 'var(--clr-text-3)', fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>
              A simple fitness system built for men 40+ who want real, lasting results.
            </p>
          </div>
          {[
            { title: 'Product', links: ['How It Works', 'Workouts', 'Nutrition', 'Progress Tracking'] },
            { title: 'Company', links: ['About', 'Privacy Policy', 'Terms of Service', 'Contact'] },
          ].map(({ title, links }) => (
            <div key={title}>
              <div style={{ fontWeight: 700, marginBottom: '1rem', fontSize: 'var(--text-sm)' }}>{title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {links.map(link => (
                  <a key={link} href="#" style={{ color: 'var(--clr-text-3)', fontSize: 'var(--text-sm)', transition: 'color var(--transition-fast)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--clr-text)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--clr-text-3)')}>
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid var(--clr-border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)' }}>
            © {new Date().getFullYear()} Fit For Midlife Men. All rights reserved.
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)', maxWidth: 520, lineHeight: 1.6 }}>
            This application provides general fitness and wellness information for educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult your healthcare provider before starting a new exercise program.
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================================
// Landing Page
// ============================================================

export default function Landing() {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <LandingNav />
      <Hero />
      <WhySection />
      <HowItWorksSection />
      <WorkoutFeaturesSection />
      <NutritionFeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <FinalCTA />
      <Footer />
    </>
  );
}
