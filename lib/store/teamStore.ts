import { create } from 'zustand';
import { Team, TeamPokemon } from '@/types/team';
import { parseShowdown, exportShowdown } from '@/lib/utils/showdown';

// Debounced localStorage writer — batches rapid updates into a single write
let _persistTimer: ReturnType<typeof setTimeout>;
function persistTeams(teams: Team[]): void {
  clearTimeout(_persistTimer);
  _persistTimer = setTimeout(() => {
    try {
      localStorage.setItem('teams', JSON.stringify(teams));
    } catch (e) {
      console.error('Failed to persist teams:', e);
    }
  }, 300);
}

// Debounced DB sync — fires 2s after the last mutation when user is signed in
let _dbSyncTimer: ReturnType<typeof setTimeout>;
function scheduleDbSync(teams: Team[]): void {
  clearTimeout(_dbSyncTimer);
  _dbSyncTimer = setTimeout(async () => {
    try {
      await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teams }),
      });
    } catch (e) {
      console.error('DB sync failed:', e);
    }
  }, 2000);
}

interface TeamStore {
  teams: Team[];
  currentTeam: Team | null;
  history: Team[][];
  historyIndex: number;
  theme: 'light' | 'dark';
  userId: string | null;
  setUserId: (userId: string | null) => void;
  loadTeams: () => void;
  loadFromDb: () => Promise<void>;
  syncToDrive: (accessToken: string) => Promise<void>;
  loadFromDrive: (accessToken: string) => Promise<void>;
  createTeam: (name: string, maxSize: number) => void;
  deleteTeam: (id: string) => void;
  duplicateTeam: (id: string) => void;
  toggleFavorite: (id: string) => void;
  renameTeam: (id: string, name: string) => void;
  setCurrentTeam: (id: string) => void;
  addPokemon: (teamId: string, pokemon: TeamPokemon) => void;
  removePokemon: (teamId: string, position: number) => void;
  reorderPokemon: (teamId: string, fromPos: number, toPos: number) => void;
  updatePokemon: (teamId: string, position: number, updates: Partial<TeamPokemon>) => void;
  exportTeam: (teamId: string) => string;
  importTeam: (jsonData: string) => void;
  exportAllTeams: () => string;
  importShowdown: (text: string) => void;
  exportShowdown: (teamId: string) => string;
  bulkDelete: (ids: string[]) => void;
  bulkExport: (ids: string[]) => string;
  bulkFavorite: (ids: string[]) => void;
  undo: () => void;
  redo: () => void;
  toggleTheme: () => void;
}

