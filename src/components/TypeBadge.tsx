import { useI18n } from '@/i18n/context';
import type { EntryType } from '@/lib/types';

const STYLES: Record<EntryType, string> = {
  dictionary: 'bg-sky-500/12 text-sky-600 dark:text-sky-300 ring-sky-500/25',
  clickpath: 'bg-violet-500/12 text-violet-600 dark:text-violet-300 ring-violet-500/25',
  protocol: 'bg-amber-500/12 text-amber-600 dark:text-amber-300 ring-amber-500/25',
  acronym: 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-300 ring-emerald-500/25',
};

export function TypeBadge({ type }: { type: EntryType }) {
  const { t } = useI18n();

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${STYLES[type]}`}
    >
      {t(`type.${type}`)}
    </span>
  );
}
