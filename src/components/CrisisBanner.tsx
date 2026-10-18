import { Phone } from 'lucide-react';
import { useI18n } from '@/i18n/context';

/**
 * Linea de crisis, siempre a la vista: coherente con el enfoque en salud mental.
 * 988 es la linea de prevencion del suicidio y crisis de EE. UU. (24/7, es/en).
 */
export function CrisisBanner({ variant = 'box' }: { variant?: 'box' | 'row' }) {
  const { t } = useI18n();

  const style =
    variant === 'row'
      ? 'px-3 py-2 transition hover:bg-rose-500/10'
      : 'rounded-lg border border-rose-500/25 bg-rose-500/10 px-3 py-2 transition hover:bg-rose-500/20';

  return (
    <a
      href="tel:988"
      className={`flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300 ${style}`}
    >
      <Phone size={14} aria-hidden className="shrink-0" />
      <span>{t('crisis.text')}</span>
    </a>
  );
}
