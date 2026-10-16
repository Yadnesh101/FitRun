// src/components/layout/AppLayout.tsx
// ============================================================
// Main application shell — sidebar (desktop) + bottom nav (mobile)
// ============================================================

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Dumbbell,
  Apple,
  TrendingUp,
  User,
  Zap,
  CheckSquare,
  LogOut,
  Settings,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import PwaInstallPrompt from '../pwa/PwaInstallPrompt';

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard',  icon: <LayoutDashboard size={20} />, label: 'Home' },
  { to: '/workouts',   icon: <Dumbbell size={20} />,        label: 'Workouts' },
  { to: '/nutrition',  icon: <Apple size={20} />,           label: 'Nutrition' },
  { to: '/progress',   icon: <TrendingUp size={20} />,      label: 'Progress' },
  { to: '/profile',    icon: <User size={20} />,            label: 'Profile' },
];

const EXTRA_NAV: NavItem[] = [
  { to: '/habits',     icon: <CheckSquare size={20} />,     label: 'Habits' },
  { to: '/fit-coach',  icon: <Zap size={20} />,             label: 'Fit Coach' },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { signOut, profile, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    toast.success('Signed out successfully');
  };

  const initials = profile
    ? `${profile.first_name[0]}${profile.last_name?.[0] ?? ''}`
    : 'U';

  return (
    <div className="app-layout">
      {/* PWA Floating Install Banner */}
      <PwaInstallPrompt />

      {/* ---- SIDEBAR (Desktop) ---- */}
      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <div style={{
            width: 36, height: 36,
            background: 'var(--grad-primary)',
            borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Dumbbell size={20} color="#0F1117" />
          </div>
          <div>
            <div className="sidebar-logo-text text-gold">FIT MIDLIFE</div>
            <div style={{ fontSize: '10px', color: 'var(--clr-text-3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              For Men 40+
            </div>
          </div>
        </div>

        {/* Main nav */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--clr-text-3)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 1rem', marginBottom: '0.5rem' }}>
            Main
          </div>
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}

          <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--clr-text-3)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '1rem 1rem 0.5rem', marginTop: '0.5rem' }}>
            Tools
          </div>
          {EXTRA_NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}

          {isAdmin && (
            <>
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--clr-text-3)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '1rem 1rem 0.5rem', marginTop: '0.5rem' }}>
                Admin
              </div>
              <NavLink
                to="/admin"
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              >
                <Shield size={20} />
                Admin
              </NavLink>
            </>
          )}
        </div>

        {/* Bottom section */}
        <div style={{ borderTop: '1px solid var(--clr-border)', paddingTop: '1rem' }}>
          {/* User info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', marginBottom: '0.5rem' }}>
            <div className="avatar avatar-md">
              {initials}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}
                className="truncate">
                {profile?.first_name ?? 'User'}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)' }}>
                Member
              </div>
            </div>
          </div>

          <NavLink
            to="/settings"
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <Settings size={18} />
            Settings
          </NavLink>
          <button onClick={handleSignOut} className="nav-item" style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left', color: 'var(--clr-danger)', cursor: 'pointer' }}>
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ---- MAIN CONTENT ---- */}
      <main className="main-content">
        {children}
      </main>

      {/* ---- BOTTOM NAV (Mobile) ---- */}
      <nav className="bottom-nav">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default AppLayout;
