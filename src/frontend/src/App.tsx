import { CuriosidadesSection } from "@/components/CuriosidadesSection";
import { Hero } from "@/components/Hero";
import { Layout } from "@/components/Layout";
import { LeyendaActualizadaSection } from "@/components/LeyendaActualizadaSection";
import { LeyendaRealSection } from "@/components/LeyendaRealSection";
import { RecordingUpload } from "@/components/RecordingUpload";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { CharroScene } from "@/components/charro/CharroScene";

export default function App() {
  return (
    <Layout>
      <Hero />

      {/* 01 — Leyenda Real */}
      <LeyendaRealSection />

      {/* 02 — Leyenda Actualizada */}
      <LeyendaActualizadaSection />

      {/* 02·Voz — Grabación propia del visitante */}
      <RecordingUpload />

      {/* 02b — El Charro Negro en 3D (versión TikTok 2026) */}
      <section
        id="charro-3d"
        data-ocid="charro.section"
        className="relative border-b border-border bg-background py-20 sm:py-28"
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <SectionHeading
              index="02·3D"
              kicker="Versión TikTok 2026"
              title="El Charro Negro en 3D"
              description="Explora al jinete montado a caballo en un desierto oscuro. Gira, acerca y toca cada punto para descubrir los datos del personaje."
            />
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-12">
              <CharroScene />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 03 — Curiosidades */}
      <CuriosidadesSection />
    </Layout>
  );
}
