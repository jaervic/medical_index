import type { Entry, EntryType } from './types';

export interface HomeSections {
  favorites: Entry[];
  recents: Entry[];
  rest: Entry[];
}

/**
 * Secciones de la vista inicial (sin busqueda). `seen` solo incluye las
 * entradas que realmente se muestran con el filtro de tipo activo: si un
 * fijado queda oculto por el filtro, no debe desaparecer de "Todo lo demas".
 */
export function buildHome(
  entries: Entry[],
  favoriteIds: string[],
  recentIds: string[],
  type: EntryType | 'all',
): HomeSections {
  const byId = new Map(entries.map((entry) => [entry.id, entry]));
  const visible = (entry: Entry | undefined): entry is Entry =>
    Boolean(entry) && (type === 'all' || entry!.type === type);

  const favorites = favoriteIds.map((id) => byId.get(id)).filter(visible);
  const recents = recentIds.map((id) => byId.get(id)).filter(visible);
  const seen = new Set([...favorites, ...recents].map((entry) => entry.id));
  const rest = entries.filter(
    (entry) => !seen.has(entry.id) && (type === 'all' || entry.type === type),
  );

  return { favorites, recents, rest };
}
