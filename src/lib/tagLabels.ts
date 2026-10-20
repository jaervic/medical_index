import type { Locale } from './storage';

/**
 * Etiquetas del contenido. La clave es estable (idioma de los datos) y se usa
 * para filtrar y puntuar; la etiqueta se muestra traducida.
 */
export const TAG_LABELS: Record<string, { es: string; en: string }> = {
  adicciones: { es: 'adicciones', en: 'addiction' },
  administrativo: { es: 'administrativo', en: 'administrative' },
  agudo: { es: 'agudo', en: 'acute' },
  alergia: { es: 'alergia', en: 'allergy' },
  ansiedad: { es: 'ansiedad', en: 'anxiety' },
  'bandera-roja': { es: 'bandera-roja', en: 'red-flag' },
  cardiovascular: { es: 'cardiovascular', en: 'cardiovascular' },
  cognitivo: { es: 'cognitivo', en: 'cognitive' },
  comunicacion: { es: 'comunicacion', en: 'communication' },
  cribado: { es: 'cribado', en: 'screening' },
  crisis: { es: 'crisis', en: 'crisis' },
  cronico: { es: 'cronico', en: 'chronic' },
  cultural: { es: 'cultural', en: 'cultural' },
  depresion: { es: 'depresion', en: 'depression' },
  dermatologico: { es: 'dermatologico', en: 'dermatology' },
  digestivo: { es: 'digestivo', en: 'digestive' },
  documentacion: { es: 'documentacion', en: 'documentation' },
  athena: { es: 'athena', en: 'athena' },
  alimentacion: { es: 'alimentacion', en: 'nutrition' },
  endocrino: { es: 'endocrino', en: 'endocrine' },
  farmacia: { es: 'farmacia', en: 'pharmacy' },
  hematologico: { es: 'hematologico', en: 'hematology' },
  laboratorio: { es: 'laboratorio', en: 'laboratory' },
  legal: { es: 'legal', en: 'legal' },
  medicare: { es: 'medicare', en: 'medicare' },
  musculoesqueletico: { es: 'musculoesqueletico', en: 'musculoskeletal' },
  neurologico: { es: 'neurologico', en: 'neurology' },
  oftalmologia: { es: 'oftalmologia', en: 'ophthalmology' },
  ordenes: { es: 'ordenes', en: 'orders' },
  otorrino: { es: 'otorrino', en: 'ENT' },
  pediatria: { es: 'pediatria', en: 'pediatrics' },
  perinatal: { es: 'perinatal', en: 'perinatal' },
  preventivo: { es: 'preventivo', en: 'preventive' },
  procedimientos: { es: 'procedimientos', en: 'procedures' },
  referrals: { es: 'referrals', en: 'referrals' },
  renal: { es: 'renal', en: 'renal' },
  respiratorio: { es: 'respiratorio', en: 'respiratory' },
  'salud-mental': { es: 'salud-mental', en: 'mental-health' },
  scheduling: { es: 'scheduling', en: 'scheduling' },
  seguros: { es: 'seguros', en: 'insurance' },
  'signos-vitales': { es: 'signos-vitales', en: 'vital-signs' },
  social: { es: 'social', en: 'social' },
  somatoformo: { es: 'somatoformo', en: 'somatic' },
  sueno: { es: 'sueno', en: 'sleep' },
  tratamiento: { es: 'tratamiento', en: 'treatment' },
  triage: { es: 'triage', en: 'triage' },
  urologia: { es: 'urologia', en: 'urology' },
  vascular: { es: 'vascular', en: 'vascular' },
};

/** Etiqueta a mostrar para una clave, en el idioma pedido. */
export function tagLabel(tag: string, locale: Locale): string {
  return TAG_LABELS[tag]?.[locale] ?? tag;
}

/** Todas las formas (clave + etiquetas) para indexar y filtrar. */
export function tagForms(tag: string): string[] {
  const labels = TAG_LABELS[tag];
  return labels ? [tag, labels.es, labels.en] : [tag];
}

/** True si alguna de las etiquetas coincide con el token (en cualquier idioma). */
export function tagMatches(tags: string[] | undefined, token: string): boolean {
  const needle = token.toLowerCase();
  for (const tag of tags ?? []) {
    if (tagForms(tag).some((form) => form.toLowerCase() === needle)) return true;
  }
  return false;
}
