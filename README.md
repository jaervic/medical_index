# Meddex

Segundo cerebro clinico: un _command palette_ (estilo Spotlight / Raycast) para consultar
**protocolos, rutas de clics de eCW, acronimos y un diccionario medico bilingue** en milisegundos,
sin perder tiempo navegando menus.

> Solo contiene **reglas generales y traducciones**. No guarda ni procesa datos de pacientes (cero PII).

## Que hace

- **Buscador instantaneo** centrado en pantalla. Se enfoca con `Ctrl/Cmd + K` o `/`.
- **Busqueda tolerante a errores** (`ashtma` encuentra _Asthma_) y por coloquialismos
  ("presion alta" -> _Hypertension (HTN)_).
- **Ranking con criterio**: primero coincidencia exacta de acronimo/titulo, luego sinonimos,
  y desempate por **frecency** (lo que mas usas y mas reciente sube).
- **Tarjetas por tipo**:
  - _Diccionario_: termino exacto EN/ES, como lo dice el paciente, nota clinica.
  - _Ruta eCW_: breadcrumb de clics (`Chart › Hub › Referrals › New ...`) copiable.
  - _Protocolo_: pasos numerados y advertencias.
  - _Acronimo_: significado y traduccion.
- **Copiar a la nota** con `Enter` o botones por campo.
- **Fijados y recientes**, filtros por categoria, **tema claro/oscuro** (oscuro por defecto).
- **PWA instalable y offline**: ponla en su propia ventana en tu monitor secundario.

## Contenido y fuentes

Actualmente incluye **207 entradas**: 87 acronimos, 59 terminos de diccionario, 31 rutas de eCW y
30 protocolos, con un **enfoque fuerte en salud mental**. Se fundamentaron en fuentes publicas:

- **Acronimos y vocabulario clinico**: listas de abreviaturas de uso comun (NCI/SEER, MedicAlert).
- **Rutas de eCW**: guias de entrenamiento de eClinicalWorks (panel DRTLA, _Treatment screen_,
  FUTURE ORDERS, _Outgoing Referral_, inmunizaciones en 2 pasos, registro de paciente nuevo).
- **Protocolos (AWV)**: guia de la CMS/Medicare para la _Annual Wellness Visit_ (G0438/G0439).
- **Triage telefonico**: banderas rojas de dolor toracico, disnea, fiebre y dolor abdominal
  (guias AHA/ACC, WHO prehospital protocols, ESI handbook, protocolos de triage telefonico).
- **Salud mental**: escalas y protocolos validados — PHQ-2/PHQ-9, GAD-2/GAD-7, PHQ-4, C-SSRS,
  AUDIT-C, DAST-10, MDQ, PC-PTSD, EPDS — junto con SBIRT (USPSTF/NIAAA), lineas de crisis (988)
  y referencia a salud conductual.

> Aviso: las rutas de clics de eCW **dependen de la configuracion de cada clinica**. Verificalas
> contra tu version antes de confiar en ellas. El contenido es de referencia general y no
> sustituye el juicio clinico ni los protocolos locales. Las escalas deben usarlas personas
> capacitadas; el C-SSRS y la evaluacion del riesgo suicida requieren entrenamiento.

## Stack

Vite · React 19 · TypeScript · Tailwind CSS v4 · [cmdk](https://cmdk.paco.me) ·
[Fuse.js](https://www.fusejs.io) · Zod · Vitest · vite-plugin-pwa. Sin backend, sin base de datos.

## Como usar

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # build de produccion (tsc + vite)
npm run preview  # sirve el build
```

Calidad:

```bash
npm run lint
npm run format:check
npm run typecheck
npm test
```

## Agregar contenido

El contenido vive en `src/data/*.json` y se valida con Zod al cargar (un dato invalido rompe el
build, no la app). Cada entrada tiene una base comun: `id`, `title`, `keywords`, `tags`,
`reviewedAt`.

Diccionario (`src/data/dictionary.json`):

```json
{
  "id": "hypertension-htn",
  "type": "dictionary",
  "title": "Hypertension (HTN)",
  "en": "Hypertension",
  "es": "Hipertension arterial",
  "colloquial": ["presion alta", "la presion"],
  "keywords": ["high blood pressure", "HTN"],
  "tags": ["cardiovascular"],
  "reviewedAt": "2026-01-15"
}
```

Ruta de eCW (`src/data/clickpaths.json`):

```json
{
  "id": "cp-referral",
  "type": "clickpath",
  "title": "Ruta de clics: Crear un Referral",
  "module": "eCW",
  "path": ["Chart", "Hub", "Referrals", "New", "Seleccionar Especialidad", "Asignar a RN"],
  "keywords": ["referral", "referir", "especialista"],
  "tags": ["eCW"]
}
```

Protocolos (`src/data/protocols.json`) y acronimos (`src/data/acronyms.json`) siguen el mismo
patron. Los tipos exactos estan en `src/lib/types.ts` y el esquema de validacion en
`src/lib/schema.ts`.

## Arquitectura

```
src/
  components/   UI (palette, tarjetas, filtros, toast)
  data/         JSON por categoria + indice validado
  hooks/        hotkey, busqueda, personalizacion, tema, portapapeles
  lib/          tipos, esquema Zod, busqueda/ranking, persistencia
tests/          validacion de datos, ranking y smoke de la UI
```

La busqueda se construye una sola vez con Fuse.js y encima aplica una capa de _tiers_ + frecency
(`src/lib/search.ts`). La personalizacion (fijados, recientes, frecency, tema) vive en
`localStorage` (`src/lib/storage.ts`).

## Limitacion conocida

Una pagina web no puede registrar un atajo **global** del sistema operativo. Para invocarla desde
cualquier lugar, instala la PWA y usala en su propia ventana; si de verdad necesitas un atajo
global, habria que anadir una extension de navegador mas adelante.

## Despliegue

Pensado para Vercel (build estatico, cero configuracion): importa el repo y despliega. El `dist/`
tambien se puede servir desde cualquier hosting estatico.
