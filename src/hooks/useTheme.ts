import { useCallback, useEffect, useState } from 'react';
import { loadTheme, saveTheme, type Theme } from '@/lib/storage';

function applyTheme(theme: Theme, prefersDark: boolean): void {
  const dark = theme === 'dark' || (theme === 'system' && prefersDark);
  const root = document.documentElement;
  root.classList.toggle('dark', dark);
  root.style.colorScheme = dark ? 'dark' : 'light';
}

/** Tema con tres modos: oscuro, claro o segun el sistema. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => loadTheme());

  useEffect(() => {
    saveTheme(theme);
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => applyTheme(theme, media.matches);
    apply();
    if (theme !== 'system') return;
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [theme]);

  const cycle = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : current === 'light' ? 'system' : 'dark'));
  }, []);

  return { theme, cycle };
}
