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

  it('resuelve coloquialismos nuevos al termino clinico', () => {
    expect(ids('me arde al orinar')).toContain('dysuria');
    expect(ids('azucar alta')).toContain('hyperglycemia');
    expect(ids('nariz tapada')).toContain('nasal-congestion');
  });

  it('encuentra acronimos clinicos por sus siglas', () => {
    expect(top('CBC')).toBe('acr-cbc');
    expect(ids('AWV')).toContain('acr-awv');
  });

  it('encuentra contenido de flujo administrativo', () => {
    expect(ids('prior auth')).toEqual(expect.arrayContaining(['proto-prior-auth']));
  });

  it('encuentra escalas de salud mental por sus siglas', () => {
    expect(top('PHQ-9')).toBe('acr-phq9');
    expect(top('C-SSRS')).toBe('acr-cssrs');
    expect(top('AUDIT-C')).toBe('acr-auditc');
    expect(top('988')).toBe('acr-988');
  });

  it('resuelve expresiones coloquiales de salud mental', () => {
    expect(ids('ya no quiero vivir')).toContain('suicidal-ideation');
    expect(ids('escucho voces')).toContain('psychosis');
    expect(ids('me siento solo')).toContain('loneliness');
    expect(ids('me tiemblo cuando no tomo')).toContain('alcohol-withdrawal');
  });

  it('activa protocolos criticos de crisis', () => {
    expect(ids('riesgo suicida')).toContain('proto-suicide-risk');
    expect(ids('violencia de pareja')).toContain('proto-ipv-screening');
  });

  it('genera el texto de copiado correcto por tipo', () => {
    const dictionary = ENTRIES.find((entry) => entry.id === 'hypertension-htn');
    const clickpath = ENTRIES.find((entry) => entry.id === 'cp-referral');
    expect(dictionary && primaryCopyText(dictionary)).toBe('Hypertension');
    expect(clickpath && primaryCopyText(clickpath)).toContain('Chart > Create Order Group');
  });
});
