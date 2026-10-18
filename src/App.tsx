import { Command } from 'cmdk';
import {
  HelpCircle,
  Monitor,
  Moon,
  PanelRightClose,
  PanelRightOpen,
  Search,
  Sun,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActiveFilters } from '@/components/ActiveFilters';
import { CategoryFilter } from '@/components/CategoryFilter';
import { CrisisBanner } from '@/components/CrisisBanner';
import { DetailCard } from '@/components/DetailCard';
import { DetailOverlay } from '@/components/DetailOverlay';
import { EmptyPanel } from '@/components/EmptyPanel';
import { HelpOverlay } from '@/components/HelpOverlay';
import { RelatedEntries } from '@/components/RelatedEntries';
import { ResultItem } from '@/components/ResultItem';
import { StatusBar } from '@/components/StatusBar';
import { Toast } from '@/components/Toast';
import { ENTRIES } from '@/data';
import { useCopy } from '@/hooks/useCopy';
import { useFocusHotkey } from '@/hooks/useFocusHotkey';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { usePanel } from '@/hooks/usePanel';
import { useSearch } from '@/hooks/useSearch';
import { useTheme } from '@/hooks/useTheme';
import { useUrlState } from '@/hooks/useUrlState';
import { useUsage } from '@/hooks/useUsage';
import { isTypingTarget } from '@/lib/dom';
import { buildHome } from '@/lib/home';
import { parseQuery, removeTagToken, removeTypeToken } from '@/lib/queryFilters';
import { findRelated } from '@/lib/related';
import { frecencyValue } from '@/lib/storage';
import type { Entry, EntryType } from '@/lib/types';

const byId = new Map(ENTRIES.map((entry) => [entry.id, entry]));

/** Tope de entradas mostradas en la vista inicial (evita volcar 200+ filas). */
const HOME_LIMIT = 50;

const GROUP_CLASS =
  'px-1 pb-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-muted [&_[cmdk-group-heading]]:uppercase';

const LIST_BASE =
  'flex min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-edge bg-panel shadow-sm';
const LIST_EXPANDED = `${LIST_BASE} lg:w-[440px] lg:shrink-0 xl:w-[500px]`;
const LIST_COLLAPSED = `${LIST_BASE} lg:mx-auto lg:max-w-3xl`;

