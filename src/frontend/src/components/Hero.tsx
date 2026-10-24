import { CharroSilhouette } from "@/components/CharroSilhouette";
import { ArrowDown } from "lucide-react";

export function Hero() {
  return (
    <section
      id="portada"
      data-ocid="hero.section"
      className="relative isolate overflow-hidden border-b border-border"
    >
      {/* Atmosphere layers */}
      <div
        className="pointer-events-none absolute inset-0 fog-layer"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 mist-drift fog-layer opacity-70"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 vignette"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-grain opacity-[0.04]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-32 sm:px-8 sm:pb-28 sm:pt-40 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <div className="animate-fade-rise">
          <div className="flex items-center gap-4">
            <span className="text-kicker text-muted-foreground">
              Leyenda Mexicana
            </span>
            <span className="h-px w-16 bg-accent/70" aria-hidden="true" />
          </div>

          <h1 className="mt-7 font-display text-5xl leading-[0.98] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            El Charro Negro
            <span className="mt-3 block font-accent text-3xl text-muted-foreground sm:text-4xl lg:text-5xl">
              el espectro de la noche
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Un jinete de sombrero ancho y mirada de brasa recorre los caminos
            solitarios. Quien lo encuentra de madrugada paga con su fortuna, y a
            veces con algo más. Esta es su historia, contada desde el origen
            hasta hoy.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#leyenda-real"
              data-ocid="hero.explore_button"
              className="group inline-flex items-center gap-3 rounded-full bg-primary px-7 py-3.5 text-sm font-medium tracking-wide text-primary-foreground transition-smooth hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Explorar la leyenda
              <ArrowDown
                className="size-4 transition-transform duration-300 group-hover:translate-y-0.5"
                aria-hidden="true"
              />
            </a>
            <a
              href="#curiosidades"
              data-ocid="hero.curiosities_link"
              className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-sm tracking-wide text-muted-foreground transition-smooth hover:border-accent/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Curiosidades
            </a>
          </div>

          <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-8">
            <div>
              <dt className="text-kicker text-muted-foreground">Origen</dt>
              <dd className="mt-2 font-display text-2xl text-foreground">
                1890
              </dd>
            </div>
            <div>
              <dt className="text-kicker text-muted-foreground">Apartados</dt>
              <dd className="mt-2 font-display text-2xl text-foreground">03</dd>
            </div>
            <div>
              <dt className="text-kicker text-muted-foreground">Estado</dt>
              <dd className="mt-2 font-display text-2xl text-foreground">
                Vigente
              </dd>
            </div>
          </dl>
        </div>

        <div className="relative animate-fade-in">
          <div className="relative mx-auto max-w-md lg:max-w-none">
            <CharroSilhouette className="h-auto w-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.7)]" />
            <p className="mt-6 text-center text-kicker text-muted-foreground">
              Representación del Charro Negro a caballo
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
