import type { MessageKey } from '@/i18n/messages';
import type { Entry } from './types';

type Translate = (key: MessageKey) => string;

/** Ficha completa de una entrada en texto plano, lista para pegar en la nota. */
export function entryToText(entry: Entry, t: Translate): string {
  const lines: string[] = [`${entry.title} — ${t(`type.${entry.type}`)}`];

  switch (entry.type) {
    case 'dictionary':
      lines.push(`${t('sheet.en')}: ${entry.en}`);
      if (entry.pronunciation) lines.push(`${t('sheet.pronunciation')}: ${entry.pronunciation}`);
      lines.push(`${t('sheet.es')}: ${entry.es}`);
      if (entry.colloquial?.length) {
        lines.push(`${t('sheet.patient')}: ${entry.colloquial.join(' / ')}`);
      }
      if (entry.note) lines.push('', entry.note);
      break;

    case 'clickpath':
      lines.push(`${entry.module}: ${entry.path.join(' > ')}`);
      if (entry.notes) lines.push('', entry.notes);
      break;

    case 'protocol':
      if (entry.appliesTo) lines.push(`${t('sheet.appliesWhen')}: ${entry.appliesTo}`);
      lines.push('', ...entry.steps.map((step, index) => `${index + 1}. ${step}`));
      if (entry.warnings?.length) {
        lines.push(
          '',
          `${t('sheet.warnings')}:`,
          ...entry.warnings.map((warning) => `- ${warning}`),
        );
      }
      break;

    case 'acronym':
      lines.push(`${entry.title}: ${entry.expansion}`);
      if (entry.translation) lines.push(`${t('sheet.es')}: ${entry.translation}`);
      if (entry.note) lines.push('', entry.note);
      break;
  }

  return lines.join('\n').trim();
}
