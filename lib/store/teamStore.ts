import { create } from 'zustand';
import { Team, TeamPokemon } from '@/types/team';

interface TeamStore {
  teams: Team[];
  currentTeam: Team | null;
  history: Team[][];
  historyIndex: number;
  theme: 'light' | 'dark';
  loadTeams: () => void;
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
  bulkDelete: (ids: string[]) => void;
  bulkExport: (ids: string[]) => string;
  bulkFavorite: (ids: string[]) => void;
  undo: () => void;
  redo: () => void;
  toggleTheme: () => void;
}

export const useTeamStore = create<TeamStore>((set, get) => ({
  teams: [],
  currentTeam: null,
  history: [],
  historyIndex: -1,
  theme: (typeof window !== 'undefined' ? localStorage.getItem('theme') as 'light' | 'dark' : 'light') || 'light',

  loadTeams: () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('teams');
      if (stored) {
        const teams = JSON.parse(stored);
        set({ teams, history: [teams], historyIndex: 0 });
      }
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
    localStorage.setItem('teams', JSON.stringify(teams));
  },

  deleteTeam: (id: string) => {
    const teams = get().teams.filter(t => t.id !== id);
    const history = [...get().history.slice(0, get().historyIndex + 1), teams].slice(-10);
    set({ teams, currentTeam: get().currentTeam?.id === id ? null : get().currentTeam, history, historyIndex: history.length - 1 });
    localStorage.setItem('teams', JSON.stringify(teams));
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
      localStorage.setItem('teams', JSON.stringify(teams));
    }
  },

  toggleFavorite: (id: string) => {
    const teams = get().teams.map(t => 
      t.id === id ? { ...t, favorite: !t.favorite } : t
    );
    set({ teams });
    localStorage.setItem('teams', JSON.stringify(teams));
  },

  renameTeam: (id: string, name: string) => {
    const teams = get().teams.map(t => 
      t.id === id ? { ...t, name, updatedAt: new Date().toISOString() } : t
    );
    set({ teams });
    localStorage.setItem('teams', JSON.stringify(teams));
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
    localStorage.setItem('teams', JSON.stringify(teams));
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
    localStorage.setItem('teams', JSON.stringify(teams));
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
    localStorage.setItem('teams', JSON.stringify(teams));
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
    localStorage.setItem('teams', JSON.stringify(teams));
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
      localStorage.setItem('teams', JSON.stringify(teams));
    } catch (error) {
      console.error('Invalid team data');
    }
  },

  exportAllTeams: () => {
    return JSON.stringify(get().teams, null, 2);
  },

  bulkDelete: (ids: string[]) => {
    const teams = get().teams.filter(t => !ids.includes(t.id));
    const history = [...get().history.slice(0, get().historyIndex + 1), teams].slice(-10);
    set({ teams, history, historyIndex: history.length - 1 });
    localStorage.setItem('teams', JSON.stringify(teams));
  },

  bulkExport: (ids: string[]) => {
    const teams = get().teams.filter(t => ids.includes(t.id));
    return JSON.stringify(teams, null, 2);
  },

  bulkFavorite: (ids: string[]) => {
    const teams = get().teams.map(t => ids.includes(t.id) ? { ...t, favorite: true } : t);
    set({ teams });
    localStorage.setItem('teams', JSON.stringify(teams));
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const teams = history[historyIndex - 1];
      set({ teams, historyIndex: historyIndex - 1 });
      localStorage.setItem('teams', JSON.stringify(teams));
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const teams = history[historyIndex + 1];
      set({ teams, historyIndex: historyIndex + 1 });
      localStorage.setItem('teams', JSON.stringify(teams));
    }
  },

  toggleTheme: () => {
    const theme = get().theme === 'light' ? 'dark' : 'light';
    set({ theme });
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  },
}));
