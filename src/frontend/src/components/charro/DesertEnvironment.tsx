import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group, Mesh } from "three";

/**
 * Dark desert stage: ground plane, scattered rocks, distant cacti and a
 * slow-drifting fog band. Purely atmospheric — no interaction.
 */
export function DesertEnvironment() {
  const fogRef = useRef<Mesh>(null);
  const rocksRef = useRef<Group>(null);

  const rocks = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => {
        const angle = (i / 26) * Math.PI * 2;
        const radius = 4.5 + ((i * 37) % 60) / 10;
        return {
          id: `rock-${i}`,
          position: [
            Math.cos(angle) * radius,
            -0.02,
            Math.sin(angle) * radius,
          ] as [number, number, number],
          scale: 0.18 + ((i * 13) % 40) / 100,
          rotation: (i * 1.7) % Math.PI,
        };
      }),
    [],
  );

  const cacti = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const angle = (i / 7) * Math.PI * 2 + 0.6;
        const radius = 9 + ((i * 29) % 50) / 10;
        return {
          id: `cactus-${i}`,
          position: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius] as [
            number,
            number,
            number,
          ],
          height: 1.4 + ((i * 17) % 30) / 20,
        };
      }),
    [],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (fogRef.current) {
      fogRef.current.position.x = Math.sin(t * 0.08) * 1.6;
      fogRef.current.position.z = Math.cos(t * 0.06) * 1.2;
    }
    if (rocksRef.current) {
      rocksRef.current.rotation.y = t * 0.01;
    }
  });

  return (
    <group>
      {/* Ground */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.05, 0]}
        receiveShadow
      >
        <circleGeometry args={[26, 64]} />
        <meshStandardMaterial color="#0b0b0d" roughness={1} metalness={0} />
      </mesh>

      {/* Subtle ground ring to frame the model */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]}>
        <ringGeometry args={[3.4, 3.55, 96]} />
        <meshBasicMaterial color="#3a3a40" transparent opacity={0.35} />
      </mesh>

      {/* Rocks */}
      <group ref={rocksRef}>
        {rocks.map((rock) => (
          <mesh
            key={rock.id}
            position={rock.position}
            rotation={[0, rock.rotation, 0]}
            scale={rock.scale}
          >
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#141416" roughness={0.95} />
          </mesh>
        ))}
      </group>

      {/* Distant cacti silhouettes */}
      {cacti.map((cactus) => (
        <group key={cactus.id} position={cactus.position}>
          <mesh position={[0, cactus.height / 2, 0]}>
            <capsuleGeometry args={[0.09, cactus.height, 4, 8]} />
            <meshStandardMaterial color="#0e0e10" roughness={1} />
          </mesh>
          <mesh
            position={[0.22, cactus.height * 0.62, 0]}
            rotation={[0, 0, -0.5]}
          >
            <capsuleGeometry args={[0.06, cactus.height * 0.4, 4, 8]} />
            <meshStandardMaterial color="#0e0e10" roughness={1} />
          </mesh>
        </group>
      ))}

      {/* Drifting fog band */}
      <mesh
        ref={fogRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.35, 0]}
      >
        <planeGeometry args={[22, 22]} />
        <meshBasicMaterial color="#6b6b74" transparent opacity={0.05} />
      </mesh>
    </group>
  );
}
