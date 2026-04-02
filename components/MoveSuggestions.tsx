'use client';

import { TeamPokemon } from '@/types/team';
import { getTypeColor } from '@/lib/utils';

interface MoveSuggestionsProps {
  pokemon: TeamPokemon;
  teamPokemon: TeamPokemon[];
  onSelectMove: (move: string) => void;
  selectedMoves: string[];
}

// Type effectiveness chart
const TYPE_EFFECTIVENESS: Record<string, { strong: string[], weak: string[] }> = {
  normal: { strong: [], weak: ['rock', 'steel'] },
  fire: { strong: ['grass', 'ice', 'bug', 'steel'], weak: ['fire', 'water', 'rock', 'dragon'] },
  water: { strong: ['fire', 'ground', 'rock'], weak: ['water', 'grass', 'dragon'] },
  electric: { strong: ['water', 'flying'], weak: ['electric', 'grass', 'dragon'] },
  grass: { strong: ['water', 'ground', 'rock'], weak: ['fire', 'grass', 'poison', 'flying', 'bug', 'dragon', 'steel'] },
  ice: { strong: ['grass', 'ground', 'flying', 'dragon'], weak: ['fire', 'water', 'ice', 'steel'] },
  fighting: { strong: ['normal', 'ice', 'rock', 'dark', 'steel'], weak: ['poison', 'flying', 'psychic', 'bug', 'fairy'] },
  poison: { strong: ['grass', 'fairy'], weak: ['poison', 'ground', 'rock', 'ghost'] },
  ground: { strong: ['fire', 'electric', 'poison', 'rock', 'steel'], weak: ['grass', 'bug'] },
  flying: { strong: ['grass', 'fighting', 'bug'], weak: ['electric', 'rock', 'steel'] },
  psychic: { strong: ['fighting', 'poison'], weak: ['psychic', 'steel'] },
  bug: { strong: ['grass', 'psychic', 'dark'], weak: ['fire', 'fighting', 'poison', 'flying', 'ghost', 'steel', 'fairy'] },
  rock: { strong: ['fire', 'ice', 'flying', 'bug'], weak: ['fighting', 'ground', 'steel'] },
  ghost: { strong: ['psychic', 'ghost'], weak: ['dark'] },
  dragon: { strong: ['dragon'], weak: ['steel', 'fairy'] },
  dark: { strong: ['psychic', 'ghost'], weak: ['fighting', 'dark', 'fairy'] },
  steel: { strong: ['ice', 'rock', 'fairy'], weak: ['fire', 'water', 'electric', 'steel'] },
  fairy: { strong: ['fighting', 'dragon', 'dark'], weak: ['fire', 'poison', 'steel'] }
};

