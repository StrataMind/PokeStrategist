'use client';

import { TeamPokemon } from '@/types/team';

interface TeamSynergyScoreProps {
  pokemon: TeamPokemon[];
  maxSize: number;
}

export default function TeamSynergyScore({ pokemon, maxSize }: TeamSynergyScoreProps) {
  const calculateSynergy = () => {
    if (pokemon.length === 0) return { score: 0, grade: 'N/A', details: [] };

    let totalScore = 0;
    const details: string[] = [];

    // 1. Type Diversity (30 points max)
    const uniqueTypes = new Set(pokemon.flatMap(p => p.types || []));
    const typeDiversity = Math.min(30, (uniqueTypes.size / 18) * 30);
    totalScore += typeDiversity;
    details.push(`Type Diversity: ${uniqueTypes.size}/18 types (${Math.round(typeDiversity)}/30)`);

    // 2. Team Completeness (20 points max)
    const completeness = (pokemon.length / maxSize) * 20;
    totalScore += completeness;
    details.push(`Team Size: ${pokemon.length}/${maxSize} (${Math.round(completeness)}/20)`);

    // 3. Stat Balance (25 points max)
    const avgStats = {
      hp: 0,
      attack: 0,
      defense: 0,
      spAtk: 0,
      spDef: 0,
      speed: 0
    };
    
    pokemon.forEach(p => {
      if (p.stats) {
        avgStats.hp += p.stats.hp || 0;
        avgStats.attack += p.stats.attack || 0;
        avgStats.defense += p.stats.defense || 0;
        avgStats.spAtk += p.stats.specialAttack || 0;
        avgStats.spDef += p.stats.specialDefense || 0;
        avgStats.speed += p.stats.speed || 0;
      }
    });

    Object.keys(avgStats).forEach(key => {
      avgStats[key as keyof typeof avgStats] /= pokemon.length || 1;
    });

    // Calculate stat variance (lower is better for balance)
    const statValues = Object.values(avgStats);
    const mean = statValues.reduce((a, b) => a + b, 0) / statValues.length;
    const variance = statValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / statValues.length;
    const statBalance = Math.max(0, 25 - (variance / 100));
    totalScore += statBalance;
    details.push(`Stat Balance: ${Math.round(statBalance)}/25`);

    // 4. Role Coverage (25 points max)
    let roles = 0;
    const hasPhysicalAttacker = pokemon.some(p => (p.stats?.attack || 0) > 100);
    const hasSpecialAttacker = pokemon.some(p => (p.stats?.specialAttack || 0) > 100);
    const hasWall = pokemon.some(p => (p.stats?.defense || 0) > 100 || (p.stats?.specialDefense || 0) > 100);
    const hasSpeedster = pokemon.some(p => (p.stats?.speed || 0) > 100);
    const hasTank = pokemon.some(p => (p.stats?.hp || 0) > 100);
    
    if (hasPhysicalAttacker) roles++;
    if (hasSpecialAttacker) roles++;
    if (hasWall) roles++;
    if (hasSpeedster) roles++;
    if (hasTank) roles++;
    
    const roleCoverage = (roles / 5) * 25;
    totalScore += roleCoverage;
    details.push(`Role Coverage: ${roles}/5 roles (${Math.round(roleCoverage)}/25)`);

    // Calculate grade
    let grade = 'F';
    if (totalScore >= 90) grade = 'S';
    else if (totalScore >= 80) grade = 'A';
    else if (totalScore >= 70) grade = 'B';
    else if (totalScore >= 60) grade = 'C';
    else if (totalScore >= 50) grade = 'D';

    return { score: Math.round(totalScore), grade, details };
  };

  const synergy = calculateSynergy();

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'S': return '#22c55e';
      case 'A': return '#3b82f6';
      case 'B': return '#eab308';
      case 'C': return '#f97316';
      case 'D': return '#ef4444';
      default: return '#9ca3af';
    }
  };

  if (pokemon.length === 0) {
    return (
      <div style={{ 
        background: 'var(--parchment)', 
        border: '2px solid var(--gold)', 
        padding: '1.5rem',
        boxShadow: '4px 4px 0 rgba(212, 175, 55, 0.3)'
      }}>
        <h3 style={{ 
          fontFamily: "'Playfair Display', serif", 
          fontSize: '1.2rem', 
          fontWeight: 700, 
          marginBottom: '1rem',
          color: 'var(--ink)',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>
          Team Synergy
        </h3>
        <p style={{ 
          fontFamily: "'DM Mono', monospace", 
          fontSize: '0.85rem', 
          color: 'var(--ink-muted)',
          textAlign: 'center',
          padding: '2rem'
        }}>
          Add Pokémon to calculate synergy
        </p>
      </div>
    );
  }

  return (
    <div style={{ 
      background: 'var(--parchment)', 
      border: '2px solid var(--gold)', 
      padding: '1.5rem',
      boxShadow: '4px 4px 0 rgba(212, 175, 55, 0.3)'
    }}>
      <h3 style={{ 
        fontFamily: "'Playfair Display', serif", 
        fontSize: '1.2rem', 
        fontWeight: 700, 
        marginBottom: '1rem',
        color: 'var(--ink)',
        textTransform: 'uppercase',
        letterSpacing: '2px'
      }}>
        ⭐ Team Synergy
      </h3>

      {/* Score Display */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1.5rem',
        marginBottom: '1.5rem',
        padding: '1rem',
        background: 'var(--cream)',
        border: '1px solid var(--border)'
      }}>
        <div style={{ 
          fontSize: '4rem',
          fontFamily: "'Playfair Display', serif",
          fontWeight: 900,
          color: getGradeColor(synergy.grade),
          lineHeight: 1
        }}>
          {synergy.grade}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ 
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.75rem',
            color: 'var(--ink-muted)',
            marginBottom: '0.25rem',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Overall Score
          </div>
          <div style={{ 
            fontFamily: "'Playfair Display', serif",
            fontSize: '2rem',
            fontWeight: 700,
            color: 'var(--ink)'
          }}>
            {synergy.score}/100
          </div>
          <div style={{ 
            width: '100%',
            height: '8px',
            background: '#e5e7eb',
            marginTop: '0.5rem',
            position: 'relative' as const,
            overflow: 'hidden'
          }}>
            <div style={{ 
              position: 'absolute' as const,
              left: 0,
              top: 0,
              height: '100%',
              width: `${synergy.score}%`,
              background: getGradeColor(synergy.grade),
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div style={{ 
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '0.5rem'
      }}>
        {synergy.details.map((detail, i) => (
          <div 
            key={i}
            style={{ 
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.75rem',
              color: 'var(--ink-muted)',
              padding: '0.5rem',
              background: 'var(--cream)',
              border: '1px solid var(--border)'
            }}
          >
            {detail}
          </div>
        ))}
      </div>

      {/* Tips */}
      {synergy.score < 70 && (
        <div style={{ 
          marginTop: '1rem',
          padding: '0.75rem',
          background: '#fef3c7',
          border: '1px solid #f59e0b',
          fontSize: '0.75rem',
          fontFamily: "'DM Mono', monospace",
          color: '#92400e'
        }}>
          💡 <strong>Tips:</strong> Add more type diversity, ensure all roles are covered, and balance physical/special attackers.
        </div>
      )}
    </div>
  );
}
