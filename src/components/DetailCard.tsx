import { AlertTriangle, Copy, FileText, Star, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { useI18n } from '@/i18n/context';
import { isRedFlag } from '@/lib/entryFlags';
import { entryToText } from '@/lib/entryText';
import { isStaleReview } from '@/lib/review';
import { primaryCopyText } from '@/lib/search';
import type { Entry } from '@/lib/types';
import { ClickPath } from './ClickPath';
import { RelatedEntries } from './RelatedEntries';
import { TypeBadge } from './TypeBadge';

interface CopyChipProps {
  label: string;
  value: string;
  onCopy: (text: string, label?: string) => void;
}

function CopyChip({ label, value, onCopy }: CopyChipProps) {
  return (
    <button
      type="button"
      onClick={() => onCopy(value, label)}
      className="inline-flex items-center gap-1.5 rounded-md bg-ink/5 px-2 py-1 text-xs font-medium text-ink ring-1 ring-inset ring-edge transition hover:bg-accent hover:text-accent-ink hover:ring-accent"
    >
      <Copy size={12} aria-hidden />
      {label}
    </button>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="text-[11px] font-semibold tracking-wide text-muted uppercase">{label}</div>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

export interface DetailCardProps {
  entry: Entry;
  isFavorite: boolean;
  useCount: number;
  isCustom?: boolean;
  related?: Entry[];
  onToggleFavorite: (id: string) => void;
  onCopy: (text: string, label?: string) => void;
  onTagClick: (tag: string) => void;
  onKeywordClick: (keyword: string) => void;
  onPickRelated?: (entry: Entry) => void;
  onDelete?: (id: string) => void;
}

export function DetailCard({
  entry,
  isFavorite,
  useCount,
  isCustom = false,
  related = [],
  onToggleFavorite,
  onCopy,
  onTagClick,
  onKeywordClick,
  onPickRelated,
  onDelete,
}: DetailCardProps) {
  const { t } = useI18n();
  const tags = entry.tags ?? [];
  const stale = isStaleReview(entry);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex items-start justify-between gap-3 border-b border-edge px-5 py-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <TypeBadge type={entry.type} />
            {isRedFlag(entry) && (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-[11px] font-medium text-rose-600 ring-1 ring-inset ring-rose-500/25 dark:text-rose-300">
                <span aria-hidden className="size-1.5 rounded-full bg-rose-500" />
                {t('detail.redFlag')}
              </span>
            )}
            {entry.reviewedAt && (
              <span className="text-[11px] text-muted">
                {t('detail.reviewed', { date: entry.reviewedAt })}
              </span>
            )}
            {stale && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/12 px-2 py-0.5 text-[11px] font-medium text-amber-700 ring-1 ring-inset ring-amber-500/25 dark:text-amber-300">
                <AlertTriangle size={11} aria-hidden />
                {t('detail.stale')}
              </span>
            )}
            {isCustom && (
              <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[11px] font-medium text-muted ring-1 ring-inset ring-edge">
                {t('detail.custom')}
              </span>
            )}
            {useCount > 0 && (
              <span className="text-[11px] text-muted">
                · {t('detail.usedCount', { count: useCount })}
              </span>
            )}
          </div>
          <h2 className="mt-2 text-lg leading-tight font-semibold text-ink">{entry.title}</h2>
        </div>
        <button
          type="button"
          aria-label={isFavorite ? 'Unpin' : 'Pin'}
          aria-pressed={isFavorite}
          onClick={() => onToggleFavorite(entry.id)}
          className={`shrink-0 rounded-md p-2 transition ${
            isFavorite ? 'text-amber-400' : 'text-muted hover:text-amber-400'
          }`}
        >
          <Star size={17} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </header>

      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4 print:overflow-visible">
        <EntryBody entry={entry} onCopy={onCopy} />

        {tags.length > 0 && (
          <Field label={t('detail.tags')}>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onTagClick(tag)}
                  className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs text-accent ring-1 ring-inset ring-accent/25 transition hover:bg-accent/20"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </Field>
        )}

        {entry.keywords && entry.keywords.length > 0 && (
          <Field label={t('detail.searchAs')}>
            <div className="flex flex-wrap gap-1.5">
              {entry.keywords.map((keyword) => (
                <button
                  key={keyword}
                  type="button"
                  onClick={() => onKeywordClick(keyword)}
                  className="rounded-md bg-ink/5 px-2 py-0.5 text-xs text-muted ring-1 ring-inset ring-edge transition hover:text-ink"
                >
                  {keyword}
                </button>
              ))}
            </div>
          </Field>
        )}

        {onPickRelated && related.length > 0 && (
          <RelatedEntries entries={related} onPick={onPickRelated} />
        )}
      </div>

      <footer className="flex flex-wrap items-center gap-2 border-t border-edge px-5 py-3">
        <button
          type="button"
          onClick={() => onCopy(primaryCopyText(entry), t('copy.done'))}
          className="inline-flex items-center gap-2 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-ink transition hover:opacity-90"
        >
          <Copy size={14} aria-hidden />
          {t('detail.copy')}
        </button>
        <button
          type="button"
          onClick={() => onCopy(entryToText(entry), t('copy.sheet'))}
          className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-ink ring-1 ring-inset ring-edge transition hover:bg-ink/5"
        >
          <FileText size={14} aria-hidden />
          {t('detail.copySheet')}
        </button>
        {isCustom && onDelete && (
          <button
            type="button"
            onClick={() => onDelete(entry.id)}
            className="ml-auto inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-rose-600 ring-1 ring-inset ring-rose-500/25 transition hover:bg-rose-500/10 dark:text-rose-300"
          >
            <Trash2 size={14} aria-hidden />
            {t('detail.delete')}
          </button>
        )}
      </footer>
    </div>
  );
}

