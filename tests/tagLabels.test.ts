import { describe, expect, it } from 'vitest';
import { TAG_LABELS, tagForms, tagLabel, tagMatches } from '@/lib/tagLabels';

describe('etiquetas bilingues', () => {
  it('traduce la etiqueta segun el idioma', () => {
    expect(tagLabel('farmacia', 'es')).toBe('farmacia');
    expect(tagLabel('farmacia', 'en')).toBe('pharmacy');
  });

  it('devuelve la clave si no hay traduccion', () => {
    expect(tagLabel('desconocida', 'en')).toBe('desconocida');
  });

  it('todas las claves tienen es y en', () => {
    const bad = Object.entries(TAG_LABELS)
      .filter(([, value]) => !value.es.trim() || !value.en.trim())
      .map(([key]) => key);
    expect(bad).toEqual([]);
  });

  it('coincide por clave o por etiqueta, en cualquier idioma', () => {
    expect(tagMatches(['farmacia'], 'farmacia')).toBe(true);
    expect(tagMatches(['farmacia'], 'pharmacy')).toBe(true);
    expect(tagMatches(['bandera-roja'], 'red-flag')).toBe(true);
    expect(tagMatches(['farmacia'], 'urology')).toBe(false);
  });

  it('tagForms incluye las dos etiquetas', () => {
    expect(tagForms('salud-mental')).toEqual(['salud-mental', 'salud-mental', 'mental-health']);
    expect(tagForms('x')).toEqual(['x']);
  });
});
