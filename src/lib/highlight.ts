export interface Segment {
  text: string;
  match: boolean;
}

const COMBINING = /[\u0300-\u036f]/g;

/**
 * Marca las coincidencias de `query` dentro de `text` para resaltarlas.
 * Insensible a mayusculas y a acentos; trabaja por code points para no romper
 * indices con caracteres como '›' o comillas tipograficas.
 */
export function highlightSegments(text: string, query: string): Segment[] {
  const chars = Array.from(text);
  const hay = chars.map((char) => char.normalize('NFD')[0].toLowerCase()).join('');

  const tokens = query
    .normalize('NFD')
    .replace(COMBINING, '')
    .toLowerCase()
    .split(/\s+/)
    .filter((token) => token.length >= 2);

  if (tokens.length === 0) return [{ text, match: false }];

  const ranges: Array<[number, number]> = [];
  for (const token of tokens) {
    let from = 0;
    while (from <= hay.length - token.length) {
      const index = hay.indexOf(token, from);
      if (index === -1) break;
      ranges.push([index, index + token.length]);
      from = index + token.length;
    }
  }
  if (ranges.length === 0) return [{ text, match: false }];

  ranges.sort((a, b) => a[0] - b[0]);
  const merged: Array<[number, number]> = [];
  for (const range of ranges) {
    const last = merged[merged.length - 1];
    if (last && range[0] <= last[1]) last[1] = Math.max(last[1], range[1]);
    else merged.push([range[0], range[1]]);
  }

  const segments: Segment[] = [];
  let cursor = 0;
  for (const [start, end] of merged) {
    if (start > cursor) segments.push({ text: chars.slice(cursor, start).join(''), match: false });
    segments.push({ text: chars.slice(start, end).join(''), match: true });
    cursor = end;
  }
  if (cursor < chars.length) segments.push({ text: chars.slice(cursor).join(''), match: false });
  return segments;
}
