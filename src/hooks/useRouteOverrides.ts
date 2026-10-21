import { useCallback, useState } from 'react';
import {
  loadRouteOverrides,
  saveRouteOverrides,
  type RouteOverride,
  type RouteOverrides,
} from '@/lib/routeOverrides';

/** Overrides locales de las rutas (localStorage). */
export function useRouteOverrides() {
  const [overrides, setOverrides] = useState<RouteOverrides>(() => loadRouteOverrides());

  const setRouteOverride = useCallback((id: string, override: RouteOverride) => {
    setOverrides((prev) => {
      const next = { ...prev, [id]: override };
      saveRouteOverrides(next);
      return next;
    });
  }, []);

  const clearRouteOverride = useCallback((id: string) => {
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[id];
      saveRouteOverrides(next);
      return next;
    });
  }, []);

  return { overrides, setRouteOverride, clearRouteOverride };
}
