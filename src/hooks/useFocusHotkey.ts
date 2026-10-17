import { useEffect, type RefObject } from 'react';

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
}

/**
 * Enfoca el buscador desde cualquier parte con Ctrl/Cmd+K, o con "/" cuando no
 * se esta escribiendo. Nota: una web no puede registrar un atajo global del SO;
 * para eso se instala como PWA en su propia ventana.
 */
export function useFocusHotkey(ref: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isModK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      const isSlash = event.key === '/' && !isTypingTarget(event.target);

      if (isModK || isSlash) {
        event.preventDefault();
        ref.current?.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [ref]);
}
