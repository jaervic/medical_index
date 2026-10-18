export type Locale = 'es' | 'en';

export const LOCALES: Locale[] = ['es', 'en'];

interface Messages {
  [key: string]: { es: string; en: string };
}

export const messages = {
  'app.tagline': {
    es: 'Segundo cerebro clinico · protocolos, click-paths de eCW y diccionario',
    en: 'Clinical second brain · protocols, eCW click-paths and dictionary',
  },
  'app.newEntry': { es: 'Nueva entrada', en: 'New entry' },
  'app.help': { es: 'Atajos de teclado', en: 'Keyboard shortcuts' },
  'app.panelShow': { es: 'Mostrar panel de detalle', en: 'Show detail panel' },
  'app.panelHide': { es: 'Ocultar panel de detalle', en: 'Hide detail panel' },
  'app.theme.dark': { es: 'oscuro', en: 'dark' },
  'app.theme.light': { es: 'claro', en: 'light' },
  'app.theme.system': { es: 'segun el sistema', en: 'system' },
  'app.theme.change': { es: 'Tema {theme}. Cambiar tema', en: 'Theme {theme}. Change theme' },
  'app.language.change': {
    es: 'Idioma: espanol. Cambiar a ingles',
    en: 'Language: English. Switch to Spanish',
  },
  'app.language.code': { es: 'EN', en: 'ES' },

  'search.label': {
    es: 'Buscar en protocolos, acronimos y diccionario',
    en: 'Search protocols, acronyms and dictionary',
  },
  'search.placeholder': {
    es: 'Busca UTI, refill, PHQ-9, tag:triage, #eCW...',
    en: 'Search UTI, refill, PHQ-9, tag:triage, #eCW...',
  },
  'search.clear': { es: 'Limpiar busqueda', en: 'Clear search' },
  'search.noResults': {
    es: 'Sin resultados para “{query}”.',
    en: 'No results for “{query}”.',
  },
  'search.resultsCount': { es: '{count} resultados', en: '{count} results' },
  'search.filterGroup': { es: 'Filtrar por categoria', en: 'Filter by category' },

  'filter.all': { es: 'Todo', en: 'All' },
  'type.dictionary': { es: 'Diccionario', en: 'Dictionary' },
  'type.clickpath': { es: 'Ruta eCW', en: 'eCW path' },
  'type.protocol': { es: 'Protocolo', en: 'Protocol' },
  'type.acronym': { es: 'Acronimo', en: 'Acronym' },
  'filters.type': { es: 'Tipo: {label}', en: 'Type: {label}' },
  'filters.remove': { es: 'Quitar filtro', en: 'Remove filter' },

  'group.favorites': { es: 'Fijados', en: 'Pinned' },
  'group.recents': { es: 'Recientes', en: 'Recent' },
  'group.rest': { es: 'Todo lo demas', en: 'Everything else' },
  'group.restAll': { es: 'Todo', en: 'All' },
  'group.more': {
    es: '{count} entradas mas · escribe para filtrar',
    en: '{count} more entries · type to filter',
  },

  'empty.title': { es: '¿Que necesitas?', en: 'What do you need?' },
  'empty.subtitle': {
    es: 'Escribe arriba o navega con el teclado. {total} entradas listas para consultar.',
    en: 'Type above or navigate with the keyboard. {total} entries ready to look up.',
  },
  'empty.recentQueries': { es: 'Busquedas recientes', en: 'Recent searches' },
  'empty.topUsed': { es: 'Mas usados', en: 'Most used' },
  'empty.favorites': { es: 'Fijados', en: 'Pinned' },

  'shortcut.navigate': { es: 'Navegar resultados', en: 'Navigate results' },
  'shortcut.view': { es: 'Ver la entrada en el panel', en: 'Show the entry in the panel' },
  'shortcut.focus': { es: 'Enfocar el buscador', en: 'Focus the search box' },
  'shortcut.focusAnywhere': { es: 'Enfocar desde cualquier lugar', en: 'Focus from anywhere' },
  'shortcut.panel': { es: 'Mostrar u ocultar el panel', en: 'Show or hide the panel' },
  'shortcut.help': { es: 'Ver esta ayuda', en: 'Show this help' },
  'shortcut.clear': { es: 'Limpiar la busqueda o cerrar', en: 'Clear the search or close' },

  'status.navigate': { es: 'navegar', en: 'navigate' },
  'status.view': { es: 'ver detalle', en: 'view detail' },
  'status.search': { es: 'buscar', en: 'search' },
  'status.focus': { es: 'enfocar', en: 'focus' },
  'status.panel': { es: 'panel', en: 'panel' },
  'status.help': { es: 'ayuda', en: 'help' },
  'status.footer': {
    es: 'Meddex · solo reglas generales, sin datos de pacientes',
    en: 'Meddex · general rules only, no patient data',
  },

  'crisis.text': {
    es: 'Crisis de salud mental: llama o textea al 988 (24/7, espanol e ingles)',
    en: 'Mental health crisis: call or text 988 (24/7, English and Spanish)',
  },

  'detail.related': { es: 'Relacionados', en: 'Related' },
  'detail.english': { es: 'Ingles (nota)', en: 'English (note)' },
  'detail.spanish': { es: 'Espanol', en: 'Spanish' },
  'detail.pronounces': { es: 'Se pronuncia', en: 'Pronounced' },
  'detail.patientSays': { es: 'Como lo dice el paciente', en: 'How the patient says it' },
  'detail.routeIn': { es: 'Ruta en {module}', en: 'Path in {module}' },
  'detail.copyRoute': { es: 'Copiar ruta completa', en: 'Copy full path' },
  'detail.appliesWhen': { es: 'Aplica cuando', en: 'Applies when' },
  'detail.steps': { es: 'Pasos', en: 'Steps' },
  'detail.copySteps': { es: 'Copiar pasos', en: 'Copy steps' },
  'detail.warnings': { es: 'Advertencias', en: 'Warnings' },
  'detail.meaning': { es: 'Significado (EN)', en: 'Meaning (EN)' },
  'detail.translation': { es: 'En espanol', en: 'In Spanish' },
  'detail.tags': { es: 'Etiquetas', en: 'Tags' },
  'detail.searchAs': { es: 'Tambien se busca como', en: 'Also searched as' },
  'detail.copy': { es: 'Copiar', en: 'Copy' },
  'detail.copySheet': { es: 'Copiar ficha', en: 'Copy sheet' },
  'detail.delete': { es: 'Eliminar', en: 'Delete' },
  'detail.custom': { es: 'Propia', en: 'Custom' },
  'detail.stale': { es: 'Revision vencida', en: 'Review overdue' },
  'detail.redFlag': { es: 'Bandera roja', en: 'Red flag' },
  'detail.usedCount': { es: 'Usada {count}x', en: 'Used {count}x' },
  'detail.reviewed': { es: 'Revisado {date}', en: 'Reviewed {date}' },
  'detail.copyEn': { es: 'Copiar EN', en: 'Copy EN' },
  'detail.copyEs': { es: 'Copiar ES', en: 'Copy ES' },
  'detail.close': { es: 'Cerrar', en: 'Close' },
  'panel.resize': {
    es: 'Ajustar el ancho del panel (arrastra o usa las flechas)',
    en: 'Resize the panel (drag or use arrow keys)',
  },

  'copy.done': { es: 'Copiado', en: 'Copied' },
  'copy.sheet': { es: 'Ficha copiada', en: 'Sheet copied' },

  'editor.title': { es: 'Nueva entrada', en: 'New entry' },
  'editor.typeField': { es: 'Tipo', en: 'Type' },
  'editor.titleField': { es: 'Titulo', en: 'Title' },
  'editor.pronunciation': { es: 'Pronunciacion', en: 'Pronunciation' },
  'editor.colloquial': {
    es: 'Como lo dice el paciente (separado por comas)',
    en: 'How the patient says it (comma separated)',
  },
  'editor.expansion': { es: 'Significado (EN)', en: 'Meaning (EN)' },
  'editor.translation': { es: 'Traduccion (ES)', en: 'Translation (ES)' },
  'editor.module': { es: 'Modulo', en: 'Module' },
  'editor.path': { es: 'Ruta de clics (una por linea)', en: 'Click path (one per line)' },
  'editor.enTitle': { es: 'Nombre en ingles', en: 'English name' },
  'editor.steps': { es: 'Pasos (uno por linea)', en: 'Steps (one per line)' },
  'editor.warnings': { es: 'Advertencias (una por linea)', en: 'Warnings (one per line)' },
  'editor.note': { es: 'Nota / indicaciones', en: 'Note / instructions' },
  'editor.keywords': {
    es: 'Tambien se busca como (separado por comas)',
    en: 'Also searched as (comma separated)',
  },
  'editor.tags': { es: 'Etiquetas (separado por comas)', en: 'Tags (comma separated)' },
  'editor.cancel': { es: 'Cancelar', en: 'Cancel' },
  'editor.save': { es: 'Guardar', en: 'Save' },
  'editor.required': { es: 'El titulo es obligatorio.', en: 'The title is required.' },

  'help.title': { es: 'Atajos y datos', en: 'Shortcuts and data' },
  'help.shortcuts': { es: 'Atajos de teclado', en: 'Keyboard shortcuts' },
  'help.data': { es: 'Datos personales', en: 'Personal data' },
  'help.dataDesc': {
    es: 'Fijados, recientes, busquedas y tema. Solo preferencias locales, sin datos de pacientes.',
    en: 'Pinned, recent, searches and theme. Local preferences only, no patient data.',
  },

  'data.export': { es: 'Exportar datos', en: 'Export data' },
  'data.import': { es: 'Importar datos', en: 'Import data' },
  'data.exported': { es: 'Datos exportados.', en: 'Data exported.' },
  'data.imported': { es: 'Datos importados. Recargando...', en: 'Data imported. Reloading...' },
  'data.importFailed': { es: 'No se importo: {error}.', en: 'Import failed: {error}.' },
  'data.readError': {
    es: 'No se pudo leer el archivo (JSON invalido).',
    en: 'Could not read the file (invalid JSON).',
  },
} satisfies Messages;

export type MessageKey = keyof typeof messages;
