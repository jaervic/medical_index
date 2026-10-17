function Hint({ keys, label }: { keys: string[]; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
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
      <span>{label}</span>
    </span>
  );
}

export function StatusBar() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-edge px-4 py-2 text-[11px] text-muted">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <Hint keys={['↑', '↓']} label="navegar" />
        <Hint keys={['↵']} label="copiar" />
        <Hint keys={['/']} label="buscar" />
        <Hint keys={['⌘', 'K']} label="enfocar" />
      </div>
      <span className="hidden sm:inline">
        Meddex · solo reglas generales, sin datos de pacientes
      </span>
    </footer>
  );
}
