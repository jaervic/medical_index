import { describe, expect, it } from 'vitest';
import { localizeEntry } from '@/lib/localize';
import type { Entry } from '@/lib/types';

const protocol: Entry = {
  id: 'x',
  type: 'protocol',
  title: 'Fever in Adults',
  steps: ['Step one'],
  i18n: { es: { title: 'Fiebre en el adulto', steps: ['Paso uno'] } },
};

describe('localizeEntry', () => {
  it('devuelve la base en ingles', () => {
    expect(localizeEntry(protocol, 'en').title).toBe('Fever in Adults');
  });

  it('aplica la variante en espanol', () => {
    const es = localizeEntry(protocol, 'es');
    expect(es.title).toBe('Fiebre en el adulto');
    expect(es.type === 'protocol' ? es.steps[0] : '').toBe('Paso uno');
  });

  it('no altera entradas sin variante', () => {
    const plain: Entry = { id: 'y', type: 'dictionary', title: 'Asthma', en: 'Asthma', es: 'Asma' };
    expect(localizeEntry(plain, 'es')).toBe(plain);
  });
});
