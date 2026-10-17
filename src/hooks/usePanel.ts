import { useCallback, useEffect, useState } from 'react';
import { loadPanelCollapsed, savePanelCollapsed } from '@/lib/storage';

/**
 * Estado del panel de detalle: colapsable y persistido. Se alterna con el boton
 * del header o con Ctrl/Cmd+B (como un sidebar clasico).
 */
export function usePanel() {
  const [collapsed, setCollapsed] = useState<boolean>(() => loadPanelCollapsed());

  useEffect(() => {
    savePanelCollapsed(collapsed);
  }, [collapsed]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'b') {
        event.preventDefault();
        setCollapsed((current) => !current);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const toggle = useCallback(() => setCollapsed((current) => !current), []);

  return { collapsed, toggle };
}
