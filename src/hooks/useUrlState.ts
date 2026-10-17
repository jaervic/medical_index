import { useEffect } from 'react';
import type { EntryType } from '@/lib/types';

/**
 * Sincroniza el estado relevante con la URL (`?q=`, `?type=`, `#id`) usando
 * replaceState, para que refrescar o compartir un enlace conserve el contexto.
 */
export function useUrlState(q: string, type: EntryType | 'all', id: string | null): void {
  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (type !== 'all') params.set('type', type);
    const search = params.toString();
    const hash = id ? `#${id}` : '';
    const url = `${window.location.pathname}${search ? `?${search}` : ''}${hash}`;
    window.history.replaceState(null, '', url);
  }, [q, type, id]);
}
