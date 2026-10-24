import { CharroModel } from "@/components/charro/CharroModel";
import { DesertEnvironment } from "@/components/charro/DesertEnvironment";
import { DetailPanel } from "@/components/charro/DetailPanel";
import { CHARRO_DETAILS, type HotspotId } from "@/lib/charro-details";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useCallback, useState } from "react";

/**
 * Interactive 3D stage: dark desert with the Charro Negro on horseback.
 * Orbit / zoom with mouse or touch; click a hotspot to open its detail card.
 */
export function CharroScene() {
  const [activeId, setActiveId] = useState<HotspotId | null>(null);

  const handleSelect = useCallback((id: HotspotId) => {
    setActiveId((current) => (current === id ? null : id));
  }, []);

  const handleClose = useCallback(() => setActiveId(null), []);

  const activeDetail =
    CHARRO_DETAILS.find((detail) => detail.id === activeId) ?? null;

  return (
    <div className="relative">
      <div
        data-ocid="charro.canvas"
        className="vignette grain-overlay relative h-[62vh] min-h-[420px] w-full overflow-hidden rounded-lg border border-border bg-background sm:h-[70vh]"
      >
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [4.6, 2.6, 5.4], fov: 42 }}
          gl={{ antialias: true }}
        >
          <color attach="background" args={["#08080a"]} />
          <fog attach="fog" args={["#08080a", 8, 24]} />

          <ambientLight intensity={0.18} />
          <hemisphereLight
            intensity={0.12}
            color="#8a8a94"
            groundColor="#050506"
          />
          {/* Cold moonlight */}
          <directionalLight
            position={[-6, 8, -4]}
            intensity={1.1}
            color="#b9c4d6"
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          {/* Ember rim light */}
          <pointLight
            position={[3, 2.4, 3]}
            intensity={6}
            color="#b8442f"
            distance={12}
          />
          <pointLight
            position={[-3, 1.2, 2]}
            intensity={2.4}
            color="#5a6a86"
            distance={10}
          />

          <Suspense fallback={null}>
            <DesertEnvironment />
            <CharroModel activeId={activeId} onSelect={handleSelect} />
          </Suspense>

          <OrbitControls
            enablePan={false}
            enableDamping
            dampingFactor={0.08}
            minDistance={4}
            maxDistance={11}
            minPolarAngle={0.6}
            maxPolarAngle={1.5}
            target={[0, 1.5, 0]}
          />
        </Canvas>

        {/* Instruction chip */}
        <p className="pointer-events-none absolute left-3 top-3 z-10 rounded-sm border border-border bg-background/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground backdrop-blur-sm">
          Arrastra para girar · Rueda para acercar · Toca un punto
        </p>

        <DetailPanel detail={activeDetail} onClose={handleClose} />
      </div>

      {/* Hotspot legend / quick select */}
      <ul className="mt-5 flex flex-wrap gap-2">
        {CHARRO_DETAILS.map((detail) => {
          const isActive = activeId === detail.id;
          return (
            <li key={detail.id}>
              <button
                type="button"
                data-ocid={`charro.legend.${detail.id}`}
                aria-pressed={isActive}
                onClick={() => handleSelect(detail.id)}
                className={[
                  "rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                  isActive
                    ? "border-accent bg-accent/15 text-foreground"
                    : "border-border text-muted-foreground hover:border-accent/60 hover:text-foreground",
                ].join(" ")}
              >
                {detail.label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
