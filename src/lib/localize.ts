import type { Locale } from './storage';
import type { Entry } from './types';

/**
 * Devuelve la entrada con los campos de prosa en el idioma pedido.
 * La base de los datos esta en ingles; el espanol vive en `i18n.es`.
 */
export function localizeEntry(entry: Entry, locale: Locale): Entry {
  const overlay = entry.i18n?.[locale];
  if (!overlay) return entry;
  return { ...entry, ...overlay } as Entry;
}

export function localizeEntries(entries: Entry[], locale: Locale): Entry[] {
  return entries.map((entry) => localizeEntry(entry, locale));
}
