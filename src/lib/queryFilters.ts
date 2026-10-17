import type { EntryType } from './types';

const TYPE_VALUES: EntryType[] = ['dictionary', 'clickpath', 'protocol', 'acronym'];

export interface ParsedQuery {
  /** Texto libre, sin los tokens de filtro. */
  text: string;
  /** Filtro de tipo pedido con `type:` (tiene prioridad sobre el chip). */
  type: EntryType | null;
  /** Etiquetas pedidas con `tag:` o `#`. */
  tags: string[];
}

/**
 * Mini-sintaxis de busqueda: `type:protocol`, `tag:salud-mental` o `#triage`.
 * Los tokens reconocidos se quitan del texto libre y se aplican como filtros.
 */
export function parseQuery(raw: string): ParsedQuery {
  const tags: string[] = [];
  let type: EntryType | null = null;

  const words = raw
    .split(/\s+/)
    .filter(Boolean)
    .filter((word) => {
      const lower = word.toLowerCase();

      if (lower.startsWith('type:')) {
        const value = lower.slice('type:'.length);
        if ((TYPE_VALUES as string[]).includes(value)) {
          type = value as EntryType;
          return false;
        }
      }

      if (lower.startsWith('tag:')) {
        const value = lower.slice('tag:'.length);
        if (value) {
          tags.push(value);
          return false;
        }
      }

      if (lower.startsWith('#') && lower.length > 1) {
        tags.push(lower.slice(1));
        return false;
      }

      return true;
    });

  return { text: words.join(' '), type, tags };
}

export function removeTypeToken(raw: string): string {
  return raw
    .split(/\s+/)
    .filter((word) => !word.toLowerCase().startsWith('type:'))
    .join(' ')
    .trim();
}

export function removeTagToken(raw: string, tag: string): string {
  return raw
    .split(/\s+/)
    .filter((word) => {
      const lower = word.toLowerCase();
      return lower !== `tag:${tag}` && lower !== `#${tag}`;
    })
    .join(' ')
    .trim();
}
