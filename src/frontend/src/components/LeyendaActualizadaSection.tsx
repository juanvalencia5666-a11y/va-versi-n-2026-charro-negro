import { LiveChatStory } from "@/components/LiveChatStory";
import { RecordingBoundary } from "@/components/NarrationButton";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { useNarration } from "@/hooks/use-narration";
import { useRecording } from "@/hooks/use-recording";
import { STORY_NARRATION_TEXT } from "@/lib/leyenda-actualizada";
import { Mic, Pause, Play, Square, Volume2 } from "lucide-react";
import { useEffect, useRef } from "react";

const PREFERRED_VOICES = [
  "Jorge",
  "Diego",
  "Carlos",
  "Juan",
  "Enrique",
  "Miguel",
  "Google español",
];

interface NarrationControlsProps {
  recordingUrl: string | null;
}

/**
 * Narration controls for the updated legend, keeping the section's own
 * ocid hooks. Plays the visitor's uploaded recording when one exists and
 * otherwise reads the story with the synthesized voice; stops when the
 * section leaves view.
 */
function NarrationControls({ recordingUrl }: NarrationControlsProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { status, supported, source, play, pause, stop } = useNarration({
    text: STORY_NARRATION_TEXT,
    recordingUrl,
    lang: "es-MX",
    preferredVoices: PREFERRED_VOICES,
    rate: 0.86,
    pitch: 0.55,
  });

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) stop();
        }
      },
      { threshold: 0.05 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      stop();
    };
  }, [stop]);

  const SourceIcon = source === "recording" ? Mic : Volume2;
  const sourceLabel =
    source === "recording" ? "Tu grabación" : "Voz sintetizada";

  return (
    <div ref={sectionRef} className="flex flex-wrap items-center gap-4">
      <button
        type="button"
        data-ocid="leyenda_actualizada.narration_button"
        onClick={status === "playing" ? pause : play}
        disabled={!supported && source === "voice"}
        aria-pressed={status === "playing"}
        className="group inline-flex min-h-11 items-center gap-3 rounded-full bg-primary px-7 py-3.5 text-sm font-medium tracking-wide text-primary-foreground transition-smooth hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "playing" ? (
          <Pause className="size-4" aria-hidden="true" />
        ) : (
          <Play className="size-4" aria-hidden="true" />
        )}
        {status === "playing"
          ? "Pausar"
          : status === "paused"
            ? "Reanudar"
            : "Escuchar esta historia"}
      </button>

      <button
        type="button"
        data-ocid="leyenda_actualizada.stop_button"
        onClick={stop}
        disabled={status === "idle"}
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm tracking-wide text-muted-foreground transition-smooth hover:border-accent/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Square className="size-4" aria-hidden="true" />
        Detener
      </button>

      <p
        data-ocid="leyenda_actualizada.narration_status"
        className="inline-flex items-center gap-2 text-kicker text-muted-foreground"
        aria-live="polite"
      >
        <SourceIcon className="size-3.5 text-ember" aria-hidden="true" />
        {!supported && source === "voice"
          ? "Narración no disponible"
          : status === "playing"
            ? `Reproduciendo · ${sourceLabel}`
            : status === "paused"
              ? `En pausa · ${sourceLabel}`
              : sourceLabel}
      </p>
    </div>
  );
}

/**
 * Reads the stored recording and renders the narration controls, falling back
 * to the synthesized voice when the recording backend is unavailable.
 */
function RecordingAwareControls() {
  const { data: recording } = useRecording();
  return <NarrationControls recordingUrl={recording?.url ?? null} />;
}

/**
 * Apartado 02 — Leyenda Actualizada. The Kevin story rendered as a live chat,
 * with a narration control that reads the story exactly as written. When the
 * visitor has uploaded a recording, that audio plays instead of the
 * synthesized voice; narration stops when the section leaves view.
 */
export function LeyendaActualizadaSection() {
  return (
    <section
      id="leyenda-actualizada"
      data-ocid="leyenda_actualizada.section"
      className="relative border-b border-border bg-card/40 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            index="02"
            kicker="La versión de hoy"
            title="Leyenda Actualizada"
            description="La historia de Kevin, un relato contemporáneo que devuelve al Charro Negro a las calles de la ciudad."
          />
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-10">
            <RecordingBoundary
              fallback={<NarrationControls recordingUrl={null} />}
            >
              <RecordingAwareControls />
            </RecordingBoundary>
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-12">
            <LiveChatStory />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
