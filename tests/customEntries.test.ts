import { describe, expect, it } from 'vitest';
import { parseCustomEntry, slugId } from '@/lib/customEntries';

describe('entradas propias', () => {
  it('slugId genera un id con prefijo user-', () => {
    expect(slugId('Presion alta')).toMatch(/^user-presion-alta-/);
  });

  it('acepta una entrada valida', () => {
    const result = parseCustomEntry({
      id: 'user-x',
      type: 'dictionary',
      title: 'X',
      en: 'X',
      es: 'X',
    });
    expect(result.ok).toBe(true);
  });

  it('rechaza una entrada sin pasos en un protocolo', () => {
    const result = parseCustomEntry({
      id: 'user-x',
      type: 'protocol',
      title: 'X',
      steps: [],
    });
    expect(result.ok).toBe(false);
  });
});
