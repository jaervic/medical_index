import { beforeEach, describe, expect, it } from 'vitest';
import { PANEL_DEFAULT, PANEL_MAX, PANEL_MIN, clampPanelWidth } from '@/hooks/usePanelWidth';
import { loadPanelWidth, savePanelWidth } from '@/lib/storage';

describe('ancho del panel', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('respeta los limites', () => {
    expect(clampPanelWidth(100)).toBe(PANEL_MIN);
    expect(clampPanelWidth(5000)).toBe(PANEL_MAX);
    expect(clampPanelWidth(500)).toBe(500);
    expect(clampPanelWidth(Number.NaN)).toBe(PANEL_DEFAULT);
  });

  it('persiste el ancho elegido', () => {
    savePanelWidth(620);
    expect(loadPanelWidth()).toBe(620);
  });
});
