import { describe, expect, it } from 'vitest';
import { isStaleReview, reviewAgeMonths } from '@/lib/review';
import type { Entry } from '@/lib/types';

function entry(reviewedAt?: string): Entry {
  return { id: 'x', type: 'dictionary', title: 'X', en: 'X', es: 'X', reviewedAt };
}

describe('revision de contenido', () => {
  it('calcula la antiguedad en meses', () => {
    const now = new Date('2026-10-17');
    expect(Math.round(reviewAgeMonths('2026-10-17', now) ?? -1)).toBe(0);
  });

  it('marca como vencida si supera el umbral', () => {
    const now = new Date('2026-10-17');
    expect(isStaleReview(entry('2024-01-01'), 12, now)).toBe(true);
    expect(isStaleReview(entry('2026-02-01'), 12, now)).toBe(false);
  });

  it('sin reviewedAt no esta vencida', () => {
    expect(isStaleReview(entry(undefined), 12, new Date('2026-10-17'))).toBe(false);
  });
});
