import { memo, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";

interface HeroSceneProps {
  reducedMotion?: boolean;
}

const PALETTE = ["#0f766e", "#0d9488", "#14b8a6", "#99f6e4", "#1f2937"];

function FloatingGeometry({
  position,
  color,
  type,
  reducedMotion,
}: {
  position: [number, number, number];
  color: string;
  type: "sphere" | "torus" | "icosahedron";
  reducedMotion: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current || reducedMotion) {
      return;
    }

    meshRef.current.rotation.x = state.clock.elapsedTime * 0.08;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.12;
  });

  const geometry = useMemo(() => {
    switch (type) {
      case "torus":
        return <torusGeometry args={[0.9, 0.26, 24, 72]} />;
      case "icosahedron":
        return <icosahedronGeometry args={[0.95, 1]} />;
      default:
        return <sphereGeometry args={[0.9, 48, 48]} />;
    }
  }, [type]);

  return (
    <Float
      speed={reducedMotion ? 0 : 1.1}
      rotationIntensity={reducedMotion ? 0 : 0.5}
      floatIntensity={reducedMotion ? 0 : 0.9}
    >
      <mesh ref={meshRef} position={position}>
        {geometry}
        <meshStandardMaterial color={color} roughness={0.22} metalness={0.65} transparent opacity={0.68} />
      </mesh>
    </Float>
  );
}

function HeroSceneContent({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current || reducedMotion) {
      return;
    }

    const targetX = state.pointer.y * 0.22;
    const targetY = state.pointer.x * 0.28;
    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.04;
    groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.04;
  });

  return (
    <>
      <color attach="background" args={["#eff5f2"]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 4]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-5, -4, 5]} intensity={1.1} color="#99f6e4" />

      <group ref={groupRef} position={[1.15, 0, 0]}>
        <FloatingGeometry position={[-1.8, 1.4, -0.5]} color={PALETTE[0]} type="sphere" reducedMotion={reducedMotion} />
        <FloatingGeometry position={[2.75, 1.2, -0.15]} color={PALETTE[1]} type="torus" reducedMotion={reducedMotion} />
        <FloatingGeometry position={[1.05, -1.4, -0.85]} color={PALETTE[3]} type="icosahedron" reducedMotion={reducedMotion} />
      </group>

      <Environment preset="city" />
    </>
  );
}

function HeroScene({ reducedMotion = false }: HeroSceneProps) {
  if (reducedMotion) {
    return (
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="landing-ambient-orb left-[-12%] top-[10%] h-56 w-56 bg-primary/25" />
        <div className="landing-ambient-orb right-[-10%] top-[24%] h-72 w-72 bg-emerald-300/20" />
        <div className="landing-ambient-orb bottom-[-20%] left-[32%] h-64 w-64 bg-teal-300/20" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <Canvas
        dpr={[1, 1.6]}
        camera={{ fov: 44, position: [0, 0, 8.6] }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <HeroSceneContent reducedMotion={false} />
      </Canvas>
      <div className="landing-grid-overlay" />
    </div>
  );
}

export default memo(HeroScene);
