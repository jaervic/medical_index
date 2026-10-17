import { describe, expect, it } from 'vitest';
import { highlightSegments } from '@/lib/highlight';

describe('highlightSegments', () => {
  it('marca la coincidencia', () => {
    const segments = highlightSegments('Hypertension', 'ten');
    expect(segments.filter((segment) => segment.match).map((segment) => segment.text)).toEqual([
      'ten',
    ]);
  });

  it('es insensible a mayusculas', () => {
    expect(highlightSegments('Asthma', 'ASTH').some((segment) => segment.match)).toBe(true);
  });

  it('ignora tokens de menos de dos letras', () => {
    expect(highlightSegments('Asthma', 'a')).toEqual([{ text: 'Asthma', match: false }]);
  });

  it('no marca nada si no hay coincidencia', () => {
    expect(highlightSegments('Asthma', 'zzz')).toEqual([{ text: 'Asthma', match: false }]);
  });

  it('reconstruye el texto original', () => {
    const text = 'Chart › Hub › Referrals';
    const segments = highlightSegments(text, 'hub');
    expect(segments.map((segment) => segment.text).join('')).toBe(text);
  });
});