function EntryBody({
  entry,
  onCopy,
}: {
  entry: Entry;
  onCopy: (text: string, label?: string) => void;
}) {
  const { t } = useI18n();

  switch (entry.type) {
    case 'dictionary':
      return (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-edge bg-ink/[0.02] p-3">
              <div className="text-[11px] font-semibold text-muted uppercase">
                {t('detail.english')}
              </div>
              <div className="mt-1 text-base font-medium text-ink">{entry.en}</div>
              {entry.pronunciation && (
                <div className="mt-1 text-xs text-muted">
                  {t('detail.pronounces')}{' '}
                  <span className="font-medium text-ink">{entry.pronunciation}</span>
                </div>
              )}
              <div className="mt-2">
                <CopyChip label={t('detail.copyEn')} value={entry.en} onCopy={onCopy} />
              </div>
            </div>
            <div className="rounded-lg border border-edge bg-ink/[0.02] p-3">
              <div className="text-[11px] font-semibold text-muted uppercase">
                {t('detail.spanish')}
              </div>
              <div className="mt-1 text-base font-medium text-ink">{entry.es}</div>
              <div className="mt-2">
                <CopyChip label={t('detail.copyEs')} value={entry.es} onCopy={onCopy} />
              </div>
            </div>
          </div>

          {entry.colloquial && entry.colloquial.length > 0 && (
            <Field label={t('detail.patientSays')}>
              <div className="flex flex-wrap gap-1.5">
                {entry.colloquial.map((phrase) => (
                  <button
                    key={phrase}
                    type="button"
                    onClick={() => onCopy(phrase, t('copy.done'))}
                    className="rounded-full bg-amber-500/12 px-2.5 py-1 text-xs text-amber-700 ring-1 ring-inset ring-amber-500/25 transition hover:bg-amber-500/20 dark:text-amber-300"
                  >
                    “{phrase}”
                  </button>
                ))}
              </div>
            </Field>
          )}

          {entry.note && <Note>{entry.note}</Note>}
        </>
      );

    case 'clickpath':
      return (
        <>
          <Field label={t('detail.routeIn', { module: entry.module })}>
            <ClickPath path={entry.path} />
          </Field>
          <CopyChip label={t('detail.copyRoute')} value={entry.path.join(' > ')} onCopy={onCopy} />
          {entry.notes && <Note>{entry.notes}</Note>}
        </>
      );

    case 'protocol':
      return (
        <>
          {entry.enTitle && (
            <Field label={t('detail.english')}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-base font-medium text-ink">{entry.enTitle}</span>
                <CopyChip label={t('detail.copyEn')} value={entry.enTitle} onCopy={onCopy} />
              </div>
              {entry.pronunciation && (
                <div className="mt-1 text-xs text-muted">
                  {t('detail.pronounces')}{' '}
                  <span className="font-medium text-ink">{entry.pronunciation}</span>
                </div>
              )}
            </Field>
          )}
          {entry.appliesTo && (
            <Field label={t('detail.appliesWhen')}>
              <p className="text-sm text-ink">{entry.appliesTo}</p>
            </Field>
          )}
          <Field label={t('detail.steps')}>
            <ol className="space-y-2">
              {entry.steps.map((step, index) => (
                <li key={step} className="flex gap-3 text-sm text-ink">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[11px] font-semibold text-accent">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </Field>
          <CopyChip
            label={t('detail.copySteps')}
            value={entry.steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}
            onCopy={onCopy}
          />
          {entry.warnings && entry.warnings.length > 0 && (
            <Field label={t('detail.warnings')}>
              <ul className="space-y-1.5">
                {entry.warnings.map((warning) => (
                  <li key={warning} className="flex gap-2 text-sm text-rose-600 dark:text-rose-300">
                    <span aria-hidden>•</span>
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </Field>
          )}
        </>
      );

    case 'acronym':
      return (
        <>
          <Field label={t('detail.meaning')}>
            <div className="flex items-center gap-2">
              <span className="text-base font-medium text-ink">{entry.expansion}</span>
              <CopyChip
                label={t('detail.copy')}
                value={`${entry.title} — ${entry.expansion}`}
                onCopy={onCopy}
              />
            </div>
          </Field>
          {entry.translation && (
            <Field label={t('detail.translation')}>
              <p className="text-sm text-ink">{entry.translation}</p>
            </Field>
          )}
          {entry.note && <Note>{entry.note}</Note>}
        </>
      );
  }
}

function Note({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-edge bg-ink/[0.02] p-3 text-sm text-muted">
      {children}
    </div>
  );
}
