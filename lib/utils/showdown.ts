import { Team, TeamPokemon } from '@/types/team';

export function parseShowdown(text: string): Partial<Team> {
  const lines = text.trim().split('\n');
  const pokemon: TeamPokemon[] = [];
  let current: any = null;
  let position = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (current) {
        pokemon.push({ ...current, position: position++ });
        current = null;
      }
      continue;
    }

    // Pokemon name line: "Pikachu (M) @ Light Ball"
    if (!trimmed.startsWith('-') && !trimmed.startsWith('Ability:') && !trimmed.startsWith('Level:') && 
        !trimmed.startsWith('EVs:') && !trimmed.startsWith('IVs:') && !trimmed.startsWith('Nature') && !current) {
      const nameMatch = trimmed.match(/^(.+?)(?:\s+\([MF]\))?\s*(?:@\s*(.+))?$/);
      if (nameMatch) {
        const name = nameMatch[1].toLowerCase().replace(/\s+/g, '-');
        current = {
          name,
          nickname: nameMatch[1],
          sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${name}.png`,
          types: [],
          stats: { hp: 100, attack: 100, defense: 100, specialAttack: 100, specialDefense: 100, speed: 100 },
          ability: '',
          nature: 'Hardy',
          item: nameMatch[2] || '',
          moves: []
        };
      }
    } else if (current) {
      if (trimmed.startsWith('Ability:')) {
        current.ability = trimmed.replace('Ability:', '').trim();
      } else if (trimmed.startsWith('Nature')) {
        current.nature = trimmed.replace('Nature', '').trim();
      } else if (trimmed.startsWith('-')) {
        const move = trimmed.substring(1).trim();
        if (current.moves.length < 4) current.moves.push(move);
      }
    }
  }

  if (current) pokemon.push({ ...current, position: position++ });

  return {
    name: 'Imported Team',
    maxSize: pokemon.length || 6,
    pokemon
  };
}

export function exportShowdown(team: Team): string {
  return team.pokemon.map(p => {
    let text = p.nickname || p.name;
    if (p.item) text += ` @ ${p.item}`;
    text += `\nAbility: ${p.selectedAbility || 'Unknown'}`;
    if (p.nature) text += `\n${p.nature} Nature`;
    if (p.selectedMoves) p.selectedMoves.forEach(m => text += `\n- ${m}`);
    return text;
  }).join('\n\n');
}