export default function MoveSuggestions({ pokemon, teamPokemon, onSelectMove, selectedMoves }: MoveSuggestionsProps) {
  const calculateSuggestions = () => {
    const suggestions: Array<{ name: string; type: string; category: string; reason: string; priority: number }> = [];

    // 1. STAB moves (Same Type Attack Bonus)
    pokemon.types.forEach(type => {
      const stab = getSTABMove(type, pokemon.stats);
      if (stab) {
        suggestions.push({
          ...stab,
          reason: `STAB ${stab.category} move`,
          priority: 10
        });
      }
    });

    // 2. Coverage moves (cover weaknesses)
    const teamTypes = new Set(teamPokemon.flatMap(p => p.types));
    const coverageNeeded = findCoverageGaps(teamTypes);
    coverageNeeded.forEach(type => {
      const move = getCoverageMove(type, pokemon.stats);
      if (move) {
        suggestions.push({
          ...move,
          reason: `Covers ${type} weakness`,
          priority: 8
        });
      }
    });

    // 3. Utility moves
    const utility = getUtilityMove(pokemon);
    if (utility) {
      suggestions.push({
        ...utility,
        reason: 'Support/Utility',
        priority: 6
      });
    }

    // 4. Recovery if bulky
    if ((pokemon.stats.hp > 90 || pokemon.stats.defense > 90 || pokemon.stats.specialDefense > 90)) {
      suggestions.push({
        name: 'Recover',
        type: 'normal',
        category: 'Status',
        reason: 'HP recovery for bulk',
        priority: 7
      });
    }

    // Sort by priority and return top 8
    return suggestions
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 8);
  };

  const getSTABMove = (type: string, stats: typeof pokemon.stats) => {
    const isPhysical = stats.attack > stats.specialAttack;
    const category = isPhysical ? 'Physical' : 'Special';
    
    const moves: Record<string, { physical: string, special: string }> = {
      fire: { physical: 'Flare Blitz', special: 'Flamethrower' },
      water: { physical: 'Waterfall', special: 'Surf' },
      grass: { physical: 'Wood Hammer', special: 'Energy Ball' },
      electric: { physical: 'Wild Charge', special: 'Thunderbolt' },
      ice: { physical: 'Icicle Crash', special: 'Ice Beam' },
      fighting: { physical: 'Close Combat', special: 'Focus Blast' },
      poison: { physical: 'Gunk Shot', special: 'Sludge Bomb' },
      ground: { physical: 'Earthquake', special: 'Earth Power' },
      flying: { physical: 'Brave Bird', special: 'Hurricane' },
      psychic: { physical: 'Zen Headbutt', special: 'Psychic' },
      bug: { physical: 'U-turn', special: 'Bug Buzz' },
      rock: { physical: 'Stone Edge', special: 'Power Gem' },
      ghost: { physical: 'Shadow Claw', special: 'Shadow Ball' },
      dragon: { physical: 'Outrage', special: 'Draco Meteor' },
      dark: { physical: 'Knock Off', special: 'Dark Pulse' },
      steel: { physical: 'Iron Head', special: 'Flash Cannon' },
      fairy: { physical: 'Play Rough', special: 'Moonblast' },
      normal: { physical: 'Extreme Speed', special: 'Hyper Beam' }
    };

    const move = moves[type];
    if (!move) return null;

    return {
      name: isPhysical ? move.physical : move.special,
      type,
      category
    };
  };

  const findCoverageGaps = (teamTypes: Set<string>) => {
    const allWeaknesses = new Set<string>();
    teamTypes.forEach(type => {
      // Find what this type is weak to
      Object.entries(TYPE_EFFECTIVENESS).forEach(([attackType, { strong }]) => {
        if (strong.includes(type)) {
          allWeaknesses.add(attackType);
        }
      });
    });
    return Array.from(allWeaknesses).slice(0, 3);
  };

  const getCoverageMove = (coverageType: string, stats: typeof pokemon.stats) => {
    const isPhysical = stats.attack > stats.specialAttack;
    const category = isPhysical ? 'Physical' : 'Special';

    const moves: Record<string, { physical: string, special: string }> = {
      fire: { physical: 'Fire Punch', special: 'Fire Blast' },
      water: { physical: 'Liquidation', special: 'Hydro Pump' },
      grass: { physical: 'Seed Bomb', special: 'Giga Drain' },
      electric: { physical: 'Thunder Punch', special: 'Thunderbolt' },
      ice: { physical: 'Ice Punch', special: 'Ice Beam' },
      fighting: { physical: 'Brick Break', special: 'Aura Sphere' },
      poison: { physical: 'Poison Jab', special: 'Sludge Bomb' },
      ground: { physical: 'Earthquake', special: 'Earth Power' },
      flying: { physical: 'Acrobatics', special: 'Air Slash' },
      psychic: { physical: 'Psycho Cut', special: 'Psychic' },
      bug: { physical: 'X-Scissor', special: 'Bug Buzz' },
      rock: { physical: 'Rock Slide', special: 'Ancient Power' },
      ghost: { physical: 'Shadow Sneak', special: 'Shadow Ball' },
      dragon: { physical: 'Dragon Claw', special: 'Dragon Pulse' },
      dark: { physical: 'Crunch', special: 'Dark Pulse' },
      steel: { physical: 'Iron Head', special: 'Steel Beam' },
      fairy: { physical: 'Play Rough', special: 'Dazzling Gleam' }
    };

    const move = moves[coverageType];
    if (!move) return null;

    return {
      name: isPhysical ? move.physical : move.special,
      type: coverageType,
      category
    };
  };

  const getUtilityMove = (pokemon: TeamPokemon) => {
    if (pokemon.stats.speed > 100) {
      return { name: 'U-turn', type: 'bug', category: 'Physical' };
    }
    if (pokemon.stats.defense > 100) {
      return { name: 'Stealth Rock', type: 'rock', category: 'Status' };
    }
    if (pokemon.stats.specialDefense > 100) {
      return { name: 'Toxic', type: 'poison', category: 'Status' };
    }
    return { name: 'Protect', type: 'normal', category: 'Status' };
  };

  const suggestions = calculateSuggestions();

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <h3 style={{ 
        fontFamily: "'Playfair Display', serif", 
        fontSize: '1rem', 
        fontWeight: 700, 
        marginBottom: '0.75rem',
        color: 'var(--ink)'
      }}>
        💡 Suggested Moves
      </h3>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
        gap: '0.5rem' 
      }}>
        {suggestions.map((move, i) => {
          const isSelected = selectedMoves.includes(move.name);
          const isFull = selectedMoves.length >= 4;
          
          return (
            <button
              key={i}
              onClick={() => !isSelected && !isFull && onSelectMove(move.name)}
              disabled={isSelected || (!isSelected && isFull)}
              style={{ 
                background: isSelected ? 'var(--gold)' : 'var(--cream)',
                border: '1px solid var(--border)',
                padding: '0.75rem',
                textAlign: 'left' as const,
                cursor: (isSelected || (!isSelected && isFull)) ? 'not-allowed' : 'pointer',
                opacity: (isSelected || (!isSelected && isFull)) ? 0.6 : 1,
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => {
                if (!isSelected && !isFull) {
                  e.currentTarget.style.borderColor = 'var(--gold)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '0.25rem'
              }}>
                <span style={{ 
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: isSelected ? 'white' : 'var(--ink)'
                }}>
                  {move.name}
                </span>
                <span style={{ 
                  fontSize: '0.6rem',
                  padding: '2px 4px',
                  background: getTypeColor(move.type).replace('bg-', ''),
                  color: 'white',
                  textTransform: 'uppercase' as const,
                  fontFamily: "'DM Mono', monospace",
                  borderRadius: '2px'
                }}>
                  {move.type}
                </span>
              </div>
              
              <div style={{ 
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.65rem',
                color: isSelected ? 'rgba(255,255,255,0.9)' : 'var(--ink-muted)',
                marginBottom: '0.25rem'
              }}>
                {move.category}
              </div>
              
              <div style={{ 
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.6rem',
                color: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--ink-muted)',
                fontStyle: 'italic' as const
              }}>
                {move.reason}
              </div>
            </button>
          );
        })}
      </div>
      
      <p style={{ 
        fontFamily: "'DM Mono', monospace",
        fontSize: '0.7rem',
        color: 'var(--ink-muted)',
        marginTop: '0.75rem',
        fontStyle: 'italic' as const
      }}>
        Click to add (max 4 moves) • Based on stats, type, and team coverage
      </p>
    </div>
  );
}
