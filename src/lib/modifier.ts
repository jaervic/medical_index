import type { Modifier } from '@/lib/shortcuts';

export type { Modifier };

/** Etiqueta del modificador segun el sistema del usuario (Mac vs resto). */
export function detectModifier(): Modifier {
  if (typeof navigator === 'undefined') return 'Ctrl';
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const platform = nav.userAgentData?.platform ?? nav.platform ?? nav.userAgent ?? '';
  return /mac|iphone|ipad|ipod/i.test(platform) ? '⌘' : 'Ctrl';
}
