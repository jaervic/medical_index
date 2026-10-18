import { Link2 } from 'lucide-react';
import { useI18n } from '@/i18n/context';
import type { Entry } from '@/lib/types';
import { TypeBadge } from './TypeBadge';

interface RelatedEntriesProps {
  entries: Entry[];
  onPick: (entry: Entry) => void;
}

export function RelatedEntries({ entries, onPick }: RelatedEntriesProps) {
  const { t } = useI18n();

  if (entries.length === 0) return null;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-edge px-4 py-2.5 text-[11px] font-semibold tracking-wide text-muted uppercase">
        <Link2 size={13} aria-hidden />
        {t('detail.related')}
      </div>
      <ul className="flex-1 space-y-0.5 overflow-y-auto p-1.5">
        {entries.map((entry) => (
          <li key={entry.id}>
            <button
              type="button"
              onClick={() => onPick(entry)}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left transition hover:bg-ink/5"
            >
              <span className="min-w-0 flex-1 truncate text-sm text-ink">{entry.title}</span>
              <TypeBadge type={entry.type} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
