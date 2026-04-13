import React, { useState } from 'react';

const courses = [
  { id: 1, name: 'Python Programming',   marks: 88, attendance: 94, engagement: 82, grade: 'A',  semester: 'Spring 2024' },
  { id: 2, name: 'Data Structures',      marks: 76, attendance: 88, engagement: 71, grade: 'B+', semester: 'Spring 2024' },
  { id: 3, name: 'Database Systems',     marks: 91, attendance: 96, engagement: 89, grade: 'A+', semester: 'Spring 2024' },
  { id: 4, name: 'Web Development',      marks: 84, attendance: 90, engagement: 88, grade: 'A-', semester: 'Spring 2024' },
  { id: 5, name: 'Machine Learning',     marks: 69, attendance: 78, engagement: 65, grade: 'B-', semester: 'Fall 2023'  },
  { id: 6, name: 'Computer Networks',   marks: 79, attendance: 85, engagement: 74, grade: 'B+', semester: 'Fall 2023'  },
];

const gradeColor = { 'A+': '#10b981', A: '#10b981', 'A-': '#22c55e', 'B+': '#6366f1', B: '#6366f1', 'B-': '#f59e0b', C: '#ef4444' };
const barColor = (val) => val >= 85 ? '#10b981' : val >= 70 ? '#6366f1' : '#ef4444';

function StatBar({ label, value, color }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color }}>{value}%</span>
      </div>
      <div style={{ height: 6, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 99,
          width: `${value}%`, background: color,
          transition: 'width 0.8s ease',
        }} />
      </div>
    </div>
  );
}

export default function Learning() {
  const [filter, setFilter] = useState('all');
  const semesters = ['all', ...new Set(courses.map(c => c.semester))];
  const filtered = filter === 'all' ? courses : courses.filter(c => c.semester === filter);

  const avg = (key) => Math.round(filtered.reduce((s, c) => s + c[key], 0) / filtered.length);

  return (
    <div className="fade-in">
      {/* Header stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18, marginBottom: 28 }}>
        {[
          { label: 'Average Marks',      value: `${avg('marks')}%`,      icon: '📊', bg: 'linear-gradient(135deg,#6366f1,#8b5cf6)' },
          { label: 'Average Attendance', value: `${avg('attendance')}%`, icon: '📅', bg: 'linear-gradient(135deg,#0ea5e9,#6366f1)' },
          { label: 'Avg Engagement',     value: `${avg('engagement')}%`, icon: '⚡', bg: 'linear-gradient(135deg,#10b981,#0ea5e9)' },
        ].map((s, i) => (
          <div key={i} style={{
            background: '#fff', borderRadius: 16, padding: '22px 24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9',
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14, background: s.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0,
            }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a' }}>{s.value}</div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {semesters.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: '8px 18px', borderRadius: 20, border: 'none', cursor: 'pointer',
            fontWeight: 600, fontSize: 13, transition: 'all 0.15s',
            background: filter === s ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#fff',
            color: filter === s ? '#fff' : '#64748b',
            boxShadow: filter === s ? '0 4px 14px rgba(99,102,241,0.35)' : '0 1px 3px rgba(0,0,0,0.06)',
          }}>{s === 'all' ? 'All Semesters' : s}</button>
        ))}
      </div>

      {/* Course cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20 }}>
        {filtered.map((course) => (
          <div key={course.id} style={{
            background: '#fff', borderRadius: 16, padding: 24,
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700, color: '#0f172a' }}>{course.name}</h3>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>{course.semester}</span>
              </div>
              <div style={{
                padding: '4px 12px', borderRadius: 20, fontSize: 14, fontWeight: 800,
                background: `${gradeColor[course.grade]}18`,
                color: gradeColor[course.grade],
              }}>{course.grade}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <StatBar label="Marks"      value={course.marks}      color={barColor(course.marks)} />
              <StatBar label="Attendance" value={course.attendance} color={barColor(course.attendance)} />
              <StatBar label="Engagement" value={course.engagement} color={barColor(course.engagement)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
