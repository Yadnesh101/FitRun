// src/contexts/AuthContext.tsx
// ============================================================
// Authentication context and provider with persistent sessions
// ============================================================

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { UserProfile } from '../types';

// ---- Types ----

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  initialized: boolean;
}

export interface AuthContextValue extends AuthState {
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
  isAdmin: boolean;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
}

// ---- Context ----

const AuthContext = createContext<AuthContextValue | null>(null);

// ---- Demo / Fallback profile ----

const DEMO_USER_ID = 'demo-user-001';

const createDemoProfile = (overrides?: Partial<UserProfile>): UserProfile => ({
  id: 'profile-demo-001',
  user_id: DEMO_USER_ID,
  first_name: 'John',
  last_name: 'Smith',
  age: 45,
  height_cm: 180,
  weight_kg: 90,
  goal: 'lose_fat',
  secondary_goals: ['build_muscle'],
  fitness_level: 'beginner',
  training_location: 'home',
  equipment: ['dumbbells', 'resistance_bands'],
  training_days_per_week: 3,
  workout_duration_minutes: 45,
  activity_level: 'lightly_active',
  avg_daily_steps: 7000,
  sleep_hours: 7,
  has_medical_conditions: false,
  onboarding_completed: true,
  is_admin: false,
  created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

function isSupabaseConfigured(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL;
  return !!(url && url !== 'https://placeholder.supabase.co' && url.includes('supabase.co'));
}

// ---- Provider ----

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    // Instant session restoration from localStorage for zero-latency app boot
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('fitrun_user_session');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.user) {
            return {
              user: parsed.user,
              profile: parsed.profile || createDemoProfile(),
              loading: false,
              initialized: true,
            };
          }
        }
      } catch (e) {
        // Ignore JSON error
      }
    }
    return {
      user: null,
      profile: null,
      loading: true,
      initialized: false,
    };
  });

  const configured = isSupabaseConfigured();

  // ---- Fetch profile from Supabase ----

  const fetchProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    if (!configured) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // No profile yet
        console.error('[AuthContext] fetchProfile error:', error);
        return null;
      }
      return data as UserProfile;
    } catch (err) {
      console.error('[AuthContext] fetchProfile exception:', err);
      return null;
    }
  }, [configured]);

  // ---- Initialize auth state ----

  useEffect(() => {
    let isMounted = true;

    if (!configured) {
      // Demo/Offline mode — check localStorage or default to demo user
      const cached = localStorage.getItem('fitrun_user_session');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setState({
            user: parsed.user,
            profile: parsed.profile || createDemoProfile(),
            loading: false,
            initialized: true,
          });
          return;
        } catch (e) {}
      }

      setState({
        user: { id: DEMO_USER_ID, email: 'member@fitmidlife.com' } as User,
        profile: createDemoProfile(),
        loading: false,
        initialized: true,
      });
      return;
    }

    // Real Supabase auth check
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user ?? null;
        let profile = user ? await fetchProfile(user.id) : null;

        if (user && !profile) {
          profile = createDemoProfile({ user_id: user.id });
        }

        if (isMounted) {
          if (user) {
            localStorage.setItem('fitrun_user_session', JSON.stringify({ user, profile }));
          }
          setState({ user, profile, loading: false, initialized: true });
        }
      } catch (err) {
        console.warn('[AuthContext] Session retrieval failed, falling back to cache:', err);
        if (isMounted) {
          const cached = localStorage.getItem('fitrun_user_session');
          if (cached) {
            try {
              const parsed = JSON.parse(cached);
              setState({ user: parsed.user, profile: parsed.profile, loading: false, initialized: true });
              return;
            } catch (e) {}
          }
          setState({ user: null, profile: null, loading: false, initialized: true });
        }
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!isMounted) return;
        const user = session?.user ?? null;
        let profile = user ? await fetchProfile(user.id) : null;
        if (user && !profile) {
          profile = createDemoProfile({ user_id: user.id });
        }

        if (user) {
          localStorage.setItem('fitrun_user_session', JSON.stringify({ user, profile }));
        } else {
          localStorage.removeItem('fitrun_user_session');
        }

        setState({ user, profile, loading: false, initialized: true });
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [configured, fetchProfile]);

  // ---- Auth actions ----

  const signUp = useCallback(async (email: string, password: string) => {
    if (!configured) {
      const demoUser = { id: DEMO_USER_ID, email } as User;
      const demoProf = createDemoProfile({ onboarding_completed: false });
      localStorage.setItem('fitrun_user_session', JSON.stringify({ user: demoUser, profile: demoProf }));
      setState(prev => ({
        ...prev,
        user: demoUser,
        profile: demoProf,
      }));
      return { error: null };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${import.meta.env.VITE_APP_URL}/auth/verify`,
      },
    });

    if (!error && data?.user) {
      const initialProfile = createDemoProfile({ user_id: data.user.id, onboarding_completed: false });
      localStorage.setItem('fitrun_user_session', JSON.stringify({ user: data.user, profile: initialProfile }));
      setState({ user: data.user, profile: initialProfile, loading: false, initialized: true });
    }

    return { error: error?.message ?? null };
  }, [configured]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!configured) {
      const demoUser = { id: DEMO_USER_ID, email } as User;
      const demoProf = createDemoProfile();
      localStorage.setItem('fitrun_user_session', JSON.stringify({ user: demoUser, profile: demoProf }));
      setState(prev => ({
        ...prev,
        user: demoUser,
        profile: demoProf,
      }));
      return { error: null };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error && data?.user) {
      let profile = await fetchProfile(data.user.id);
      if (!profile) profile = createDemoProfile({ user_id: data.user.id });
      localStorage.setItem('fitrun_user_session', JSON.stringify({ user: data.user, profile }));
      setState({ user: data.user, profile, loading: false, initialized: true });
    }
    return { error: error?.message ?? null };
  }, [configured, fetchProfile]);

  const signOut = useCallback(async () => {
    localStorage.removeItem('fitrun_user_session');
    if (!configured) {
      setState({ user: null, profile: null, loading: false, initialized: true });
      return;
    }
    await supabase.auth.signOut();
    setState({ user: null, profile: null, loading: false, initialized: true });
  }, [configured]);

  const resetPassword = useCallback(async (email: string) => {
    if (!configured) {
      return { error: null };
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${import.meta.env.VITE_APP_URL}/auth/reset-password`,
    });
    return { error: error?.message ?? null };
  }, [configured]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!state.user) return { error: 'Not authenticated' };

    const newProfile = state.profile ? { ...state.profile, ...updates } : null;
    if (newProfile && state.user) {
      localStorage.setItem('fitrun_user_session', JSON.stringify({ user: state.user, profile: newProfile }));
    }

    if (!configured) {
      setState(prev => ({ ...prev, profile: newProfile }));
      return { error: null };
    }

    const { error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', state.user.id);

    if (!error) {
      setState(prev => ({ ...prev, profile: newProfile }));
    }
    return { error: error?.message ?? null };
  }, [configured, state.user, state.profile]);

  const refreshProfile = useCallback(async () => {
    if (!state.user || !configured) return;
    const profile = await fetchProfile(state.user.id);
    if (profile && state.user) {
      localStorage.setItem('fitrun_user_session', JSON.stringify({ user: state.user, profile }));
    }
    setState(prev => ({ ...prev, profile }));
  }, [configured, state.user, fetchProfile]);

  // ---- Derived values ----

  const value: AuthContextValue = {
    ...state,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    refreshProfile,
    isAdmin: state.profile?.is_admin ?? false,
    isAuthenticated: !!state.user,
    hasCompletedOnboarding: state.profile?.onboarding_completed ?? false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ---- Hook ----

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export default AuthContext;
