'use client';

import { useEffect, useState } from 'react';
import { useTeamStore } from '@/lib/store/teamStore';
import { Plus, Trash2, Copy, Download, Upload, Star, Edit2, Save, X as XIcon, Calculator, TrendingUp, Home as HomeIcon, Swords, MoreVertical, BarChart3, CheckCircle, Share2, Moon, Sun, Undo, Redo, CheckSquare, Square, Zap, AlertCircle, Info, Image as ImageIcon, Clock } from 'lucide-react';
import Link from 'next/link';
import { getTypeColor } from '@/lib/utils';
import { teamTemplates } from '@/lib/data/templates';
import { getFormatBadge } from '@/lib/utils/validator';
import { getTeamCoverage, getTeamTypeFilters } from '@/lib/utils/teamStats';

export default function Home() {
  const { teams, loadTeams, createTeam, deleteTeam, duplicateTeam, toggleFavorite, renameTeam, exportTeam, importTeam, exportAllTeams, importShowdown, exportShowdown, bulkDelete, bulkExport, bulkFavorite, undo, redo, theme, toggleTheme } = useTeamStore();
  const [showCreate, setShowCreate] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showShowdownImport, setShowShowdownImport] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [importData, setImportData] = useState('');
  const [showdownData, setShowdownData] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teamSize, setTeamSize] = useState(6);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'favorite'>('date');
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [commandSearch, setCommandSearch] = useState('');
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'favorites' | 'size'>('all');
  const [hoveredTeam, setHoveredTeam] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [compareMode, setCompareMode] = useState(false);
  const [compareTeams, setCompareTeams] = useState<string[]>([]);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());

  useEffect(() => {
    loadTeams();
    document.documentElement.classList.toggle('dark', theme === 'dark');
    
    const interval = setInterval(() => {
      setLastSaved(new Date());
    }, 1000);
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
      if (e.key === 'Escape') {
        setShowCommandPalette(false);
        setOpenDropdown(null);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        setShowCreate(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
      if (e.key === 'Delete' && selectedTeams.length > 0) {
        if (confirm(`Delete ${selectedTeams.length} teams?`)) {
          bulkDelete(selectedTeams);
          setSelectedTeams([]);
        }
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const filtered = sortedTeams.filter(team => {
          if (searchQuery && !team.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
              !team.pokemon.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))) return false;
          if (filterType === 'favorites' && !team.favorite) return false;
          return true;
        });
        const currentIndex = filtered.findIndex(t => t.id === hoveredTeam);
        const nextIndex = e.key === 'ArrowDown' ? currentIndex + 1 : currentIndex - 1;
        if (nextIndex >= 0 && nextIndex < filtered.length) {
          setHoveredTeam(filtered[nextIndex].id);
        }
      }
      if (e.key === 'Enter' && hoveredTeam) {
        window.location.href = `/team/${hoveredTeam}`;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(interval);
    };
  }, [loadTeams, theme, undo, redo, selectedTeams, bulkDelete, hoveredTeam]);

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

  const handleExport = (id: string) => {
    const json = exportTeam(id);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `team-${id}.json`;
    a.click();
  };

  const handleImport = () => {
    if (importData.trim()) {
      importTeam(importData);
      setImportData('');
      setShowImport(false);
    }
  };

  const handleShowdownImport = () => {
    if (showdownData.trim()) {
      importShowdown(showdownData);
      setShowdownData('');
      setShowShowdownImport(false);
    }
  };

  const handleExportAll = () => {
    const json = exportAllTeams();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `all-teams-${Date.now()}.json`;
    a.click();
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

  const exportTeamImage = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = theme === 'dark' ? '#1f2937' : '#ffffff';
    ctx.fillRect(0, 0, 800, 400);
    ctx.fillStyle = theme === 'dark' ? '#ffffff' : '#000000';
    ctx.font = 'bold 32px Inter';
    ctx.fillText(team.name, 40, 60);
    
    team.pokemon.forEach((p, i) => {
      const x = 40 + (i % 3) * 240;
      const y = 120 + Math.floor(i / 3) * 140;
      ctx.font = '18px Inter';
      ctx.fillText(p.nickname || p.name, x, y + 100);
    });
    
    canvas.toBlob(blob => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${team.name}.png`;
      a.click();
    });
  };

  const commands = [
    { name: 'Create New Team', action: () => setShowCreate(true) },
    { name: 'Start from Template', action: () => setShowTemplates(true) },
    { name: 'Import Team (JSON)', action: () => setShowImport(true) },
    { name: 'Import from Showdown', action: () => setShowShowdownImport(true) },
    { name: 'Damage Calculator', action: () => window.location.href = '/calculator' },
    { name: 'EV/IV Calculator', action: () => window.location.href = '/ev-iv' },
    { name: 'Toggle Dark Mode', action: () => toggleTheme() },
    ...sortedTeams.map(team => ({
      name: `Open ${team.name}`,
      action: () => window.location.href = `/team/${team.id}`
    }))
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.name.toLowerCase().includes(commandSearch.toLowerCase())
  );

  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'dark bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'}`}>
      {/* Sidebar */}
      <aside className={`w-64 border-r fixed h-full ${theme === 'dark' ? 'glass-dark border-gray-700/50' : 'glass border-white/50'} backdrop-blur-xl`}>
        <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-700/50' : 'border-white/50'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl font-bold">⚡</span>
            </div>
            <div>
              <h1 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>PokeStrategist</h1>
              <p className="text-xs text-purple-400">Team Builder</p>
            </div>
          </div>
        </div>
        <nav className="p-4 space-y-1">
          <div className={`text-xs font-bold uppercase tracking-wider mb-3 px-4 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>Main</div>
          <Link href="/" className={`flex items-center gap-3 px-4 py-3 font-semibold mb-1 rounded-xl transition-all ${theme === 'dark' ? 'text-white bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg' : 'text-gray-900 bg-white shadow-md'}`}>
            <HomeIcon size={20} />
            My Teams
          </Link>
          <div className={`text-xs font-bold uppercase tracking-wider mb-3 px-4 mt-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>Tools</div>
          <Link href="/calculator" className={`flex items-center gap-3 px-4 py-3 font-medium mb-1 rounded-xl transition-all ${theme === 'dark' ? 'text-gray-300 hover:bg-white/10' : 'text-gray-600 hover:bg-white/60'}`}>
            <Calculator size={20} />
            Damage Calculator
          </Link>
          <Link href="/ev-iv" className={`flex items-center gap-3 px-4 py-3 font-medium mb-1 rounded-xl transition-all ${theme === 'dark' ? 'text-gray-300 hover:bg-white/10' : 'text-gray-600 hover:bg-white/60'}`}>
            <TrendingUp size={20} />
            EV/IV Calculator
          </Link>
          <div className={`text-xs font-bold uppercase tracking-wider mb-3 px-4 mt-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>Actions</div>
          <button onClick={() => setShowTemplates(true)} className={`w-full flex items-center gap-3 px-4 py-3 font-medium mb-1 text-left rounded-xl transition-all ${theme === 'dark' ? 'text-gray-300 hover:bg-white/10' : 'text-gray-600 hover:bg-white/60'}`}>
            <Zap size={20} />
            Templates
          </button>
          <button onClick={() => setShowImport(true)} className={`w-full flex items-center gap-3 px-4 py-3 font-medium mb-1 text-left rounded-xl transition-all ${theme === 'dark' ? 'text-gray-300 hover:bg-white/10' : 'text-gray-600 hover:bg-white/60'}`}>
            <Upload size={20} />
            Import Team
          </button>
          <button onClick={() => setShowShowdownImport(true)} className={`w-full flex items-center gap-3 px-4 py-3 font-medium mb-1 text-left rounded-xl transition-all ${theme === 'dark' ? 'text-gray-300 hover:bg-white/10' : 'text-gray-600 hover:bg-white/60'}`}>
            <Upload size={20} />
            Import Showdown
          </button>
          {teams.length > 0 && (
            <button onClick={handleExportAll} className={`w-full flex items-center gap-3 px-4 py-3 font-medium mb-1 text-left rounded-xl transition-all ${theme === 'dark' ? 'text-gray-300 hover:bg-white/10' : 'text-gray-600 hover:bg-white/60'}`}>
              <Download size={20} />
              Export All
            </button>
          )}
          {recentTeams.length > 0 && (
            <>
              <div className={`text-xs font-bold uppercase tracking-wider mb-3 px-4 mt-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>Recent</div>
              {recentTeams.map(team => (
                <Link key={team.id} href={`/team/${team.id}`} className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium mb-1 text-left rounded-xl transition-all ${theme === 'dark' ? 'text-gray-300 hover:bg-white/10' : 'text-gray-600 hover:bg-white/60'}`}>
                  <span className="truncate">{team.name}</span>
                </Link>
              ))}
            </>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Bar */}
        <header className={`border-b h-16 flex items-center justify-between px-8 ${theme === 'dark' ? 'glass-dark border-gray-700/50' : 'glass border-white/50'} backdrop-blur-xl sticky top-0 z-10`}>
          <div className="flex items-center gap-4">
            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>My Teams</h2>
            <span className={`text-sm px-3 py-1 rounded-full ${theme === 'dark' ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>({filteredTeams.length})</span>
            {selectedTeams.length > 0 && (
              <span className="text-sm px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">{selectedTeams.length} selected</span>
            )}
            {compareMode && (
              <span className="text-sm px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold">Compare Mode ({compareTeams.length}/2)</span>
            )}
            <div className={`flex items-center gap-1 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              <Clock size={12} />
              <span>Saved {Math.floor((new Date().getTime() - lastSaved.getTime()) / 1000)}s ago</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search teams..."
              className={`px-4 py-2 border text-sm w-48 rounded-xl transition-all ${theme === 'dark' ? 'bg-white/5 border-gray-700 text-white placeholder-gray-400 focus:bg-white/10' : 'bg-white/80 border-gray-200 text-gray-900 focus:bg-white'} focus:ring-2 focus:ring-purple-500`}
            />
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value as any)}
              className={`px-4 py-2 border text-sm font-semibold rounded-xl transition-all ${theme === 'dark' ? 'bg-white/5 border-gray-700 text-gray-300 focus:bg-white/10' : 'bg-white/80 border-gray-200 text-gray-700 focus:bg-white'} focus:ring-2 focus:ring-purple-500`}
            >
              <option value="all">All Teams</option>
              <option value="favorites">Favorites</option>
            </select>
            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
              className={`px-4 py-2 border text-sm font-semibold rounded-xl transition-all ${theme === 'dark' ? 'bg-white/5 border-gray-700 text-gray-300 focus:bg-white/10' : 'bg-white/80 border-gray-200 text-gray-700 focus:bg-white'} focus:ring-2 focus:ring-purple-500`}
            >
              <option value="all">All Types</option>
              {availableTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`px-4 py-2 border text-sm font-semibold rounded-xl transition-all ${theme === 'dark' ? 'bg-white/5 border-gray-700 text-gray-300 focus:bg-white/10' : 'bg-white/80 border-gray-200 text-gray-700 focus:bg-white'} focus:ring-2 focus:ring-purple-500`}
            >
              <option value="date">Latest</option>
              <option value="name">Name</option>
              <option value="favorite">Favorites</option>
            </select>
            {selectedTeams.length > 0 && (
              <>
                <button onClick={() => { bulkFavorite(selectedTeams); setSelectedTeams([]); }} className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 font-semibold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all" title="Favorite Selected">
                  <Star size={16} />
                </button>
                <button onClick={() => { const json = bulkExport(selectedTeams); const blob = new Blob([json], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `teams-${Date.now()}.json`; a.click(); }} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 font-semibold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all" title="Export Selected">
                  <Download size={16} />
                </button>
                <button onClick={() => { if (confirm(`Delete ${selectedTeams.length} teams?`)) { bulkDelete(selectedTeams); setSelectedTeams([]); } }} className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 font-semibold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all" title="Delete Selected">
                  <Trash2 size={16} />
                </button>
              </>
            )}
            <button onClick={() => { setCompareMode(!compareMode); setCompareTeams([]); }} className={`px-4 py-2 font-semibold text-sm rounded-xl transition-all shadow-lg ${compareMode ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : theme === 'dark' ? 'bg-white/10 text-gray-300 hover:bg-white/20' : 'bg-white text-gray-700 hover:bg-gray-50'}`} title="Compare Teams">
              Compare
            </button>
            <button onClick={toggleTheme} className={`p-2 rounded-xl transition-all shadow-lg ${theme === 'dark' ? 'bg-white/10 text-yellow-400 hover:bg-white/20' : 'bg-white text-gray-700 hover:bg-gray-50'}`} title="Toggle Theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={undo} className={`p-2 rounded-xl transition-all shadow-lg ${theme === 'dark' ? 'bg-white/10 text-gray-300 hover:bg-white/20' : 'bg-white text-gray-700 hover:bg-gray-50'}`} title="Undo (Ctrl+Z)">
              <Undo size={18} />
            </button>
            <button onClick={redo} className={`p-2 rounded-xl transition-all shadow-lg ${theme === 'dark' ? 'bg-white/10 text-gray-300 hover:bg-white/20' : 'bg-white text-gray-700 hover:bg-gray-50'}`} title="Redo (Ctrl+Y)">
              <Redo size={18} />
            </button>
            <button
              onClick={() => setShowCommandPalette(true)}
              className={`flex items-center gap-2 px-4 py-2 font-semibold text-sm rounded-xl transition-all shadow-lg ${theme === 'dark' ? 'bg-white/10 text-gray-300 hover:bg-white/20' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              title="Command Palette"
            >
              ⌘K
            </button>
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 font-bold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <Plus size={18} />
              New Team
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-8">
          {showTemplates && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowTemplates(false)}>
              <div className={`w-full max-w-4xl border max-h-[80vh] overflow-y-auto ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`} style={{ borderRadius: '4px' }} onClick={(e) => e.stopPropagation()}>
                <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                  <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Start from Template</h3>
                </div>
                <div className="p-6 grid grid-cols-2 gap-4">
                  {teamTemplates.map((template, i) => (
                    <div key={i} className={`border p-4 cursor-pointer hover:border-blue-600 ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`} style={{ borderRadius: '4px' }} onClick={() => { createTeam(template.name, template.maxSize); setShowTemplates(false); }}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{template.name}</h4>
                        <span className={`text-xs px-2 py-1 ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`} style={{ borderRadius: '4px' }}>{template.category}</span>
                      </div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{template.pokemon.length} Pokemon • {template.pokemon.map(p => p.name).join(', ')}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {showCommandPalette && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-32 z-50" onClick={() => setShowCommandPalette(false)}>
              <div className={`w-full max-w-2xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`} style={{ borderRadius: '4px' }} onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  value={commandSearch}
                  onChange={(e) => setCommandSearch(e.target.value)}
                  placeholder="Type a command or search..."
                  className={`w-full px-4 py-3 border-b text-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'border-gray-200 text-gray-900'}`}
                  autoFocus
                />
                <div className="max-h-96 overflow-y-auto">
                  {filteredCommands.map((cmd, i) => (
                    <button
                      key={i}
                      onClick={() => { cmd.action(); setShowCommandPalette(false); setCommandSearch(''); }}
                      className={`w-full px-4 py-3 text-sm border-b text-left ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 border-gray-700' : 'text-gray-700 hover:bg-gray-50 border-gray-100'}`}
                    >
                      {cmd.name}
                    </button>
                  ))}
                  {filteredCommands.length === 0 && (
                    <div className={`px-4 py-8 text-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>No commands found</div>
                  )}
                </div>
              </div>
            </div>
          )}
          {showImport && (
            <div className={`p-6 border mb-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`} style={{ borderRadius: '4px' }}>
              <h3 className={`text-base font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Import Team (JSON)</h3>
              <div className="space-y-4">
                <textarea
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  placeholder="Paste your team JSON here..."
                  className={`w-full px-3 py-2 border h-32 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 text-gray-900'}`}
                  style={{ borderRadius: '4px' }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleImport}
                    className="bg-blue-900 text-white px-4 py-2 font-medium text-sm"
                    style={{ borderRadius: '4px' }}
                  >
                    Import
                  </button>
                  <button
                    onClick={() => setShowImport(false)}
                    className={`px-4 py-2 font-medium text-sm ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
                    style={{ borderRadius: '4px' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {showShowdownImport && (
            <div className={`p-6 border mb-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`} style={{ borderRadius: '4px' }}>
              <h3 className={`text-base font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Import from Showdown</h3>
              <div className="space-y-4">
                <textarea
                  value={showdownData}
                  onChange={(e) => setShowdownData(e.target.value)}
                  placeholder="Paste Showdown format here...\n\nPikachu @ Light Ball\nAbility: Static\nAdamant Nature\n- Thunderbolt\n- Iron Tail"
                  className={`w-full px-3 py-2 border h-32 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 text-gray-900'}`}
                  style={{ borderRadius: '4px' }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleShowdownImport}
                    className="bg-blue-900 text-white px-4 py-2 font-medium text-sm"
                    style={{ borderRadius: '4px' }}
                  >
                    Import
                  </button>
                  <button
                    onClick={() => setShowShowdownImport(false)}
                    className={`px-4 py-2 font-medium text-sm ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
                    style={{ borderRadius: '4px' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {showCreate && (
            <div className={`p-6 border mb-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`} style={{ borderRadius: '4px' }}>
              <h3 className={`text-base font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Create New Team</h3>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Team Name</label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Enter team name..."
                    className={`w-full px-3 py-2 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 text-gray-900'}`}
                    style={{ borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Team Size (1-6)</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={teamSize}
                    onChange={(e) => setTeamSize(Number(e.target.value))}
                    className={`w-full px-3 py-2 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'}`}
                    style={{ borderRadius: '4px' }}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCreate}
                    className="bg-blue-900 text-white px-4 py-2 font-medium text-sm"
                    style={{ borderRadius: '4px' }}
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setShowCreate(false)}
                    className={`px-4 py-2 font-medium text-sm ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
                    style={{ borderRadius: '4px' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team) => {
              const totalStats = team.pokemon.reduce((sum, p) => 
                sum + Object.values(p.stats).reduce((a, b) => a + b, 0), 0
              );
              const avgStat = team.pokemon.length > 0 ? Math.round(totalStats / team.pokemon.length) : 0;
              const validation = getFormatBadge(team);
              const coverage = getTeamCoverage(team);
              const isCompareSelected = compareTeams.includes(team.id);
              
              return (
              <div 
                key={team.id} 
                className={`border card-hover ${theme === 'dark' ? 'glass-dark border-gray-700/50' : 'glass border-white/50'} rounded-2xl overflow-hidden ${hoveredTeam === team.id ? 'ring-2 ring-purple-500' : ''} ${isCompareSelected ? 'ring-2 ring-pink-500' : ''}`} 
                onMouseEnter={() => setHoveredTeam(team.id)}
                onMouseLeave={() => setHoveredTeam(null)}
                onClick={() => {
                  if (compareMode) {
                    if (isCompareSelected) {
                      setCompareTeams(compareTeams.filter(id => id !== team.id));
                    } else if (compareTeams.length < 2) {
                      setCompareTeams([...compareTeams, team.id]);
                    }
                  }
                }}
              >
                <div className={`p-5 border-b ${theme === 'dark' ? 'border-gray-700/50' : 'border-white/50'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2 flex-1">
                      <button onClick={() => setSelectedTeams(prev => prev.includes(team.id) ? prev.filter(id => id !== team.id) : [...prev, team.id])} className={`${theme === 'dark' ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'} transition-colors`}>
                        {selectedTeams.includes(team.id) ? <CheckSquare size={20} /> : <Square size={20} />}
                      </button>
                    {editingTeamId === team.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className={`flex-1 px-3 py-1 border-2 border-purple-500 font-bold rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                          autoFocus
                        />
                        <button onClick={() => handleRename(team.id)} className="text-green-500 hover:text-green-600">
                          <Save size={18} />
                        </button>
                        <button onClick={() => setEditingTeamId(null)} className={theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'}>
                          <XIcon size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 flex-1">
                        <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{team.name}</h3>
                        <button
                          onClick={() => {
                            setEditingTeamId(team.id);
                            setEditingName(team.name);
                          }}
                          className={`${theme === 'dark' ? 'text-gray-500 hover:text-purple-400' : 'text-gray-400 hover:text-purple-600'} transition-colors`}
                        >
                          <Edit2 size={16} />
                        </button>
                      </div>
                    )}
                    </div>
                    <button
                      onClick={() => toggleFavorite(team.id)}
                      className="text-yellow-400 hover:text-yellow-500 transition-colors"
                    >
                      <Star size={20} fill={team.favorite ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {team.pokemon.length}/{team.maxSize} Pokemon
                    </p>
                    {avgStat > 0 && (
                      <span className="text-xs font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full">⚡ {avgStat}</span>
                    )}
                    {validation && (
                      <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 ${validation.valid ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`} title={validation.valid ? `Valid ${validation.format}` : 'Invalid'}>
                        {validation.valid ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                        {validation.format}
                      </span>
                    )}
                  </div>
                </div>
                
                {team.pokemon.length > 0 && (
                  <div className={`px-5 py-4 border-b ${theme === 'dark' ? 'border-gray-700/50 bg-gradient-to-br from-purple-900/20 to-pink-900/20' : 'border-white/50 bg-gradient-to-br from-purple-50 to-pink-50'}`}>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className={`font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Offensive</span>
                      <span className={`font-bold ${coverage.offensive > 50 ? 'text-green-400' : 'text-yellow-400'}`}>{coverage.offensive}%</span>
                    </div>
                    <div className="w-full bg-gray-700/30 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all" style={{ width: `${coverage.offensive}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-xs mb-2 mt-3">
                      <span className={`font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Defensive</span>
                      <span className={`font-bold ${coverage.defensive > 50 ? 'text-green-400' : 'text-red-400'}`}>{coverage.defensive}%</span>
                    </div>
                    <div className="w-full bg-gray-700/30 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-400 to-cyan-500 h-2 rounded-full transition-all" style={{ width: `${coverage.defensive}%` }} />
                    </div>
                  </div>
                )}
                
                <div className="p-5">
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {Array.from({ length: team.maxSize }).map((_, i) => (
                      <div
                        key={i}
                        className={`aspect-square border-2 flex items-center justify-center relative group rounded-xl overflow-hidden transition-all ${theme === 'dark' ? 'border-gray-700/50 bg-gradient-to-br from-gray-800 to-gray-900' : 'border-gray-200 bg-gradient-to-br from-white to-gray-50'} hover:scale-105`}
                      >
                        {team.pokemon[i] ? (
                          <>
                            <img
                              src={team.pokemon[i].sprite}
                              alt={team.pokemon[i].name}
                              className="w-full h-full object-contain p-2"
                            />
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-gray-900/95' : 'bg-white/95'} p-2 backdrop-blur-sm`}>
                              <p className={`font-bold text-xs mb-1 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{team.pokemon[i].nickname || team.pokemon[i].name}</p>
                              {team.pokemon[i].selectedAbility && (
                                <p className={`text-xs ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>{team.pokemon[i].selectedAbility}</p>
                              )}
                              <div className="flex gap-1 mt-1 flex-wrap justify-center">
                                {team.pokemon[i].types.map(t => (
                                  <span key={t} className="text-xs px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full font-semibold">{t}</span>
                                ))}
                              </div>
                            </div>
                          </>
                        ) : (
                          <span className={`text-3xl ${theme === 'dark' ? 'text-gray-700' : 'text-gray-300'}`}>+</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`p-4 border-t flex gap-2 ${theme === 'dark' ? 'border-gray-700/50 bg-gradient-to-br from-gray-800/50 to-gray-900/50' : 'border-white/50 bg-gradient-to-br from-gray-50 to-white'}`}>
                  <Link
                    href={`/team/${team.id}`}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-2.5 font-bold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/battle/${team.id}`}
                    className={`px-4 py-2.5 font-bold text-sm rounded-xl transition-all shadow-lg ${theme === 'dark' ? 'bg-white/10 text-gray-300 hover:bg-white/20' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    Battle
                  </Link>
                  <div className="relative">
                    <button
                      onClick={() => setOpenDropdown(openDropdown === team.id ? null : team.id)}
                      className={`p-2 rounded-xl transition-all shadow-lg ${theme === 'dark' ? 'bg-white/10 text-gray-300 hover:bg-white/20' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                    >
                      <MoreVertical size={18} />
                    </button>
                    {openDropdown === team.id && (
                      <div className={`absolute right-0 bottom-full mb-2 border shadow-2xl w-48 z-10 rounded-xl overflow-hidden ${theme === 'dark' ? 'glass-dark border-gray-700/50' : 'glass border-white/50'} backdrop-blur-xl`}>
                        <Link
                          href={`/analytics/${team.id}`}
                          className={`flex items-center gap-3 px-4 py-3 text-sm border-b font-semibold ${theme === 'dark' ? 'text-gray-300 hover:bg-white/10 border-gray-700/50' : 'text-gray-700 hover:bg-white/60 border-gray-100'} transition-colors`}
                        >
                          <BarChart3 size={16} />
                          Analytics
                        </Link>
                        <Link
                          href={`/formats/${team.id}`}
                          className={`flex items-center gap-3 px-4 py-3 text-sm border-b font-semibold ${theme === 'dark' ? 'text-gray-300 hover:bg-white/10 border-gray-700/50' : 'text-gray-700 hover:bg-white/60 border-gray-100'} transition-colors`}
                        >
                          <CheckCircle size={16} />
                          Validate
                        </Link>
                        <Link
                          href={`/share/${team.id}`}
                          className={`flex items-center gap-3 px-4 py-3 text-sm border-b font-semibold ${theme === 'dark' ? 'text-gray-300 hover:bg-white/10 border-gray-700/50' : 'text-gray-700 hover:bg-white/60 border-gray-100'} transition-colors`}
                        >
                          <Share2 size={16} />
                          Share
                        </Link>
                        <button
                          onClick={() => { handleExport(team.id); setOpenDropdown(null); }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm border-b text-left font-semibold ${theme === 'dark' ? 'text-gray-300 hover:bg-white/10 border-gray-700/50' : 'text-gray-700 hover:bg-white/60 border-gray-100'} transition-colors`}
                        >
                          <Download size={16} />
                          Export JSON
                        </button>
                        <button
                          onClick={() => { 
                            const text = exportShowdown(team.id);
                            navigator.clipboard.writeText(text);
                            setOpenDropdown(null);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm border-b text-left font-semibold ${theme === 'dark' ? 'text-gray-300 hover:bg-white/10 border-gray-700/50' : 'text-gray-700 hover:bg-white/60 border-gray-100'} transition-colors`}
                        >
                          <Copy size={16} />
                          Copy Showdown
                        </button>
                        <button
                          onClick={() => { exportTeamImage(team.id); setOpenDropdown(null); }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm border-b text-left font-semibold ${theme === 'dark' ? 'text-gray-300 hover:bg-white/10 border-gray-700/50' : 'text-gray-700 hover:bg-white/60 border-gray-100'} transition-colors`}
                        >
                          <ImageIcon size={16} />
                          Export Image
                        </button>
                        <button
                          onClick={() => { duplicateTeam(team.id); setOpenDropdown(null); }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm border-b text-left font-semibold ${theme === 'dark' ? 'text-gray-300 hover:bg-white/10 border-gray-700/50' : 'text-gray-700 hover:bg-white/60 border-gray-100'} transition-colors`}
                        >
                          <Copy size={16} />
                          Duplicate
                        </button>
                        <button
                          onClick={() => { handleDelete(team.id); setOpenDropdown(null); }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left font-bold ${
                            deleteConfirm === team.id ? 'text-red-500' : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          } ${theme === 'dark' ? 'hover:bg-red-500/20' : 'hover:bg-red-50'} transition-colors`}
                        >
                          <Trash2 size={16} />
                          {deleteConfirm === team.id ? 'Confirm Delete' : 'Delete'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
            })}
          </div>

          {teams.length === 0 && !showCreate && (
            <div className="text-center py-16">
              <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>No teams yet. Create your first team!</p>
              <button
                onClick={() => setShowCreate(true)}
                className="bg-blue-900 text-white px-6 py-3 font-medium"
                style={{ borderRadius: '4px' }}
              >
                Get Started
              </button>
            </div>
          )}

          {compareTeams.length === 2 && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => { setCompareTeams([]); setCompareMode(false); }}>
              <div className={`w-full max-w-6xl border max-h-[80vh] overflow-y-auto ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`} style={{ borderRadius: '4px' }} onClick={(e) => e.stopPropagation()}>
                <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                  <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Team Comparison</h3>
                </div>
                <div className="p-6 grid grid-cols-2 gap-6">
                  {compareTeams.map(teamId => {
                    const team = teams.find(t => t.id === teamId);
                    if (!team) return null;
                    const coverage = getTeamCoverage(team);
                    const avgStat = team.pokemon.length > 0 ? Math.round(team.pokemon.reduce((sum, p) => sum + Object.values(p.stats).reduce((a, b) => a + b, 0), 0) / team.pokemon.length) : 0;
                    return (
                      <div key={teamId} className={`border p-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`} style={{ borderRadius: '4px' }}>
                        <h4 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{team.name}</h4>
                        <div className="space-y-3">
                          <div>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Avg Stats: {avgStat}</p>
                          </div>
                          <div>
                            <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Offensive: {coverage.offensive}%</p>
                            <div className="w-full bg-gray-200 h-2" style={{ borderRadius: '2px' }}>
                              <div className="bg-green-500 h-2" style={{ width: `${coverage.offensive}%`, borderRadius: '2px' }} />
                            </div>
                          </div>
                          <div>
                            <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Defensive: {coverage.defensive}%</p>
                            <div className="w-full bg-gray-200 h-2" style={{ borderRadius: '2px' }}>
                              <div className="bg-blue-500 h-2" style={{ width: `${coverage.defensive}%`, borderRadius: '2px' }} />
                            </div>
                          </div>
                          <div>
                            <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Pokemon:</p>
                            <div className="grid grid-cols-3 gap-2">
                              {team.pokemon.map(p => (
                                <img key={p.position} src={p.sprite} alt={p.name} className="w-full" />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {teams.length > 0 && (
            <div className="mt-8 text-center">
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                <kbd className={`px-2 py-1 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`} style={{ borderRadius: '4px' }}>Ctrl+K</kbd> Command Palette • 
                <kbd className={`px-2 py-1 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`} style={{ borderRadius: '4px' }}>Ctrl+N</kbd> New Team • 
                <kbd className={`px-2 py-1 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`} style={{ borderRadius: '4px' }}>Ctrl+Z</kbd> Undo • 
                <kbd className={`px-2 py-1 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`} style={{ borderRadius: '4px' }}>↑↓</kbd> Navigate • 
                <kbd className={`px-2 py-1 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`} style={{ borderRadius: '4px' }}>Enter</kbd> Open
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
