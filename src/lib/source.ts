import type { EntryType } from './types';

/**
 * Trazabilidad: cada entrada vive en un JSON versionado del repo. Desde la
 * tarjeta se puede abrir el archivo en GitHub para revisar o editar el dato.
 */

const REPO = 'https://github.com/jaervic/medical_index';
const BRANCH = 'main';

export const FILE_BY_TYPE: Record<EntryType, string> = {
  dictionary: 'dictionary.json',
  acronym: 'acronyms.json',
  clickpath: 'clickpaths.json',
  protocol: 'protocols.json',
};

export function sourceFile(type: EntryType): string {
  return `src/data/${FILE_BY_TYPE[type]}`;
}

export function sourceUrl(type: EntryType): string {
  return `${REPO}/blob/${BRANCH}/${sourceFile(type)}`;
}
