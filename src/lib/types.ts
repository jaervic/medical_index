/**
 * Modelo de datos unificado de Meddex.
 *
 * Toda entrada comparte una base (id, titulo, keywords, tags) y se especializa
 * por `type`. Una sola busqueda cubre todas las categorias y el ranking es
 * coherente porque todas exponen los mismos campos indexables.
 */

export type EntryType = 'dictionary' | 'clickpath' | 'protocol' | 'acronym';

export interface BaseEntry {
  /** Identificador estable y unico (kebab-case). */
  id: string;
  /** Etiqueta principal que se muestra en los resultados. */
  title: string;
  /** Sinonimos, coloquialismos, errores frecuentes. Se indexan con peso alto. */
  keywords?: string[];
  /** Categorias transversales (p. ej. "triage", "eCW", "cardiologia"). */
  tags?: string[];
  /** Fecha ISO de ultima revision del contenido clinico. */
  reviewedAt?: string;
}

export interface DictionaryEntry extends BaseEntry {
  type: 'dictionary';
  /** Termino exacto para la nota, en ingles. */
  en: string;
  /** Equivalente en espanol. */
  es: string;
  /** Como se pronuncia el termino en ingles (respelling en texto). */
  pronunciation?: string;
  /** Como lo dice el paciente en la calle (p. ej. "presion alta"). */
  colloquial?: string[];
  note?: string;
}

export interface ClickPathEntry extends BaseEntry {
  type: 'clickpath';
  /** Modulo de eCW al que pertenece la ruta. */
  module: string;
  /** Secuencia de clics. */
  path: string[];
  notes?: string;
}

export interface ProtocolEntry extends BaseEntry {
  type: 'protocol';
  /** Nombre del protocolo en ingles (para la nota). */
  enTitle?: string;
  /** Como se pronuncia el nombre en ingles (respelling en texto). */
  pronunciation?: string;
  /** Pasos ordenados. */
  steps: string[];
  /** Cuando aplica. */
  appliesTo?: string;
  /** Banderas rojas o advertencias. */
  warnings?: string[];
}

export interface AcronymEntry extends BaseEntry {
  type: 'acronym';
  /** Significado completo (EN). */
  expansion: string;
  /** Traduccion del significado (ES). */
  translation?: string;
  note?: string;
}

export type Entry = DictionaryEntry | ClickPathEntry | ProtocolEntry | AcronymEntry;

export const ENTRY_TYPE_LABEL: Record<EntryType, string> = {
  dictionary: 'Diccionario',
  clickpath: 'Ruta eCW',
  protocol: 'Protocolo',
  acronym: 'Acronimo',
};
