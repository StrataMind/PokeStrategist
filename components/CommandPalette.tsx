'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTeamStore } from '@/lib/store/teamStore';
import { Search, Plus, Download, Upload, Calculator, TrendingUp, Zap } from 'lucide-react';

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { teams } = useTeamStore();
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(o => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const commands = [
    { icon: Plus, label: 'Create New Team', action: () => router.push('/?new=true'), keywords: 'new create team' },
    { icon: Calculator, label: 'Damage Calculator', action: () => router.push('/calculator'), keywords: 'damage calc calculator' },
    { icon: TrendingUp, label: 'EV/IV Calculator', action: () => router.push('/ev-iv'), keywords: 'ev iv stats calculator' },
    { icon: Zap, label: 'Create Fakémon', action: () => router.push('/fakemon'), keywords: 'fakemon create custom' },
    { icon: Upload, label: 'Import Team', action: () => {}, keywords: 'import load team json' },
    { icon: Download, label: 'Export All Teams', action: () => {}, keywords: 'export save download all' },
    ...teams.map(t => ({ icon: Search, label: `Open ${t.name}`, action: () => router.push(`/team/${t.id}`), keywords: `team ${t.name}` }))
  ];

  const filtered = commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()) || c.keywords.includes(query.toLowerCase()));

  if (!open) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 100, paddingTop: '15vh' }} onClick={() => setOpen(false)}>
      <div style={{ background: 'var(--parchment)', border: '2px solid var(--gold)', width: '600px', maxWidth: '90vw', boxShadow: '8px 8px 0 var(--border)' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            style={{ width: '100%', border: '1px solid var(--border)', borderBottom: '2px solid var(--ink-muted)', padding: '0.75rem', fontFamily: "'DM Mono', monospace", fontSize: '0.9rem', outline: 'none' }}
            autoFocus
          />
        </div>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--ink-muted)', fontFamily: "'DM Mono', monospace", fontSize: '0.8rem' }}>No results found</div>
          ) : (
            filtered.map((cmd, i) => (
              <button
                key={i}
                onClick={() => { cmd.action(); setOpen(false); }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <cmd.icon size={18} style={{ color: 'var(--gold)' }} />
                <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '0.9rem', color: 'var(--ink)' }}>{cmd.label}</span>
              </button>
            ))
          )}
        </div>
        <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '1rem', fontSize: '0.7rem', color: 'var(--ink-muted)', fontFamily: "'DM Mono', monospace" }}>
          <span>↑↓ Navigate</span>
          <span>↵ Select</span>
          <span>ESC Close</span>
        </div>
      </div>
    </div>
  );
}
