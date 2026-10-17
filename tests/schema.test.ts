import { describe, expect, it } from 'vitest';
import { ENTRIES } from '@/data';
import { parseEntries } from '@/lib/schema';

describe('validacion de datos (Zod)', () => {
  it('valida todas las entradas del repo', () => {
    const result = parseEntries(ENTRIES);
    expect(result.ok).toBe(true);
  });

  it('rechaza una entrada a la que le faltan campos requeridos', () => {
    const result = parseEntries([{ id: 'x', type: 'dictionary', title: 'X' }]);
    expect(result.ok).toBe(false);
  });

  it('no admite ids duplicados', () => {
    const ids = ENTRIES.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('todo termino de diccionario trae su pronunciacion en ingles', () => {
    const sinPronunciacion = ENTRIES.filter(
      (entry) => entry.type === 'dictionary' && !entry.pronunciation,
    ).map((entry) => entry.id);
    expect(sinPronunciacion).toEqual([]);
  });
});
