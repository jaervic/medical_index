import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { loadLocale, saveLocale } from '@/lib/storage';
import { I18nContext, format, type I18nValue } from './context';
import { messages, type Locale, type MessageKey } from './messages';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => loadLocale());

  useEffect(() => {
    saveLocale(locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const t = useCallback(
    (key: MessageKey, vars?: Record<string, string | number>) =>
      format(messages[key]?.[locale] ?? key, vars),
    [locale],
  );

  const toggle = useCallback(() => {
    setLocale((current) => (current === 'es' ? 'en' : 'es'));
  }, []);

  const value = useMemo<I18nValue>(() => ({ locale, setLocale, toggle, t }), [locale, toggle, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
