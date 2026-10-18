import { useCallback, useState } from 'react';
import { loadValidCustomEntries } from '@/lib/customEntries';
import { saveCustomEntries } from '@/lib/storage';
import type { Entry } from '@/lib/types';

/** Entradas creadas por el usuario, en localStorage. Sin backend ni cuenta. */
export function useCustomEntries() {
  const [customEntries, setCustomEntries] = useState<Entry[]>(() => loadValidCustomEntries());

  const addCustomEntry = useCallback((entry: Entry) => {
    setCustomEntries((prev) => {
      const next = [...prev, entry];
      saveCustomEntries(next);
      return next;
    });
  }, []);

  const removeCustomEntry = useCallback((id: string) => {
    setCustomEntries((prev) => {
      const next = prev.filter((entry) => entry.id !== id);
      saveCustomEntries(next);
      return next;
    });
  }, []);

  return { customEntries, addCustomEntry, removeCustomEntry };
}
