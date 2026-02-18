import { Fakemon } from '@/types/fakemon';

const STORAGE_KEY = 'fakemon_data';

export function getFakemon(): Fakemon[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveFakemon(fakemon: Fakemon[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fakemon));
}

export function addFakemon(fakemon: Omit<Fakemon, 'id' | 'createdAt' | 'source'>): Fakemon {
  const newFakemon: Fakemon = {
    ...fakemon,
    id: `fan-${Date.now()}`,
    source: 'fanmade',
    createdAt: new Date().toISOString(),
  };
  
  const existing = getFakemon();
  saveFakemon([...existing, newFakemon]);
  return newFakemon;
}

export function deleteFakemon(id: string): void {
  const existing = getFakemon();
  saveFakemon(existing.filter(f => f.id !== id));
}

export function validateFakemon(fakemon: Partial<Fakemon>): string[] {
  const errors: string[] = [];
  
  if (!fakemon.name?.trim()) errors.push('Name is required');
  if (!fakemon.types || fakemon.types.length === 0) errors.push('At least one type required');
  if (fakemon.types && fakemon.types.length > 2) errors.push('Maximum 2 types allowed');
  
  if (fakemon.stats) {
    const total = Object.values(fakemon.stats).reduce((a, b) => a + b, 0);
    if (total > 720) errors.push('Total base stats cannot exceed 720');
    
    Object.entries(fakemon.stats).forEach(([key, val]) => {
      if (val < 1 || val > 255) errors.push(`${key} must be between 1-255`);
    });
  } else {
    errors.push('All stats are required');
  }
  
  if (!fakemon.abilities || fakemon.abilities.length === 0) {
    errors.push('At least one ability required');
  }
  
  return errors;
}
