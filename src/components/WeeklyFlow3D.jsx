import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float } from '@react-three/drei';

function Orb({ position, isCurrent, isPast, isHovered, onHover }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (isCurrent) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x += 0.005;
    }
  });

  const color = isCurrent ? '#C3E5B2' : isPast ? '#0D2E19' : '#e6f4e1';
  const distort = isCurrent ? 0.5 : isPast ? 0.1 : 0.2;
  const speed = isCurrent ? 4 : 2;
  // Increase scale slightly when hovered, and make the current orb inherently larger
  const scale = isCurrent ? (isHovered ? 1.4 : 1.3) : (isHovered ? 1.1 : 1.0);
  const opacity = isPast ? 0.8 : isCurrent ? 1 : 0.5;
  
  return (
    <Float speed={speed} rotationIntensity={isCurrent ? 1 : 0.2} floatIntensity={isCurrent ? 2 : 0.5}>
      <group position={position}>
        <mesh 
          ref={meshRef}
          scale={scale}
          onPointerOver={() => onHover(true)}
          onPointerOut={() => onHover(false)}
        >
          {/* Base sphere geometry */}
          <sphereGeometry args={[0.35, 32, 32]} />
          <MeshDistortMaterial 
            color={color}
            roughness={0.2}
            metalness={0.1}
            distort={distort}
            speed={speed}
            transparent
            opacity={opacity}
            emissive={isCurrent ? '#C3E5B2' : '#000000'}
            emissiveIntensity={isCurrent ? 0.2 : 0}
          />
        </mesh>
      </group>
    </Float>
  );
}

export default function WeeklyFlow3D() {
  // Use translations if available, else fallback to letters
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  // Simulated current day (Wednesday = 3)
  const currentDayIndex = 3; 
  const [hoveredDay, setHoveredDay] = useState(null);

  // Spacing for the 7 orbs to fit within the camera frustum at Z=6
  const spacing = 0.85;
  const startX = -((days.length - 1) * spacing) / 2;

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="w-full h-32 md:h-40 relative group cursor-pointer">
      <Canvas dpr={isMobile ? 1 : 2} camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#C3E5B2" />
        
        <Suspense fallback={null}>
          {days.map((day, i) => (
            <Orb 
              key={i}
              position={[startX + i * spacing, 0, 0]}
              isCurrent={i === currentDayIndex}
              isPast={i < currentDayIndex}
              isHovered={hoveredDay === i}
              onHover={(state) => setHoveredDay(state ? i : null)}
            />
          ))}
        </Suspense>
      </Canvas>
      
      {/* Overlay text for days */}
      <div className="absolute bottom-0 left-0 w-full flex justify-between px-2 md:px-6 pointer-events-none">
        {days.map((day, i) => (
          <span 
            key={i} 
            className={`font-bold text-[10px] md:text-xs transition-colors w-8 text-center ${
              i === currentDayIndex ? 'text-[#0D2E19] scale-110 drop-shadow-sm' : 
              i < currentDayIndex ? 'text-[#0D2E19]/70' : 'text-[#0D2E19]/40'
            }`}
          >
            {day}
          </span>
        ))}
      </div>
    </div>
  );
}
