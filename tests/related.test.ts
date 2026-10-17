import { describe, expect, it } from 'vitest';
import { findRelated } from '@/lib/related';
import type { Entry } from '@/lib/types';

function dict(id: string, title: string, keywords: string[], tags: string[]): Entry {
  return { id, type: 'dictionary', title, en: title, es: title, keywords, tags };
}

const corpus: Entry[] = [
  dict('a', 'Alpha', ['shared-word', 'alpha-only'], ['cardio']),
  dict('b', 'Beta', ['shared-word'], ['cardio']),
  dict('c', 'Gamma', ['gamma-only'], ['cardio']),
  dict('d', 'Delta', ['shared-word', 'other'], ['neuro']),
  {
    id: 'e',
    type: 'protocol',
    title: 'Epsilon',
    steps: ['x'],
    keywords: ['shared-word'],
    tags: ['cardio'],
  },
];

describe('findRelated', () => {
  const related = findRelated(corpus[0], corpus, 10);

  it('excluye la propia entrada', () => {
    expect(related.map((item) => item.entry.id)).not.toContain('a');
  });

  it('prioriza compartir sinonimos sobre compartir solo etiquetas', () => {
    const ids = related.map((item) => item.entry.id);
    expect(ids.indexOf('b')).toBeLessThan(ids.indexOf('c'));
  });

  it('incluye quien comparte un sinonimo aunque cambie el tipo', () => {
    expect(related.map((item) => item.entry.id)).toContain('e');
  });

  it('respeta el limite', () => {
    expect(findRelated(corpus[0], corpus, 1)).toHaveLength(1);
  });
});
