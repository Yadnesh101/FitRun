// src/pages/auth/SignUp.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, Mail, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

export default function SignUp() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [done, setDone] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    const { error } = await signUp(form.email, form.password);
    setLoading(false);
    if (error) {
      toast.error(error);
    } else {
      setDone(true);
      // In demo mode, redirect immediately to onboarding
      setTimeout(() => navigate('/onboarding'), 1500);
    }
  };

  if (done) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--clr-bg)', padding: '1.5rem',
      }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <CheckCircle2 size={64} color="var(--clr-success)" style={{ margin: '0 auto 1.5rem' }} />
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: '0.75rem' }}>
            Account Created!
          </h2>
          <p style={{ color: 'var(--clr-text-2)', marginBottom: '1.5rem' }}>
            Let's personalize your fitness program in just a few steps.
          </p>
          <div className="spinner spinner-lg" style={{ margin: '0 auto' }} />
        </div>
      </div>
    );
  }

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6) return { label: 'Weak', color: 'var(--clr-danger)', width: '25%' };
    if (p.length < 10) return { label: 'Fair', color: 'var(--clr-warning)', width: '50%' };
    if (p.length >= 12 && /[A-Z]/.test(p) && /[0-9]/.test(p)) return { label: 'Strong', color: 'var(--clr-success)', width: '100%' };
    return { label: 'Good', color: 'var(--clr-info)', width: '75%' };
  };

  const strength = passwordStrength();

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--clr-bg)', padding: '1.5rem',
    }}>
      <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', background: 'radial-gradient(ellipse, rgba(232,160,32,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 52, height: 52, background: 'var(--grad-primary)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Dumbbell size={26} color="#0F1117" />
            </div>
            <span className="font-display text-2xl text-gold" style={{ letterSpacing: '0.04em' }}>FIT MIDLIFE</span>
          </Link>
        </div>

        <div className="card" style={{ padding: '2.5rem' }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: '0.5rem' }}>
            Start Your Journey
          </h1>
          <p style={{ color: 'var(--clr-text-2)', marginBottom: '2rem' }}>
            Create your free account — takes less than 2 minutes.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <Input
                id="signup-email"
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                error={errors.email}
                required
                leftIcon={<Mail size={16} />}
              />

              <div>
                <Input
                  id="signup-password"
                  label="Password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  error={errors.password}
                  required
                  leftIcon={<Lock size={16} />}
                  rightIcon={
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clr-text-3)' }}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                />
                {strength && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <div className="progress-bar" style={{ height: 4 }}>
                      <div className="progress-fill" style={{ width: strength.width, background: strength.color }} />
                    </div>
                    <span style={{ fontSize: 'var(--text-xs)', color: strength.color, fontWeight: 600 }}>
                      {strength.label}
                    </span>
                  </div>
                )}
              </div>

              <Input
                id="signup-confirm"
                label="Confirm Password"
                type={showPass ? 'text' : 'password'}
                placeholder="Repeat your password"
                value={form.confirm}
                onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
                error={errors.confirm}
                required
                leftIcon={<Lock size={16} />}
              />

              {errors.general && <p className="form-error text-center">{errors.general}</p>}

              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)', lineHeight: 1.6 }}>
                By creating an account you agree to our{' '}
                <span style={{ color: 'var(--clr-primary)' }}>Terms of Service</span> and{' '}
                <span style={{ color: 'var(--clr-primary)' }}>Privacy Policy</span>.
                This app is for general fitness purposes only and is not a substitute for medical advice.
              </p>

              <Button type="submit" loading={loading} block size="lg" id="signup-submit-btn">
                Create Free Account
              </Button>
            </div>
          </form>

          <div className="divider-text" style={{ margin: '1.5rem 0' }}>or</div>

          <p style={{ textAlign: 'center', color: 'var(--clr-text-2)', fontSize: 'var(--text-sm)' }}>
            Already have an account?{' '}
            <Link to="/auth/login" style={{ color: 'var(--clr-primary)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
