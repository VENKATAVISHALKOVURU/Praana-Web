import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';

function SlowOrb() {
  const meshRef = useRef();
  
  useFrame((state) => {
    // Slow, soothing rotation
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.05;
  });

  return (
    <mesh ref={meshRef} scale={2.5} position={[2, 0, -2]}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial 
        color="#C3E5B2"
        roughness={0.2}
        metalness={0.1}
        distort={0.4}
        speed={1}
        transparent
        opacity={0.15}
      />
    </mesh>
  );
}

export default function InsightBackground3D() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-3xl opacity-60 mix-blend-multiply">
      <Canvas dpr={isMobile ? 1 : 1.5} camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
        <Suspense fallback={null}>
          <SlowOrb />
        </Suspense>
      </Canvas>
    </div>
  );
}
