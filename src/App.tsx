import { Command } from 'cmdk';
import { Moon, PanelRightClose, PanelRightOpen, Search, Sun, X } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { CategoryFilter } from '@/components/CategoryFilter';
import { CrisisBanner } from '@/components/CrisisBanner';
import { DetailCard } from '@/components/DetailCard';
import { DetailOverlay } from '@/components/DetailOverlay';
import { EmptyPanel } from '@/components/EmptyPanel';
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
import { useUsage } from '@/hooks/useUsage';
import { findRelated } from '@/lib/related';
import { primaryCopyText } from '@/lib/search';
import { frecencyValue } from '@/lib/storage';
import type { Entry, EntryType } from '@/lib/types';

const byId = new Map(ENTRIES.map((entry) => [entry.id, entry]));

const GROUP_CLASS =
  'px-1 pb-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-muted [&_[cmdk-group-heading]]:uppercase';

const LIST_BASE =
  'flex min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-edge bg-panel shadow-sm';
const LIST_EXPANDED = `${LIST_BASE} lg:w-[440px] lg:shrink-0 xl:w-[500px]`;
const LIST_COLLAPSED = `${LIST_BASE} lg:mx-auto lg:max-w-3xl`;

export default function App() {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<EntryType | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [overlayId, setOverlayId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { theme, toggle: toggleTheme } = useTheme();
  const { collapsed, toggle: togglePanel } = usePanel();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const { favorites, recents, frecencyMap, toggleFavorite, registerUse } = useUsage();
  const { message, copy } = useCopy();
  useFocusHotkey(inputRef);

  const results = useSearch(query, frecencyMap, typeFilter);
  const isSearching = query.trim().length > 0;
  const panelVisible = isDesktop && !collapsed;

  const home = useMemo(() => {
    const isVisible = (entry: Entry | undefined): entry is Entry =>
      Boolean(entry) && (typeFilter === 'all' || entry!.type === typeFilter);

    const favoriteEntries = favorites.map((id) => byId.get(id)).filter(isVisible);
    const recentEntries = recents.map((id) => byId.get(id)).filter(isVisible);
    const seen = new Set([...favorites, ...recents]);
    const rest = ENTRIES.filter(
      (entry) => !seen.has(entry.id) && (typeFilter === 'all' || entry.type === typeFilter),
    );

    return { favoriteEntries, recentEntries, rest };
  }, [favorites, recents, typeFilter]);

  const topUsed = useMemo(
    () =>
      ENTRIES.map((entry) => ({ entry, value: frecencyValue(frecencyMap[entry.id]) }))
        .filter((item) => item.value > 0)
        .sort((a, b) => b.value - a.value)
        .slice(0, 5)
        .map((item) => item.entry),
    [frecencyMap],
  );

  const favoriteEntries = useMemo(
    () => favorites.map((id) => byId.get(id)).filter((entry): entry is Entry => Boolean(entry)),
    [favorites],
  );

  const selected = selectedId ? (byId.get(selectedId) ?? null) : null;
  const overlayEntry = overlayId ? (byId.get(overlayId) ?? null) : null;

  const related = useMemo(
    () => (selected ? findRelated(selected, ENTRIES, 6).map((item) => item.entry) : []),
    [selected],
  );

  const useCount = selected ? (frecencyMap[selected.id]?.count ?? 0) : 0;

  /** Enter/clic en la lista: copia si el panel esta visible, si no abre la tarjeta. */
  const handleSelect = (entry: Entry) => {
    registerUse(entry.id);
    if (panelVisible) {
      void copy(primaryCopyText(entry));
    } else {
      setOverlayId(entry.id);
    }
  };

  /** Elegir desde "Relacionados", "Mas usados" o vacio: selecciona sin copiar. */
  const handlePick = (entry: Entry) => {
    setSelectedId(entry.id);
    if (overlayId) setOverlayId(entry.id);
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    inputRef.current?.focus();
  };

  const renderItem = (entry: Entry) => (
    <ResultItem
      key={entry.id}
      entry={entry}
      isFavorite={favorites.includes(entry.id)}
      onToggleFavorite={toggleFavorite}
      onSelect={handleSelect}
    />
  );

  const hasHomeShortcuts = home.favoriteEntries.length > 0 || home.recentEntries.length > 0;

  return (
    <div className="flex h-full flex-col">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-3 overflow-hidden p-3 sm:p-5 2xl:max-w-[1400px]">
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
              onClick={togglePanel}
              aria-label={collapsed ? 'Mostrar panel de detalle' : 'Ocultar panel de detalle'}
              aria-pressed={!collapsed}
              className="hidden rounded-md p-2 text-muted transition hover:bg-ink/5 hover:text-ink lg:inline-flex"
            >
              {collapsed ? <PanelRightOpen size={17} /> : <PanelRightClose size={17} />}
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
              className="rounded-md p-2 text-muted transition hover:bg-ink/5 hover:text-ink"
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-3 lg:flex-row">
          <Command
            shouldFilter={false}
            loop
            label="Buscador de protocolos y acronimos"
            onValueChange={setSelectedId}
            className={collapsed ? LIST_COLLAPSED : LIST_EXPANDED}
          >
            <div className="flex items-center gap-2.5 border-b border-edge px-4">
              <Search size={18} className="shrink-0 text-muted" />
              <Command.Input
                ref={inputRef}
                value={query}
                onValueChange={setQuery}
                autoFocus
                spellCheck={false}
                placeholder="Busca UTI, refill, presion alta, PHQ-9..."
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

            <div className="border-b border-edge px-3 py-2">
              <CategoryFilter value={typeFilter} onChange={setTypeFilter} />
            </div>

            <Command.List className="min-h-0 flex-1 overflow-y-auto p-1.5">
              <Command.Empty className="px-4 py-10 text-center text-sm text-muted">
                Sin resultados para “{query}”.
              </Command.Empty>

              {isSearching ? (
                results.map((item) => renderItem(item.entry))
              ) : (
                <>
                  {home.favoriteEntries.length > 0 && (
                    <Command.Group heading="Fijados" className={GROUP_CLASS}>
                      {home.favoriteEntries.map(renderItem)}
                    </Command.Group>
                  )}
                  {home.recentEntries.length > 0 && (
                    <Command.Group heading="Recientes" className={GROUP_CLASS}>
                      {home.recentEntries.map(renderItem)}
                    </Command.Group>
                  )}
                  <Command.Group
                    heading={hasHomeShortcuts ? 'Todo lo demas' : 'Todo'}
                    className={GROUP_CLASS}
                  >
                    {home.rest.map(renderItem)}
                  </Command.Group>
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
                  />
                ) : (
                  <EmptyPanel
                    total={ENTRIES.length}
                    topUsed={topUsed}
                    favorites={favoriteEntries}
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
      </div>

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
          onPick={handlePick}
          onClose={() => setOverlayId(null)}
        />
      )}
    </div>
  );
}
