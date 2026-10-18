import { Check } from 'lucide-react';

export function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="meddex-toast pointer-events-none fixed inset-x-0 bottom-6 z-50 mx-auto flex w-fit max-w-[90vw] items-center gap-2 rounded-full border border-edge bg-panel px-4 py-2 text-sm text-ink shadow-xl print:hidden"
    >
      <Check size={15} aria-hidden className="shrink-0 text-accent" />
      <span className="truncate">{message}</span>
    </div>
  );
}
