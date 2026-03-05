'use client';

import { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useTeamStore } from '@/lib/store/teamStore';
import Link from 'next/link';
import { getTeamTypeFilters } from '@/lib/utils/teamStats';
import CommandPalette from '@/components/CommandPalette';
import AutoSaveIndicator from '@/components/AutoSaveIndicator';
import KeyboardShortcuts from '@/components/KeyboardShortcuts';
import ErrorBoundary from '@/components/ErrorBoundary';
import StorageWarning from '@/components/StorageWarning';
import Sidebar from '@/components/Sidebar';
import TeamCard from '@/components/TeamCard';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

export default function Home() {
  const { data: session } = useSession();
  const {
    teams, loadTeams, syncToDrive, loadFromDrive,
    createTeam, deleteTeam, duplicateTeam, toggleFavorite, renameTeam,
    exportTeam, importTeam, exportAllTeams, bulkDelete, bulkExport, bulkFavorite,
    undo, redo, theme, toggleTheme,
  } = useTeamStore();

  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamSize, setTeamSize] = useState(6);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'favorite'>('date');
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'favorites'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    loadTeams();
    if (session?.accessToken) {
      loadFromDrive(session.accessToken as string);
    }
  }, [loadTeams, loadFromDrive, session]);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'n' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); setShowCreate(true); }
      if (e.key === 'ArrowDown') { e.preventDefault(); setFocusedIndex(i => Math.min(i + 1, filteredTeams.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setFocusedIndex(i => Math.max(i - 1, 0)); }
      if (e.key === 'Enter' && filteredTeams[focusedIndex]) window.location.href = `/team/${filteredTeams[focusedIndex].id}`;
      if (e.key === 'Delete' && selectedTeams.length > 0) { bulkDelete(selectedTeams); setSelectedTeams([]); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex, filteredTeams, selectedTeams, bulkDelete]);

  const handleCreate = () => {
    if (teamName.trim()) {
      createTeam(teamName, teamSize);
      setTeamName('');
      setTeamSize(6);
      setShowCreate(false);
      if (session?.accessToken) setTimeout(() => syncToDrive(session.accessToken as string), 500);
    }
  };

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      deleteTeam(id);
      setDeleteConfirm(null);
      if (session?.accessToken) setTimeout(() => syncToDrive(session.accessToken as string), 500);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const handleExportJSON = (id: string) => {
    const data = exportTeam(id);
    const team = teams.find(t => t.id === id);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${team?.name ?? 'team'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const recentTeams = [...teams]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--cream)', fontFamily: "'Libre Baskerville', Georgia, serif" }}>

      <Sidebar
        recentTeams={recentTeams}
        isOpen={sidebarOpen}
        isMobile={isMobile}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header
          style={{
            height: '64px',
            background: 'var(--parchment)',
            borderBottom: '2px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 1rem',
            gap: '0.75rem',
            flexWrap: 'wrap',
            minHeight: '64px',
          }}
        >
          {/* Hamburger for mobile */}
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                background: 'none',
                border: '1px solid var(--border)',
                color: 'var(--ink)',
                padding: '0.45rem 0.65rem',
                cursor: 'pointer',
                fontSize: '1rem',
                flexShrink: 0,
              }}
              aria-label="Open menu"
            >
              ☰
            </button>
          )}

          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>My Teams</h1>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', color: 'var(--ink-muted)', letterSpacing: '0.1em', marginTop: '2px' }}>
              {filteredTeams.length} team{filteredTeams.length !== 1 ? 's' : ''} · Saved
            </p>
          </div>

          {!isMobile && (
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search teams..."
              style={{ background: 'white', border: '1px solid var(--border)', borderBottom: '2px solid var(--ink-muted)', padding: '0.45rem 0.85rem', fontFamily: "'DM Mono', monospace", fontSize: '0.78rem', color: 'var(--ink)', width: '180px', outline: 'none' }}
            />
          )}

          {!isMobile && (
            <>
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
            </>
          )}

          <button onClick={undo} style={{ background: 'white', border: '1px solid var(--border)', padding: '0.45rem', color: 'var(--ink-muted)', cursor: 'pointer', flexShrink: 0 }} title="Undo (Ctrl+Z)">↶</button>
          <button onClick={redo} style={{ background: 'white', border: '1px solid var(--border)', padding: '0.45rem', color: 'var(--ink-muted)', cursor: 'pointer', flexShrink: 0 }} title="Redo (Ctrl+Y)">↷</button>

          {!isMobile && (
            <button onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: '?' }))} style={{ background: 'white', border: '1px solid var(--border)', padding: '0.45rem', color: 'var(--ink-muted)', cursor: 'pointer' }} title="Keyboard Shortcuts (?)">⌨</button>
          )}

          {session ? (
            <button onClick={() => signOut()} style={{ background: 'white', border: '1px solid var(--border)', padding: '0.45rem 0.85rem', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: 'var(--ink-muted)', cursor: 'pointer', flexShrink: 0 }} title={session.user?.email || ''}>
              {isMobile ? '↪' : (session.user?.name || 'Sign Out')}
            </button>
          ) : (
            <button onClick={() => signIn()} style={{ background: 'var(--gold)', border: '2px solid var(--gold-dark)', padding: '0.45rem 0.85rem', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: 'var(--ink)', cursor: 'pointer', letterSpacing: '0.05em', flexShrink: 0 }}>
              Sign In
            </button>
          )}

          {selectedTeams.length > 0 && !isMobile && (
            <>
              <div style={{ height: '24px', width: '1px', background: 'var(--border)' }} />
              <button onClick={() => bulkFavorite(selectedTeams)} style={{ background: 'white', border: '1px solid var(--border)', padding: '0.45rem 0.75rem', color: 'var(--gold)', cursor: 'pointer' }} title="Favorite Selected">★ {selectedTeams.length}</button>
              <button
                onClick={() => {
                  const data = bulkExport(selectedTeams);
                  const blob = new Blob([data], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url; a.download = 'teams.json'; a.click();
                  URL.revokeObjectURL(url);
                }}
                style={{ background: 'white', border: '1px solid var(--border)', padding: '0.45rem 0.75rem', color: 'var(--ink-muted)', cursor: 'pointer' }}
                title="Export Selected"
              >↓</button>
              <button onClick={() => { if (confirm(`Delete ${selectedTeams.length} teams?`)) { bulkDelete(selectedTeams); setSelectedTeams([]); } }} style={{ background: 'white', border: '1px solid var(--border)', padding: '0.45rem 0.75rem', color: 'var(--red)', cursor: 'pointer' }} title="Delete Selected">🗑</button>
            </>
          )}

          <button
            onClick={() => setShowCreate(true)}
            style={{ background: 'var(--ink)', border: '2px solid var(--gold)', padding: '0.45rem 1.1rem', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: 'var(--gold)', cursor: 'pointer', letterSpacing: '0.1em', boxShadow: '2px 2px 0 var(--gold-dark)', flexShrink: 0 }}
          >
            + New Team
          </button>
        </header>

        {/* Mobile search bar */}
        {isMobile && (
          <div style={{ padding: '0.75rem 1rem', background: 'var(--parchment)', borderBottom: '1px solid var(--border)' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search teams..."
              style={{ width: '100%', background: 'white', border: '1px solid var(--border)', borderBottom: '2px solid var(--ink-muted)', padding: '0.45rem 0.85rem', fontFamily: "'DM Mono', monospace", fontSize: '0.78rem', color: 'var(--ink)', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        )}

        <ErrorBoundary>
          <main
            style={{
              flex: 1,
              padding: isMobile ? '1rem' : '2rem',
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '1.5rem',
              alignContent: 'start',
            }}
          >
            {filteredTeams.map((team, idx) => (
              <TeamCard
                key={team.id}
                team={team}
                isSelected={selectedTeams.includes(team.id)}
                isFocused={idx === focusedIndex}
                deleteConfirm={deleteConfirm}
                onSelect={(id, checked) =>
                  setSelectedTeams(prev => checked ? [...prev, id] : prev.filter(x => x !== id))
                }
                onDelete={handleDelete}
                onRename={renameTeam}
                onToggleFavorite={toggleFavorite}
                onDuplicate={duplicateTeam}
                onExportJSON={handleExportJSON}
              />
            ))}

            {teams.length === 0 && (
              <button
                onClick={() => setShowCreate(true)}
                style={{ border: '2px dashed var(--border)', background: 'transparent', padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--ink-muted)' }}
              >
                <span style={{ fontSize: '2rem', lineHeight: 1 }}>+</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.12em' }}>NEW TEAM</span>
              </button>
            )}
          </main>
        </ErrorBoundary>

        {/* Create team modal */}
        {showCreate && (
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}
            onClick={() => setShowCreate(false)}
          >
            <div
              style={{ background: 'var(--parchment)', border: '2px solid var(--gold)', padding: '2rem', width: '100%', maxWidth: '400px', boxShadow: '8px 8px 0 var(--border)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem' }}>Create New Team</h2>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '0.5rem', color: 'var(--ink-muted)' }}>TEAM NAME</label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); }}
                  style={{ width: '100%', border: '1px solid var(--border)', borderBottom: '2px solid var(--ink-muted)', padding: '0.5rem', fontFamily: "'DM Mono', monospace", boxSizing: 'border-box' }}
                  autoFocus
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '0.5rem', color: 'var(--ink-muted)' }}>TEAM SIZE (1-6)</label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  style={{ width: '100%', border: '1px solid var(--border)', borderBottom: '2px solid var(--ink-muted)', padding: '0.5rem', fontFamily: "'DM Mono', monospace", boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={handleCreate} style={{ flex: 1, background: 'var(--ink)', border: '2px solid var(--gold)', color: 'var(--gold)', padding: '0.6rem', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', letterSpacing: '0.1em', cursor: 'pointer', boxShadow: '2px 2px 0 var(--gold-dark)' }}>CREATE</button>
                <button onClick={() => setShowCreate(false)} style={{ flex: 1, background: 'white', border: '1px solid var(--border)', color: 'var(--ink)', padding: '0.6rem', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', letterSpacing: '0.1em', cursor: 'pointer' }}>CANCEL</button>
              </div>
            </div>
          </div>
        )}

        <CommandPalette />
        <AutoSaveIndicator />
        <KeyboardShortcuts />
        <StorageWarning />
      </div>
    </div>
  );
}
