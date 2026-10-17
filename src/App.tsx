// src/App.tsx
// ============================================================
// Main application router and state configuration
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AppLayout from './components/layout/AppLayout';
import { isNativeApp } from './lib/platform';

import WarmupTimer from './pages/workouts/WarmupTimer';

// Pages
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgotPassword';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import WorkoutPrograms from './pages/workouts/WorkoutPrograms';
import WorkoutPlayer from './pages/workouts/WorkoutPlayer';
import ExerciseLibrary from './pages/workouts/ExerciseLibrary';
import Nutrition from './pages/Nutrition';
import Progress from './pages/Progress';
import Habits from './pages/Habits';
import FitCoach from './pages/FitCoach';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

function LoadingScreen() {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0F1117',
      color: '#E8A020',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 700,
      fontSize: '1.25rem',
      gap: '0.75rem',
    }}>
      <div className="animate-spin" style={{ width: 24, height: 24, border: '3px solid rgba(232,160,32,0.2)', borderTopColor: '#E8A020', borderRadius: '50%' }} />
      Loading Fit Midlife...
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { loading, user } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  return <AppLayout>{children}</AppLayout>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { loading, user } = useAuth();
  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function RootRoute() {
  const { loading, user } = useAuth();
  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to="/dashboard" replace />;
  if (isNativeApp()) return <Navigate to="/login" replace />;
  return <Landing />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<RootRoute />} />
      
      {/* Auth routes (supporting both /auth/... and short paths) */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/auth/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
      <Route path="/auth/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="/auth/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />

      <Route path="/onboarding" element={<PublicRoute><Onboarding /></PublicRoute>} />

      {/* Protected App Pages (wrapped in AppLayout) */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/workouts" element={<ProtectedRoute><WorkoutPrograms /></ProtectedRoute>} />
      <Route path="/workouts/warmup" element={<ProtectedRoute><WarmupTimer /></ProtectedRoute>} />
      <Route path="/workouts/warmup/:programId" element={<ProtectedRoute><WarmupTimer /></ProtectedRoute>} />
      <Route path="/workouts/player/:programId" element={<ProtectedRoute><WorkoutPlayer /></ProtectedRoute>} />
      <Route path="/workouts/player/:programId/:dayId" element={<ProtectedRoute><WorkoutPlayer /></ProtectedRoute>} />
      <Route path="/exercises" element={<ProtectedRoute><ExerciseLibrary /></ProtectedRoute>} />
      <Route path="/nutrition" element={<ProtectedRoute><Nutrition /></ProtectedRoute>} />
      <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
      <Route path="/habits" element={<ProtectedRoute><Habits /></ProtectedRoute>} />
      <Route path="/fit-coach" element={<ProtectedRoute><FitCoach /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

      {/* Fallback redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1A1D26',
              color: '#F0F2F6',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
