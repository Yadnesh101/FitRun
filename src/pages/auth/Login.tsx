// src/pages/auth/Login.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    const { error } = await signIn(form.email, form.password);
    setLoading(false);
    if (error) {
      toast.error(error);
      setErrors({ general: error });
    } else {
      toast.success('Welcome back!');
      navigate('/dashboard');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--clr-bg)', padding: '1.5rem',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(232,160,32,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 52, height: 52, background: 'var(--grad-primary)',
              borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Dumbbell size={26} color="#0F1117" />
            </div>
            <span className="font-display text-2xl text-gold" style={{ letterSpacing: '0.04em' }}>
              FIT MIDLIFE
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: '2.5rem' }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: '0.5rem' }}>
            Sign In
          </h1>
          <p style={{ color: 'var(--clr-text-2)', marginBottom: '2rem' }}>
            Welcome back. Let's continue your journey.
          </p>



          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <Input
                id="login-email"
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                error={errors.email}
                required
                leftIcon={<Mail size={16} />}
              />

              <Input
                id="login-password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                error={errors.password}
                required
                leftIcon={<Lock size={16} />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clr-text-3)' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />

              {errors.general && (
                <p className="form-error" style={{ textAlign: 'center' }}>{errors.general}</p>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Link to="/auth/forgot-password" style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-primary)' }}>
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" loading={loading} block size="lg" id="login-submit-btn">
                Sign In
              </Button>
            </div>
          </form>

          <div className="divider-text" style={{ margin: '1.5rem 0' }}>or</div>

          <p style={{ textAlign: 'center', color: 'var(--clr-text-2)', fontSize: 'var(--text-sm)' }}>
            New here?{' '}
            <Link to="/auth/signup" style={{ color: 'var(--clr-primary)', fontWeight: 600 }}>
              Create your free account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
