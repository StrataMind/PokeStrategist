const TYPE_CHART: Record<string, { strong: string[], weak: string[], immune: string[] }> = {
  normal: { strong: [], weak: ['fighting'], immune: ['ghost'] },
  fire: { strong: ['grass', 'ice', 'bug', 'steel'], weak: ['water', 'ground', 'rock'], immune: [] },
  water: { strong: ['fire', 'ground', 'rock'], weak: ['electric', 'grass'], immune: [] },
  electric: { strong: ['water', 'flying'], weak: ['ground'], immune: [] },
  grass: { strong: ['water', 'ground', 'rock'], weak: ['fire', 'ice', 'poison', 'flying', 'bug'], immune: [] },
  ice: { strong: ['grass', 'ground', 'flying', 'dragon'], weak: ['fire', 'fighting', 'rock', 'steel'], immune: [] },
  fighting: { strong: ['normal', 'ice', 'rock', 'dark', 'steel'], weak: ['flying', 'psychic', 'fairy'], immune: [] },
  poison: { strong: ['grass', 'fairy'], weak: ['ground', 'psychic'], immune: [] },
  ground: { strong: ['fire', 'electric', 'poison', 'rock', 'steel'], weak: ['water', 'grass', 'ice'], immune: ['electric'] },
  flying: { strong: ['grass', 'fighting', 'bug'], weak: ['electric', 'ice', 'rock'], immune: ['ground'] },
  psychic: { strong: ['fighting', 'poison'], weak: ['bug', 'ghost', 'dark'], immune: [] },
  bug: { strong: ['grass', 'psychic', 'dark'], weak: ['fire', 'flying', 'rock'], immune: [] },
  rock: { strong: ['fire', 'ice', 'flying', 'bug'], weak: ['water', 'grass', 'fighting', 'ground', 'steel'], immune: [] },
  ghost: { strong: ['psychic', 'ghost'], weak: ['ghost', 'dark'], immune: ['normal', 'fighting'] },
  dragon: { strong: ['dragon'], weak: ['ice', 'dragon', 'fairy'], immune: [] },
  dark: { strong: ['psychic', 'ghost'], weak: ['fighting', 'bug', 'fairy'], immune: ['psychic'] },
  steel: { strong: ['ice', 'rock', 'fairy'], weak: ['fire', 'fighting', 'ground'], immune: ['poison'] },
  fairy: { strong: ['fighting', 'dragon', 'dark'], weak: ['poison', 'steel'], immune: ['dragon'] },
};

export function calculateTypeCoverage(types: string[][]) {
  const offensive: Record<string, number> = {};
  const defensive: Record<string, number> = {};

  types.forEach(pokemonTypes => {
    pokemonTypes.forEach(type => {
      const chart = TYPE_CHART[type];
      if (chart) {
        chart.strong.forEach(t => {
          offensive[t] = (offensive[t] || 0) + 1;
        });
        chart.weak.forEach(t => {
          defensive[t] = (defensive[t] || 0) + 1;
        });
      }
    });
  });

  return { offensive, defensive };
}

export function getTeamStats(pokemon: any[]) {
  const stats = {
    hp: 0,
    attack: 0,
    defense: 0,
    specialAttack: 0,
    specialDefense: 0,
    speed: 0,
  };

  pokemon.forEach(p => {
    stats.hp += p.stats.hp;
    stats.attack += p.stats.attack;
    stats.defense += p.stats.defense;
    stats.specialAttack += p.stats.specialAttack;
    stats.specialDefense += p.stats.specialDefense;
    stats.speed += p.stats.speed;
  });

  const count = pokemon.length || 1;
  return {
    hp: Math.round(stats.hp / count),
    attack: Math.round(stats.attack / count),
    defense: Math.round(stats.defense / count),
    specialAttack: Math.round(stats.specialAttack / count),
    specialDefense: Math.round(stats.specialDefense / count),
    speed: Math.round(stats.speed / count),
  };
}
