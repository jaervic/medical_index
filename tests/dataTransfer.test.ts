import { beforeEach, describe, expect, it } from 'vitest';
import {
  exportPersonalData,
  importPersonalData,
  loadFavorites,
  loadQueries,
  saveFavorites,
  saveQueries,
} from '@/lib/storage';

describe('exportar / importar datos', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('exporta lo que hay guardado', () => {
    saveFavorites(['a']);
    saveQueries(['uti']);
    const data = exportPersonalData();
    expect(data.app).toBe('meddex');
    expect(data.favorites).toEqual(['a']);
    expect(data.queries).toEqual(['uti']);
  });

  it('importa datos validos y los persiste', () => {
    const result = importPersonalData({
      app: 'meddex',
      version: 1,
      favorites: ['x'],
      recents: [],
      queries: ['y'],
      frecency: {},
      theme: 'light',
    });
    expect(result.ok).toBe(true);
    expect(loadFavorites()).toEqual(['x']);
    expect(loadQueries()).toEqual(['y']);
  });

  it('rechaza datos invalidos', () => {
    expect(importPersonalData({ favorites: 'no' }).ok).toBe(false);
    expect(importPersonalData(null).ok).toBe(false);
  });
});
