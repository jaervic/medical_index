import { useCallback, useState } from 'react';
import {
  bumpFrecency,
  frecencyValue,
  loadFavorites,
  loadFrecency,
  loadRecents,
  pushRecent,
  saveFavorites,
  saveFrecency,
  saveRecents,
  type FrecencyMap,
} from '@/lib/storage';

/**
 * Personalizacion local: fijados, recientes y frecency. Sin backend ni cuentas;
 * todo vive en localStorage y es exclusivo del usuario.
 */
export function useUsage() {
  const [favorites, setFavorites] = useState<string[]>(() => loadFavorites());
  const [recents, setRecents] = useState<string[]>(() => loadRecents());
  const [frecencyMap, setFrecencyMap] = useState<FrecencyMap>(() => loadFrecency());

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [id, ...prev];
      saveFavorites(next);
      return next;
    });
  }, []);

  const registerUse = useCallback((id: string) => {
    setRecents((prev) => {
      const next = pushRecent(prev, id);
      saveRecents(next);
      return next;
    });
    setFrecencyMap((prev) => {
      const next = bumpFrecency(prev, id);
      saveFrecency(next);
      return next;
    });
  }, []);

  const frecency = useCallback((id: string) => frecencyValue(frecencyMap[id]), [frecencyMap]);

  return { favorites, recents, frecencyMap, frecency, toggleFavorite, registerUse };
}
