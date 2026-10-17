import { Phone } from 'lucide-react';

/**
 * Linea de crisis, siempre a la vista: coherente con el enfoque en salud mental.
 * 988 es la linea de prevencion del suicidio y crisis de EE. UU. (24/7, es/en).
 */
export function CrisisBanner() {
  return (
    <a
      href="tel:988"
      className="flex items-center gap-2 rounded-lg border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-xs text-rose-700 transition hover:bg-rose-500/20 dark:text-rose-300"
    >
      <Phone size={14} className="shrink-0" />
      <span>
        Crisis de salud mental: llama o textea al <strong>988</strong> (24/7, espanol e ingles)
      </span>
    </a>
  );
}
