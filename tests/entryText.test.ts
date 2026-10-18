import { describe, expect, it } from 'vitest';
import { messages } from '@/i18n/messages';
import { entryToText } from '@/lib/entryText';
import type { Entry } from '@/lib/types';

const es = (key: keyof typeof messages) => messages[key].es;

describe('entryToText', () => {
  it('formatea un termino de diccionario', () => {
    const entry: Entry = {
      id: 'x',
      type: 'dictionary',
      title: 'Asthma',
      en: 'Asthma',
      es: 'Asma',
      pronunciation: 'AZ-muh',
    };
    const text = entryToText(entry, es);
    expect(text).toContain('EN: Asthma');
    expect(text).toContain('Pronunciacion: AZ-muh');
    expect(text).toContain('ES: Asma');
  });

  it('numera los pasos de un protocolo', () => {
    const entry: Entry = {
      id: 'p',
      type: 'protocol',
      title: 'Protocolo',
      steps: ['uno', 'dos'],
    };
    const text = entryToText(entry, es);
    expect(text).toContain('1. uno');
    expect(text).toContain('2. dos');
  });

  it('incluye la ruta de un clickpath', () => {
    const entry: Entry = {
      id: 'c',
      type: 'clickpath',
      title: 'Referral',
      module: 'eCW',
      path: ['Chart', 'Hub', 'Referrals'],
    };
    expect(entryToText(entry, es)).toContain('Chart > Hub > Referrals');
  });
});
