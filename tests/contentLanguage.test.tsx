import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '@/App';
import { I18nProvider } from '@/i18n/I18nProvider';

describe('idioma del contenido', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState(null, '', '/');
  });

  it('los protocolos cambian de idioma con el switch', () => {
    render(
      <I18nProvider>
        <App />
      </I18nProvider>,
    );

    fireEvent.change(screen.getByPlaceholderText(/Search UTI/i), { target: { value: 'fever' } });
    expect(screen.getAllByText(/Fever in Adults/).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole('button', { name: 'ES' }));
    expect(screen.getAllByText(/Fiebre en el adulto/).length).toBeGreaterThan(0);
  });
});
