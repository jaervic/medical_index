import { History, Star, TrendingUp } from 'lucide-react';
import type { ReactNode } from 'react';
import { useI18n } from '@/i18n/context';
import { useModifierKey } from '@/hooks/useModifierKey';
import type { Entry } from '@/lib/types';
import { ShortcutList } from './ShortcutList';
import { TypeBadge } from './TypeBadge';

interface EmptyPanelProps {
  total: number;
  topUsed: Entry[];
  favorites: Entry[];
  queries: string[];
  onPick: (entry: Entry) => void;
  onPickQuery: (query: string) => void;
}

function MiniList({
  heading,
  icon,
  entries,
  onPick,
}: {
  heading: string;
  icon: ReactNode;
  entries: Entry[];
  onPick: (entry: Entry) => void;
}) {
  if (entries.length === 0) return null;
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-muted uppercase">
        {icon}
        {heading}
      </div>
      <ul className="mt-2 space-y-0.5">
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

export function EmptyPanel({
  total,
  topUsed,
  favorites,
  queries,
  onPick,
  onPickQuery,
}: EmptyPanelProps) {
  const modifier = useModifierKey();
  const { t } = useI18n();

  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto p-5">
      <div>
        <h2 className="text-base font-semibold text-ink">{t('empty.title')}</h2>
        <p className="mt-1 text-sm text-muted">{t('empty.subtitle', { total })}</p>
      </div>

      {queries.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-muted uppercase">
            <History size={13} aria-hidden />
            {t('empty.recentQueries')}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {queries.map((query) => (
              <button
                key={query}
                type="button"
                onClick={() => onPickQuery(query)}
                className="rounded-full bg-ink/5 px-2.5 py-1 text-xs text-muted ring-1 ring-inset ring-edge transition hover:text-ink"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      )}

      <ShortcutList modifier={modifier} />

      <MiniList
        heading={t('empty.topUsed')}
        icon={<TrendingUp size={13} aria-hidden />}
        entries={topUsed}
        onPick={onPick}
      />

      <MiniList
        heading={t('empty.favorites')}
        icon={<Star size={13} aria-hidden />}
        entries={favorites}
        onPick={onPick}
      />
    </div>
  );
}
