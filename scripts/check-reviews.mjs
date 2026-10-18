import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * Higiene de contenido: avisa de entradas con `reviewedAt` antiguo.
 * - > WARN_MONTHS: aviso (no falla).
 * - > FAIL_MONTHS: falla la CI para forzar una revision.
 */
const WARN_MONTHS = 12;
const FAIL_MONTHS = 24;
const DAYS_PER_MONTH = 30.44;

const files = ['dictionary', 'acronyms', 'clickpaths', 'protocols'];
const now = Date.now();

let warnings = 0;
let failures = 0;

for (const file of files) {
  const path = fileURLToPath(new URL(`../src/data/${file}.json`, import.meta.url));
  const entries = JSON.parse(readFileSync(path, 'utf8'));

  for (const entry of entries) {
    if (!entry.reviewedAt) {
      console.warn(`AVISO  ${file}/${entry.id}: sin reviewedAt`);
      warnings += 1;
      continue;
    }
    const months =
      (now - new Date(entry.reviewedAt).getTime()) / (1000 * 60 * 60 * 24 * DAYS_PER_MONTH);
    if (months > FAIL_MONTHS) {
      console.error(`VENCIDA ${file}/${entry.id}: ${entry.reviewedAt} (>${FAIL_MONTHS} meses)`);
      failures += 1;
    } else if (months > WARN_MONTHS) {
      console.warn(`AVISO   ${file}/${entry.id}: ${entry.reviewedAt} (>${WARN_MONTHS} meses)`);
      warnings += 1;
    }
  }
}

console.log(`Revision de contenido: ${warnings} avisos, ${failures} vencidas.`);
if (failures > 0) process.exit(1);
