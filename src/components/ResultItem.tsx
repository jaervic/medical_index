import { Command } from 'cmdk';
import { BookOpen, LetterText, ListChecks, MousePointerClick } from 'lucide-react';
import { isRedFlag } from '@/lib/entryFlags';
import type { Entry } from '@/lib/types';
import { Highlight } from './Highlight';
import { TypeBadge } from './TypeBadge';

const ICONS = {
  dictionary: BookOpen,
  clickpath: MousePointerClick,
  protocol: ListChecks,
  acronym: LetterText,
} as const;

function subtitle(entry: Entry): string {
  switch (entry.type) {
    case 'dictionary':
      return `${entry.en} · ${entry.es}`;
    case 'clickpath':
      return entry.path.join(' › ');
    case 'protocol':
      return entry.appliesTo ?? entry.steps[0] ?? '';
    case 'acronym':
      return entry.expansion;
  }
}

interface ResultItemProps {
  entry: Entry;
  query: string;
  onSelect: (entry: Entry) => void;
}

export function ResultItem({ entry, query, onSelect }: ResultItemProps) {
  const Icon = ICONS[entry.type];

  return (
    <Command.Item
      value={entry.id}
      onSelect={() => onSelect(entry)}
      className="group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 data-[selected=true]:bg-ink/[0.06] dark:data-[selected=true]:bg-white/[0.07]"
    >
      <span
        aria-hidden
        className="mt-0.5 shrink-0 text-muted group-data-[selected=true]:text-accent"
      >
        <Icon size={17} strokeWidth={2} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          {isRedFlag(entry) && (
            <span
              aria-hidden
              title="Bandera roja"
              className="size-1.5 shrink-0 rounded-full bg-rose-500"
            />
          )}
          <span className="truncate text-sm font-medium text-ink">
            <Highlight text={entry.title} query={query} />
          </span>
          <TypeBadge type={entry.type} />
        </span>
        <span className="mt-0.5 block truncate text-xs text-muted">
          <Highlight text={subtitle(entry)} query={query} />
        </span>
      </span>
    </Command.Item>
  );
}
