import axios from 'axios';
import { Pokemon, Move } from '@/types/pokemon';
import { Fakemon } from '@/types/fakemon';
import { getFakemon } from '@/lib/utils/fakemon';

const BASE_URL = 'https://pokeapi.co/api/v2';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

function getCached<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`pkcache_${key}`);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) {
      localStorage.removeItem(`pkcache_${key}`);
      return null;
    }
    return data as T;
  } catch {
    return null;
  }
}

function setCache<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`pkcache_${key}`, JSON.stringify({ data, ts: Date.now() }));
  } catch {
    // Ignore quota errors — cache is best-effort
  }
}

export async function fetchPokemon(idOrName: number | string): Promise<Pokemon> {
  const cacheKey = `pokemon_${idOrName}`;
  const cached = getCached<Pokemon>(cacheKey);
  if (cached) return cached;

  const { data } = await axios.get(`${BASE_URL}/pokemon/${idOrName}`);
  const pokemon: Pokemon = {
    id: data.id,
    name: data.name,
    types: data.types.map((t: any) => t.type.name),
    sprite: data.sprites.front_default,
    stats: {
      hp: data.stats[0].base_stat,
      attack: data.stats[1].base_stat,
      defense: data.stats[2].base_stat,
      specialAttack: data.stats[3].base_stat,
      specialDefense: data.stats[4].base_stat,
      speed: data.stats[5].base_stat,
    },
    abilities: data.abilities.map((a: any) => a.ability.name),
    height: data.height,
    weight: data.weight,
    moves: data.moves.slice(0, 50).map((m: any) => ({
      name: m.move.name,
      type: 'normal',
      category: 'Physical',
      power: 0,
      accuracy: 0,
      pp: 0,
    })),
  };
  setCache(cacheKey, pokemon);
  return pokemon;
}

export async function fetchPokemonList(limit = 151): Promise<{ id: number; name: string }[]> {
  const cacheKey = `list_${limit}`;
  const cached = getCached<{ id: number; name: string }[]>(cacheKey);
  if (cached) return cached;

  const { data } = await axios.get(`${BASE_URL}/pokemon?limit=${limit}`);
  const list = data.results.map((p: any, i: number) => ({ id: i + 1, name: p.name }));
  setCache(cacheKey, list);
  return list;
}

export async function searchPokemon(query: string): Promise<(Pokemon | Fakemon)[]> {
  try {
    // Cache the full pokemon list (2000) to avoid repeated large fetches
    const listCacheKey = `alllist_2000`;
    let allPokemon = getCached<{ name: string }[]>(listCacheKey);
    if (!allPokemon) {
      const { data } = await axios.get(`${BASE_URL}/pokemon?limit=2000`);
      allPokemon = data.results as { name: string }[];
      setCache(listCacheKey, allPokemon);
    }

    const filtered = allPokemon
      .filter((p) => p.name.includes(query.toLowerCase()))
      .slice(0, 20);

    const results = await Promise.allSettled(
      filtered.map((p) => fetchPokemon(p.name))
    );

    const official = results
      .filter((r): r is PromiseFulfilledResult<Pokemon> => r.status === 'fulfilled')
      .map(r => r.value);

    const fakemon = getFakemon().filter(f =>
      f.name.toLowerCase().includes(query.toLowerCase())
    );

    return [...official, ...fakemon];
  } catch {
    return getFakemon().filter(f =>
      f.name.toLowerCase().includes(query.toLowerCase())
    );
  }
}

export async function fetchMove(name: string): Promise<Move> {
  const cacheKey = `move_${name}`;
  const cached = getCached<Move>(cacheKey);
  if (cached) return cached;

  const { data } = await axios.get(`${BASE_URL}/move/${name}`);
  const move: Move = {
    name: data.name,
    type: data.type.name,
    category: data.damage_class.name === 'physical' ? 'Physical' : data.damage_class.name === 'special' ? 'Special' : 'Status',
    power: data.power,
    accuracy: data.accuracy,
    pp: data.pp,
  };
  setCache(cacheKey, move);
  return move;
}
