import { useMemo } from 'react';
import { ENTRIES } from '@/data';
import { createIndex, searchEntries, type RankedEntry } from '@/lib/search';
import { frecencyValue, type FrecencyMap } from '@/lib/storage';
import type { EntryType } from '@/lib/types';

// El indice se construye una sola vez: el contenido es estatico.
const index = createIndex(ENTRIES);

export function useSearch(
  query: string,
  frecencyMap: FrecencyMap,
  type: EntryType | 'all' = 'all',
): RankedEntry[] {
  return useMemo(() => {
    const results = searchEntries(index, query, {
      frecency: (id) => frecencyValue(frecencyMap[id]),
    });
    return type === 'all' ? results : results.filter((item) => item.entry.type === type);
  }, [query, frecencyMap, type]);
}
