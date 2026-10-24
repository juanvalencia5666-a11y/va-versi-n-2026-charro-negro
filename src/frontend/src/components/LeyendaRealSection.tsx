import { LegendTimeline } from "@/components/LegendTimeline";
import { SectionNarration } from "@/components/NarrationButton";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import {
  LEYENDA_NARRATION,
  LEYENDA_REAL,
  LEYENDA_TIMELINE,
} from "@/lib/leyenda-real";

const PREFERRED_VOICES = [
  "Jorge",
  "Diego",
  "Carlos",
  "Microsoft Jorge",
  "Google español",
];

/**
 * Apartado 01 — Leyenda Real. The original legend told in full, a vertical
 * timeline of its milestones, and a narration control that reads the story
 * aloud. When the visitor has uploaded a recording, that audio plays instead
 * of the synthesized voice; narration stops when the section leaves view.
 */
export function LeyendaRealSection() {
  return (
    <section
      id="leyenda-real"
      data-ocid="leyenda_real.section"
      className="relative border-b border-border py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            index="01"
            kicker="El origen"
            title="Leyenda Real"
            description="La versión que se cuenta desde hace más de un siglo, tal como se transmitió de boca en boca por los caminos de México."
          />
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-10">
            <SectionNarration
              text={LEYENDA_NARRATION}
              preferredVoices={PREFERRED_VOICES}
            />
          </div>
        </Reveal>

        <div className="mt-14 grid gap-14 lg:grid-cols-[1.35fr_0.65fr] lg:gap-16">
          <div className="space-y-10">
            {LEYENDA_REAL.map((chapter, index) => (
              <Reveal as="article" key={chapter.id} delay={index * 50}>
                <div data-ocid={`leyenda_real.chapter.${index + 1}`}>
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-ember">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-2xl text-foreground">
                      {chapter.title}
                    </h3>
                  </div>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                    {chapter.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <Reveal delay={120}>
              <div className="surface-card rounded-lg p-6 sm:p-8">
                <p className="text-kicker text-muted-foreground">
                  Línea del tiempo
                </p>
                <div className="rule-ember mt-4" aria-hidden="true" />
                <div className="mt-8">
                  <LegendTimeline milestones={LEYENDA_TIMELINE} />
                </div>
              </div>
            </Reveal>
          </aside>
        </div>
      </div>
    </section>
  );
}
