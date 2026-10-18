import { X } from 'lucide-react';
import { useMemo, useRef } from 'react';
import { useI18n } from '@/i18n/context';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useScrollLock } from '@/hooks/useScrollLock';
import { findRelated } from '@/lib/related';
import type { Entry } from '@/lib/types';
import { CrisisBanner } from './CrisisBanner';
import { DetailCard } from './DetailCard';

interface DetailOverlayProps {
  entry: Entry;
  entries: Entry[];
  isFavorite: boolean;
  useCount: number;
  isCustom?: boolean;
  onToggleFavorite: (id: string) => void;
  onCopy: (text: string, label?: string) => void;
  onTagClick: (tag: string) => void;
  onKeywordClick: (keyword: string) => void;
  onPick: (entry: Entry) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

/** Tarjeta a pantalla completa para cuando no hay panel lateral (movil o colapsado). */
export function DetailOverlay({
  entry,
  entries,
  isFavorite,
  useCount,
  isCustom = false,
  onToggleFavorite,
  onCopy,
  onTagClick,
  onKeywordClick,
  onPick,
  onDelete,
  onClose,
}: DetailOverlayProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useI18n();
  useFocusTrap(ref, onClose);
  useScrollLock();

  const related = useMemo(
    () => findRelated(entry, entries, 5).map((item) => item.entry),
    [entry, entries],
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={entry.title}
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        ref={ref}
        tabIndex={-1}
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-edge bg-panel shadow-2xl outline-none sm:max-h-[85vh] sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative flex min-h-0 flex-1 flex-col">
          <button
            type="button"
            aria-label={t('detail.close')}
            onClick={onClose}
            className="absolute top-3 right-3 z-10 rounded-md bg-panel/80 p-1.5 text-muted transition hover:text-ink"
          >
            <X size={18} />
          </button>
          <DetailCard
            entry={entry}
            isFavorite={isFavorite}
            useCount={useCount}
            isCustom={isCustom}
            related={related}
            onToggleFavorite={onToggleFavorite}
            onCopy={onCopy}
            onTagClick={onTagClick}
            onKeywordClick={onKeywordClick}
            onPickRelated={onPick}
            onDelete={onDelete}
          />
        </div>

        <div className="shrink-0 border-t border-edge p-3">
          <CrisisBanner />
        </div>
      </div>
    </div>
  );
}
