import { describe, expect, it } from 'vitest';
import { ENTRIES } from '@/data';
import { createIndex, primaryCopyText, searchEntries } from '@/lib/search';

const index = createIndex(ENTRIES);
const ids = (query: string) => searchEntries(index, query).map((result) => result.entry.id);
const top = (query: string) => ids(query)[0];

describe('busqueda fuzzy y ranking', () => {
  it('tolera errores de tecleo ("ashtma" -> asthma)', () => {
    expect(ids('ashtma')).toContain('asthma');
  });

  it('resuelve coloquialismos a terminos clinicos', () => {
    expect(ids('presion alta')).toContain('hypertension-htn');
  });

  it('prioriza el acronimo exacto', () => {
    expect(top('UTI')).toBe('acr-uti');
  });

  it('encuentra click-paths por lenguaje natural', () => {
    expect(ids('referral')).toContain('cp-referral');
  });

  it('encuentra protocolos por su tema', () => {
    expect(ids('resurtido')).toContain('proto-refill-policy');
  });

  it('genera el texto de copiado correcto por tipo', () => {
    const dictionary = ENTRIES.find((entry) => entry.id === 'hypertension-htn');
    const clickpath = ENTRIES.find((entry) => entry.id === 'cp-referral');
    expect(dictionary && primaryCopyText(dictionary)).toBe('Hypertension');
    expect(clickpath && primaryCopyText(clickpath)).toContain('Chart > Hub');
  });
});
