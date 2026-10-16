// src/pages/auth/ForgotPassword.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError('Email is required'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Enter a valid email'); return; }
    setError('');
    setLoading(true);
    const { error: err } = await resetPassword(email);
    setLoading(false);
    if (err) {
      toast.error(err);
    } else {
      setSent(true);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--clr-bg)', padding: '1.5rem',
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 52, height: 52, background: 'var(--grad-primary)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
            <Dumbbell size={26} color="#0F1117" />
          </div>
        </div>

        <div className="card" style={{ padding: '2.5rem' }}>
          {sent ? (
            <div style={{ textAlign: 'center' }}>
              <CheckCircle2 size={56} color="var(--clr-success)" style={{ margin: '0 auto 1.5rem' }} />
              <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: '0.75rem' }}>Check Your Email</h2>
              <p style={{ color: 'var(--clr-text-2)', marginBottom: '2rem', lineHeight: 1.7 }}>
                We've sent password reset instructions to <strong>{email}</strong>.
                Check your inbox — it should arrive within a few minutes.
              </p>
              <Link to="/auth/login">
                <Button variant="secondary" block>Back to Sign In</Button>
              </Link>
            </div>
          ) : (
            <>
              <Link to="/auth/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--clr-text-3)', fontSize: 'var(--text-sm)', marginBottom: '1.5rem' }}>
                <ArrowLeft size={16} /> Back to Sign In
              </Link>
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: '0.5rem' }}>
                Reset Password
              </h1>
              <p style={{ color: 'var(--clr-text-2)', marginBottom: '2rem' }}>
                Enter your email and we'll send you reset instructions.
              </p>
              <form onSubmit={handleSubmit} noValidate>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <Input
                    id="forgot-email"
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    error={error}
                    required
                    leftIcon={<Mail size={16} />}
                  />
                  <Button type="submit" loading={loading} block size="lg" id="forgot-submit-btn">
                    Send Reset Link
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
