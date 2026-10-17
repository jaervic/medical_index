import { ENTRY_TYPE_LABEL, type EntryType } from '@/lib/types';

const FILTERS: Array<{ value: EntryType | 'all'; label: string }> = [
  { value: 'all', label: 'Todo' },
  { value: 'acronym', label: ENTRY_TYPE_LABEL.acronym },
  { value: 'dictionary', label: ENTRY_TYPE_LABEL.dictionary },
  { value: 'clickpath', label: ENTRY_TYPE_LABEL.clickpath },
  { value: 'protocol', label: ENTRY_TYPE_LABEL.protocol },
];

interface CategoryFilterProps {
  value: EntryType | 'all';
  onChange: (value: EntryType | 'all') => void;
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <div role="group" aria-label="Filtrar por categoria" className="flex flex-wrap gap-1.5">
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
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
