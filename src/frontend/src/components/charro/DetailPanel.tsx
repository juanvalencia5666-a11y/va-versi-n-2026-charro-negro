import type { CharroDetail } from "@/lib/charro-details";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";

interface DetailPanelProps {
  detail: CharroDetail | null;
  onClose: () => void;
}

/**
 * Slide-in detail card for the selected hotspot. Closes on Escape and
 * restores focus to the trigger on unmount.
 */
export function DetailPanel({ detail, onClose }: DetailPanelProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!detail) return;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [detail, onClose]);

  if (!detail) return null;

  return (
    <aside
      data-ocid="charro.detail_panel"
      aria-live="polite"
      className="pointer-events-auto absolute inset-x-3 bottom-3 z-20 max-h-[70%] overflow-y-auto rounded-lg border border-border bg-popover/95 p-5 shadow-elevated backdrop-blur-sm sm:inset-x-auto sm:right-4 sm:top-4 sm:bottom-auto sm:w-80"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-kicker text-ember">{detail.label}</p>
          <h3 className="mt-2 font-display text-2xl leading-tight text-foreground">
            {detail.title}
          </h3>
        </div>
        <button
          ref={closeRef}
          type="button"
          data-ocid="charro.detail_panel.close_button"
          aria-label="Cerrar ficha"
          onClick={onClose}
          className="flex size-8 shrink-0 items-center justify-center rounded-sm border border-border text-muted-foreground transition-smooth hover:border-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>

      <p className="mt-3 font-accent text-lg leading-snug text-foreground/90">
        {detail.tagline}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {detail.description}
      </p>

      <ul className="mt-5 space-y-2 border-t border-border pt-4">
        {detail.facts.map((fact) => (
          <li
            key={fact}
            className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
          >
            <span
              aria-hidden="true"
              className="mt-2 size-1.5 shrink-0 rounded-full bg-accent"
            />
            <span>{fact}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
