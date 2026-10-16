// src/components/pwa/PwaInstallPrompt.tsx
// ============================================================
// PWA Install Prompt Banner Component
// Prompts users to install FitRun to their Mobile / Desktop Home Screen
// ============================================================

import { useState, useEffect } from 'react';
import { Download, X, Smartphone, Share, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // Check if already running in standalone mode (already installed)
    const isStandaloneApp =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true;

    if (isStandaloneApp) {
      setIsStandalone(true);
      return;
    }

    // Check for iOS Safari
    const ua = window.navigator.userAgent;
    const isIosDevice = /iPhone|iPad|iPod/.test(ua);
    setIsIOS(isIosDevice);

    // Listen for native PWA install prompt (Android & Chrome/Edge Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If on iOS and not standalone, show iOS banner after a short delay
    if (isIosDevice && !isStandaloneApp) {
      const timer = setTimeout(() => setShowBanner(true), 2500);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIosGuide(true);
      return;
    }

    if (!deferredPrompt) {
      toast('To install, open browser menu and tap "Add to Home Screen"', { icon: '📲' });
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      toast.success('🎉 FitRun App installed to your Home Screen!');
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setShowIosGuide(false);
  };

  if (isStandalone || !showBanner) return null;

  return (
    <>
      {/* Floating Bottom PWA Install Banner */}
      <div
        className="animate-slide-up"
        style={{
          position: 'fixed',
          bottom: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          width: 'calc(100% - 2rem)',
          maxWidth: 480,
          background: 'linear-gradient(135deg, #1A1D26 0%, #0F1117 100%)',
          border: '1.5px solid var(--clr-primary)',
          borderRadius: 'var(--radius-xl)',
          padding: '1rem 1.25rem',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6), 0 0 15px rgba(232, 160, 32, 0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.875rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 44, height: 44, background: 'var(--grad-primary)',
              borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(232,160,32,0.3)'
            }}>
              <Smartphone size={24} color="#0F1117" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 'var(--text-sm)', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                Install FitRun App <span className="badge badge-primary" style={{ fontSize: '0.6rem', padding: '0.15rem 0.4rem' }}>Mobile</span>
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-2)', marginTop: '0.125rem' }}>
                Add to your phone for 1-click full screen access!
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={handleInstallClick}
              style={{
                background: 'var(--grad-primary)',
                color: '#0F1117',
                border: 'none',
                padding: '0.5rem 0.875rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 800,
                fontSize: 'var(--text-xs)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 12px rgba(232,160,32,0.3)',
              }}
            >
              <Download size={14} /> Install
            </button>
            <button
              onClick={handleDismiss}
              style={{ background: 'none', border: 'none', color: 'var(--clr-text-3)', cursor: 'pointer', padding: '0.25rem' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* iOS Instructions Guide Modal */}
      {showIosGuide && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1150,
          background: 'rgba(9, 11, 16, 0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }}>
          <div className="card animate-fade-in" style={{ maxWidth: 420, width: '100%', padding: '1.75rem', textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, background: 'rgba(232,160,32,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <Share size={28} color="var(--clr-primary)" />
            </div>
            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, marginBottom: '0.5rem' }}>Install on iPhone / iPad</h3>
            <p style={{ color: 'var(--clr-text-2)', fontSize: 'var(--text-sm)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Follow these 2 simple steps in Safari to add FitRun to your iPhone Home Screen:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left', background: 'var(--clr-bg-3)', padding: '1rem', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem', border: '1px solid var(--clr-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--clr-primary)', color: '#0F1117', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem' }}>1</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-text)' }}>Tap the <strong>Share button</strong> 📤 at the bottom of Safari.</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--clr-primary)', color: '#0F1117', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem' }}>2</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-text)' }}>Scroll down & tap <strong>"Add to Home Screen"</strong> 📲.</div>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="btn btn-primary btn-block"
            >
              <CheckCircle2 size={16} /> Got It!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
