/**
 * Persistencia local (localStorage). Todo es del usuario final: recientes,
 * fijados, frecency y tema. Nunca se guarda informacion de pacientes.
 */

const NS = 'meddex';

export const STORAGE_KEYS = {
  favorites: `${NS}:favorites`,
  frecency: `${NS}:frecency`,
  recents: `${NS}:recents`,
  theme: `${NS}:theme`,
  panelCollapsed: `${NS}:panel-collapsed`,
} as const;

export type Theme = 'dark' | 'light';

export interface FrecencyRecord {
  count: number;
  last: number;
}

export type FrecencyMap = Record<string, FrecencyRecord>;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* almacenamiento no disponible (modo privado): ignorar */
  }
}

// --- Favoritos -------------------------------------------------------------

export function loadFavorites(): string[] {
  return read<string[]>(STORAGE_KEYS.favorites, []);
}

export function saveFavorites(ids: string[]): void {
  write(STORAGE_KEYS.favorites, ids);
}

// --- Recientes -------------------------------------------------------------

export function loadRecents(): string[] {
  return read<string[]>(STORAGE_KEYS.recents, []);
}

export function saveRecents(ids: string[]): void {
  write(STORAGE_KEYS.recents, ids);
}

export function pushRecent(list: string[], id: string, max = 8): string[] {
  return [id, ...list.filter((item) => item !== id)].slice(0, max);
}

// --- Frecency --------------------------------------------------------------

export function loadFrecency(): FrecencyMap {
  return read<FrecencyMap>(STORAGE_KEYS.frecency, {});
}

export function saveFrecency(map: FrecencyMap): void {
  write(STORAGE_KEYS.frecency, map);
}

export function bumpFrecency(map: FrecencyMap, id: string, now = Date.now()): FrecencyMap {
  const prev = map[id];
  return { ...map, [id]: { count: (prev?.count ?? 0) + 1, last: now } };
}

/** Convierte un registro en un peso: mas uso y mas reciente = mas alto. */
export function frecencyValue(record: FrecencyRecord | undefined, now = Date.now()): number {
  if (!record) return 0;
  const ageDays = (now - record.last) / 86_400_000;
  const recency = ageDays < 1 ? 1 : ageDays < 7 ? 0.6 : ageDays < 30 ? 0.3 : 0.1;
  return record.count * recency;
}

// --- Tema ------------------------------------------------------------------

export function loadTheme(): Theme {
  return read<Theme>(STORAGE_KEYS.theme, 'dark');
}

export function saveTheme(theme: Theme): void {
  write(STORAGE_KEYS.theme, theme);
}

// --- Panel de detalle ------------------------------------------------------

export function loadPanelCollapsed(): boolean {
  return read<boolean>(STORAGE_KEYS.panelCollapsed, false);
}

export function savePanelCollapsed(collapsed: boolean): void {
  write(STORAGE_KEYS.panelCollapsed, collapsed);
}
