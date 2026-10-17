import { useCallback, useRef, useState } from 'react';

/** Copia al portapapeles y expone un mensaje efimero para el toast. */
export function useCopy() {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const copy = useCallback(async (text: string, label = 'Copiado') => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* sin permisos de portapapeles: aun mostramos el toast con el valor */
    }
    const preview = text.length > 60 ? `${text.slice(0, 57)}...` : text;
    setMessage(`${label}: ${preview}`);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMessage(null), 1900);
  }, []);

  return { message, copy };
}
