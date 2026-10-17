import acronyms from './acronyms.json';
import clickpaths from './clickpaths.json';
import dictionary from './dictionary.json';
import protocols from './protocols.json';
import { parseEntries } from '@/lib/schema';
import type { Entry } from '@/lib/types';

/**
 * Fuente de verdad del contenido. Cada categoria vive en su propio JSON y aqui
 * se mezclan en un unico indice buscable. La validacion con Zod corre al cargar
 * (dev) y en los tests, de modo que un dato invalido rompe el build, no al usuario.
 */
const raw = [...dictionary, ...acronyms, ...clickpaths, ...protocols];

const parsed = parseEntries(raw);

if (!parsed.ok) {
  // En produccion preferimos fallar ruidosamente a mostrar datos a medias.
  throw new Error(`[meddex] ${parsed.error}`);
}

export const ENTRIES: Entry[] = parsed.entries;
