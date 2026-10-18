import { useMemo } from 'react';
import { createIndex, searchEntries, type RankedEntry } from '@/lib/search';
import { frecencyValue, type FrecencyMap } from '@/lib/storage';
import type { Entry, EntryType } from '@/lib/types';

/** Busca sobre la lista de entradas dada (incluye las propias). El indice se memoiza. */
export function useSearch(
  entries: Entry[],
  query: string,
  frecencyMap: FrecencyMap,
  type: EntryType | 'all' = 'all',
): RankedEntry[] {
  const index = useMemo(() => createIndex(entries), [entries]);

  return useMemo(() => {
    const results = searchEntries(index, query, {
      frecency: (id) => frecencyValue(frecencyMap[id]),
    });
    return type === 'all' ? results : results.filter((item) => item.entry.type === type);
  }, [index, query, frecencyMap, type]);
}
