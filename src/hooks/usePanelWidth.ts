import { useCallback, useEffect, useState } from 'react';
import { loadPanelWidth, savePanelWidth } from '@/lib/storage';

export const PANEL_MIN = 360;
export const PANEL_MAX = 760;
export const PANEL_DEFAULT = 480;

/** Mantiene el ancho del panel dentro de los limites permitidos. */
export function clampPanelWidth(width: number): number {
  if (!Number.isFinite(width)) return PANEL_DEFAULT;
  return Math.min(PANEL_MAX, Math.max(PANEL_MIN, Math.round(width)));
}

/** Ancho del panel de detalle, persistido en localStorage. */
export function usePanelWidth() {
  const [width, setWidthState] = useState<number>(() => clampPanelWidth(loadPanelWidth()));

  useEffect(() => {
    savePanelWidth(width);
  }, [width]);

  const setWidth = useCallback((next: number) => setWidthState(clampPanelWidth(next)), []);
  const reset = useCallback(() => setWidthState(PANEL_DEFAULT), []);

  return { width, setWidth, reset };
}
