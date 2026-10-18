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

const clickpath: Entry = {
  id: 'cp',
  type: 'clickpath',
  title: 'Create a Referral',
  module: 'eCW',
  path: ['Chart', 'Select Specialty'],
  i18n: { es: { title: 'Crear un Referral', path: ['Chart', 'Seleccionar Especialidad'] } },
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

  it('localiza el path de una ruta de eCW', () => {
    const en = localizeEntry(clickpath, 'en');
    const es = localizeEntry(clickpath, 'es');
    expect(en.type === 'clickpath' ? en.path[1] : '').toBe('Select Specialty');
    expect(es.type === 'clickpath' ? es.path[1] : '').toBe('Seleccionar Especialidad');
  });

  it('no altera entradas sin variante', () => {
    const plain: Entry = { id: 'y', type: 'dictionary', title: 'Asthma', en: 'Asthma', es: 'Asma' };
    expect(localizeEntry(plain, 'es')).toBe(plain);
  });
});
