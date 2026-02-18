'use client';

import { useEffect, useState } from 'react';
import { useTeamStore } from '@/lib/store/teamStore';
import { Plus, Trash2, Copy, Download, Upload, Star, Edit2, Save, X as XIcon, Calculator, TrendingUp, Home as HomeIcon, Swords, MoreVertical, BarChart3, CheckCircle, Share2, Moon, Sun, Undo, Redo, CheckSquare, Square, Zap, AlertCircle, Info, Image as ImageIcon, Clock } from 'lucide-react';
import Link from 'next/link';
import { getTypeColor } from '@/lib/utils';
import { teamTemplates } from '@/lib/data/templates';
import { getFormatBadge } from '@/lib/utils/validator';
import { getTeamCoverage, getTeamTypeFilters } from '@/lib/utils/teamStats';

const navItems = [
  { section: 'MAIN', items: [{ icon: '⊞', label: 'My Teams', href: '/', active: true as boolean | undefined }] },
  {
    section: 'TOOLS',
    items: [
      { icon: '⊟', label: 'Damage Calculator', href: '/calculator', active: undefined as boolean | undefined },
      { icon: '↗', label: 'EV/IV Calculator', href: '/ev-iv', active: undefined as boolean | undefined },
    ],
  },
  {
    section: 'ACTIONS',
    items: [
      { icon: '⊡', label: 'Templates', href: '#', active: undefined as boolean | undefined },
      { icon: '⚡', label: 'Create Fakémon', href: '/fakemon', active: undefined as boolean | undefined },
      { icon: '↑', label: 'Import Team', href: '#', active: undefined as boolean | undefined },
      { icon: '↓', label: 'Export All', href: '#', active: undefined as boolean | undefined },
    ],
  },
];

