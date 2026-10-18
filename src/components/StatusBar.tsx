import { useI18n } from '@/i18n/context';
import { useModifierKey } from '@/hooks/useModifierKey';

function Hint({ keys, label }: { keys: string[]; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="flex items-center gap-1">
        {keys.map((key) => (
          <kbd
            key={key}
            className="rounded border border-edge bg-ink/5 px-1.5 py-0.5 font-sans text-[10px] text-muted"
          >
            {key}
          </kbd>
        ))}
      </span>
      <span>{label}</span>
    </span>
  );
}

export function StatusBar() {
  const modifier = useModifierKey();
  const { t } = useI18n();

  return (
    <footer className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-edge px-4 py-2 text-[11px] text-muted print:hidden">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <Hint keys={['↑', '↓']} label={t('status.navigate')} />
        <Hint keys={['↵']} label={t('status.view')} />
        <Hint keys={['/']} label={t('status.search')} />
        <Hint keys={[modifier, 'K']} label={t('status.focus')} />
        <Hint keys={[modifier, 'B']} label={t('status.panel')} />
        <Hint keys={['?']} label={t('status.help')} />
      </div>
      <span className="hidden sm:inline">{t('status.footer')}</span>
    </footer>
  );
}
