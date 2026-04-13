import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../context/store';

const statCards = [
  {
    label: 'Current GPA',
    value: '3.8',
    sub: '+0.2 from last semester',
    positive: true,
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    label: 'Attendance Rate',
    value: '92%',
    sub: 'Above average',
    positive: true,
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    label: 'Courses Completed',
    value: '12 / 15',
    sub: '3 remaining this semester',
    positive: true,
    gradient: 'linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
  },
  {
    label: 'Risk Status',
    value: 'Low',
    sub: 'All metrics healthy',
    positive: true,
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
];

const learningPath = [
  { title: 'Romanticism',   status: 'done',    progress: 100 },
  { title: 'Gothic Fiction', status: 'done',   progress: 100 },
  { title: 'Victorian Era',  status: 'active', progress: 62  },
  { title: 'Modernism',      status: 'locked', progress: 0   },
  { title: 'Postmodernism',  status: 'locked', progress: 0   },
];

const recentActivity = [
  { text: 'Submitted Essay: Gothic Motifs',       time: '2h ago',   color: '#6366f1' },
  { text: 'Attended Victorian Literature lecture', time: '1d ago',   color: '#10b981' },
  { text: 'AI Advisor session completed',          time: '2d ago',   color: '#0ea5e9' },
  { text: 'Knowledge Base: Plagiarism Policy',     time: '3d ago',   color: '#f59e0b' },
];

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="fade-in">
      {/* Welcome banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f1729 0%, #1e1b4b 50%, #312e81 100%)',
        borderRadius: 20, padding: '32px 36px', marginBottom: 28,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        overflow: 'hidden', position: 'relative',
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(99,102,241,0.15)' }} />
        <div style={{ position: 'absolute', bottom: -60, right: 100, width: 160, height: 160, borderRadius: '50%', background: 'rgba(139,92,246,0.1)' }} />
        <div style={{ position: 'relative' }}>
          <p style={{ color: '#a5b4fc', margin: '0 0 4px', fontSize: 14, fontWeight: 500 }}>Good morning 👋</p>
          <h1 style={{ color: '#fff', margin: '0 0 8px', fontSize: 28, fontWeight: 800 }}>
            Welcome back, {user?.name?.split(' ')[0] || 'Student'}!
          </h1>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: 14 }}>Your academic curator has prepared today's insights.</p>
        </div>
        <Link to="/chatbot" style={{
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: '#fff', padding: '12px 24px', borderRadius: 12,
          textDecoration: 'none', fontWeight: 600, fontSize: 14,
          boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
          display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
          position: 'relative',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
          Chat with Advisor
        </Link>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginBottom: 28 }}>
        {statCards.map((card, i) => (
          <div key={i} style={{
            background: '#fff', borderRadius: 16, padding: '22px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
            border: '1px solid #f1f5f9', transition: 'transform 0.15s, box-shadow 0.15s',
          }}
            className={`fade-in delay-${i}00`}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: card.gradient, display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: '#fff',
              }}>
                {card.icon}
              </div>
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 20,
                background: card.positive ? '#dcfce7' : '#fee2e2',
                color: card.positive ? '#16a34a' : '#dc2626',
              }}>
                {card.positive ? '↑' : '↓'} Good
              </span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>{card.value}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 2 }}>{card.label}</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Bottom two columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
        {/* Learning Path */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Learning Path</h3>
            <Link to="/learning" style={{ fontSize: 13, color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>View all →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {learningPath.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: item.status === 'done' ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' :
                               item.status === 'active' ? '#ede9fe' : '#f1f5f9',
                  color: item.status === 'done' ? '#fff' : item.status === 'active' ? '#6366f1' : '#94a3b8',
                  fontSize: 14, fontWeight: 700,
                }}>
                  {item.status === 'done' ? '✓' : i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: item.status === 'locked' ? '#94a3b8' : '#0f172a' }}>
                      {item.title}
                    </span>
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>{item.progress}%</span>
                  </div>
                  <div style={{ height: 6, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 99,
                      background: item.status === 'active' ? 'linear-gradient(90deg, #6366f1, #8b5cf6)' :
                                  item.status === 'done' ? '#6366f1' : 'transparent',
                      width: `${item.progress}%`, transition: 'width 0.8s ease',
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
          <h3 style={{ margin: '0 0 24px', fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {recentActivity.map((act, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', background: act.color,
                  marginTop: 5, flexShrink: 0,
                  boxShadow: `0 0 0 3px ${act.color}22`,
                }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 2px', fontSize: 13, fontWeight: 500, color: '#334155' }}>{act.text}</p>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>{act.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick links */}
          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #f1f5f9' }}>
            <p style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Links</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { to: '/knowledge-base', label: 'Browse Knowledge Base' },
                { to: '/chatbot', label: 'Ask AI Advisor' },
              ].map(link => (
                <Link key={link.to} to={link.to} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 14px', background: '#f8fafc', borderRadius: 10,
                  textDecoration: 'none', color: '#334155', fontSize: 13, fontWeight: 500,
                  transition: 'background 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#ede9fe'}
                  onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}
                >
                  {link.label}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