export default function Home() {
  const { teams, loadTeams, createTeam, deleteTeam, duplicateTeam, toggleFavorite, renameTeam, exportTeam, importTeam, exportAllTeams, importShowdown, exportShowdown, bulkDelete, bulkExport, bulkFavorite, undo, redo, theme, toggleTheme } = useTeamStore();
  const [showCreate, setShowCreate] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamSize, setTeamSize] = useState(6);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'favorite'>('date');
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'favorites'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  const handleCreate = () => {
    if (teamName.trim()) {
      createTeam(teamName, teamSize);
      setTeamName('');
      setTeamSize(6);
      setShowCreate(false);
    }
  };

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      deleteTeam(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const handleRename = (id: string) => {
    if (editingName.trim()) {
      renameTeam(id, editingName);
      setEditingTeamId(null);
      setEditingName('');
    }
  };

  const sortedTeams = [...teams].sort((a, b) => {
    if (sortBy === 'favorite') return (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0);
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const filteredTeams = sortedTeams.filter(team => {
    if (searchQuery && !team.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !team.pokemon.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))) return false;
    if (filterType === 'favorites' && !team.favorite) return false;
    if (typeFilter !== 'all' && !team.pokemon.some(p => p.types.includes(typeFilter))) return false;
    return true;
  });

  const recentTeams = [...teams].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  ).slice(0, 5);

  const availableTypes = getTeamTypeFilters(teams);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--cream)', fontFamily: "'Libre Baskerville', Georgia, serif" }}>
      
      {/* Sidebar */}
      <aside style={{ width: '220px', minHeight: '100vh', background: 'var(--ink)', borderRight: '3px solid var(--gold)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid rgba(201,168,76,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '32px', height: '32px', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>⚡</div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", color: 'var(--cream)', fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.1 }}>PokeStrategist</div>
              <div style={{ fontFamily: "'DM Mono', monospace", color: 'var(--ink-muted)', fontSize: '0.6rem', letterSpacing: '0.1em' }}>TEAM BUILDER</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '1rem 0' }}>
          {navItems.map(({ section, items }) => (
            <div key={section} style={{ marginBottom: '1rem' }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.2em', color: 'var(--gold)', padding: '0 1.25rem', marginBottom: '0.3rem' }}>{section}</div>
              {items.map((item) => (
                <Link key={item.label} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.55rem 1.25rem', background: item.active ? 'rgba(201,168,76,0.15)' : 'transparent', borderLeft: item.active ? '3px solid var(--gold)' : '3px solid transparent', color: item.active ? 'var(--gold)' : 'var(--ink-muted)', fontSize: '0.82rem', textDecoration: 'none', transition: 'all 0.15s', fontFamily: item.active ? "'Playfair Display', serif" : 'inherit' }}>
                  <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {recentTeams.length > 0 && (
          <div style={{ borderTop: '1px solid rgba(201,168,76,0.2)', padding: '1rem 1.25rem' }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.2em', color: 'var(--gold)', marginBottom: '0.5rem' }}>RECENT</div>
            {recentTeams.map(team => (
              <div key={team.id} style={{ color: 'var(--ink-muted)', fontSize: '0.8rem', marginBottom: '0.3rem' }}>{team.name}</div>
            ))}
          </div>
        )}
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ height: '64px', background: 'var(--parchment)', borderBottom: '2px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 2rem', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>My Teams</h1>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', color: 'var(--ink-muted)', letterSpacing: '0.1em', marginTop: '2px' }}>{filteredTeams.length} team{filteredTeams.length !== 1 ? 's' : ''} · Saved</p>
          </div>

          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search teams..." style={{ background: 'white', border: '1px solid var(--border)', borderBottom: '2px solid var(--ink-muted)', padding: '0.45rem 0.85rem', fontFamily: "'DM Mono', monospace", fontSize: '0.78rem', color: 'var(--ink)', width: '200px', outline: 'none' }} />

          <div style={{ position: 'relative' }}>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value as any)} style={{ appearance: 'none', background: 'white', border: '1px solid var(--border)', borderBottom: '2px solid var(--ink-muted)', padding: '0.45rem 2rem 0.45rem 0.75rem', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: 'var(--ink)', outline: 'none', cursor: 'pointer' }}>
              <option value="all">All Teams</option>
              <option value="favorites">Favorites</option>
            </select>
            <span style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.6rem', color: 'var(--ink-muted)', pointerEvents: 'none' }}>▼</span>
          </div>

          <div style={{ position: 'relative' }}>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} style={{ appearance: 'none', background: 'white', border: '1px solid var(--border)', borderBottom: '2px solid var(--ink-muted)', padding: '0.45rem 2rem 0.45rem 0.75rem', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: 'var(--ink)', outline: 'none', cursor: 'pointer' }}>
              <option value="date">Latest</option>
              <option value="name">Name</option>
              <option value="favorite">Favorites</option>
            </select>
            <span style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.6rem', color: 'var(--ink-muted)', pointerEvents: 'none' }}>▼</span>
          </div>

          <button onClick={() => setShowCreate(true)} style={{ background: 'var(--ink)', border: '2px solid var(--gold)', padding: '0.45rem 1.1rem', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: 'var(--gold)', cursor: 'pointer', letterSpacing: '0.1em', boxShadow: '2px 2px 0 var(--gold-dark)', transition: 'all 0.15s' }}>+ New Team</button>
        </header>

        <main style={{ flex: 1, padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem', alignContent: 'start' }}>
          {filteredTeams.map((team) => {
            const totalStats = team.pokemon.reduce((sum, p) => sum + Object.values(p.stats).reduce((a, b) => a + b, 0), 0);
            const avgStat = team.pokemon.length > 0 ? Math.round(totalStats / team.pokemon.length) : 0;
            const validation = getFormatBadge(team);
            const coverage = getTeamCoverage(team);

            return (
              <div key={team.id} style={{ background: 'var(--parchment)', border: '1px solid var(--border)', borderTop: '4px solid var(--gold)', boxShadow: '4px 4px 0 var(--border)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <input type="checkbox" checked={selectedTeams.includes(team.id)} onChange={() => setSelectedTeams(prev => prev.includes(team.id) ? prev.filter(id => id !== team.id) : [...prev, team.id])} style={{ accentColor: 'var(--gold)', width: '14px', height: '14px' }} />
                  {editingTeamId === team.id ? (
                    <>
                      <input type="text" value={editingName} onChange={(e) => setEditingName(e.target.value)} style={{ flex: 1, border: '1px solid var(--gold)', padding: '0.25rem 0.5rem', fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700 }} autoFocus />
                      <button onClick={() => handleRename(team.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>✓</button>
                      <button onClick={() => setEditingTeamId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>✕</button>
                    </>
                  ) : (
                    <>
                      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: 'var(--ink)', flex: 1 }}>{team.name}</span>
                      <button onClick={() => { setEditingTeamId(team.id); setEditingName(team.name); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.7rem' }}>✏</button>
                    </>
                  )}
                  <button onClick={() => toggleFavorite(team.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: team.favorite ? 'var(--gold)' : 'var(--border)' }}>★</button>
                </div>

                <div style={{ padding: '0.6rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--ink-muted)' }}>{team.pokemon.length}/6 Pokémon</span>
                  {avgStat > 0 && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', color: 'var(--gold)', border: '1px solid var(--gold)', padding: '1px 6px', letterSpacing: '0.05em' }}>⚡ {avgStat}</span>}
                  {validation && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', color: 'var(--green)', border: '1px solid var(--green)', padding: '1px 6px' }}>✓ {validation.format}</span>}
                </div>

                {team.pokemon.length > 0 && (
                  <div style={{ padding: '0.85rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {[{ label: 'Offensive', value: coverage.offensive, color: 'var(--red)' }, { label: 'Defensive', value: coverage.defensive, color: '#3A6EA5' }].map(({ label, value, color }) => (
                      <div key={label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', color: 'var(--ink-muted)', letterSpacing: '0.05em' }}>{label}</span>
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', color }}>{value}%</span>
                        </div>
                        <div style={{ height: '5px', background: 'var(--border)', position: 'relative' }}>
                          <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${value}%`, background: color, transition: 'width 0.6s ease-out' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--border)' }}>
                  {Array.from({ length: team.maxSize }).map((_, i) => (
                    <div key={i} style={{ background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.75rem', aspectRatio: '1' }}>
                      {team.pokemon[i] ? <img src={team.pokemon[i].sprite} alt={team.pokemon[i].name} style={{ width: '64px', height: '64px', imageRendering: 'pixelated', objectFit: 'contain' }} /> : <span style={{ fontSize: '1.5rem', color: 'var(--border)' }}>+</span>}
                    </div>
                  ))}
                </div>

                <div style={{ padding: '0.85rem 1.25rem', display: 'flex', gap: '0.6rem' }}>
                  <Link href={`/team/${team.id}`} style={{ flex: 1, background: 'var(--ink)', border: '2px solid var(--gold)', color: 'var(--gold)', padding: '0.5rem', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', letterSpacing: '0.1em', cursor: 'pointer', boxShadow: '2px 2px 0 var(--gold-dark)', textAlign: 'center', textDecoration: 'none', display: 'block' }}>EDIT</Link>
                  <Link href={`/battle/${team.id}`} style={{ flex: 1, background: 'white', border: '1px solid var(--border)', color: 'var(--ink)', padding: '0.5rem', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', letterSpacing: '0.1em', cursor: 'pointer', textAlign: 'center', textDecoration: 'none', display: 'block' }}>BATTLE</Link>
                  <button onClick={() => setOpenDropdown(openDropdown === team.id ? null : team.id)} style={{ background: 'white', border: '1px solid var(--border)', color: 'var(--ink-muted)', padding: '0.5rem 0.75rem', fontFamily: "'DM Mono', monospace", fontSize: '0.8rem', cursor: 'pointer' }}>···</button>
                </div>
              </div>
            );
          })}

          {teams.length === 0 && (
            <button onClick={() => setShowCreate(true)} style={{ border: '2px dashed var(--border)', background: 'transparent', padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--ink-muted)' }}>
              <span style={{ fontSize: '2rem', lineHeight: 1 }}>+</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.12em' }}>NEW TEAM</span>
            </button>
          )}
        </main>

        {showCreate && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }} onClick={() => setShowCreate(false)}>
            <div style={{ background: 'var(--parchment)', border: '2px solid var(--gold)', padding: '2rem', width: '400px', boxShadow: '8px 8px 0 var(--border)' }} onClick={(e) => e.stopPropagation()}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem' }}>Create New Team</h2>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '0.5rem', color: 'var(--ink-muted)' }}>TEAM NAME</label>
                <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} style={{ width: '100%', border: '1px solid var(--border)', borderBottom: '2px solid var(--ink-muted)', padding: '0.5rem', fontFamily: "'DM Mono', monospace" }} />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '0.5rem', color: 'var(--ink-muted)' }}>TEAM SIZE (1-6)</label>
                <input type="number" min="1" max="6" value={teamSize} onChange={(e) => setTeamSize(Number(e.target.value))} style={{ width: '100%', border: '1px solid var(--border)', borderBottom: '2px solid var(--ink-muted)', padding: '0.5rem', fontFamily: "'DM Mono', monospace" }} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={handleCreate} style={{ flex: 1, background: 'var(--ink)', border: '2px solid var(--gold)', color: 'var(--gold)', padding: '0.6rem', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', letterSpacing: '0.1em', cursor: 'pointer', boxShadow: '2px 2px 0 var(--gold-dark)' }}>CREATE</button>
                <button onClick={() => setShowCreate(false)} style={{ flex: 1, background: 'white', border: '1px solid var(--border)', color: 'var(--ink)', padding: '0.6rem', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', letterSpacing: '0.1em', cursor: 'pointer' }}>CANCEL</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
