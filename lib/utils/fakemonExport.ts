import { Fakemon } from '@/types/fakemon';
import { getFakemon } from './fakemon';

export function exportFakemonCollection(): string {
  const fakemon = getFakemon();
  return JSON.stringify(fakemon, null, 2);
}

export function importFakemonCollection(jsonData: string): { success: boolean; count: number; error?: string } {
  try {
    const imported = JSON.parse(jsonData) as Fakemon[];
    
    if (!Array.isArray(imported)) {
      return { success: false, count: 0, error: 'Invalid format: must be an array' };
    }

    const existing = getFakemon();
    const merged = [...existing, ...imported];
    
    localStorage.setItem('fakemon', JSON.stringify(merged));
    
    return { success: true, count: imported.length };
  } catch (error) {
    return { success: false, count: 0, error: 'Invalid JSON format' };
  }
}

export function downloadFakemonJSON() {
  const json = exportFakemonCollection();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fakemon-collection-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
