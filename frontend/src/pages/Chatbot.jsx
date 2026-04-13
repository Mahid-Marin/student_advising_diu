import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore, useChatStore } from '../context/store';
import { chatbotAPI } from '../services/api';
import { v4 as uuidv4 } from 'uuid';

const suggestions = [
  'What is the grade appeal process?',
  'How can I improve my GPA?',
  'When are scholarship applications due?',
  'What are the attendance requirements?',
];

export default function Chatbot() {
  const user = useAuthStore((state) => state.user);
  const { messages, sessionId, addMessage, setSessionId } = useChatStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!sessionId) setSessionId(uuidv4());
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    addMessage({ type: 'user', content: msg, timestamp: new Date() });
    setInput('');
    setIsLoading(true);
    try {
      const res = await chatbotAPI.sendMessage(user?.id, msg, sessionId);
      addMessage({ type: 'ai', content: res.data.response, timestamp: new Date() });
    } catch {
      addMessage({ type: 'ai', content: 'Sorry, I encountered an error. Please try again.', timestamp: new Date() });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => { e.preventDefault(); send(); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px - 64px)', maxHeight: 700 }}>
      {/* Chat window */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '8px 0 16px',
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        {messages.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32, marginBottom: 16,
              boxShadow: '0 8px 32px rgba(99,102,241,0.35)',
            }}>🎓</div>
            <h3 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 700, color: '#0f172a' }}>AI Academic Advisor</h3>
            <p style={{ margin: '0 0 32px', color: '#64748b', fontSize: 14, textAlign: 'center' }}>
              Ask me anything about courses, policies, grades, or academic planning.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', maxWidth: 500 }}>
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => send(s)} style={{
                  padding: '10px 16px', borderRadius: 20, border: '1.5px solid #e2e8f0',
                  background: '#fff', color: '#475569', fontSize: 13, cursor: 'pointer',
                  fontWeight: 500, transition: 'all 0.15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#6366f1'; e.currentTarget.style.background = '#eef2ff'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = '#fff'; }}
                >{s}</button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start' }}>
              {msg.type === 'ai' && (
                <div style={{
                  width: 34, height: 34, borderRadius: '50%', flexShrink: 0, marginRight: 10,
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                }}>🎓</div>
              )}
              <div style={{
                maxWidth: '70%', padding: '12px 16px', borderRadius: msg.type === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: msg.type === 'user' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#fff',
                color: msg.type === 'user' ? '#fff' : '#1e293b',
                fontSize: 14, lineHeight: 1.6,
                boxShadow: msg.type === 'user' ? '0 4px 14px rgba(99,102,241,0.3)' : '0 1px 3px rgba(0,0,0,0.06)',
                border: msg.type === 'ai' ? '1px solid #f1f5f9' : 'none',
              }}>
                {msg.content}
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
            }}>🎓</div>
            <div style={{
              padding: '12px 16px', background: '#fff', borderRadius: '18px 18px 18px 4px',
              border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 8, height: 8, borderRadius: '50%', background: '#6366f1',
                    animation: 'bounce 1.2s infinite',
                    animationDelay: `${i * 0.2}s`,
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div style={{ paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask your AI academic advisor..."
            disabled={isLoading}
            style={{
              flex: 1, padding: '14px 18px', border: '1.5px solid #e2e8f0', borderRadius: 14,
              fontSize: 14, outline: 'none', color: '#1e293b', transition: 'border-color 0.15s',
              background: '#fff',
            }}
            onFocus={e => e.target.style.borderColor = '#6366f1'}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          />
          <button type="submit" disabled={isLoading || !input.trim()} style={{
            padding: '14px 24px', borderRadius: 14, border: 'none',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
            opacity: isLoading || !input.trim() ? 0.5 : 1,
            transition: 'opacity 0.15s',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
            Send
          </button>
        </form>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