function readInitialState() {
  const params = new URLSearchParams(window.location.search);
  const type = params.get('type');
  return {
    q: params.get('q') ?? '',
    type: type as EntryType | null,
    id: window.location.hash.replace(/^#/, ''),
  };
}

export default function App() {
  const initial = useMemo(() => readInitialState(), []);
  const [query, setQuery] = useState(initial.q);
  const [typeFilter, setTypeFilter] = useState<EntryType | 'all'>(initial.type ?? 'all');
  const [selectedId, setSelectedId] = useState<string | null>(initial.id || null);
  const [overlayId, setOverlayId] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { theme, cycle: cycleTheme } = useTheme();
  const { collapsed, toggle: togglePanel } = usePanel();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const { favorites, recents, frecencyMap, toggleFavorite, registerUse } = useUsage();
  const { message, copy } = useCopy();
  useFocusHotkey(inputRef);

  const parsed = useMemo(() => parseQuery(query), [query]);
  const activeTags = parsed.tags;
  const effectiveType: EntryType | 'all' = parsed.type ?? typeFilter;
  const isSearching = parsed.text.length > 0;
  const browsingTags = !isSearching && activeTags.length > 0;
  const panelVisible = isDesktop && !collapsed;

  const results = useSearch(parsed.text, frecencyMap, effectiveType);
  const tagFiltered = useMemo(
    () =>
      activeTags.length === 0
        ? results
        : results.filter((item) =>
            activeTags.every((tag) =>
              (item.entry.tags ?? []).some((value) => value.toLowerCase() === tag),
            ),
          ),
    [results, activeTags],
  );

  const browseResults = useMemo(() => {
    if (!browsingTags) return [] as Entry[];
    return ENTRIES.filter(
      (entry) =>
        (effectiveType === 'all' || entry.type === effectiveType) &&
        activeTags.every((tag) => (entry.tags ?? []).some((value) => value.toLowerCase() === tag)),
    )
      .map((entry) => ({ entry, value: frecencyValue(frecencyMap[entry.id]) }))
      .sort((a, b) => b.value - a.value || a.entry.title.localeCompare(b.entry.title))
      .map((item) => item.entry);
  }, [browsingTags, effectiveType, activeTags, frecencyMap]);

  const home = useMemo(
    () => buildHome(ENTRIES, favorites, recents, effectiveType),
    [favorites, recents, effectiveType],
  );

  const topUsed = useMemo(
    () =>
      ENTRIES.map((entry) => ({ entry, value: frecencyValue(frecencyMap[entry.id]) }))
        .filter((item) => item.value > 0)
        .sort((a, b) => b.value - a.value)
        .slice(0, 5)
        .map((item) => item.entry),
    [frecencyMap],
  );

  const restShown = useMemo(() => home.rest.slice(0, HOME_LIMIT), [home]);
  const restRemaining = home.rest.length - restShown.length;

  // Ids visibles en el orden en que se muestran.
  const orderedIds = useMemo(() => {
    if (isSearching) return tagFiltered.map((item) => item.entry.id);
    if (browsingTags) return browseResults.map((entry) => entry.id);
    return [...home.favorites, ...home.recents, ...restShown].map((entry) => entry.id);
  }, [isSearching, tagFiltered, browsingTags, browseResults, home, restShown]);

  /*
   * Seleccion activa derivada (sin efectos): al buscar o filtrar por etiqueta se
   * previsualiza el primer resultado; la seleccion se descarta si deja de existir.
   * Es la que alimenta el `value` controlado de cmdk y la tarjeta de detalle.
   */
  const activeId =
    selectedId && orderedIds.includes(selectedId)
      ? selectedId
      : isSearching || browsingTags
        ? (orderedIds[0] ?? null)
        : null;

  const selected = activeId ? (byId.get(activeId) ?? null) : null;
  const overlayEntry = overlayId ? (byId.get(overlayId) ?? null) : null;

  const related = useMemo(
    () => (selected ? findRelated(selected, ENTRIES, 6).map((item) => item.entry) : []),
    [selected],
  );

  const useCount = selected ? (frecencyMap[selected.id]?.count ?? 0) : 0;

  useUrlState(query, typeFilter, activeId);

  // Atajos globales: Esc limpia la busqueda, ? abre la ayuda.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (overlayId || helpOpen) return; // el dialogo lo maneja
        if (query) setQuery('');
        return;
      }
      if (event.key === '?' && !isTypingTarget(event.target)) {
        event.preventDefault();
        setHelpOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [overlayId, helpOpen, query]);

  /**
   * Clic / Enter en un resultado: solo selecciona (la tarjeta aparece en el panel).
   * En movil o con el panel colapsado, abre el overlay. Copiar es una accion
   * explicita desde el boton de la tarjeta.
   */
  const handleSelect = (entry: Entry) => {
    registerUse(entry.id);
    setSelectedId(entry.id);
    if (!panelVisible) setOverlayId(entry.id);
  };

  /** Elegir desde "Relacionados", "Mas usados" o vacio: selecciona sin copiar. */
  const handlePick = (entry: Entry) => {
    setSelectedId(entry.id);
    if (overlayId) setOverlayId(entry.id);
  };

  const handleTagClick = (tag: string) => {
    setQuery(`#${tag.toLowerCase()}`);
    inputRef.current?.focus();
  };

  const handleKeywordClick = (keyword: string) => {
    setQuery(keyword);
    inputRef.current?.focus();
  };

  const handleTypeChange = (value: EntryType | 'all') => {
    setTypeFilter(value);
    if (parsed.type) setQuery(removeTypeToken(query));
  };

  const renderItem = (entry: Entry) => (
    <ResultItem key={entry.id} entry={entry} query={parsed.text} onSelect={handleSelect} />
  );

  const hasHomeShortcuts = home.favorites.length > 0 || home.recents.length > 0;
  const resultCount = isSearching
    ? tagFiltered.length
    : browsingTags
      ? browseResults.length
      : home.favorites.length + home.recents.length + home.rest.length;

  const themeLabel = theme === 'dark' ? 'oscuro' : theme === 'light' ? 'claro' : 'segun el sistema';
  const ThemeIcon = theme === 'dark' ? Sun : theme === 'light' ? Moon : Monitor;

  return (
    <div className="flex h-full flex-col">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-3 overflow-hidden p-3 sm:p-5 2xl:max-w-[1400px]">
        <header className="flex items-center justify-between gap-4 px-1">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold text-ink">Meddex</span>
            <span className="hidden text-xs text-muted sm:inline">
              Segundo cerebro clinico · protocolos, click-paths de eCW y diccionario
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setHelpOpen(true)}
              aria-label="Atajos de teclado"
              className="rounded-md p-2 text-muted transition hover:bg-ink/5 hover:text-ink"
            >
              <HelpCircle size={17} />
            </button>
            <button
              type="button"
              onClick={togglePanel}
              aria-label={collapsed ? 'Mostrar panel de detalle' : 'Ocultar panel de detalle'}
              aria-pressed={!collapsed}
              className="hidden rounded-md p-2 text-muted transition hover:bg-ink/5 hover:text-ink lg:inline-flex"
            >
              {collapsed ? <PanelRightOpen size={17} /> : <PanelRightClose size={17} />}
            </button>
            <button
              type="button"
              onClick={cycleTheme}
              aria-label={`Tema ${themeLabel}. Cambiar tema`}
              className="rounded-md p-2 text-muted transition hover:bg-ink/5 hover:text-ink"
            >
              <ThemeIcon size={17} />
            </button>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-3 lg:flex-row">
          <Command
            shouldFilter={false}
            loop
            label="Buscador de protocolos y acronimos"
            value={activeId ?? ''}
            onValueChange={setSelectedId}
            className={collapsed ? LIST_COLLAPSED : LIST_EXPANDED}
          >
            <div className="flex items-center gap-2.5 border-b border-edge px-4 has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-accent/50 has-[input:focus-visible]:ring-inset">
              <Search size={18} aria-hidden className="shrink-0 text-muted" />
              <Command.Input
                ref={inputRef}
                value={query}
                onValueChange={setQuery}
                autoFocus
                spellCheck={false}
                aria-label="Buscar en protocolos, acronimos y diccionario"
                placeholder="Busca UTI, refill, PHQ-9, tag:triage, #eCW..."
                className="h-14 w-full bg-transparent text-base text-ink outline-none placeholder:text-muted"
              />
              {query.length > 0 && (
                <button
                  type="button"
                  aria-label="Limpiar busqueda"
                  onClick={() => {
                    setQuery('');
                    inputRef.current?.focus();
                  }}
                  className="shrink-0 rounded-md p-1.5 text-muted transition hover:bg-ink/5 hover:text-ink"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex flex-col gap-2 border-b border-edge px-3 py-2">
              <CategoryFilter value={effectiveType} onChange={handleTypeChange} />
              <ActiveFilters
                type={parsed.type}
                tags={activeTags}
                onRemoveType={() => {
                  setQuery(removeTypeToken(query));
                  setTypeFilter('all');
                }}
                onRemoveTag={(tag) => setQuery(removeTagToken(query, tag))}
              />
            </div>

            <div aria-live="polite" className="sr-only">
              {isSearching || browsingTags ? `${resultCount} resultados` : ''}
            </div>

            <Command.List className="min-h-0 flex-1 overflow-y-auto p-1.5">
              <Command.Empty className="px-4 py-10 text-center text-sm text-muted">
                Sin resultados para “{query}”.
              </Command.Empty>

              {isSearching ? (
                tagFiltered.map((item) => renderItem(item.entry))
              ) : browsingTags ? (
                <Command.Group heading={`#${activeTags.join(' #')}`} className={GROUP_CLASS}>
                  {browseResults.map(renderItem)}
                </Command.Group>
              ) : (
                <>
                  {home.favorites.length > 0 && (
                    <Command.Group heading="Fijados" className={GROUP_CLASS}>
                      {home.favorites.map(renderItem)}
                    </Command.Group>
                  )}
                  {home.recents.length > 0 && (
                    <Command.Group heading="Recientes" className={GROUP_CLASS}>
                      {home.recents.map(renderItem)}
                    </Command.Group>
                  )}
                  <Command.Group
                    heading={hasHomeShortcuts ? 'Todo lo demas' : 'Todo'}
                    className={GROUP_CLASS}
                  >
                    {restShown.map(renderItem)}
                  </Command.Group>
                  {restRemaining > 0 && (
                    <p className="px-3 pb-2 text-center text-[11px] text-muted">
                      {restRemaining} entradas mas · escribe para filtrar
                    </p>
                  )}
                </>
              )}
            </Command.List>
          </Command>

          {!collapsed && (
            <section className="hidden min-h-0 flex-1 flex-col gap-3 lg:flex">
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-edge bg-panel shadow-sm">
                {selected ? (
                  <DetailCard
                    entry={selected}
                    isFavorite={favorites.includes(selected.id)}
                    useCount={useCount}
                    onToggleFavorite={toggleFavorite}
                    onCopy={copy}
                    onTagClick={handleTagClick}
                    onKeywordClick={handleKeywordClick}
                  />
                ) : (
                  <EmptyPanel
                    total={ENTRIES.length}
                    topUsed={topUsed}
                    favorites={home.favorites}
                    onPick={handlePick}
                  />
                )}
              </div>

              {selected && related.length > 0 && (
                <div className="max-h-[38%] shrink-0 overflow-hidden rounded-2xl border border-edge bg-panel shadow-sm 2xl:hidden">
                  <RelatedEntries entries={related} onPick={handlePick} />
                </div>
              )}

              <div className="shrink-0">
                <CrisisBanner />
              </div>
            </section>
          )}

          {!collapsed && selected && related.length > 0 && (
            <aside className="hidden w-[300px] shrink-0 flex-col overflow-hidden rounded-2xl border border-edge bg-panel shadow-sm 2xl:flex">
              <RelatedEntries entries={related} onPick={handlePick} />
            </aside>
          )}
        </div>
      </main>

      <StatusBar />
      <Toast message={message} />

      {overlayEntry && (
        <DetailOverlay
          entry={overlayEntry}
          isFavorite={favorites.includes(overlayEntry.id)}
          useCount={frecencyMap[overlayEntry.id]?.count ?? 0}
          onToggleFavorite={toggleFavorite}
          onCopy={copy}
          onTagClick={handleTagClick}
          onKeywordClick={handleKeywordClick}
          onPick={handlePick}
          onClose={() => setOverlayId(null)}
        />
      )}

      {helpOpen && <HelpOverlay onClose={() => setHelpOpen(false)} />}
    </div>
  );
}
