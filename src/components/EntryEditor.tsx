import { X } from 'lucide-react';
import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react';
import { useI18n } from '@/i18n/context';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useScrollLock } from '@/hooks/useScrollLock';
import { parseCustomEntry, slugId } from '@/lib/customEntries';
import type { Entry, EntryType } from '@/lib/types';

const TYPES: EntryType[] = ['dictionary', 'acronym', 'clickpath', 'protocol'];

const EMPTY = {
  title: '',
  en: '',
  es: '',
  pronunciation: '',
  colloquial: '',
  expansion: '',
  translation: '',
  module: 'athenaOne',
  path: '',
  appliesTo: '',
  steps: '',
  warnings: '',
  note: '',
  keywords: '',
  tags: '',
};

function lines(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function csv(value: string): string[] | undefined {
  const items = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  return items.length > 0 ? items : undefined;
}

interface EntryEditorProps {
  onSave: (entry: Entry) => void;
  onClose: () => void;
}

/** Formulario para crear una entrada propia. Valida con el mismo esquema Zod. */
export function EntryEditor({ onSave, onClose }: EntryEditorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useI18n();
  useFocusTrap(ref, onClose);
  useScrollLock();

  const [type, setType] = useState<EntryType>('dictionary');
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState<string | null>(null);

  const set =
    (key: keyof typeof EMPTY) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((current) => ({ ...current, [key]: event.target.value }));

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const title = form.title.trim();
    if (title.length === 0) {
      setError(t('editor.required'));
      return;
    }

    const base = {
      id: slugId(title),
      title,
      keywords: csv(form.keywords),
      tags: csv(form.tags),
      reviewedAt: new Date().toISOString().slice(0, 10),
    };

    let candidate: unknown;
    switch (type) {
      case 'dictionary':
        candidate = {
          ...base,
          type,
          en: form.en.trim() || title,
          es: form.es.trim() || title,
          pronunciation: form.pronunciation.trim() || undefined,
          colloquial: csv(form.colloquial),
          note: form.note.trim() || undefined,
        };
        break;
      case 'acronym':
        candidate = {
          ...base,
          type,
          expansion: form.expansion.trim() || title,
          translation: form.translation.trim() || undefined,
          note: form.note.trim() || undefined,
        };
        break;
      case 'clickpath':
        candidate = {
          ...base,
          type,
          module: form.module.trim() || 'athenaOne',
          path: lines(form.path),
          notes: form.note.trim() || undefined,
        };
        break;
      case 'protocol':
        candidate = {
          ...base,
          type,
          pronunciation: form.pronunciation.trim() || undefined,
          appliesTo: form.appliesTo.trim() || undefined,
          steps: lines(form.steps),
          warnings: lines(form.warnings).length > 0 ? lines(form.warnings) : undefined,
        };
        break;
    }

    const result = parseCustomEntry(candidate);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onSave(result.entry);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('editor.title')}
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
          <h2 className="text-base font-semibold text-ink">{t('editor.title')}</h2>
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
            <Field label={t('editor.typeField')}>
              <select
                value={type}
                onChange={(event) => setType(event.target.value as EntryType)}
                className="w-full rounded-md bg-ink/5 px-3 py-2 text-sm text-ink ring-1 ring-inset ring-edge"
              >
                {TYPES.map((value) => (
                  <option key={value} value={value}>
                    {t(`type.${value}`)}
                  </option>
                ))}
              </select>
            </Field>

            <Field label={t('editor.titleField')}>
              <Input value={form.title} onChange={set('title')} placeholder="Migraine" />
            </Field>

            {type === 'dictionary' && (
              <>
                <Field label={t('detail.english')}>
                  <Input value={form.en} onChange={set('en')} placeholder="Migraine" />
                </Field>
                <Field label={t('detail.spanish')}>
                  <Input value={form.es} onChange={set('es')} placeholder={t('ph.en')} />
                </Field>
                <Field label={t('editor.pronunciation')}>
                  <Input
                    value={form.pronunciation}
                    onChange={set('pronunciation')}
                    placeholder="MY-grayn"
                  />
                </Field>
                <Field label={t('editor.colloquial')}>
                  <Input
                    value={form.colloquial}
                    onChange={set('colloquial')}
                    placeholder={t('ph.colloquial')}
                  />
                </Field>
              </>
            )}

            {type === 'acronym' && (
              <>
                <Field label={t('editor.expansion')}>
                  <Input value={form.expansion} onChange={set('expansion')} placeholder="UTI" />
                </Field>
                <Field label={t('editor.translation')}>
                  <Input
                    value={form.translation}
                    onChange={set('translation')}
                    placeholder={t('ph.translation')}
                  />
                </Field>
              </>
            )}

            {type === 'clickpath' && (
              <>
                <Field label={t('editor.module')}>
                  <Input value={form.module} onChange={set('module')} placeholder="athenaOne" />
                </Field>
                <Field label={t('editor.path')}>
                  <Textarea
                    value={form.path}
                    onChange={set('path')}
                    placeholder={'Chart\nHub\nReferrals'}
                  />
                </Field>
              </>
            )}

            {type === 'protocol' && (
              <>
                <Field label={t('editor.pronunciation')}>
                  <Input
                    value={form.pronunciation}
                    onChange={set('pronunciation')}
                    placeholder="MY-grayn TRY-ij"
                  />
                </Field>
                <Field label={t('detail.appliesWhen')}>
                  <Input
                    value={form.appliesTo}
                    onChange={set('appliesTo')}
                    placeholder={t('ph.appliesTo')}
                  />
                </Field>
                <Field label={t('editor.steps')}>
                  <Textarea
                    value={form.steps}
                    onChange={set('steps')}
                    placeholder={t('ph.steps')}
                  />
                </Field>
                <Field label={t('editor.warnings')}>
                  <Textarea
                    value={form.warnings}
                    onChange={set('warnings')}
                    placeholder={t('ph.warnings')}
                  />
                </Field>
              </>
            )}

            <Field label={t('editor.note')}>
              <Textarea value={form.note} onChange={set('note')} />
            </Field>

            <Field label={t('editor.keywords')}>
              <Input
                value={form.keywords}
                onChange={set('keywords')}
                placeholder={t('ph.keywords')}
              />
            </Field>
            <Field label={t('editor.tags')}>
              <Input value={form.tags} onChange={set('tags')} placeholder={t('ph.tags')} />
            </Field>
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

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold tracking-wide text-muted uppercase">{label}</span>
      <span className="mt-1.5 block">{children}</span>
    </label>
  );
}

function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-md bg-ink/5 px-3 py-2 text-sm text-ink ring-1 ring-inset ring-edge outline-none focus-visible:ring-accent"
    />
  );
}

function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      rows={3}
      className="w-full rounded-md bg-ink/5 px-3 py-2 text-sm text-ink ring-1 ring-inset ring-edge outline-none focus-visible:ring-accent"
    />
  );
}
