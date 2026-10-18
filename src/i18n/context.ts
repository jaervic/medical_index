import { createContext, useContext } from 'react';
import { messages, type Locale, type MessageKey } from './messages';

export type { Locale, MessageKey };

type Vars = Record<string, string | number>;

/** Formatea una plantilla con `{clave}` interpoladas. */
export function format(template: string, vars?: Vars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    key in vars ? String(vars[key]) : `{${key}}`,
  );
}

export interface I18nValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggle: () => void;
  t: (key: MessageKey, vars?: Vars) => string;
}

/** Valor por defecto en ingles: permite usar la app sin proveedor (tests). */
export const fallbackI18n: I18nValue = {
  locale: 'en',
  setLocale: () => {},
  toggle: () => {},
  t: (key, vars) => format(messages[key]?.en ?? key, vars),
};

export const I18nContext = createContext<I18nValue>(fallbackI18n);

export function useI18n(): I18nValue {
  return useContext(I18nContext);
}
