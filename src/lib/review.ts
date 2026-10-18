import type { Entry } from './types';

const DAYS_PER_MONTH = 30.44;

/** Antiguedad (en meses) de la ultima revision de una entrada, o null. */
export function reviewAgeMonths(reviewedAt: string | undefined, now = new Date()): number | null {
  if (!reviewedAt) return null;
  const date = new Date(reviewedAt);
  if (Number.isNaN(date.getTime())) return null;
  return (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * DAYS_PER_MONTH);
}

/** True si el contenido lleva mas de `months` meses sin revisarse. */
export function isStaleReview(entry: Entry, months = 12, now = new Date()): boolean {
  const age = reviewAgeMonths(entry.reviewedAt, now);
  return age !== null && age > months;
}
