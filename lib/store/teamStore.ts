import { create } from 'zustand';
import { Team, TeamPokemon } from '@/types/team';
import { parseShowdown, exportShowdown } from '@/lib/utils/showdown';

const DEFAULT_STATS: TeamPokemon['stats'] = {
  hp: 100,
  attack: 100,
  defense: 100,
  specialAttack: 100,
  specialDefense: 100,
  speed: 100,
};

function toNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function normalizePokemon(input: unknown, index: number): TeamPokemon {
  const candidate = (input ?? {}) as Partial<TeamPokemon>;
  const normalizedMoves = Array.isArray(candidate.moves) ? candidate.moves : [];
  const normalizedSelectedMoves = Array.isArray(candidate.selectedMoves)
    ? candidate.selectedMoves.filter((move): move is string => typeof move === 'string')
    : undefined;

  return {
    id: candidate.id ?? `pokemon-${index}`,
    name: typeof candidate.name === 'string' ? candidate.name : 'unknown',
    types: Array.isArray(candidate.types)
      ? candidate.types.filter((type): type is string => typeof type === 'string')
      : [],
    sprite: typeof candidate.sprite === 'string' ? candidate.sprite : '',
    stats: {
      hp: toNumber(candidate.stats?.hp, DEFAULT_STATS.hp),
      attack: toNumber(candidate.stats?.attack, DEFAULT_STATS.attack),
      defense: toNumber(candidate.stats?.defense, DEFAULT_STATS.defense),
      specialAttack: toNumber(candidate.stats?.specialAttack, DEFAULT_STATS.specialAttack),
      specialDefense: toNumber(candidate.stats?.specialDefense, DEFAULT_STATS.specialDefense),
      speed: toNumber(candidate.stats?.speed, DEFAULT_STATS.speed),
    },
    abilities: Array.isArray(candidate.abilities)
      ? candidate.abilities.filter((ability): ability is string => typeof ability === 'string')
      : [],
    height: toNumber(candidate.height, 0),
    weight: toNumber(candidate.weight, 0),
    moves: normalizedMoves,
    position: toNumber(candidate.position, index),
    isShiny: candidate.isShiny,
    nickname: candidate.nickname,
    selectedMoves: normalizedSelectedMoves,
    selectedAbility: candidate.selectedAbility,
    item: candidate.item,
    nature: candidate.nature,
    evs: candidate.evs,
    ivs: candidate.ivs,
    caughtRank: typeof candidate.caughtRank === 'number' ? candidate.caughtRank : undefined,
    caughtNote: typeof candidate.caughtNote === 'string' ? candidate.caughtNote : undefined,
  };
}

function normalizeTeam(input: unknown): Team {
  const candidate = (input ?? {}) as Partial<Team>;
  const maxSize = Math.max(1, Math.min(6, Math.floor(toNumber(candidate.maxSize, 6))));
  const rawPokemon = Array.isArray(candidate.pokemon) ? candidate.pokemon : [];
  const pokemon = rawPokemon.map((p, i) => normalizePokemon(p, i)).map((p, i) => ({ ...p, position: i }));

  return {
    id: typeof candidate.id === 'string' ? candidate.id : Date.now().toString(),
    name: typeof candidate.name === 'string' ? candidate.name : 'Untitled Team',
    maxSize,
    pokemon,
    createdAt: typeof candidate.createdAt === 'string' ? candidate.createdAt : new Date().toISOString(),
    updatedAt: typeof candidate.updatedAt === 'string' ? candidate.updatedAt : new Date().toISOString(),
    favorite: candidate.favorite,
  };
}

function normalizeTeams(input: unknown): Team[] {
  if (!Array.isArray(input)) return [];
  return input.map((team) => normalizeTeam(team));
}

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
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('sync:start'));
      }
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teams }),
      });
      if (!res.ok) throw new Error(`Sync failed: ${res.status}`);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('sync:success'));
      }
    } catch (e) {
      console.error('DB sync failed:', e);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('sync:error'));
      }
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
  manualSync: () => Promise<void>;
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
  setCaughtRanking: (teamId: string, orderedPositions: number[]) => void;
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
    const normalizedTeams = normalizeTeams(teams);
    persistTeams(normalizedTeams);
    if (get().userId) scheduleDbSync(normalizedTeams);
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
        const normalizedDbTeams = normalizeTeams(dbTeams);
        const localTeams = get().teams;
        const dbIds = new Set(normalizedDbTeams.map((t: Team) => t.id));
        const localOnly = localTeams.filter((t) => !dbIds.has(t.id));
        const merged = normalizeTeams([...normalizedDbTeams, ...localOnly]);
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
        const teams = normalizeTeams(JSON.parse(stored));
        set({ teams, history: [teams], historyIndex: 0 });
      }
    }
  },

  manualSync: async () => {
    const { teams, userId } = get();
    if (!userId) throw new Error('Not authenticated');
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sync:start'));
    }
    
    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teams }),
      });
      
      if (!res.ok) throw new Error(`Sync failed: ${res.status}`);
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('sync:success'));
      }
    } catch (error) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('sync:error'));
      }
      throw error;
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
        const normalizedTeams = normalizeTeams(data.teams);
        set({ teams: normalizedTeams });
        persistTeams(normalizedTeams);
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
        const normalizedPokemon = normalizePokemon(pokemon, team.pokemon.length);
        return {
          ...team,
          pokemon: [...team.pokemon, {
            ...normalizedPokemon,
            position: team.pokemon.length,
            caughtRank: normalizedPokemon.caughtRank ?? team.pokemon.length,
          }],
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
        const remaining = team.pokemon.filter(p => p.position !== position);
        const normalizedCaughtOrder = [...remaining]
          .sort((a, b) => (a.caughtRank ?? a.position) - (b.caughtRank ?? b.position))
          .map(p => p.position);
        const caughtRankMap = new Map<number, number>(
          normalizedCaughtOrder.map((pokemonPosition, rank) => [pokemonPosition, rank])
        );

        return {
          ...team,
          pokemon: remaining.map((p, i) => ({
            ...p,
            position: i,
            caughtRank: caughtRankMap.get(p.position) ?? i,
          })),
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
            p.position === position ? normalizePokemon({ ...p, ...updates }, p.position) : p
          ),
          updatedAt: new Date().toISOString(),
        };
      }
      return team;
    });
    set({ teams });
    saveAndSync(teams);
  },

  setCaughtRanking: (teamId: string, orderedPositions: number[]) => {
    const rankMap = new Map<number, number>(
      orderedPositions.map((position, rank) => [position, rank])
    );

    const teams = get().teams.map(team => {
      if (team.id === teamId) {
        return {
          ...team,
          pokemon: team.pokemon.map(p => ({
            ...p,
            caughtRank: rankMap.get(p.position) ?? p.caughtRank ?? p.position,
          })),
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
      const parsedTeam = JSON.parse(jsonData);
      const team = normalizeTeam({
        ...parsedTeam,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
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
        pokemon: normalizeTeams([{ pokemon: parsed.pokemon || [] }])[0].pokemon,
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
