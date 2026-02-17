import { create } from 'zustand';
import { Team, TeamPokemon } from '@/types/team';

interface TeamStore {
  teams: Team[];
  currentTeam: Team | null;
  loadTeams: () => void;
  createTeam: (name: string, maxSize: number) => void;
  deleteTeam: (id: string) => void;
  duplicateTeam: (id: string) => void;
  toggleFavorite: (id: string) => void;
  setCurrentTeam: (id: string) => void;
  addPokemon: (teamId: string, pokemon: TeamPokemon) => void;
  removePokemon: (teamId: string, position: number) => void;
  reorderPokemon: (teamId: string, fromPos: number, toPos: number) => void;
  updatePokemon: (teamId: string, position: number, updates: Partial<TeamPokemon>) => void;
  exportTeam: (teamId: string) => string;
  importTeam: (jsonData: string) => void;
}

export const useTeamStore = create<TeamStore>((set, get) => ({
  teams: [],
  currentTeam: null,

  loadTeams: () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('teams');
      if (stored) {
        set({ teams: JSON.parse(stored) });
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
    set({ teams });
    localStorage.setItem('teams', JSON.stringify(teams));
  },

  deleteTeam: (id: string) => {
    const teams = get().teams.filter(t => t.id !== id);
    set({ teams, currentTeam: get().currentTeam?.id === id ? null : get().currentTeam });
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
}));
