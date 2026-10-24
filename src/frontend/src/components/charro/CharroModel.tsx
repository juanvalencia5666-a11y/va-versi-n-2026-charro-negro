import { Hotspot } from "@/components/charro/Hotspot";
import { CHARRO_DETAILS, type HotspotId } from "@/lib/charro-details";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

interface CharroModelProps {
  activeId: HotspotId | null;
  onSelect: (id: HotspotId) => void;
}

const DARK = "#0d0d0f";
const DARKER = "#08080a";
const SILVER = "#8f8f98";
const EMBER = "#b8442f";

/**
 * Stylized low-poly Charro Negro on horseback, assembled from primitives.
 * The whole group breathes with a slow idle motion.
 */
export function CharroModel({ activeId, onSelect }: CharroModelProps) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;
    const t = state.clock.elapsedTime;
    group.position.y = Math.sin(t * 0.9) * 0.035;
    group.rotation.z = Math.sin(t * 0.6) * 0.012;
  });

  return (
    <group ref={groupRef}>
      {/* ---------- Horse ---------- */}
      <group position={[0, 0.95, 0]}>
        {/* Body */}
        <mesh castShadow position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.42, 1.15, 8, 16]} />
          <meshStandardMaterial color={DARK} roughness={0.85} metalness={0.1} />
        </mesh>
        {/* Chest */}
        <mesh castShadow position={[0.72, 0.05, 0]}>
          <sphereGeometry args={[0.44, 20, 20]} />
          <meshStandardMaterial color={DARK} roughness={0.85} />
        </mesh>
        {/* Neck */}
        <mesh castShadow position={[1.02, 0.42, 0]} rotation={[0, 0, -0.7]}>
          <capsuleGeometry args={[0.2, 0.62, 6, 12]} />
          <meshStandardMaterial color={DARK} roughness={0.85} />
        </mesh>
        {/* Head */}
        <mesh castShadow position={[1.42, 0.78, 0]} rotation={[0, 0, -0.35]}>
          <boxGeometry args={[0.52, 0.26, 0.24]} />
          <meshStandardMaterial color={DARKER} roughness={0.8} />
        </mesh>
        {/* Ears */}
        <mesh position={[1.28, 0.98, 0.08]} rotation={[0, 0, -0.3]}>
          <coneGeometry args={[0.05, 0.16, 6]} />
          <meshStandardMaterial color={DARKER} />
        </mesh>
        <mesh position={[1.28, 0.98, -0.08]} rotation={[0, 0, -0.3]}>
          <coneGeometry args={[0.05, 0.16, 6]} />
          <meshStandardMaterial color={DARKER} />
        </mesh>
        {/* Fiery eyes */}
        <mesh position={[1.62, 0.82, 0.11]}>
          <sphereGeometry args={[0.035, 10, 10]} />
          <meshBasicMaterial color={EMBER} />
        </mesh>
        <mesh position={[1.62, 0.82, -0.11]}>
          <sphereGeometry args={[0.035, 10, 10]} />
          <meshBasicMaterial color={EMBER} />
        </mesh>
        {/* Mane */}
        <mesh position={[1.0, 0.72, 0]} rotation={[0, 0, -0.7]}>
          <boxGeometry args={[0.1, 0.5, 0.16]} />
          <meshStandardMaterial color={DARKER} roughness={1} />
        </mesh>
        {/* Tail */}
        <mesh position={[-0.85, 0.1, 0]} rotation={[0, 0, 0.5]}>
          <capsuleGeometry args={[0.09, 0.6, 6, 10]} />
          <meshStandardMaterial color={DARKER} roughness={1} />
        </mesh>

        {/* Legs */}
        {[
          [0.62, 0.2],
          [0.62, -0.2],
          [-0.62, 0.2],
          [-0.62, -0.2],
        ].map(([x, z]) => (
          <group key={`leg-${x}-${z}`} position={[x, -0.5, z]}>
            <mesh castShadow>
              <capsuleGeometry args={[0.075, 0.72, 4, 8]} />
              <meshStandardMaterial color={DARKER} roughness={0.9} />
            </mesh>
            {/* Silver rim / horseshoe */}
            <mesh position={[0, -0.42, 0]}>
              <torusGeometry args={[0.09, 0.025, 8, 16]} />
              <meshStandardMaterial
                color={SILVER}
                roughness={0.3}
                metalness={0.9}
              />
            </mesh>
          </group>
        ))}

        {/* Saddle */}
        <mesh position={[-0.05, 0.42, 0]}>
          <boxGeometry args={[0.7, 0.14, 0.62]} />
          <meshStandardMaterial color="#1a1a1d" roughness={0.7} />
        </mesh>
      </group>

      {/* ---------- Rider ---------- */}
      <group position={[-0.05, 1.55, 0]}>
        {/* Torso / traje */}
        <mesh castShadow position={[0, 0.42, 0]}>
          <capsuleGeometry args={[0.26, 0.5, 8, 16]} />
          <meshStandardMaterial color={DARK} roughness={0.6} metalness={0.15} />
        </mesh>
        {/* LED embroidery band */}
        <mesh position={[0, 0.5, 0.24]}>
          <boxGeometry args={[0.34, 0.05, 0.03]} />
          <meshBasicMaterial color="#cfe6ff" />
        </mesh>
        <mesh position={[0, 0.34, 0.25]}>
          <boxGeometry args={[0.3, 0.04, 0.03]} />
          <meshBasicMaterial color="#9fc4e8" />
        </mesh>
        {/* Shoulders */}
        <mesh position={[0.3, 0.66, 0]}>
          <sphereGeometry args={[0.13, 14, 14]} />
          <meshStandardMaterial color={DARK} roughness={0.6} />
        </mesh>
        <mesh position={[-0.3, 0.66, 0]}>
          <sphereGeometry args={[0.13, 14, 14]} />
          <meshStandardMaterial color={DARK} roughness={0.6} />
        </mesh>
        {/* Arms */}
        <mesh position={[0.34, 0.42, 0.12]} rotation={[0.5, 0, -0.25]}>
          <capsuleGeometry args={[0.075, 0.42, 4, 10]} />
          <meshStandardMaterial color={DARK} roughness={0.6} />
        </mesh>
        <mesh position={[-0.34, 0.42, 0.12]} rotation={[0.5, 0, 0.25]}>
          <capsuleGeometry args={[0.075, 0.42, 4, 10]} />
          <meshStandardMaterial color={DARK} roughness={0.6} />
        </mesh>
        {/* Head */}
        <mesh castShadow position={[0, 0.92, 0]}>
          <sphereGeometry args={[0.17, 18, 18]} />
          <meshStandardMaterial color={DARKER} roughness={0.7} />
        </mesh>
        {/* Sombrero — brim + crown + silver toquilla + chain */}
        <mesh position={[0, 1.06, 0]} rotation={[0.06, 0, 0]}>
          <cylinderGeometry args={[0.46, 0.5, 0.03, 32]} />
          <meshStandardMaterial color={DARKER} roughness={0.75} />
        </mesh>
        <mesh position={[0, 1.16, 0]}>
          <cylinderGeometry args={[0.2, 0.24, 0.22, 24]} />
          <meshStandardMaterial color={DARKER} roughness={0.75} />
        </mesh>
        <mesh position={[0, 1.06, 0]}>
          <torusGeometry args={[0.245, 0.018, 8, 32]} />
          <meshStandardMaterial
            color={SILVER}
            roughness={0.25}
            metalness={0.95}
          />
        </mesh>
        {/* Chain hanging from the brim */}
        <mesh position={[0.34, 0.98, 0.16]} rotation={[0.4, 0, 0.3]}>
          <torusGeometry args={[0.07, 0.012, 6, 14]} />
          <meshStandardMaterial
            color={SILVER}
            roughness={0.3}
            metalness={0.9}
          />
        </mesh>
        {/* Legs / botas */}
        <mesh position={[0.24, -0.02, 0.16]} rotation={[0.35, 0, 0]}>
          <capsuleGeometry args={[0.09, 0.5, 4, 10]} />
          <meshStandardMaterial
            color={DARKER}
            roughness={0.4}
            metalness={0.3}
          />
        </mesh>
        <mesh position={[-0.24, -0.02, 0.16]} rotation={[0.35, 0, 0]}>
          <capsuleGeometry args={[0.09, 0.5, 4, 10]} />
          <meshStandardMaterial
            color={DARKER}
            roughness={0.4}
            metalness={0.3}
          />
        </mesh>
        {/* Spur */}
        <mesh position={[0.3, -0.24, 0.2]}>
          <torusGeometry args={[0.05, 0.012, 6, 12]} />
          <meshStandardMaterial
            color={SILVER}
            metalness={0.9}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* ---------- Props: iPhone + contract ---------- */}
      {/* iPhone in the right hand */}
      <group position={[0.62, 1.7, 0.35]} rotation={[0.2, -0.4, 0.1]}>
        <mesh>
          <boxGeometry args={[0.11, 0.22, 0.015]} />
          <meshStandardMaterial
            color="#111114"
            roughness={0.3}
            metalness={0.5}
          />
        </mesh>
        <mesh position={[0, 0, 0.009]}>
          <planeGeometry args={[0.09, 0.19]} />
          <meshBasicMaterial color="#dbe9ff" />
        </mesh>
      </group>

      {/* Rolled contract in the left hand */}
      <group position={[-0.35, 1.75, 0.3]} rotation={[0.3, 0.5, 0.2]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.045, 0.045, 0.3, 12]} />
          <meshStandardMaterial color="#c9c4b4" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[0.05, 0.014, 8, 16]} />
          <meshStandardMaterial color="#3a0d0d" roughness={0.6} />
        </mesh>
      </group>

      {/* ---------- Interactive hotspots ---------- */}
      {CHARRO_DETAILS.map((detail) => (
        <Hotspot
          key={detail.id}
          id={detail.id}
          label={detail.label}
          position={detail.position}
          active={activeId === detail.id}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}
