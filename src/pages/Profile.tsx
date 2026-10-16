// src/pages/Profile.tsx

import { useState } from 'react';
import { Edit2, Check, X, LogOut, Bell, Shield, ChevronRight, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GOAL_LABELS, LEVEL_LABELS, LOCATION_LABELS, EQUIPMENT_LABELS, kgToLbs } from '../lib/utils';
import type { FitnessGoal } from '../types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import StripeCheckoutModal from '../components/checkout/StripeCheckoutModal';
import toast from 'react-hot-toast';

export default function Profile() {
  const { profile, updateProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showStripeModal, setShowStripeModal] = useState(false);

  const [form, setForm] = useState({
    first_name: profile?.first_name ?? '',
    age: String(profile?.age ?? 45),
    weight_kg: String(profile ? Math.round(kgToLbs(profile.weight_kg)) : 190),
    goal: (profile?.goal ?? 'improve_fitness') as FitnessGoal,
    training_days_per_week: String(profile?.training_days_per_week ?? 3),
    workout_duration_minutes: String(profile?.workout_duration_minutes ?? 45),
  });

  const isPro = profile?.plan === 'pro' || profile?.plan === 'annual';

  const handleSave = async () => {
    setSaving(true);
    const weightKg = Math.round(parseFloat(form.weight_kg) / 2.20462);
    const { error } = await updateProfile({
      first_name: form.first_name,
      age: parseInt(form.age, 10),
      weight_kg: weightKg,
      goal: form.goal,
      training_days_per_week: parseInt(form.training_days_per_week, 10),
      workout_duration_minutes: parseInt(form.workout_duration_minutes, 10),
    });
    setSaving(false);
    if (error) {
      toast.error(error);
    } else {
      toast.success('Profile updated successfully!');
      setEditing(false);
    }
  };

  const handlePaymentSuccess = async () => {
    await updateProfile({ plan: 'pro' });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    toast.success('Signed out');
  };

  const initials = profile ? `${profile.first_name[0]}${profile.last_name?.[0] ?? ''}` : 'U';

  return (
    <div style={{ padding: '1.5rem', maxWidth: 640, margin: '0 auto' }}>
      {/* Header */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <div className="avatar avatar-lg">
            {initials}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800 }}>
                {profile?.first_name} {profile?.last_name ?? ''}
              </h2>
              {isPro ? (
                <span className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Crown size={12} /> PRO MEMBER
                </span>
              ) : (
                <span className="badge badge-neutral">FREE MEMBER</span>
              )}
            </div>
            <p style={{ color: 'var(--clr-text-3)', fontSize: 'var(--text-sm)' }}>
              Age {profile?.age ?? 45} • {profile ? GOAL_LABELS[profile.goal] : ''}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditing(!editing)}
            id="edit-profile-btn"
          >
            {editing ? <X size={16} /> : <Edit2 size={16} />}
          </Button>
        </div>

        {/* Quick specs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--clr-border)' }}>
          {[
            { label: 'Level', val: profile ? LEVEL_LABELS[profile.fitness_level] : '—' },
            { label: 'Location', val: profile ? LOCATION_LABELS[profile.training_location] : '—' },
            { label: 'Schedule', val: `${profile?.training_days_per_week ?? 3}d / week` },
          ].map(({ label, val }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)' }}>{label}</div>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', marginTop: '0.125rem' }}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit form */}
      {editing && (
        <div className="card" style={{ marginBottom: '1rem', border: '1px solid rgba(232,160,32,0.3)' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Edit Profile</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input id="profile-name" label="First Name" value={form.first_name} onChange={e => setForm(p => ({ ...p, first_name: e.target.value }))} />
              <Input id="profile-age" label="Age" type="number" value={form.age} onChange={e => setForm(p => ({ ...p, age: e.target.value }))} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input id="profile-weight" label="Weight (lbs)" type="number" value={form.weight_kg} onChange={e => setForm(p => ({ ...p, weight_kg: e.target.value }))} />
              <Select id="profile-goal" label="Primary Goal" value={form.goal}
                onChange={e => setForm(p => ({ ...p, goal: e.target.value as FitnessGoal }))}
                options={Object.entries(GOAL_LABELS).map(([v, l]) => ({ value: v, label: l }))} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Select id="profile-days" label="Days / Week" value={form.training_days_per_week}
                onChange={e => setForm(p => ({ ...p, training_days_per_week: e.target.value }))}
                options={[2, 3, 4, 5].map(d => ({ value: String(d), label: `${d} days` }))} />
              <Select id="profile-duration" label="Duration" value={form.workout_duration_minutes}
                onChange={e => setForm(p => ({ ...p, workout_duration_minutes: e.target.value }))}
                options={[15, 20, 30, 45, 60].map(m => ({ value: String(m), label: `${m} min` }))} />
            </div>
          </div>
          <Button onClick={handleSave} loading={saving} block id="save-profile-btn">
            <Check size={16} /> Save Changes
          </Button>
        </div>
      )}

      {/* Equipment details */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: 'var(--text-base)' }}>Your Equipment</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {(profile?.equipment ?? []).map(eq => (
            <span key={eq} className="badge badge-neutral">
              {EQUIPMENT_LABELS[eq]}
            </span>
          ))}
        </div>
      </div>

      {/* Subscription Card */}
      <div className="card card-gold" style={{ marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
              {isPro ? 'PRO ACTIVE' : 'PRO PLAN'}
            </div>
            <h3 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>
              {isPro ? 'Pro Membership Active' : 'Upgrade to Pro Plan'}
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-text-2)' }}>
              {isPro
                ? 'You have full access to all 4-Day Fat Loss Builder programs, AI Fit Coach, & custom macro targets.'
                : 'Unlock all 4-day workouts, AI Fit Coach assistant, and advanced progress charts.'}
            </p>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 900, color: 'var(--clr-primary)', marginTop: '0.5rem' }}>
              $19.99<span style={{ fontSize: 'var(--text-base)', fontWeight: 400, color: 'var(--clr-text-3)' }}>/month</span>
            </div>
          </div>
        </div>
        <Button
          onClick={() => setShowStripeModal(true)}
          style={{ marginTop: '1.25rem', borderColor: 'rgba(232,160,32,0.4)' }}
          block
          id="upgrade-btn"
        >
          {isPro ? 'Manage Membership / Billing' : 'Stripe Checkout — Activate Pro ($19.99)'}
        </Button>
      </div>

      {/* Settings links */}
      <div className="card" style={{ marginBottom: '1rem', padding: 0, overflow: 'hidden' }}>
        {[
          { icon: <Bell size={18} />, label: 'Notification Settings', path: '/settings' },
          { icon: <Shield size={18} />, label: 'Privacy & Security', path: '/settings' },
        ].map(({ icon, label, path }, i) => (
          <div key={label} onClick={() => navigate(path)} style={{
            display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem',
            borderBottom: i < 1 ? '1px solid var(--clr-border)' : 'none',
            cursor: 'pointer', transition: 'background var(--transition-fast)',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--clr-bg-3)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            <div style={{ color: 'var(--clr-text-3)' }}>{icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{label}</div>
            </div>
            <ChevronRight size={16} color="var(--clr-text-3)" />
          </div>
        ))}
      </div>

      {/* Sign out */}
      <button onClick={handleSignOut}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem', padding: '0.875rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-lg)', color: 'var(--clr-danger)', fontWeight: 600, cursor: 'pointer', fontSize: 'var(--text-base)' }}
        id="signout-btn">
        <LogOut size={18} /> Sign Out
      </button>

      {/* Stripe Checkout Modal */}
      <StripeCheckoutModal
        isOpen={showStripeModal}
        onClose={() => setShowStripeModal(false)}
        onSuccess={handlePaymentSuccess}
        customerName={profile ? `${profile.first_name} ${profile.last_name ?? ''}` : 'John Smith'}
      />
    </div>
  );
}
