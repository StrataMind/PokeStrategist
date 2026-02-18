import { Team } from '@/types/team';

export type Format = 'OU' | 'UU' | 'VGC' | 'Ubers' | 'LC';

export interface ValidationResult {
  valid: boolean;
  format: Format;
  errors: string[];
}

export function validateTeam(team: Team, format: Format = 'OU'): ValidationResult {
  const errors: string[] = [];
  
  // Species Clause
  const species = team.pokemon.map(p => p.name);
  const duplicates = species.filter((s, i) => species.indexOf(s) !== i);
  if (duplicates.length > 0) errors.push('Species Clause');
  
  // Item Clause (VGC)
  if (format === 'VGC') {
    const items = team.pokemon.map(p => p.item).filter(Boolean);
    const dupItems = items.filter((s, i) => items.indexOf(s) !== i);
    if (dupItems.length > 0) errors.push('Item Clause');
  }
  
  // Team size
  if (format === 'VGC' && team.pokemon.length < 4) errors.push('Min 4 Pokemon');
  if (format !== 'VGC' && team.pokemon.length < 1) errors.push('Empty team');
  
  return { valid: errors.length === 0, format, errors };
}

export function getFormatBadge(team: Team): { format: Format; valid: boolean } | null {
  const formats: Format[] = ['OU', 'UU', 'VGC', 'Ubers', 'LC'];
  for (const format of formats) {
    const result = validateTeam(team, format);
    if (result.valid) return { format, valid: true };
  }
  return { format: 'OU', valid: false };
}
