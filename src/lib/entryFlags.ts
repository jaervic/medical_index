import type { Entry } from './types';

/** Una entrada es "bandera roja" si lleva la etiqueta correspondiente. */
export function isRedFlag(entry: Entry): boolean {
  return (entry.tags ?? []).some((tag) => tag.toLowerCase() === 'bandera-roja');
}
