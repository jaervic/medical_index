import * as axeCore from 'axe-core';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '@/App';

// axe-core es CJS (export =); resolvemos el default con interop de bundler.
const axe = (axeCore as unknown as { default?: typeof axeCore }).default ?? axeCore;

describe('accesibilidad (axe)', () => {
  it('la vista inicial no tiene violaciones graves ni criticas', async () => {
    window.history.replaceState(null, '', '/');
    render(<App />);

    const results = await axe.run(document.body, {
      rules: {
        // jsdom no calcula contraste real ni layout.
        'color-contrast': { enabled: false },
        // La app no usa landmarks por region; <main> ya esta presente.
        region: { enabled: false },
      },
    });

    const serious = results.violations
      .filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')
      .map((violation) => violation.id);

    expect(serious).toEqual([]);
  });
});
