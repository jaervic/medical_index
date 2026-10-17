import { vi } from 'vitest';

// jsdom no implementa la Clipboard API: la stubeamos para los componentes que copian.
if (!navigator.clipboard) {
  Object.assign(navigator, {
    clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
  });
}

// cmdk usa ResizeObserver para medir la lista; jsdom no lo trae.
if (!('ResizeObserver' in globalThis)) {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  Object.assign(globalThis, { ResizeObserver: ResizeObserverStub });
}

// cmdk hace scrollIntoView del item seleccionado; jsdom no lo implementa.
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

// Algunos componentes consultan matchMedia (jsdom tampoco lo implementa).
if (!window.matchMedia) {
  Object.assign(window, {
    matchMedia: () => ({
      matches: false,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
      dispatchEvent: () => false,
    }),
  });
}
