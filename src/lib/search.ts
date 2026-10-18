import Fuse from 'fuse.js';
import { tagForms } from './tagLabels';
import type { Entry } from './types';
/**
 * Busqueda: Fuse.js para fuzzy matching + una capa de boosts propia.
 *
 * Fuse ordena por score (menor = mejor). Encima aplicamos boosts para que los
 * casos que de verdad importan en un turno queden arriba: acronimo exacto
 * (escribir "UTI"), titulo exacto, sinonimo exacto y frecency (uso reciente).
 */

export interface SearchDoc {
  entry: Entry;
  title: string;
  keywords: string;
  tags: string;
  body: string;
}

export type MatchKind = 'acronym' | 'exact' | 'prefix' | 'fuzzy';

export interface RankedEntry {
  entry: Entry;
  score: number;
  matchedOn: MatchKind;
}

export interface SearchOptions {
  /** Peso de uso por entrada (frecency). */
  frecency?: (id: string) => number;
  limit?: number;
}

function bodyOf(entry: Entry): string {
  switch (entry.type) {
    case 'dictionary':
      return [entry.en, entry.es, ...(entry.colloquial ?? []), entry.note ?? ''].join(' ');
    case 'clickpath':
      return [entry.module, ...entry.path, entry.notes ?? ''].join(' ');
    case 'protocol':
      return [...entry.steps, entry.appliesTo ?? '', ...(entry.warnings ?? [])].join(' ');
    case 'acronym':
      return [entry.expansion, entry.translation ?? '', entry.note ?? ''].join(' ');
  }
}

/** Texto de las variantes de idioma, para que la busqueda funcione en ambos. */
function overlayText(entry: Entry): string {
  const parts: string[] = [];
  for (const overlay of [entry.i18n?.es, entry.i18n?.en]) {
    if (!overlay) continue;
    if (overlay.title) parts.push(overlay.title);
    if (overlay.note) parts.push(overlay.note);
    if (overlay.notes) parts.push(overlay.notes);
    if (overlay.appliesTo) parts.push(overlay.appliesTo);
    if (overlay.steps) parts.push(...overlay.steps);
    if (overlay.warnings) parts.push(...overlay.warnings);
    if (overlay.path) parts.push(...overlay.path);
  }
  return parts.join(' ');
}

export function toDoc(entry: Entry): SearchDoc {
  return {
    entry,
    title: entry.title,
    keywords: (entry.keywords ?? []).join(' '),
    tags: (entry.tags ?? []).flatMap(tagForms).join(' '),
    body: [bodyOf(entry), overlayText(entry)].join(' '),
  };
}

export function createIndex(entries: Entry[]): Fuse<SearchDoc> {
  return new Fuse(entries.map(toDoc), {
    includeScore: true,
    ignoreLocation: true,
    threshold: 0.4,
    minMatchCharLength: 2,
    keys: [
      { name: 'title', weight: 3 },
      { name: 'keywords', weight: 2 },
      { name: 'tags', weight: 1 },
      { name: 'body', weight: 0.5 },
    ],
  });
}

export function searchEntries(
  index: Fuse<SearchDoc>,
  query: string,
  options: SearchOptions = {},
): RankedEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const { frecency = () => 0, limit = 30 } = options;
  const results = index.search(query);

  const ranked = results.map((result) => {
    const entry = result.item.entry;
    const title = entry.title.toLowerCase();
    const keywords = (entry.keywords ?? []).map((keyword) => keyword.toLowerCase());

    // Tiers: la coincidencia "humana" manda sobre el score difuso de Fuse.
    let tier: number;
    let matchedOn: MatchKind;
    if (title === q) {
      tier = 0;
      matchedOn = entry.type === 'acronym' ? 'acronym' : 'exact';
    } else if (title.startsWith(q) || keywords.some((keyword) => keyword === q)) {
      tier = 1;
      matchedOn = 'prefix';
    } else {
      tier = 2;
      matchedOn = 'fuzzy';
    }

    // Frecency: desempata dentro del mismo tier (mas uso y mas reciente, mejor).
    const adjusted = (result.score ?? 1) - Math.min(frecency(entry.id) * 0.02, 0.15);

    return { entry, score: adjusted, matchedOn, tier };
  });

  ranked.sort(
    (a, b) => a.tier - b.tier || a.score - b.score || a.entry.title.localeCompare(b.entry.title),
  );

  return ranked.slice(0, limit).map(({ entry, score, matchedOn }) => ({ entry, score, matchedOn }));
}

/** Texto listo para pegar en la nota clinica (accion primaria de copiar). */
export function primaryCopyText(entry: Entry): string {
  switch (entry.type) {
    case 'dictionary':
      return entry.en;
    case 'clickpath':
      return entry.path.join(' > ');
    case 'protocol':
      return entry.steps.map((step, i) => `${i + 1}. ${step}`).join('\n');
    case 'acronym':
      return `${entry.title} — ${entry.expansion}`;
  }
}
