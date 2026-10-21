import type { Entry } from './types';

/**
 * Overrides locales de las rutas integradas: permiten corregir los rotulos de
 * athenaOne para que coincidan con la instancia de cada clinica. Viven en
 * localStorage y no tocan el contenido versionado.
 */
export interface RouteOverride {
  path?: string[];
  notes?: string;
}

export type RouteOverrides = Record<string, RouteOverride>;

const KEY = 'meddex:route-overrides';

export function loadRouteOverrides(): RouteOverrides {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    return typeof parsed === 'object' && parsed !== null ? (parsed as RouteOverrides) : {};
  } catch {
    return {};
  }
}

export function saveRouteOverrides(overrides: RouteOverrides): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(overrides));
  } catch {
    /* almacenamiento no disponible: ignorar */
  }
}

/** Aplica el override a una ruta, si existe. */
export function applyRouteOverride(entry: Entry, overrides: RouteOverrides): Entry {
  if (entry.type !== 'clickpath') return entry;
  const override = overrides[entry.id];
  if (!override) return entry;
  return {
    ...entry,
    path: override.path && override.path.length > 0 ? override.path : entry.path,
    notes: override.notes ?? entry.notes,
  };
}
