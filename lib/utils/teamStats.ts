import { Team } from '@/types/team';

const typeChart: Record<string, string[]> = {
  normal: ['fighting'],
  fire: ['water', 'ground', 'rock'],
  water: ['electric', 'grass'],
  electric: ['ground'],
  grass: ['fire', 'ice', 'poison', 'flying', 'bug'],
  ice: ['fire', 'fighting', 'rock', 'steel'],
  fighting: ['flying', 'psychic', 'fairy'],
  poison: ['ground', 'psychic'],
  ground: ['water', 'grass', 'ice'],
  flying: ['electric', 'ice', 'rock'],
  psychic: ['bug', 'ghost', 'dark'],
  bug: ['fire', 'flying', 'rock'],
  rock: ['water', 'grass', 'fighting', 'ground', 'steel'],
  ghost: ['ghost', 'dark'],
  dragon: ['ice', 'dragon', 'fairy'],
  dark: ['fighting', 'bug', 'fairy'],
  steel: ['fire', 'fighting', 'ground'],
  fairy: ['poison', 'steel']
};

export function getTeamCoverage(team: Team): { offensive: number; defensive: number } {
  const types = team.pokemon.flatMap(p => p.types);
  const uniqueTypes = [...new Set(types)];
  
  const offensiveCoverage = uniqueTypes.length;
  
  const weaknesses = team.pokemon.flatMap(p => 
    p.types.flatMap(t => typeChart[t.toLowerCase()] || [])
  );
  const uniqueWeaknesses = [...new Set(weaknesses)];
  const defensiveCoverage = Math.max(0, 18 - uniqueWeaknesses.length);
  
  return {
    offensive: Math.round((offensiveCoverage / 18) * 100),
    defensive: Math.round((defensiveCoverage / 18) * 100)
  };
}

export function getTeamTypeFilters(teams: Team[]): string[] {
  const allTypes = teams.flatMap(t => t.pokemon.flatMap(p => p.types));
  return [...new Set(allTypes)].sort();
}
