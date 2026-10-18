import type { MessageKey } from '@/i18n/messages';

export type Modifier = '⌘' | 'Ctrl';

export interface ShortcutDef {
  keys: string[];
  label: string;
}

type Translate = (key: MessageKey) => string;

/** Lista de atajos mostrada en la ayuda y en el panel vacio. */
export function shortcuts(modifier: Modifier, t: Translate): ShortcutDef[] {
  return [
    { keys: ['↑', '↓'], label: t('shortcut.navigate') },
    { keys: ['↵'], label: t('shortcut.view') },
    { keys: ['/'], label: t('shortcut.focus') },
    { keys: [modifier, 'K'], label: t('shortcut.focusAnywhere') },
    { keys: [modifier, 'B'], label: t('shortcut.panel') },
    { keys: ['?'], label: t('shortcut.help') },
    { keys: ['Esc'], label: t('shortcut.clear') },
  ];
}
