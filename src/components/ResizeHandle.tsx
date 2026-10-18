import { useRef, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react';

interface ResizeHandleProps {
  width: number;
  min: number;
  max: number;
  label: string;
  /** Arrastrar hacia la izquierda agranda el panel (el handle esta a su izquierda). */
  onChange: (width: number) => void;
  onReset: () => void;
}

/** Separador arrastrable entre la lista y el panel de detalle. */
export function ResizeHandle({ width, min, max, label, onChange, onReset }: ResizeHandleProps) {
  const startX = useRef(0);
  const startWidth = useRef(width);
  const dragging = useRef(false);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    startX.current = event.clientX;
    startWidth.current = width;
    event.currentTarget.setPointerCapture(event.pointerId);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    onChange(startWidth.current - (event.clientX - startX.current));
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    dragging.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 96 : 24;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      onChange(width - step);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      onChange(width + step);
    } else if (event.key === 'Home') {
      event.preventDefault();
      onReset();
    }
  };

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={label}
      aria-valuenow={width}
      aria-valuemin={min}
      aria-valuemax={max}
      tabIndex={0}
      title={label}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onDoubleClick={onReset}
      onKeyDown={onKeyDown}
      className="hidden w-1.5 shrink-0 cursor-col-resize rounded-full bg-transparent transition hover:bg-accent/40 focus-visible:bg-accent/60 lg:block print:hidden"
    />
  );
}