export const useTeamStore = create<TeamStore>((set, get) => {
  // Persists to localStorage AND schedules a DB sync when user is authenticated
  const saveAndSync = (teams: Team[]) => {
    persistTeams(teams);
    if (get().userId) scheduleDbSync(teams);
  };

  return ({
  teams: [],
  currentTeam: null,
  history: [],
  historyIndex: -1,
  userId: null,
  theme: (typeof window !== 'undefined' ? localStorage.getItem('theme') as 'light' | 'dark' : 'light') || 'light',

  setUserId: (userId) => set({ userId }),

  loadFromDb: async () => {
    try {
      const res = await fetch('/api/teams');
      if (!res.ok) return;
      const { teams: dbTeams } = await res.json();
      if (Array.isArray(dbTeams) && dbTeams.length > 0) {
        // Merge: DB teams take precedence; keep any local-only teams as well
        const localTeams = get().teams;
        const dbIds = new Set(dbTeams.map((t: Team) => t.id));
        const localOnly = localTeams.filter((t) => !dbIds.has(t.id));
        const merged = [...dbTeams, ...localOnly];
        set({ teams: merged, history: [merged], historyIndex: 0 });
        persistTeams(merged);
        // Push any local-only teams up to the DB
        if (localOnly.length > 0) scheduleDbSync(merged);
      }
    } catch (e) {
      console.error('loadFromDb failed:', e);
    }
  },

  loadTeams: () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('teams');
      if (stored) {
        const teams = JSON.parse(stored);
        set({ teams, history: [teams], historyIndex: 0 });
      }
    }
  },

  syncToDrive: async (accessToken: string) => {
    try {
      const teams = get().teams;
      const res = await fetch('/api/drive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync', accessToken, teams }),
      });
      if (!res.ok) throw new Error(`Drive sync failed: ${res.status}`);
    } catch (error) {
      console.error('Drive sync error:', error);
    }
  },

  loadFromDrive: async (accessToken: string) => {
    try {
      const res = await fetch('/api/drive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'load', accessToken }),
      });
      if (!res.ok) throw new Error(`Drive load failed: ${res.status}`);
      const data = await res.json();
      if (data.success && data.teams?.length > 0) {
        set({ teams: data.teams });
        persistTeams(data.teams);
      }
    } catch (error) {
      console.error('Drive load error:', error);
    }
  },

  createTeam: (name: string, maxSize: number) => {
    const newTeam: Team = {
      id: Date.now().toString(),
      name,
      maxSize,
      pokemon: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const teams = [...get().teams, newTeam];
    const history = [...get().history.slice(0, get().historyIndex + 1), teams].slice(-10);
    set({ teams, history, historyIndex: history.length - 1 });
    saveAndSync(teams);
  },

  deleteTeam: (id: string) => {
    const teams = get().teams.filter(t => t.id !== id);
    const history = [...get().history.slice(0, get().historyIndex + 1), teams].slice(-10);
    set({ teams, currentTeam: get().currentTeam?.id === id ? null : get().currentTeam, history, historyIndex: history.length - 1 });
    saveAndSync(teams);
  },

  duplicateTeam: (id: string) => {
    const team = get().teams.find(t => t.id === id);
    if (team) {
      const newTeam: Team = {
        ...team,
        id: Date.now().toString(),
        name: `${team.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const teams = [...get().teams, newTeam];
      set({ teams });
      saveAndSync(teams);
    }
  },

  toggleFavorite: (id: string) => {
    const teams = get().teams.map(t => 
      t.id === id ? { ...t, favorite: !t.favorite } : t
    );
    set({ teams });
    saveAndSync(teams);
  },

  renameTeam: (id: string, name: string) => {
    const teams = get().teams.map(t => 
      t.id === id ? { ...t, name, updatedAt: new Date().toISOString() } : t
    );
    set({ teams });
    saveAndSync(teams);
  },

  setCurrentTeam: (id: string) => {
    const team = get().teams.find(t => t.id === id);
    set({ currentTeam: team || null });
  },

  addPokemon: (teamId: string, pokemon: TeamPokemon) => {
    const teams = get().teams.map(team => {
      if (team.id === teamId && team.pokemon.length < team.maxSize) {
        return {
          ...team,
          pokemon: [...team.pokemon, { ...pokemon, position: team.pokemon.length }],
          updatedAt: new Date().toISOString(),
        };
      }
      return team;
    });
    set({ teams });
    saveAndSync(teams);
  },

  removePokemon: (teamId: string, position: number) => {
    const teams = get().teams.map(team => {
      if (team.id === teamId) {
        return {
          ...team,
          pokemon: team.pokemon.filter(p => p.position !== position).map((p, i) => ({ ...p, position: i })),
          updatedAt: new Date().toISOString(),
        };
      }
      return team;
    });
    set({ teams });
    saveAndSync(teams);
  },

  reorderPokemon: (teamId: string, fromPos: number, toPos: number) => {
    const teams = get().teams.map(team => {
      if (team.id === teamId) {
        const pokemon = [...team.pokemon];
        const [moved] = pokemon.splice(fromPos, 1);
        pokemon.splice(toPos, 0, moved);
        return {
          ...team,
          pokemon: pokemon.map((p, i) => ({ ...p, position: i })),
          updatedAt: new Date().toISOString(),
        };
      }
      return team;
    });
    set({ teams });
    saveAndSync(teams);
  },

  updatePokemon: (teamId: string, position: number, updates: Partial<TeamPokemon>) => {
    const teams = get().teams.map(team => {
      if (team.id === teamId) {
        return {
          ...team,
          pokemon: team.pokemon.map(p => 
            p.position === position ? { ...p, ...updates } : p
          ),
          updatedAt: new Date().toISOString(),
        };
      }
      return team;
    });
    set({ teams });
    saveAndSync(teams);
  },

  exportTeam: (teamId: string) => {
    const team = get().teams.find(t => t.id === teamId);
    if (!team) return '';
    return JSON.stringify(team, null, 2);
  },

  importTeam: (jsonData: string) => {
    try {
      const team = JSON.parse(jsonData);
      team.id = Date.now().toString();
      team.createdAt = new Date().toISOString();
      team.updatedAt = new Date().toISOString();
      const teams = [...get().teams, team];
      set({ teams });
      saveAndSync(teams);
    } catch (error) {
      console.error('Invalid team data');
    }
  },

  exportAllTeams: () => {
    return JSON.stringify(get().teams, null, 2);
  },

  importShowdown: (text: string) => {
    try {
      const parsed = parseShowdown(text);
      const newTeam: Team = {
        id: Date.now().toString(),
        name: parsed.name || 'Showdown Import',
        maxSize: parsed.maxSize || 6,
        pokemon: parsed.pokemon || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const teams = [...get().teams, newTeam];
      const history = [...get().history.slice(0, get().historyIndex + 1), teams].slice(-10);
      set({ teams, history, historyIndex: history.length - 1 });
      saveAndSync(teams);
    } catch (error) {
      console.error('Invalid Showdown format');
    }
  },

  exportShowdown: (teamId: string) => {
    const team = get().teams.find(t => t.id === teamId);
    if (!team) return '';
    return exportShowdown(team);
  },

  bulkDelete: (ids: string[]) => {
    const teams = get().teams.filter(t => !ids.includes(t.id));
    const history = [...get().history.slice(0, get().historyIndex + 1), teams].slice(-10);
    set({ teams, history, historyIndex: history.length - 1 });
    saveAndSync(teams);
  },

  bulkExport: (ids: string[]) => {
    const teams = get().teams.filter(t => ids.includes(t.id));
    return JSON.stringify(teams, null, 2);
  },

  bulkFavorite: (ids: string[]) => {
    const teams = get().teams.map(t => ids.includes(t.id) ? { ...t, favorite: true } : t);
    set({ teams });
    saveAndSync(teams);
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const teams = history[historyIndex - 1];
      set({ teams, historyIndex: historyIndex - 1 });
      saveAndSync(teams);
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const teams = history[historyIndex + 1];
      set({ teams, historyIndex: historyIndex + 1 });
      saveAndSync(teams);
    }
  },

  toggleTheme: () => {
    const theme = get().theme === 'light' ? 'dark' : 'light';
    set({ theme });
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  },
}); });
