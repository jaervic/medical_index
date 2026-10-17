import { X } from 'lucide-react';
import { useRef } from 'react';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useModifierKey } from '@/hooks/useModifierKey';
import { useScrollLock } from '@/hooks/useScrollLock';
import { ShortcutList } from './ShortcutList';

/** Ayuda de atajos de teclado, invocable con "?". */
export function HelpOverlay({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const modifier = useModifierKey();
  useFocusTrap(ref, onClose);
  useScrollLock();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Atajos de teclado"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        ref={ref}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md overflow-hidden rounded-t-2xl border border-edge bg-panel shadow-2xl outline-none sm:rounded-2xl"
      >
        <header className="flex items-center justify-between border-b border-edge px-5 py-3.5">
          <h2 className="text-base font-semibold text-ink">Atajos de teclado</h2>
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="rounded-md p-1.5 text-muted transition hover:bg-ink/5 hover:text-ink"
          >
            <X size={18} />
          </button>
        </header>
        <div className="p-5">
          <ShortcutList modifier={modifier} />
        </div>
      </div>
    </div>
  );
}
