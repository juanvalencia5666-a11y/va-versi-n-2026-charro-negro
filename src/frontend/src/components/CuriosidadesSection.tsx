import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { CURIOSIDADES } from "@/lib/curiosidades";

/**
 * Curiosidades — a clean grid of legend facts, each with an icon and title.
 */
export function CuriosidadesSection() {
  return (
    <section
      id="curiosidades"
      data-ocid="curiosidades.section"
      className="relative py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            index="03"
            kicker="Detalles del personaje"
            title="Curiosidades"
            description="Los rasgos que definen al Charro Negro y que se repiten, con variaciones, en cada versión de la leyenda."
          />
        </Reveal>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CURIOSIDADES.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal as="li" key={item.id} delay={index * 60}>
                <article
                  data-ocid={`curiosidades.card.${index + 1}`}
                  className="group h-full rounded-lg border border-border bg-card p-6 transition-smooth hover:-translate-y-1 hover:border-accent/60 hover:shadow-elevated focus-within:border-accent/60"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-sm border border-border bg-background/60 text-ember transition-smooth group-hover:border-accent/60">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-xl text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
