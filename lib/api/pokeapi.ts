import axios from 'axios';
import { Pokemon, Move } from '@/types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

export async function fetchPokemon(id: number): Promise<Pokemon> {
  const { data } = await axios.get(`${BASE_URL}/pokemon/${id}`);
  
  return {
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
}

export async function fetchPokemonList(limit = 151): Promise<{ id: number; name: string }[]> {
  const { data } = await axios.get(`${BASE_URL}/pokemon?limit=${limit}`);
  return data.results.map((p: any, i: number) => ({
    id: i + 1,
    name: p.name,
  }));
}

export async function searchPokemon(query: string): Promise<Pokemon[]> {
  const list = await fetchPokemonList(2000);
  const filtered = list.filter(p => p.name.includes(query.toLowerCase())).slice(0, 20);
  return Promise.all(filtered.map(p => fetchPokemon(p.id)));
}

export async function fetchMove(name: string): Promise<Move> {
  const { data } = await axios.get(`${BASE_URL}/move/${name}`);
  return {
    name: data.name,
    type: data.type.name,
    category: data.damage_class.name === 'physical' ? 'Physical' : data.damage_class.name === 'special' ? 'Special' : 'Status',
    power: data.power,
    accuracy: data.accuracy,
    pp: data.pp,
  };
}
