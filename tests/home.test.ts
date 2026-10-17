import { describe, expect, it } from 'vitest';
import { buildHome } from '@/lib/home';
import type { Entry } from '@/lib/types';

const entries: Entry[] = [
  { id: 'd1', type: 'dictionary', title: 'D1', en: 'D1', es: 'D1' },
  { id: 'd2', type: 'dictionary', title: 'D2', en: 'D2', es: 'D2' },
  { id: 'p1', type: 'protocol', title: 'P1', steps: ['x'] },
];

describe('buildHome', () => {
  it('con filtro de tipo oculta fijados/recientes de otro tipo', () => {
    const home = buildHome(entries, ['p1'], ['p1'], 'dictionary');
    expect(home.favorites.map((entry) => entry.id)).toEqual([]);
    expect(home.recents.map((entry) => entry.id)).toEqual([]);
    expect(home.rest.map((entry) => entry.id)).toEqual(['d1', 'd2']);
  });

  it('con "all" respeta fijados y recientes', () => {
    const home = buildHome(entries, ['d2'], ['p1'], 'all');
    expect(home.favorites.map((entry) => entry.id)).toEqual(['d2']);
    expect(home.recents.map((entry) => entry.id)).toEqual(['p1']);
    expect(home.rest.map((entry) => entry.id)).toEqual(['d1']);
  });
});
