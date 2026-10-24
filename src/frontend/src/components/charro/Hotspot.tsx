import type { HotspotId } from "@/lib/charro-details";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import type { Group } from "three";

interface HotspotProps {
  id: HotspotId;
  label: string;
  position: [number, number, number];
  active: boolean;
  onSelect: (id: HotspotId) => void;
}

/**
 * A clickable marker anchored in 3D space. Renders a pulsing ring plus a
 * label chip that appears on hover or when the hotspot is active.
 */
export function Hotspot({
  id,
  label,
  position,
  active,
  onSelect,
}: HotspotProps) {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;
    const t = state.clock.elapsedTime;
    const pulse = 1 + Math.sin(t * 2.4 + position[0] * 3) * 0.12;
    group.scale.setScalar(active ? pulse * 1.15 : pulse);
  });

  return (
    <group ref={groupRef} position={position}>
      <Html center distanceFactor={9} zIndexRange={[20, 0]}>
        <button
          type="button"
          data-ocid={`charro.hotspot.${id}`}
          aria-label={`Ver detalles: ${label}`}
          aria-pressed={active}
          onClick={(event) => {
            event.stopPropagation();
            onSelect(id);
          }}
          onPointerOver={(event) => {
            event.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={() => setHovered(false)}
          className={[
            "group relative flex size-9 items-center justify-center rounded-full border transition-smooth",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            active
              ? "border-accent bg-accent/25"
              : "border-foreground/40 bg-background/60 hover:border-accent hover:bg-accent/15",
          ].join(" ")}
        >
          <span
            aria-hidden="true"
            className={[
              "absolute inset-0 rounded-full border",
              active ? "border-accent/70" : "border-foreground/25",
              "animate-ping motion-reduce:animate-none",
            ].join(" ")}
          />
          <span
            aria-hidden="true"
            className={[
              "size-2 rounded-full transition-smooth",
              active ? "bg-accent" : "bg-foreground/70 group-hover:bg-accent",
            ].join(" ")}
          />
          <span
            className={[
              "pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-sm border border-border bg-popover px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground transition-smooth",
              hovered || active ? "opacity-100" : "opacity-0",
            ].join(" ")}
          >
            {label}
          </span>
        </button>
      </Html>
    </group>
  );
}
