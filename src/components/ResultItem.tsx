import { Command } from 'cmdk';
import { BookOpen, LetterText, ListChecks, MousePointerClick, Star } from 'lucide-react';
import type { Entry } from '@/lib/types';
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
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelect: (entry: Entry) => void;
}

export function ResultItem({ entry, isFavorite, onToggleFavorite, onSelect }: ResultItemProps) {
  const Icon = ICONS[entry.type];

  return (
    <Command.Item
      value={entry.id}
      onSelect={() => onSelect(entry)}
      className="group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 data-[selected=true]:bg-ink/[0.06] dark:data-[selected=true]:bg-white/[0.07]"
    >
      <span className="mt-0.5 shrink-0 text-muted group-data-[selected=true]:text-accent">
        <Icon size={17} strokeWidth={2} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-ink">{entry.title}</span>
          <TypeBadge type={entry.type} />
        </span>
        <span className="mt-0.5 block truncate text-xs text-muted">{subtitle(entry)}</span>
      </span>

      <button
        type="button"
        aria-label={isFavorite ? 'Quitar de fijados' : 'Fijar'}
        aria-pressed={isFavorite}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation();
          onToggleFavorite(entry.id);
        }}
        className={`shrink-0 rounded-md p-1.5 transition ${
          isFavorite
            ? 'text-amber-400'
            : 'text-muted/60 opacity-0 hover:text-amber-400 group-hover:opacity-100'
        }`}
      >
        <Star size={15} fill={isFavorite ? 'currentColor' : 'none'} />
      </button>
    </Command.Item>
  );
}
