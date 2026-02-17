import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';

function VehicleHologram() {
  const mesh = useRef();
  
  useFrame((state) => {
    mesh.current.rotation.y += 0.01;
  });

  return (
    <group ref={mesh}>
      {/* Abstract vehicle shape */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3, 0.8, 1.5]} />
        <MeshDistortMaterial
          color="#06b6d4"
          speed={2}
          distort={0.2}
          radius={1}
          wireframe
          transparent
          opacity={0.5}
        />
      </mesh>
      {/* Wheels/Orbs */}
      {[[-1, -0.4, 0.75], [1, -0.4, 0.75], [-1, -0.4, -0.75], [1, -0.4, -0.75]].map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={5} />
        </mesh>
      ))}
    </group>
  );
}

export default function HolographicRidePreview({ pickup, dropoff }) {
  if (!pickup || !dropoff) return null;

  return (
    <div className="relative w-full h-64 bg-black/40 rounded-3xl border border-cyan-500/20 overflow-hidden shadow-2xl mb-6">
      <div className="absolute inset-0 z-0">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 2, 6]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#06b6d4" />
          <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <VehicleHologram />
          </Float>
          <OrbitControls enableZoom={false} autoRotate />
          <gridHelper args={[20, 20, 0x06b6d4, 0x06b6d4]} position={[0, -1, 0]} opacity={0.1} transparent />
        </Canvas>
      </div>

      <div className="absolute top-4 left-4 z-10">
        <Badge className="bg-cyan-600 text-black font-black uppercase tracking-widest text-[10px] italic">
          Holographic_Preview_Active
        </Badge>
      </div>

      <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-between items-end">
        <div className="space-y-1">
          <p className="text-[10px] font-mono text-cyan-400 uppercase">Route_Manifest</p>
          <p className="text-xs font-black text-white uppercase">{pickup} ➔ {dropoff}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-mono text-white/40 uppercase">Rendering_Engine</p>
          <p className="text-[10px] font-bold text-cyan-400 uppercase">Base44_Quantum_v1</p>
        </div>
      </div>
      
      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(6,182,212,0.05)_2px,rgba(6,182,212,0.05)_4px)]" />
    </div>
  );
}
