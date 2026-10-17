export function ClickPath({ path }: { path: string[] }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
      {path.map((step, index) => (
        <li key={`${step}-${index}`} className="flex items-center gap-x-1.5">
          <span className="rounded-md bg-ink/5 px-2 py-1 text-sm text-ink ring-1 ring-inset ring-edge dark:bg-white/5">
            {step}
          </span>
          {index < path.length - 1 && (
            <span aria-hidden className="text-muted">
              ›
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
