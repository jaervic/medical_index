export type Modifier = '⌘' | 'Ctrl';

export interface ShortcutDef {
  keys: string[];
  label: string;
}

/** Lista de atajos mostrada en la ayuda y en el panel vacio. */
export function shortcuts(modifier: Modifier): ShortcutDef[] {
  return [
    { keys: ['↑', '↓'], label: 'Navegar resultados' },
    { keys: ['↵'], label: 'Copiar el termino (o abrir la tarjeta)' },
    { keys: ['/'], label: 'Enfocar el buscador' },
    { keys: [modifier, 'K'], label: 'Enfocar desde cualquier lugar' },
    { keys: [modifier, 'B'], label: 'Mostrar u ocultar el panel' },
    { keys: ['?'], label: 'Ver esta ayuda' },
    { keys: ['Esc'], label: 'Limpiar la busqueda o cerrar' },
  ];
}
