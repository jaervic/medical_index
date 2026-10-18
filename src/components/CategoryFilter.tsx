import { useI18n } from '@/i18n/context';
import type { MessageKey } from '@/i18n/messages';
import type { EntryType } from '@/lib/types';

const FILTERS: Array<{ value: EntryType | 'all'; key: MessageKey }> = [
  { value: 'all', key: 'filter.all' },
  { value: 'acronym', key: 'type.acronym' },
  { value: 'dictionary', key: 'type.dictionary' },
  { value: 'clickpath', key: 'type.clickpath' },
  { value: 'protocol', key: 'type.protocol' },
];

interface CategoryFilterProps {
  value: EntryType | 'all';
  onChange: (value: EntryType | 'all') => void;
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  const { t } = useI18n();

  return (
    <div role="group" aria-label={t('search.filterGroup')} className="flex flex-wrap gap-1.5">
      {FILTERS.map((filter) => {
        const active = filter.value === value;
        return (
          <button
            key={filter.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(filter.value)}
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
              active
                ? 'bg-accent text-accent-ink'
                : 'text-muted ring-1 ring-inset ring-edge hover:text-ink'
            }`}
          >
            {t(filter.key)}
          </button>
        );
      })}
    </div>
  );
}
