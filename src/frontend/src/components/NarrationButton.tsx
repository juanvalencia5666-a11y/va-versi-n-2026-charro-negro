import type { NarrationSource, NarrationStatus } from "@/hooks/use-narration";
import { useNarration } from "@/hooks/use-narration";
import { useRecording } from "@/hooks/use-recording";
import { Mic, Pause, Play, Square, Volume2 } from "lucide-react";
import { Component, type ReactNode, useEffect, useRef } from "react";

interface NarrationButtonProps {
  status: NarrationStatus;
  supported: boolean;
  source: NarrationSource;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  label?: string;
  ocid?: string;
}

const STATUS_LABEL: Record<NarrationStatus, string> = {
  idle: "Escuchar esta historia",
  playing: "Pausar narración",
  paused: "Reanudar narración",
};

const SOURCE_LABEL: Record<NarrationSource, string> = {
  recording: "Tu grabación",
  voice: "Voz sintetizada",
};

/**
 * Narration control with three explicit states: play, pause and stop.
 * The primary control toggles between play and pause; stop is always
 * available while a narration is in progress. The status line shows whether
 * the visitor's own recording or the synthesized voice is playing.
 */
export function NarrationButton({
  status,
  supported,
  source,
  onPlay,
  onPause,
  onStop,
  label = "Escuchar esta historia",
  ocid = "leyenda_real.narration",
}: NarrationButtonProps) {
  const isActive = status !== "idle";

  if (!supported && source === "voice") {
    return (
      <p
        data-ocid={`${ocid}.unsupported`}
        className="text-sm text-muted-foreground"
      >
        La narración en voz alta no está disponible en este navegador.
      </p>
    );
  }

  const primaryLabel = status === "idle" ? label : STATUS_LABEL[status];
  const SourceIcon = source === "recording" ? Mic : Volume2;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        data-ocid={`${ocid}.toggle_button`}
        onClick={status === "playing" ? onPause : onPlay}
        aria-label={primaryLabel}
        className="group inline-flex min-h-11 items-center gap-3 rounded-full border border-accent/50 bg-accent/10 px-6 py-3 text-sm font-medium tracking-wide text-foreground transition-smooth hover:border-accent hover:bg-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <span className="flex size-6 items-center justify-center rounded-full bg-accent/20 text-ember transition-transform duration-300 group-hover:scale-110">
          {status === "playing" ? (
            <Pause className="size-3.5" aria-hidden="true" />
          ) : (
            <Play className="size-3.5 translate-x-px" aria-hidden="true" />
          )}
        </span>
        {primaryLabel}
      </button>

      {isActive ? (
        <button
          type="button"
          data-ocid={`${ocid}.stop_button`}
          onClick={onStop}
          aria-label="Detener narración"
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-5 py-3 text-sm text-muted-foreground transition-smooth hover:border-foreground/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Square className="size-3.5" aria-hidden="true" />
          Detener
        </button>
      ) : null}

      <span
        data-ocid={`${ocid}.status`}
        aria-live="polite"
        className="inline-flex items-center gap-2 text-kicker text-muted-foreground"
      >
        <SourceIcon className="size-3.5 text-ember" aria-hidden="true" />
        {status === "playing"
          ? `Narrando · ${SOURCE_LABEL[source]}`
          : status === "paused"
            ? `En pausa · ${SOURCE_LABEL[source]}`
            : SOURCE_LABEL[source]}
      </span>
    </div>
  );
}

interface SectionNarrationProps {
  text: string;
  preferredVoices: string[];
  rate?: number;
  pitch?: number;
  ocid?: string;
  /** Stops narration when the section leaves the viewport. */
  stopOnLeave?: boolean;
}

/**
 * Recording-aware narration control for a story section. Plays the visitor's
 * uploaded recording when one exists and otherwise reads the text with the
 * synthesized voice. Stops when the section leaves the viewport.
 */
function RecordingAwareNarration({
  text,
  preferredVoices,
  rate,
  pitch,
  ocid,
  stopOnLeave = true,
}: SectionNarrationProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { data: recording } = useRecording();
  const { status, supported, source, play, pause, stop } = useNarration({
    text,
    recordingUrl: recording?.url ?? null,
    lang: "es-MX",
    preferredVoices,
    rate,
    pitch,
  });

  useEffect(() => {
    if (!stopOnLeave) return;
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) stop();
        }
      },
      { threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [stop, stopOnLeave]);

  return (
    <div ref={containerRef}>
      <NarrationButton
        status={status}
        supported={supported}
        source={source}
        onPlay={play}
        onPause={pause}
        onStop={stop}
        ocid={ocid}
      />
    </div>
  );
}

/**
 * Synthesized-voice-only narration control, used as the fallback when the
 * recording backend is unavailable.
 */
function SynthesizedNarration({
  text,
  preferredVoices,
  rate,
  pitch,
  ocid,
  stopOnLeave = true,
}: SectionNarrationProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { status, supported, source, play, pause, stop } = useNarration({
    text,
    recordingUrl: null,
    lang: "es-MX",
    preferredVoices,
    rate,
    pitch,
  });

  useEffect(() => {
    if (!stopOnLeave) return;
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) stop();
        }
      },
      { threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [stop, stopOnLeave]);

  return (
    <div ref={containerRef}>
      <NarrationButton
        status={status}
        supported={supported}
        source={source}
        onPlay={play}
        onPause={pause}
        onStop={stop}
        ocid={ocid}
      />
    </div>
  );
}

/**
 * Keeps the narration control usable when the recording backend is
 * unavailable (for example, outside the identity provider). On failure it
 * renders the synthesized-voice fallback instead of crashing the section.
 */
export class RecordingBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/**
 * Section narration control that prefers the visitor's uploaded recording and
 * degrades to the synthesized voice when the recording backend is unavailable.
 */
export function SectionNarration(props: SectionNarrationProps) {
  return (
    <RecordingBoundary fallback={<SynthesizedNarration {...props} />}>
      <RecordingAwareNarration {...props} />
    </RecordingBoundary>
  );
}
