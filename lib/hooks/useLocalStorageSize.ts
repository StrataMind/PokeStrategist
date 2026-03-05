import { useState, useEffect } from 'react';

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB

function getStorageUsage(): number {
  if (typeof window === 'undefined') return 0;
  let total = 0;
  try {
    for (const key in localStorage) {
      if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
        total += ((localStorage.getItem(key)?.length ?? 0) + key.length) * 2;
      }
    }
  } catch {}
  return total;
}

export function useLocalStorageSize() {
  const [bytes, setBytes] = useState(0);

  useEffect(() => {
    const refresh = () => setBytes(getStorageUsage());
    refresh();
    const id = setInterval(refresh, 10_000);
    return () => clearInterval(id);
  }, []);

  const percent = Math.min(100, Math.round((bytes / MAX_BYTES) * 100));
  return { bytes, percent, isWarning: percent >= 70, isCritical: percent >= 90 };
}
