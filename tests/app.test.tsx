import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '@/App';

describe('App (palette)', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState(null, '', '/');
    vi.clearAllMocks();
  });

  it('muestra resultados al escribir en el buscador', () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Search UTI/i);

    fireEvent.change(input, { target: { value: 'asthma' } });

    expect(screen.getAllByText(/Asthma \(Reactive Airway Disease\)/).length).toBeGreaterThan(0);
  });

  it('Esc limpia la busqueda', () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Search UTI/i) as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'asthma' } });
    expect(input.value).toBe('asthma');

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(input.value).toBe('');
  });

  it('la tecla ? abre la ayuda de atajos', () => {
    render(<App />);

    fireEvent.keyDown(window, { key: '?' });

    expect(screen.getByRole('dialog', { name: /Atajos y datos|Shortcuts and data/i })).toBeTruthy();
  });

  it('lee la busqueda inicial desde la URL', () => {
    window.history.replaceState(null, '', '/?q=pharyngitis');
    render(<App />);

    expect(screen.getAllByText(/Sore Throat/).length).toBeGreaterThan(0);
  });

  it('hacer clic en un resultado no copia al portapapeles', () => {
    const spy = vi.spyOn(navigator.clipboard, 'writeText');
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText(/Search UTI/i), { target: { value: 'asthma' } });

    const item = document.querySelector('[cmdk-item]');
    expect(item).toBeTruthy();
    fireEvent.click(item as Element);

    expect(spy).not.toHaveBeenCalled();
  });

  it('el boton Copiar de la tarjeta si copia', () => {
    const spy = vi.spyOn(navigator.clipboard, 'writeText');
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText(/Search UTI/i), { target: { value: 'asthma' } });

    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));

    expect(spy).toHaveBeenCalled();
  });

  it('crea una entrada propia', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'New entry' }));
    const dialog = screen.getByRole('dialog', { name: 'New entry' });
    fireEvent.change(within(dialog).getByLabelText(/Title/i), {
      target: { value: 'Tension headache' },
    });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Save' }));

    expect(screen.getAllByText('Tension headache').length).toBeGreaterThan(0);
  });

  it('expone un separador para redimensionar el panel', () => {
    render(<App />);

    const handle = screen.getByRole('separator');
    expect(handle.getAttribute('aria-orientation')).toBe('vertical');
    expect(Number(handle.getAttribute('aria-valuenow'))).toBeGreaterThan(0);
  });
});
