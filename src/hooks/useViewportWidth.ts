import { useEffect, useState } from 'react';

/** Ancho de la ventana, con reaccion a los cambios de tamano. */
export function useViewportWidth(): number {
  const [width, setWidth] = useState<number>(() =>
    typeof window === 'undefined' ? 1280 : window.innerWidth,
  );

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return width;
}
