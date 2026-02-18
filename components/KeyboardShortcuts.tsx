'use client';

import { useEffect, useState } from 'react';
import { X, Keyboard } from 'lucide-react';

export default function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  if (!open) return null;

  const shortcuts = [
    { key: 'Ctrl+K', desc: 'Open command palette' },
    { key: 'Ctrl+N', desc: 'Create new team' },
    { key: 'Ctrl+Z', desc: 'Undo last action' },
    { key: 'Ctrl+Y', desc: 'Redo action' },
    { key: '↑↓', desc: 'Navigate teams' },
    { key: 'Enter', desc: 'Open selected team' },
    { key: 'Delete', desc: 'Delete selected teams' },
    { key: 'Esc', desc: 'Close modals' },
    { key: '?', desc: 'Show this help' },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={() => setOpen(false)}>
      <div style={{ background: 'var(--parchment)', border: '2px solid var(--gold)', width: '500px', maxWidth: '90vw', boxShadow: '8px 8px 0 var(--border)' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Keyboard size={24} style={{ color: 'var(--gold)' }} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700 }}>Keyboard Shortcuts</h2>
          </div>
          <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)' }}>
            <X size={20} />
          </button>
        </div>
        <div style={{ padding: '1.5rem' }}>
          {shortcuts.map((s, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: i < shortcuts.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '0.9rem', color: 'var(--ink)' }}>{s.desc}</span>
              <kbd style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'white', border: '1px solid var(--border)', borderBottom: '2px solid var(--ink-muted)', color: 'var(--ink)' }}>
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--ink-muted)' }}>Press ? to toggle this help</p>
        </div>
      </div>
    </div>
  );
}
