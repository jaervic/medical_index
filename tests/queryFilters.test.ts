import { describe, expect, it } from 'vitest';
import { parseQuery, removeTagToken, removeTypeToken } from '@/lib/queryFilters';

describe('parseQuery', () => {
  it('extrae el filtro de tipo', () => {
    expect(parseQuery('type:protocol fiebre')).toEqual({
      text: 'fiebre',
      type: 'protocol',
      tags: [],
    });
  });

  it('extrae etiquetas con tag: y #', () => {
    expect(parseQuery('tag:triage #eCW dolor')).toEqual({
      text: 'dolor',
      type: null,
      tags: ['triage', 'ecw'],
    });
  });

  it('deja como texto un type: invalido', () => {
    expect(parseQuery('type:foo bar')).toEqual({ text: 'type:foo bar', type: null, tags: [] });
  });

  it('quita los tokens de filtro', () => {
    expect(removeTypeToken('type:protocol fiebre')).toBe('fiebre');
    expect(removeTagToken('#eCW referral', 'ecw')).toBe('referral');
  });
});
