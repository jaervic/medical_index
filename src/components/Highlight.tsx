import { highlightSegments } from '@/lib/highlight';

/** Resalta el fragmento de `text` que coincide con la busqueda. */
export function Highlight({ text, query }: { text: string; query: string }) {
  const segments = highlightSegments(text, query);
  if (segments.length === 1 && !segments[0].match) return <>{text}</>;

  return (
    <>
      {segments.map((segment, index) =>
        segment.match ? (
          <mark key={index} className="rounded-[3px] bg-accent/25 text-inherit dark:bg-accent/30">
            {segment.text}
          </mark>
        ) : (
          <span key={index}>{segment.text}</span>
        ),
      )}
    </>
  );
}
