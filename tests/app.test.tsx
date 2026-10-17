import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '@/App';

describe('App (palette)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('muestra resultados al escribir en el buscador', () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Busca UTI/i);

    fireEvent.change(input, { target: { value: 'asthma' } });

    expect(screen.getAllByText(/Asthma \(Reactive Airway Disease\)/).length).toBeGreaterThan(0);
  });
});
