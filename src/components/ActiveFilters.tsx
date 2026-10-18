import { X } from 'lucide-react';
import { useI18n } from '@/i18n/context';
import type { EntryType } from '@/lib/types';

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  const { t } = useI18n();
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-xs text-accent ring-1 ring-inset ring-accent/25 transition hover:bg-accent/20"
    >
      {label}
      <X size={12} aria-hidden />
      <span className="sr-only">{t('filters.remove')}</span>
    </button>
  );
}

interface ActiveFiltersProps {
  type: EntryType | null;
  tags: string[];
  onRemoveType: () => void;
  onRemoveTag: (tag: string) => void;
}

export function ActiveFilters({ type, tags, onRemoveType, onRemoveTag }: ActiveFiltersProps) {
  const { t } = useI18n();

  if (!type && tags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {type && (
        <Chip label={t('filters.type', { label: t(`type.${type}`) })} onRemove={onRemoveType} />
      )}
      {tags.map((tag) => (
        <Chip key={tag} label={`#${tag}`} onRemove={() => onRemoveTag(tag)} />
      ))}
    </div>
  );
}
