import { useState } from 'react';
import {
  Bell, Shield, HelpCircle, ChevronRight, X, Search,
  BookOpen, FileText, Lock, Trash2, CheckCircle2, MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface FAQItem {
  question: string;
  answer: string;
  category: 'Workouts' | 'Nutrition' | 'AI & Gemini' | 'Billing';
}

const FAQS: FAQItem[] = [
  {
    category: 'Workouts',
    question: 'Why are the workouts specifically designed for men 40+?',
    answer: 'As men age past 40, recovery capacity decreases and joint tissue (tendons/ligaments) requires higher warm-up care. Our workouts focus on high-yield compound movements with controlled eccentric tempos, minimal spinal load, and mandatory dynamic joint mobility.',
  },
  {
    category: 'Workouts',
    question: 'What if I feel sharp knee or shoulder pain during a lift?',
    answer: 'Never train through sharp pain. Swap for joint-friendly variations (e.g. Neutral-grip dumbbell press instead of barbell bench press, or box squats instead of deep squats). Use our 5-minute pre-workout joint mobility timer before every session.',
  },
  {
    category: 'Nutrition',
    question: 'How much daily protein should I eat for muscle preservation?',
    answer: 'Aim for 0.8g to 1.0g of protein per pound of body weight (e.g. 150g–180g daily for a 180 lb man). Distribute this into 3–4 meals with ~35–45g of high-quality protein per meal.',
  },
  {
    category: 'AI & Gemini',
    question: 'How does the AI Meal Vision Scanner recognize food photos?',
    answer: 'Our meal scanner uses Google Gemini 3.5 Flash Vision. When you snap or upload a meal photo, the AI analyzes the visual ingredients, portion weight, and estimates calories, protein, carbs, and fats in real-time.',
  },
  {
    category: 'Billing',
    question: 'Can I cancel my Pro membership anytime?',
    answer: 'Yes! You can cancel or change your plan anytime under your Profile or Settings. You will retain full access until the end of your current billing period.',
  },
];

export default function Settings() {
  const navigate = useNavigate();

  // Toggles state
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    'notif-workout': true,
    'notif-habit': true,
    'notif-progress': false,
  });

  // Modal active tab state: null | 'help' | 'terms' | 'privacy' | 'data' | 'delete'
  const [activeModal, setActiveModal] = useState<'help' | 'terms' | 'privacy' | 'data' | 'delete' | null>(null);

  // Help center search filter
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const handleToggle = (id: string) => {
    setToggles(prev => {
      const nextVal = !prev[id];
      toast.success(`${nextVal ? 'Enabled' : 'Disabled'} setting`);
      return { ...prev, [id]: nextVal };
    });
  };

  const handleClearData = () => {
    localStorage.clear();
    toast.success('Local cache & app data cleared successfully!');
    setActiveModal(null);
    setTimeout(() => window.location.reload(), 1000);
  };

  const filteredFaqs = FAQS.filter(
    f =>
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '1.5rem', maxWidth: 650, margin: '0 auto' }}>
      <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900, marginBottom: '2rem' }}>Settings</h1>

      {/* NOTIFICATIONS SECTION */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.875rem', color: 'var(--clr-text-3)' }}>
          <Bell size={18} />
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Notifications
          </span>
        </div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {[
            { id: 'notif-workout', label: 'Workout Reminders', desc: 'Get reminded before your scheduled workout time' },
            { id: 'notif-habit', label: 'Habit Check-ins', desc: 'Daily reminder to log your habits & water intake' },
            { id: 'notif-progress', label: 'Weekly Summary', desc: 'Weekly progress & assessment report every Sunday' },
          ].map((item, idx) => (
            <div
              key={item.id}
              onClick={() => handleToggle(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '1rem 1.5rem',
                borderBottom: idx < 2 ? '1px solid var(--clr-border)' : 'none',
                cursor: 'pointer', transition: 'background var(--transition-fast)',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--clr-bg-3)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--clr-text)' }}>{item.label}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)', marginTop: '0.125rem' }}>{item.desc}</div>
              </div>
              <div style={{
                width: 44, height: 24, borderRadius: 'var(--radius-full)',
                background: toggles[item.id] ? 'var(--clr-primary)' : 'var(--clr-bg-4)',
                position: 'relative', transition: 'background var(--transition-fast)', cursor: 'pointer',
                border: '1px solid var(--clr-border)',
              }}>
                <div style={{
                  position: 'absolute', top: 2, left: toggles[item.id] ? 'calc(100% - 22px)' : '2px',
                  width: 18, height: 18, background: 'white',
                  borderRadius: '50%', transition: 'left var(--transition-fast)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PRIVACY SECTION */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.875rem', color: 'var(--clr-text-3)' }}>
          <Shield size={18} />
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Privacy & Control
          </span>
        </div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div
            onClick={() => setActiveModal('data')}
            style={{
              display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem',
              borderBottom: '1px solid var(--clr-border)', cursor: 'pointer',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--clr-bg-3)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--clr-text)' }}>Data & Security Overview</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)', marginTop: '0.125rem' }}>View how your stats & profile data are protected</div>
            </div>
            <ChevronRight size={16} color="var(--clr-text-3)" />
          </div>

          <div
            onClick={() => setActiveModal('delete')}
            style={{
              display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem',
              cursor: 'pointer',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--clr-danger)' }}>Clear Local Cache & Reset Data</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)', marginTop: '0.125rem' }}>Reset app storage or local workout cache</div>
            </div>
            <ChevronRight size={16} color="var(--clr-danger)" />
          </div>
        </div>
      </div>

      {/* SUPPORT SECTION */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.875rem', color: 'var(--clr-text-3)' }}>
          <HelpCircle size={18} />
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Support & Legal
          </span>
        </div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div
            id="support-help"
            onClick={() => setActiveModal('help')}
            style={{
              display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem',
              borderBottom: '1px solid var(--clr-border)', cursor: 'pointer',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--clr-bg-3)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--clr-text)' }}>Help Center</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)', marginTop: '0.125rem' }}>FAQs, exercise guides & AI Assistant</div>
            </div>
            <ChevronRight size={16} color="var(--clr-text-3)" />
          </div>

          <div
            id="support-terms"
            onClick={() => setActiveModal('terms')}
            style={{
              display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem',
              borderBottom: '1px solid var(--clr-border)', cursor: 'pointer',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--clr-bg-3)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--clr-text)' }}>Terms of Service</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)', marginTop: '0.125rem' }}>Our terms and user guidelines</div>
            </div>
            <ChevronRight size={16} color="var(--clr-text-3)" />
          </div>

          <div
            id="support-privacy"
            onClick={() => setActiveModal('privacy')}
            style={{
              display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem',
              cursor: 'pointer',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--clr-bg-3)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--clr-text)' }}>Privacy Policy</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)', marginTop: '0.125rem' }}>How we handle your information & AI data</div>
            </div>
            <ChevronRight size={16} color="var(--clr-text-3)" />
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ textAlign: 'center', color: 'var(--clr-text-3)', fontSize: 'var(--text-xs)', lineHeight: 1.8 }}>
        <div style={{ fontWeight: 700, color: 'var(--clr-primary)', marginBottom: '0.25rem' }}>Fit For Midlife Men</div>
        <div>Version 1.0.0 (Production Build)</div>
        <div style={{ marginTop: '0.5rem', maxWidth: 460, margin: '0.5rem auto 0' }}>
          This application is intended for general fitness & wellness purposes for men 40+. It is not a substitute for professional medical advice or treatment.
        </div>
      </div>

      {/* ============================================================
          MODALS
          ============================================================ */}

      {/* 1. HELP CENTER MODAL */}
      {activeModal === 'help' && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1100,
          background: 'rgba(9, 11, 16, 0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }}>
          <div className="card animate-fade-in" style={{ maxWidth: 640, width: '100%', padding: '2rem', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 40, height: 40, background: 'rgba(232,160,32,0.15)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen size={20} color="var(--clr-primary)" />
                </div>
                <div>
                  <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800 }}>Help Center & FAQs</h3>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)' }}>Search answers or chat with Fit Coach AI</div>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', color: 'var(--clr-text-3)', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            {/* Search Box */}
            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
              <Search size={18} color="var(--clr-text-3)" style={{ position: 'absolute', left: 14, top: 12 }} />
              <input
                type="text"
                className="form-input"
                placeholder="Search FAQs (e.g. protein, pain, Gemini vision, workouts)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>

            {/* FAQs Accordion */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, idx) => {
                  const isOpen = openFaqIdx === idx;
                  return (
                    <div
                      key={faq.question}
                      style={{
                        background: 'var(--clr-bg-3)', borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--clr-border)', overflow: 'hidden',
                      }}
                    >
                      <button
                        onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                        style={{
                          width: '100%', padding: '1rem', background: 'none', border: 'none',
                          textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
                          alignItems: 'center', gap: '1rem', color: 'var(--clr-text)', fontWeight: 700,
                          fontSize: 'var(--text-sm)',
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>{faq.category}</span>
                          {faq.question}
                        </span>
                        <ChevronRight size={16} color="var(--clr-text-3)" style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                      </button>
                      {isOpen && (
                        <div style={{ padding: '0 1rem 1rem', fontSize: 'var(--text-sm)', color: 'var(--clr-text-2)', lineHeight: 1.7, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--clr-text-3)' }}>
                  No matching questions found for "{searchQuery}".
                </div>
              )}
            </div>

            {/* CTA to Fit Coach */}
            <div style={{ background: 'rgba(232,160,32,0.1)', border: '1px solid rgba(232,160,32,0.25)', borderRadius: 'var(--radius-lg)', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <MessageSquare size={20} color="var(--clr-primary)" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>Have a specific fitness question?</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-2)' }}>Ask Fit Coach AI for instant personalized guidance.</div>
                </div>
              </div>
              <button
                onClick={() => { setActiveModal(null); navigate('/coach'); }}
                style={{ background: 'var(--grad-primary)', color: '#0F1117', border: 'none', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: 'var(--text-xs)', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                Ask AI Coach
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. TERMS OF SERVICE MODAL */}
      {activeModal === 'terms' && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1100,
          background: 'rgba(9, 11, 16, 0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }}>
          <div className="card animate-fade-in" style={{ maxWidth: 640, width: '100%', padding: '2rem', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 40, height: 40, background: 'rgba(232,160,32,0.15)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={20} color="var(--clr-primary)" />
                </div>
                <div>
                  <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800 }}>Terms of Service</h3>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)' }}>Last updated: October 2026</div>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', color: 'var(--clr-text-3)', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: 'var(--text-sm)', color: 'var(--clr-text-2)', lineHeight: 1.7 }}>
              <section>
                <h4 style={{ color: 'var(--clr-text)', fontWeight: 700, marginBottom: '0.375rem' }}>1. Acceptance of Terms</h4>
                <p>By accessing or using Fit For Midlife Men, you agree to be bound by these Terms of Service. If you do not agree to all terms, please discontinue use of the platform.</p>
              </section>

              <section>
                <h4 style={{ color: 'var(--clr-text)', fontWeight: 700, marginBottom: '0.375rem' }}>2. Health & Exercise Disclaimer</h4>
                <p style={{ background: 'rgba(245,166,35,0.08)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--clr-warning)' }}>
                  ⚠️ <strong>Important:</strong> Fit For Midlife Men provides educational exercise programs and nutrition estimates. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult a physician before beginning any physical exercise regimen, especially if you have pre-existing cardiovascular or joint conditions.
                </p>
              </section>

              <section>
                <h4 style={{ color: 'var(--clr-text)', fontWeight: 700, marginBottom: '0.375rem' }}>3. User Accounts & Responsibilities</h4>
                <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized access or security breach.</p>
              </section>

              <section>
                <h4 style={{ color: 'var(--clr-text)', fontWeight: 700, marginBottom: '0.375rem' }}>4. Subscriptions & Billing</h4>
                <p>Pro memberships renew automatically per billing cycle (Monthly or Annual). You may cancel your subscription at any time with no cancellation penalty.</p>
              </section>
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--clr-border)', textAlign: 'right' }}>
              <button onClick={() => setActiveModal(null)} className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. PRIVACY POLICY MODAL */}
      {activeModal === 'privacy' && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1100,
          background: 'rgba(9, 11, 16, 0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }}>
          <div className="card animate-fade-in" style={{ maxWidth: 640, width: '100%', padding: '2rem', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 40, height: 40, background: 'rgba(34,212,122,0.15)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Lock size={20} color="var(--clr-success)" />
                </div>
                <div>
                  <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800 }}>Privacy Policy</h3>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)' }}>Data Privacy & Security Standards</div>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', color: 'var(--clr-text-3)', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: 'var(--text-sm)', color: 'var(--clr-text-2)', lineHeight: 1.7 }}>
              <section>
                <h4 style={{ color: 'var(--clr-text)', fontWeight: 700, marginBottom: '0.375rem' }}>1. Data Collection & Supabase Cloud Storage</h4>
                <p>We collect workout session logs, body measurements, macro targets, and profile information to personalize your fitness analytics. All data is encrypted in transit and at rest using PostgreSQL Row Level Security (RLS) on Supabase.</p>
              </section>

              <section>
                <h4 style={{ color: 'var(--clr-text)', fontWeight: 700, marginBottom: '0.375rem' }}>2. AI Vision & Image Processing</h4>
                <p>When you snap or upload a meal photo for AI Vision recognition, images are transmitted securely to Google Gemini APIs over HTTPS solely for instant nutrition extraction. Photos are not saved permanently or used to train third-party public models.</p>
              </section>

              <section>
                <h4 style={{ color: 'var(--clr-text)', fontWeight: 700, marginBottom: '0.375rem' }}>3. Your Rights & Data Controls</h4>
                <p>You own your fitness data. You can request a full export of your assessment records or wipe your local cache anytime under Settings ➔ Privacy.</p>
              </section>
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--clr-border)', textAlign: 'right' }}>
              <button onClick={() => setActiveModal(null)} className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>
                Accept Policy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. DATA & PRIVACY OVERVIEW MODAL */}
      {activeModal === 'data' && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1100,
          background: 'rgba(9, 11, 16, 0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }}>
          <div className="card animate-fade-in" style={{ maxWidth: 540, width: '100%', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Shield size={24} color="var(--clr-primary)" />
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>Data & Security Overview</h3>
              </div>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', color: 'var(--clr-text-3)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: 'var(--text-sm)', color: 'var(--clr-text-2)', lineHeight: 1.6 }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', background: 'var(--clr-bg-3)', padding: '0.875rem', borderRadius: 'var(--radius-md)' }}>
                <CheckCircle2 size={18} color="var(--clr-success)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong style={{ color: 'var(--clr-text)' }}>PostgreSQL Row Level Security (RLS)</strong>
                  <div>Your profile, workouts, and macro logs are protected by database policies linked to your user ID.</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', background: 'var(--clr-bg-3)', padding: '0.875rem', borderRadius: 'var(--radius-md)' }}>
                <CheckCircle2 size={18} color="var(--clr-success)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong style={{ color: 'var(--clr-text)' }}>256-Bit SSL Encryption</strong>
                  <div>All client-to-cloud communications (Supabase & Google Gemini API) are encrypted with TLS 1.3 standards.</div>
                </div>
              </div>
            </div>

            <button onClick={() => setActiveModal(null)} className="btn btn-secondary btn-block" style={{ marginTop: '1.5rem' }}>
              Close Overview
            </button>
          </div>
        </div>
      )}

      {/* 5. DELETE DATA CONFIRMATION MODAL */}
      {activeModal === 'delete' && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1100,
          background: 'rgba(9, 11, 16, 0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }}>
          <div className="card animate-fade-in" style={{ maxWidth: 480, width: '100%', padding: '2rem', border: '1px solid rgba(239,68,68,0.3)' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <div style={{ width: 56, height: 56, background: 'rgba(239,68,68,0.12)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Trash2 size={28} color="var(--clr-danger)" />
              </div>
              <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--clr-text)' }}>Clear Local Cache & Reset Data</h3>
              <p style={{ color: 'var(--clr-text-2)', fontSize: 'var(--text-sm)', marginTop: '0.5rem', lineHeight: 1.6 }}>
                Are you sure you want to clear your local browser storage? This will reset local demo caches and log you out.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button onClick={() => setActiveModal(null)} className="btn btn-secondary" style={{ flex: 1 }}>
                Cancel
              </button>
              <button onClick={handleClearData} className="btn btn-danger" style={{ flex: 1 }}>
                Clear & Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

