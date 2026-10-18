import type { Entry } from './types';
import { ENTRY_TYPE_LABEL } from './types';

/** Ficha completa de una entrada en texto plano, lista para pegar en la nota. */
export function entryToText(entry: Entry): string {
  const lines: string[] = [`${entry.title} — ${ENTRY_TYPE_LABEL[entry.type]}`];

  switch (entry.type) {
    case 'dictionary':
      lines.push(`EN: ${entry.en}`);
      if (entry.pronunciation) lines.push(`Pronunciacion: ${entry.pronunciation}`);
      lines.push(`ES: ${entry.es}`);
      if (entry.colloquial?.length) lines.push(`Paciente: ${entry.colloquial.join(' / ')}`);
      if (entry.note) lines.push('', entry.note);
      break;

    case 'clickpath':
      lines.push(`${entry.module}: ${entry.path.join(' > ')}`);
      if (entry.notes) lines.push('', entry.notes);
      break;

    case 'protocol':
      if (entry.enTitle) {
        lines.push(`EN: ${entry.enTitle}${entry.pronunciation ? ` (${entry.pronunciation})` : ''}`);
      }
      if (entry.appliesTo) lines.push(`Aplica cuando: ${entry.appliesTo}`);
      lines.push('', ...entry.steps.map((step, index) => `${index + 1}. ${step}`));
      if (entry.warnings?.length) {
        lines.push('', 'Advertencias:', ...entry.warnings.map((warning) => `- ${warning}`));
      }
      break;

    case 'acronym':
      lines.push(`${entry.title}: ${entry.expansion}`);
      if (entry.translation) lines.push(`ES: ${entry.translation}`);
      if (entry.note) lines.push('', entry.note);
      break;
  }

  return lines.join('\n').trim();
}
