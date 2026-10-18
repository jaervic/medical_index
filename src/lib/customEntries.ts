import { entrySchema } from './schema';
import { loadCustomEntries } from './storage';
import type { Entry } from './types';

/** Convierte un titulo en un id estable con prefijo para distinguir las propias. */
export function slugId(title: string): string {
  const base = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  const suffix = Math.random().toString(36).slice(2, 6);
  return `user-${base || 'entrada'}-${suffix}`;
}

export function parseCustomEntry(
  raw: unknown,
): { ok: true; entry: Entry } | { ok: false; error: string } {
  const result = entrySchema.safeParse(raw);
  if (result.success) return { ok: true, entry: result.data };
  const issue = result.error.issues[0];
  return {
    ok: false,
    error: issue ? `${issue.path.join('.') || 'dato'}: ${issue.message}` : 'Datos invalidos',
  };
}

/** Carga las entradas propias guardadas, descartando cualquiera invalida. */
export function loadValidCustomEntries(): Entry[] {
  const raw = loadCustomEntries();
  const entries: Entry[] = [];
  for (const item of raw) {
    const result = entrySchema.safeParse(item);
    if (result.success) entries.push(result.data);
  }
  return entries;
}
