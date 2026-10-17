import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '@/App';

describe('App (palette)', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState(null, '', '/');
  });

  it('muestra resultados al escribir en el buscador', () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Busca UTI/i);

    fireEvent.change(input, { target: { value: 'asthma' } });

    expect(screen.getAllByText(/Asthma \(Reactive Airway Disease\)/).length).toBeGreaterThan(0);
  });

  it('Esc limpia la busqueda', () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Busca UTI/i) as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'asthma' } });
    expect(input.value).toBe('asthma');

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(input.value).toBe('');
  });

  it('la tecla ? abre la ayuda de atajos', () => {
    render(<App />);

    fireEvent.keyDown(window, { key: '?' });

    expect(screen.getByRole('dialog', { name: /Atajos de teclado/i })).toBeTruthy();
  });

  it('lee la busqueda inicial desde la URL', () => {
    window.history.replaceState(null, '', '/?q=pharyngitis');
    render(<App />);

    expect(screen.getAllByText(/Sore Throat/).length).toBeGreaterThan(0);
  });
});
