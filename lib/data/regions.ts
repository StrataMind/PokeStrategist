// Pokemon regions based on National Pokedex number ranges
export const POKEMON_REGIONS = {
  kanto: { name: 'Kanto', range: [1, 151], gen: 1 },
  johto: { name: 'Johto', range: [152, 251], gen: 2 },
  hoenn: { name: 'Hoenn', range: [252, 386], gen: 3 },
  sinnoh: { name: 'Sinnoh', range: [387, 493], gen: 4 },
  unova: { name: 'Unova', range: [494, 649], gen: 5 },
  kalos: { name: 'Kalos', range: [650, 721], gen: 6 },
  alola: { name: 'Alola', range: [722, 809], gen: 7 },
  galar: { name: 'Galar', range: [810, 905], gen: 8 },
  paldea: { name: 'Paldea', range: [906, 1025], gen: 9 },
} as const;

export type Region = keyof typeof POKEMON_REGIONS;

/**
 * Get the region (generation) of a Pokemon by its ID
 */
export function getPokemonRegion(pokemonId: number | string): Region | null {
  const id = typeof pokemonId === 'string' ? parseInt(pokemonId, 10) : pokemonId;
  if (isNaN(id)) return null;
  
  for (const [region, data] of Object.entries(POKEMON_REGIONS)) {
    const [min, max] = data.range;
    if (id >= min && id <= max) {
      return region as Region;
    }
  }
  return null;
}

/**
 * Get the primary region of a team based on the majority of Pokemon
 */
export function getTeamRegion(pokemon: Array<{ id: number | string }>): Region | null {
  if (pokemon.length === 0) return null;

  const regionCounts: Record<string, number> = {};
  
  for (const p of pokemon) {
    const region = getPokemonRegion(p.id);
    if (region) {
      regionCounts[region] = (regionCounts[region] || 0) + 1;
    }
  }

  // Return the region with the most Pokemon
  let maxCount = 0;
  let primaryRegion: Region | null = null;
  
  for (const [region, count] of Object.entries(regionCounts)) {
    if (count > maxCount) {
      maxCount = count;
      primaryRegion = region as Region;
    }
  }

  return primaryRegion;
}

/**
 * Get all regions present in a team
 */
export function getTeamRegions(pokemon: Array<{ id: number | string }>): Region[] {
  const regions = new Set<Region>();
  
  for (const p of pokemon) {
    const region = getPokemonRegion(p.id);
    if (region) {
      regions.add(region);
    }
  }

  return Array.from(regions);
}
