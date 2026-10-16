// src/pages/FitCoach.tsx
// ============================================================
// FIT COACH — AI fitness assistant interface.
// Uses real AI if configured, otherwise uses mock responses.
// ============================================================

import { useState, useRef, useEffect } from 'react';
import { Zap, Send, RefreshCw, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { sendMessage } from '../lib/ai';
import type { ChatMessage } from '../types';

const SUGGESTED_QUESTIONS = [
  "I only have 20 minutes today. What should I do?",
  "How do I make progress when I feel stuck?",
  "What should I eat before and after my workout?",
  "How can I improve my sleep quality?",
  "Is it normal to feel sore after my first week?",
  "How much protein do I need each day?",
];

function TypingIndicator() {
  return (
    <div className="chat-message assistant">
      <div style={{ width: 32, height: 32, background: 'var(--grad-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Zap size={16} color="#0F1117" />
      </div>
      <div className="chat-bubble" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: '50%', background: 'var(--clr-primary)',
              animation: 'pulse 1.2s ease-in-out infinite',
              animationDelay: `${i * 0.2}s`,
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: "Hi! I'm Fit Coach, your personal fitness assistant. I'm here to help you with workouts, nutrition tips, and staying on track with your fitness goals. What can I help you with today?",
  timestamp: new Date().toISOString(),
};

export default function FitCoach() {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const content = text || input.trim();
    if (!content || loading) return;
    setInput('');

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const reply = await sendMessage(updatedMessages, { profile, recentWorkouts: [], currentProgram: null });
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([WELCOME_MESSAGE]);
    setInput('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--clr-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--clr-bg)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{ width: 44, height: 44, background: 'var(--grad-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={22} color="#0F1117" />
          </div>
          <div>
            <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, lineHeight: 1.1 }}>Fit Coach</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: 'var(--text-xs)', color: 'var(--clr-success)' }}>
              <div style={{ width: 6, height: 6, background: 'var(--clr-success)', borderRadius: '50%' }} />
              Online — Ready to help
            </div>
          </div>
        </div>
        <button onClick={clearChat} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clr-text-3)', fontSize: 'var(--text-sm)' }}>
          <RefreshCw size={15} /> New Chat
        </button>
      </div>

      {/* Disclaimer */}
      <div style={{ padding: '0.75rem 1.5rem', background: 'rgba(245,166,35,0.06)', border: 'none', borderBottom: '1px solid var(--clr-border)', display: 'flex', gap: '0.625rem', alignItems: 'flex-start', fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)', lineHeight: 1.6 }}>
        <AlertTriangle size={13} color="var(--clr-warning)" style={{ flexShrink: 0, marginTop: 2 }} />
        Fit Coach provides general fitness and wellness information only — not medical advice. For health concerns or injuries, consult a qualified healthcare professional.
      </div>

      {/* Messages */}
      <div className="chat-messages" style={{ flex: 1, overflowY: 'auto' }}>
        {messages.map(msg => (
          <div key={msg.id} className={`chat-message ${msg.role}`}>
            {msg.role === 'assistant' && (
              <div style={{ width: 32, height: 32, background: 'var(--grad-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, alignSelf: 'flex-end' }}>
                <Zap size={16} color="#0F1117" />
              </div>
            )}
            <div className="chat-bubble">
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <TypingIndicator />}
        <div ref={endRef} />
      </div>

      {/* Suggested questions */}
      {messages.length <= 1 && !loading && (
        <div style={{ padding: '0.75rem 1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {SUGGESTED_QUESTIONS.map(q => (
            <button key={q} onClick={() => handleSend(q)}
              style={{ padding: '0.5rem 0.875rem', background: 'var(--clr-bg-3)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-sm)', color: 'var(--clr-text-2)', cursor: 'pointer', transition: 'all var(--transition-fast)', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}
              onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = 'var(--clr-primary)'; (e.target as HTMLElement).style.color = 'var(--clr-primary)'; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = 'var(--clr-border)'; (e.target as HTMLElement).style.color = 'var(--clr-text-2)'; }}>
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="chat-input-area">
        <textarea
          ref={inputRef}
          className="chat-input"
          rows={1}
          placeholder="Ask Fit Coach anything about workouts, nutrition, or recovery..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          id="fitcoach-input"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          style={{
            width: 44, height: 44, borderRadius: '50%',
            background: input.trim() && !loading ? 'var(--grad-primary)' : 'var(--clr-bg-4)',
            border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: input.trim() && !loading ? '#0F1117' : 'var(--clr-text-3)',
            flexShrink: 0, transition: 'all var(--transition-fast)',
          }}
          id="fitcoach-send-btn"
        >
          <Send size={18} />
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
