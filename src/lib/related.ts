import type { Entry } from './types';

/**
 * Entradas relacionadas: comparten etiquetas o sinonimos con la entrada dada.
 *
 * Los sinonimos (keywords) pesan mas porque son mas especificos; las etiquetas
 * se ponderan por frecuencia inversa (una etiqueta generica como "salud-mental"
 * aporta poco, una especifica como "athena" aporta mucho). Asi el bloque
 * "Relacionados" llena el panel con sugerencias utiles y no con ruido.
 */

export interface RelatedResult {
  entry: Entry;
  score: number;
}

function keywordSet(entry: Entry): Set<string> {
  return new Set((entry.keywords ?? []).map((keyword) => keyword.toLowerCase()));
}

function tagList(entry: Entry): string[] {
  return (entry.tags ?? []).map((tag) => tag.toLowerCase());
}

export function findRelated(entry: Entry, all: Entry[], limit = 6): RelatedResult[] {
  const baseKeywords = keywordSet(entry);
  const baseTags = new Set(tagList(entry));
  if (baseKeywords.size === 0 && baseTags.size === 0) return [];

  // Frecuencia de cada etiqueta en el corpus (para el peso inverso).
  const tagFreq = new Map<string, number>();
  for (const candidate of all) {
    for (const tag of tagList(candidate)) {
      tagFreq.set(tag, (tagFreq.get(tag) ?? 0) + 1);
    }
  }
  const tagWeight = (tag: string) => 1 / Math.log2(2 + (tagFreq.get(tag) ?? 1));

  const results: RelatedResult[] = [];

  for (const candidate of all) {
    if (candidate.id === entry.id) continue;

    let score = 0;

    for (const keyword of keywordSet(candidate)) {
      if (baseKeywords.has(keyword)) score += 3;
    }
    for (const tag of tagList(candidate)) {
      if (baseTags.has(tag)) score += tagWeight(tag);
    }
    if (candidate.type === entry.type) score += 0.5;

    if (score > 0.5) results.push({ entry: candidate, score });
  }

  results.sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title));
  return results.slice(0, limit);
}
