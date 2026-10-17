import { shortcuts, type Modifier } from '@/lib/shortcuts';

export function ShortcutList({ modifier }: { modifier: Modifier }) {
  return (
    <ul className="divide-y divide-edge rounded-lg border border-edge px-3 py-1.5">
      {shortcuts(modifier).map((shortcut) => (
        <li key={shortcut.label} className="flex items-center justify-between gap-3 py-1">
          <span className="text-xs text-muted">{shortcut.label}</span>
          <span className="flex items-center gap-1">
            {shortcut.keys.map((key) => (
              <kbd
                key={key}
                className="rounded border border-edge bg-ink/5 px-1.5 py-0.5 font-sans text-[10px] text-muted"
              >
                {key}
              </kbd>
            ))}
          </span>
        </li>
      ))}
    </ul>
  );
}
