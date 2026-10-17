import { Star, TrendingUp } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Entry } from '@/lib/types';
import { TypeBadge } from './TypeBadge';

interface EmptyPanelProps {
  total: number;
  topUsed: Entry[];
  favorites: Entry[];
  onPick: (entry: Entry) => void;
}

function Shortcut({ keys, label }: { keys: string[]; label: string }) {
  return (
    <li className="flex items-center justify-between gap-3 py-1">
      <span className="text-xs text-muted">{label}</span>
      <span className="flex items-center gap-1">
        {keys.map((key) => (
          <kbd
            key={key}
            className="rounded border border-edge bg-ink/5 px-1.5 py-0.5 font-sans text-[10px] text-muted"
          >
            {key}
          </kbd>
        ))}
      </span>
    </li>
  );
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

export function EmptyPanel({ total, topUsed, favorites, onPick }: EmptyPanelProps) {
  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto p-5">
      <div>
        <h2 className="text-base font-semibold text-ink">¿Que necesitas?</h2>
        <p className="mt-1 text-sm text-muted">
          Escribe arriba o navega con el teclado. {total} entradas listas para consultar.
        </p>
      </div>

      <ul className="divide-y divide-edge rounded-lg border border-edge px-3 py-1.5">
        <Shortcut keys={['↑', '↓']} label="Navegar resultados" />
        <Shortcut keys={['↵']} label="Copiar el termino seleccionado" />
        <Shortcut keys={['/']} label="Enfocar el buscador" />
        <Shortcut keys={['⌘', 'K']} label="Enfocar desde cualquier lugar" />
        <Shortcut keys={['⌘', 'B']} label="Mostrar u ocultar este panel" />
      </ul>

      <MiniList
        heading="Mas usados"
        icon={<TrendingUp size={13} />}
        entries={topUsed}
        onPick={onPick}
      />

      <MiniList heading="Fijados" icon={<Star size={13} />} entries={favorites} onPick={onPick} />
    </div>
  );
}
