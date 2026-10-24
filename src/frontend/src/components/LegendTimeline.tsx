import { Reveal } from "@/components/Reveal";
import type { LegendMilestone } from "@/lib/leyenda-real";

interface LegendTimelineProps {
  milestones: LegendMilestone[];
}

/**
 * Vertical editorial timeline for the original legend. A hairline spine runs
 * down the left with numbered markers; each milestone reveals on scroll.
 */
export function LegendTimeline({ milestones }: LegendTimelineProps) {
  return (
    <ol
      data-ocid="leyenda_real.timeline"
      className="relative space-y-10 border-l border-border pl-8 sm:pl-10"
    >
      {milestones.map((milestone, index) => (
        <Reveal as="li" key={milestone.id} delay={index * 70}>
          <div
            data-ocid={`leyenda_real.timeline.item.${index + 1}`}
            className="group relative"
          >
            <span
              aria-hidden="true"
              className="absolute -left-[41px] top-1 flex size-6 items-center justify-center rounded-full border border-border bg-background font-mono text-[0.625rem] text-ember transition-smooth group-hover:border-accent sm:-left-[49px]"
            >
              {milestone.marker}
            </span>
            <h3 className="font-display text-xl text-foreground">
              {milestone.title}
            </h3>
            <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground">
              {milestone.body}
            </p>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
