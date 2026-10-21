import { X } from 'lucide-react';
import { useRef, useState, type FormEvent } from 'react';
import { useI18n } from '@/i18n/context';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useScrollLock } from '@/hooks/useScrollLock';
import type { RouteOverride } from '@/lib/routeOverrides';
import type { ClickPathEntry } from '@/lib/types';

interface RouteOverrideEditorProps {
  entry: ClickPathEntry;
  onSave: (override: RouteOverride) => void;
  onClose: () => void;
}

/** Permite corregir los pasos/notas de una ruta integrada para tu instancia. */
export function RouteOverrideEditor({ entry, onSave, onClose }: RouteOverrideEditorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useI18n();
  useFocusTrap(ref, onClose);
  useScrollLock();

  const [path, setPath] = useState(entry.path.join('\n'));
  const [notes, setNotes] = useState(entry.notes ?? '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const steps = path
      .split('\n')
      .map((step) => step.trim())
      .filter(Boolean);
    if (steps.length === 0) {
      setError(t('route.pathRequired'));
      return;
    }
    onSave({ path: steps, notes: notes.trim() || undefined });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('route.editorTitle')}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        ref={ref}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-edge bg-panel shadow-2xl outline-none sm:rounded-2xl"
      >
        <header className="flex items-center justify-between border-b border-edge px-5 py-3.5">
          <h2 className="text-base font-semibold text-ink">{t('route.editorTitle')}</h2>
          <button
            type="button"
            aria-label={t('detail.close')}
            onClick={onClose}
            className="rounded-md p-1.5 text-muted transition hover:bg-ink/5 hover:text-ink"
          >
            <X size={18} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="space-y-4 overflow-y-auto p-5">
            <label className="block">
              <span className="text-[11px] font-semibold tracking-wide text-muted uppercase">
                {t('route.pathLabel')}
              </span>
              <span className="mt-1.5 block">
                <textarea
                  value={path}
                  onChange={(event) => setPath(event.target.value)}
                  rows={6}
                  spellCheck={false}
                  className="w-full rounded-md bg-ink/5 px-3 py-2 font-mono text-sm text-ink ring-1 ring-inset ring-edge outline-none focus-visible:ring-accent"
                />
              </span>
            </label>

            <label className="block">
              <span className="text-[11px] font-semibold tracking-wide text-muted uppercase">
                {t('route.notesLabel')}
              </span>
              <span className="mt-1.5 block">
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={3}
                  className="w-full rounded-md bg-ink/5 px-3 py-2 text-sm text-ink ring-1 ring-inset ring-edge outline-none focus-visible:ring-accent"
                />
              </span>
            </label>
          </div>

          {error && (
            <p role="alert" className="px-5 pb-2 text-xs text-rose-500">
              {error}
            </p>
          )}

          <footer className="flex items-center justify-end gap-2 border-t border-edge px-5 py-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-3 py-1.5 text-sm text-muted transition hover:text-ink"
            >
              {t('editor.cancel')}
            </button>
            <button
              type="submit"
              className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-ink transition hover:opacity-90"
            >
              {t('editor.save')}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
