import { X } from 'lucide-react';
import { useRef } from 'react';
import { useI18n } from '@/i18n/context';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useModifierKey } from '@/hooks/useModifierKey';
import { useScrollLock } from '@/hooks/useScrollLock';
import { DataControls } from './DataControls';
import { ShortcutList } from './ShortcutList';

/** Ayuda de atajos de teclado y gestion de datos personales. Invocable con "?". */
export function HelpOverlay({
  onClose,
  onImported,
}: {
  onClose: () => void;
  onImported: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const modifier = useModifierKey();
  const { t } = useI18n();
  useFocusTrap(ref, onClose);
  useScrollLock();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('help.title')}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        ref={ref}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl border border-edge bg-panel shadow-2xl outline-none sm:rounded-2xl"
      >
        <header className="flex items-center justify-between border-b border-edge px-5 py-3.5">
          <h2 className="text-base font-semibold text-ink">{t('help.title')}</h2>
          <button
            type="button"
            aria-label={t('detail.close')}
            onClick={onClose}
            className="rounded-md p-1.5 text-muted transition hover:bg-ink/5 hover:text-ink"
          >
            <X size={18} />
          </button>
        </header>
        <div className="space-y-5 overflow-y-auto p-5">
          <section>
            <h3 className="mb-2 text-[11px] font-semibold tracking-wide text-muted uppercase">
              {t('help.shortcuts')}
            </h3>
            <ShortcutList modifier={modifier} />
          </section>
          <section>
            <h3 className="text-[11px] font-semibold tracking-wide text-muted uppercase">
              {t('help.data')}
            </h3>
            <p className="mt-1 mb-2 text-xs text-muted">{t('help.dataDesc')}</p>
            <DataControls onImported={onImported} />
          </section>
        </div>
      </div>
    </div>
  );
}
