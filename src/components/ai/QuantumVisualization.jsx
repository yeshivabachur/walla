import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line, Sphere, OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

function QuantumParticle({ position, color, speed }) {
  const mesh = useRef();
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.position.y += Math.sin(state.clock.elapsedTime * speed) * 0.02;
      mesh.current.rotation.x += 0.01;
      mesh.current.rotation.y += 0.01;
    }
  });

  return (
    <Sphere ref={mesh} position={position} args={[0.15, 16, 16]}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        transparent
        opacity={0.8}
        roughness={0.1}
        metalness={0.8}
      />
    </Sphere>
  );
}

function QuantumPath({ points, color, active }) {
  const lineRef = useRef();

  useFrame((state) => {
    if (lineRef.current && active) {
      lineRef.current.material.opacity = 0.4 + Math.sin(state.clock.elapsedTime * 5) * 0.4;
      lineRef.current.material.linewidth = 2 + Math.sin(state.clock.elapsedTime * 2);
    }
  });

  return (
    <Line
      ref={lineRef}
      points={points}
      color={color}
      lineWidth={active ? 3 : 1}
      transparent
      opacity={active ? 0.8 : 0.2}
    />
  );
}

function QuantumGrid({ activePath }) {
  // Generate random paths representing superposition states
  const paths = useMemo(() => {
    const p = [];
    for (let i = 0; i < 20; i++) {
      const points = [];
      let current = new THREE.Vector3(-4, 0, 0);
      points.push(current.clone());
      
      for (let j = 0; j < 5; j++) {
        current.x += 1.5;
        current.y += (Math.random() - 0.5) * 3;
        current.z += (Math.random() - 0.5) * 3;
        points.push(current.clone());
      }
      
      current.x = 4;
      current.y = 0;
      current.z = 0;
      points.push(current.clone());
      
      p.push(points);
    }
    return p;
  }, []);

  return (
    <group>
      {paths.map((path, i) => (
        <QuantumPath 
          key={i} 
          points={path} 
          color={i === activePath ? "#00ffff" : "#4b0082"} 
          active={i === activePath}
        />
      ))}
      {/* Start Node */}
      <QuantumParticle position={[-4, 0, 0]} color="#00ff00" speed={2} />
      {/* End Node */}
      <QuantumParticle position={[4, 0, 0]} color="#ff00ff" speed={2} />
    </group>
  );
}

export default function QuantumVisualization({ activePathIndex }) {
  return (
    <div className="w-full h-64 rounded-xl overflow-hidden bg-black border border-blue-500/30 shadow-inner">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <QuantumGrid activePath={activePathIndex} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        <fog attach="fog" args={['#000000', 5, 20]} />
      </Canvas>
    </div>
  );
}
