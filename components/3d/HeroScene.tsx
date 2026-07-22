'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function FloatingCards() {
  const groupRef = useRef<THREE.Group>(null);

  const cards = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10 - 5,
      ] as [number, number, number],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
      scale: 0.5 + Math.random() * 0.5,
      speed: 0.2 + Math.random() * 0.3,
    }));
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      groupRef.current.children.forEach((child, i) => {
        child.position.y += Math.sin(state.clock.elapsedTime * cards[i].speed + i) * 0.002;
        child.rotation.x = Math.sin(state.clock.elapsedTime * 0.3 + i) * 0.1;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {cards.map((card, i) => (
        <mesh key={i} position={card.position} rotation={card.rotation} scale={card.scale}>
          <boxGeometry args={[1.4, 1.4, 0.05]} />
          <meshStandardMaterial 
            color="#0a0a0a" 
            emissive="#00d4ff" 
            emissiveIntensity={0.1}
            wireframe
          />
        </mesh>
      ))}
    </group>
  );
}

function NeonGrid() {
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.elapsedTime * 0.5) % 2;
    }
  });

  return (
    <gridHelper 
      ref={gridRef}
      args={[40, 40, '#00d4ff', '#111']} 
      position={[0, -3, 0]}
    />
  );
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#00d4ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#39ff14" />
        <FloatingCards />
        <NeonGrid />
        <fog attach="fog" args={['#050505', 5, 20]} />
      </Canvas>
    </div>
  );
}
