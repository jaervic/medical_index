import { beforeEach, describe, expect, it } from 'vitest';
import { applyRouteOverride, loadRouteOverrides, saveRouteOverrides } from '@/lib/routeOverrides';
import type { Entry } from '@/lib/types';

const route: Entry = {
  id: 'cp-test',
  type: 'clickpath',
  title: 'Create a Referral',
  module: 'athenaOne',
  path: ['Chart', 'Referral'],
  verified: false,
};

describe('overrides de rutas', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('aplica path y notas', () => {
    const out = applyRouteOverride(route, {
      'cp-test': { path: ['Chart', 'Orders', 'Referral'], notes: 'custom' },
    });
    expect(out.type === 'clickpath' ? out.path.join(' > ') : '').toBe('Chart > Orders > Referral');
    expect(out.type === 'clickpath' ? out.notes : '').toBe('custom');
  });

  it('sin override devuelve la misma entrada', () => {
    expect(applyRouteOverride(route, {})).toBe(route);
  });

  it('no toca entradas que no son rutas', () => {
    const dict: Entry = { id: 'd', type: 'dictionary', title: 'Asthma', en: 'Asthma', es: 'Asma' };
    expect(applyRouteOverride(dict, { d: { path: ['x'] } })).toBe(dict);
  });

  it('persiste los overrides', () => {
    saveRouteOverrides({ 'cp-test': { path: ['A'] } });
    expect(loadRouteOverrides()).toEqual({ 'cp-test': { path: ['A'] } });
  });
});
