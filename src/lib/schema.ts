import { z } from 'zod';

/**
 * Validacion de los datos clinicos con Zod.
 *
 * Los JSON del repo son la fuente de verdad; validarlos evita que una entrada
 * mal escrita rompa la app en produccion. `parseEntries` se usa tanto en runtime
 * (dev) como en los tests, asi que un dato invalido falla el build y la CI.
 */

const baseSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  keywords: z.array(z.string().min(1)).optional(),
  tags: z.array(z.string().min(1)).optional(),
  reviewedAt: z.string().optional(),
});

export const dictionarySchema = baseSchema.extend({
  type: z.literal('dictionary'),
  en: z.string().min(1),
  es: z.string().min(1),
  pronunciation: z.string().optional(),
  colloquial: z.array(z.string().min(1)).optional(),
  note: z.string().optional(),
});

export const clickPathSchema = baseSchema.extend({
  type: z.literal('clickpath'),
  module: z.string().min(1),
  path: z.array(z.string().min(1)).min(1),
  notes: z.string().optional(),
});

export const protocolSchema = baseSchema.extend({
  type: z.literal('protocol'),
  enTitle: z.string().min(1).optional(),
  pronunciation: z.string().optional(),
  steps: z.array(z.string().min(1)).min(1),
  appliesTo: z.string().optional(),
  warnings: z.array(z.string().min(1)).optional(),
});

export const acronymSchema = baseSchema.extend({
  type: z.literal('acronym'),
  expansion: z.string().min(1),
  translation: z.string().optional(),
  note: z.string().optional(),
});

export const entrySchema = z.discriminatedUnion('type', [
  dictionarySchema,
  clickPathSchema,
  protocolSchema,
  acronymSchema,
]);

export const entriesSchema = z.array(entrySchema);

/** Valida una lista de entradas y devuelve un error legible si algo falla. */
export function parseEntries(data: unknown) {
  const result = entriesSchema.safeParse(data);
  if (result.success) return { ok: true as const, entries: result.data };

  const details = result.error.issues
    .map((issue) => `  - ${issue.path.join('.') || '(raiz)'}: ${issue.message}`)
    .join('\n');
  return { ok: false as const, error: `Datos invalidos:\n${details}` };
}
