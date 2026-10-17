import { useMemo } from 'react';
import { detectModifier, type Modifier } from '@/lib/modifier';

/** Etiqueta del modificador segun el sistema del usuario (Mac vs resto). */
export function useModifierKey(): Modifier {
  return useMemo(() => detectModifier(), []);
}
