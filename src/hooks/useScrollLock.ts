import { useEffect } from 'react';

/** Bloquea el scroll del fondo mientras un dialogo esta abierto. */
export function useScrollLock(active = true): void {
  useEffect(() => {
    if (!active) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [active]);
}
