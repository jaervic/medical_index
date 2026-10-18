import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useI18n } from '@/i18n/context';
import { I18nProvider } from '@/i18n/I18nProvider';
import { messages } from '@/i18n/messages';

function Probe() {
  const { locale, t } = useI18n();
  return (
    <span>
      {locale}:{t('empty.title')}
    </span>
  );
}

describe('i18n', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('todas las claves tienen es y en no vacios', () => {
    const incomplete = Object.entries(messages)
      .filter(([, value]) => !value.es.trim() || !value.en.trim())
      .map(([key]) => key);
    expect(incomplete).toEqual([]);
  });

  it('usa ingles por defecto', () => {
    render(
      <I18nProvider>
        <Probe />
      </I18nProvider>,
    );
    expect(screen.getByText('en:What do you need?')).toBeTruthy();
  });

  it('usa espanol si esta guardado', () => {
    localStorage.setItem('meddex:locale', JSON.stringify('es'));
    render(
      <I18nProvider>
        <Probe />
      </I18nProvider>,
    );
    expect(screen.getByText('es:¿Que necesitas?')).toBeTruthy();
  });
});
