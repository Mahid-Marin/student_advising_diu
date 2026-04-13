import React, { useState } from 'react';

const articles = [
  { id: 1, title: 'Academic Integrity Policy',         category: 'POLICY',           content: 'All submitted work must be original. Plagiarism results in academic penalties. Students are required to cite all sources properly using APA or MLA format.', tags: ['Policy', 'Ethics'] },
  { id: 2, title: 'Grade Appeal Process',              category: 'FAQ',              content: 'Students may appeal grades within 14 days of release. Submit a written request to your department head with supporting evidence for your appeal.', tags: ['Grades', 'Process'] },
  { id: 3, title: 'CS101 Course Overview',             category: 'COURSE_INFO',      content: 'Introduction to Python programming. Topics include variables, control flow, functions, and basic data structures. Prerequisites: None.', tags: ['CS', 'Python'] },
  { id: 4, title: 'Research Protocol Guidelines',      category: 'RESEARCH_PROTOCOL',content: 'All research involving human subjects requires IRB approval. Submit forms at least 4 weeks before data collection begins.', tags: ['Research', 'IRB'] },
  { id: 5, title: 'Scholarship Application Guide',     category: 'FAQ',              content: 'Merit scholarships are awarded based on GPA and extracurricular activities. Apply before March 31 each year through the student portal.', tags: ['Scholarship', 'Finance'] },
  { id: 6, title: 'Attendance Requirements',           category: 'POLICY',           content: 'Students must attend at least 75% of classes to be eligible for examinations. Medical absences require documentation within 3 days.', tags: ['Attendance', 'Policy'] },
  { id: 7, title: 'Database Systems Syllabus',         category: 'COURSE_INFO',      content: 'Covers relational databases, SQL, normalization, transactions, and indexing. Includes a semester-long project building a full-stack application.', tags: ['DB', 'SQL'] },
  { id: 8, title: 'Thesis Submission Format',          category: 'RESEARCH_PROTOCOL',content: 'Thesis must follow department formatting guidelines: 12pt Times New Roman, double-spaced, 1-inch margins. Submit digitally and one hard copy.', tags: ['Thesis', 'Format'] },
];

const catMeta = {
  POLICY:            { label: 'Policy',           color: '#ef4444', bg: '#fef2f2' },
  FAQ:               { label: 'FAQ',              color: '#f59e0b', bg: '#fffbeb' },
  COURSE_INFO:       { label: 'Course Info',      color: '#6366f1', bg: '#eef2ff' },
  RESEARCH_PROTOCOL: { label: 'Research',         color: '#10b981', bg: '#ecfdf5' },
};

export default function KnowledgeBase() {
  const [search, setSearch] = useState('');
  const [active, setActive] = useState('all');
  const [expanded, setExpanded] = useState(null);

  const categories = ['all', ...Object.keys(catMeta)];

  const filtered = articles.filter(a => {
    const matchCat = active === 'all' || a.category === active;
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.content.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="fade-in">
      {/* Search bar */}
      <div style={{
        background: '#fff', borderRadius: 16, padding: '20px 24px', marginBottom: 24,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9',
      }}>
        <div style={{ position: 'relative' }}>
          <svg style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
            width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search policies, FAQs, course info..."
            style={{
              width: '100%', padding: '12px 16px 12px 48px', border: '1.5px solid #e2e8f0',
              borderRadius: 12, fontSize: 14, outline: 'none', color: '#1e293b',
              transition: 'border-color 0.15s', boxSizing: 'border-box',
            }}
            onFocus={e => e.target.style.borderColor = '#6366f1'}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>
      </div>

      {/* Category pills */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {categories.map(cat => {
          const meta = catMeta[cat];
          const isActive = active === cat;
          return (
            <button key={cat} onClick={() => setActive(cat)} style={{
              padding: '8px 18px', borderRadius: 20, border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: 13, transition: 'all 0.15s',
              background: isActive ? (meta ? meta.color : 'linear-gradient(135deg,#6366f1,#8b5cf6)') : '#fff',
              color: isActive ? '#fff' : (meta ? meta.color : '#64748b'),
              boxShadow: isActive ? `0 4px 14px ${meta ? meta.color + '40' : 'rgba(99,102,241,0.35)'}` : '0 1px 3px rgba(0,0,0,0.06)',
            }}>
              {cat === 'all' ? 'All' : meta.label}
            </button>
          );
        })}
        <span style={{ marginLeft: 'auto', fontSize: 13, color: '#94a3b8', alignSelf: 'center' }}>
          {filtered.length} article{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Articles */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <p style={{ fontSize: 15 }}>No articles found</p>
          </div>
        ) : filtered.map(article => {
          const meta = catMeta[article.category];
          const isOpen = expanded === article.id;
          return (
            <div key={article.id} style={{
              background: '#fff', borderRadius: 16, overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: `1px solid ${isOpen ? meta.color + '40' : '#f1f5f9'}`,
              transition: 'border-color 0.2s',
            }}>
              <button
                onClick={() => setExpanded(isOpen ? null : article.id)}
                style={{
                  width: '100%', padding: '20px 24px', display: 'flex', alignItems: 'center',
                  gap: 16, background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10, background: meta.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  color: meta.color, fontSize: 16,
                }}>
                  {article.category === 'POLICY' ? '📋' : article.category === 'FAQ' ? '❓' : article.category === 'COURSE_INFO' ? '📚' : '🔬'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{article.title}</h3>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 99, background: meta.bg, color: meta.color }}>
                      {meta.label}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {article.tags.map(t => (
                      <span key={t} style={{ fontSize: 11, color: '#94a3b8', background: '#f8fafc', padding: '2px 8px', borderRadius: 99 }}>#{t}</span>
                    ))}
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {isOpen && (
                <div style={{ padding: '0 24px 20px 80px', borderTop: `1px solid ${meta.color}20` }}>
                  <p style={{ margin: '16px 0 0', fontSize: 14, color: '#475569', lineHeight: 1.7 }}>{article.content}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
