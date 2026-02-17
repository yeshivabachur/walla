import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, GradientTexture, Points, PointMaterial, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Zap, MoveUp, MoveDown, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function StarField({ count = 5000 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 50;
      p[i * 3 + 1] = (Math.random() - 0.5) * 50;
      p[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return p;
  }, [count]);

  return (
    <Points positions={points}>
      <PointMaterial transparent color="#fff" size={0.05} sizeAttenuation={true} depthWrite={false} />
    </Points>
  );
}

function ChronoTorus({ speed }) {
  const mesh = useRef();
  useFrame((state) => {
    mesh.current.rotation.x += 0.01 * speed;
    mesh.current.rotation.y += 0.02 * speed;
  });

  return (
    <mesh ref={mesh}>
      <torusKnotGeometry args={[2, 0.6, 128, 32]} />
      <MeshDistortMaterial
        color="#4f46e5"
        speed={5}
        distort={0.5}
        radius={1}
        emissive="#1e1b4b"
        emissiveIntensity={2}
      >
        <GradientTexture stops={[0, 1]} colors={['#4f46e5', '#ec4899']} />
      </MeshDistortMaterial>
    </mesh>
  );
}

export default function QuantumTimeOptimizer() {
  const [temporalState, setTemporalState] = useState('PRESENT');
  const [isJumping, setIsJumping] = useState(false);
  const [timeOffset, setTimeOffset] = useState(0);

  const handleJump = (direction) => {
    setIsJumping(true);
    setTimeout(() => {
      setTemporalState(direction === 1 ? 'FUTURE_CONVERGENCE' : 'PAST_RECONSTRUCTION');
      setTimeOffset(prev => prev + (direction * 15));
      setIsJumping(false);
    }, 2000);
  };

  return (
    <Card className="border border-pink-500/30 bg-black/90 backdrop-blur-xl text-white shadow-2xl h-[500px] flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-pink-500/5">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-pink-400 animate-spin-slow" />
            <span className="uppercase tracking-[0.3em] font-black italic">Temporal Optimizer</span>
          </div>
          <Badge className="bg-pink-600 font-mono">T-OFFSET: {timeOffset}m</Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 relative p-0">
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 10] }}>
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#ec4899" />
            <StarField />
            <Float speed={isJumping ? 20 : 2} rotationIntensity={2} floatIntensity={2}>
              <ChronoTorus speed={isJumping ? 10 : 1} />
            </Float>
            <OrbitControls enableZoom={false} />
          </Canvas>
        </div>

        <div className="absolute inset-0 z-10 p-6 flex flex-col justify-between pointer-events-none">
          <div className="bg-black/40 backdrop-blur-sm p-4 rounded-xl border border-white/10 w-fit">
            <p className="text-[10px] font-mono text-pink-300 uppercase mb-1">State_Vector</p>
            <h4 className="text-xl font-black font-mono tracking-tighter">{temporalState}</h4>
          </div>

          <div className="grid grid-cols-2 gap-4 pointer-events-auto">
            <Button 
              onClick={() => handleJump(-1)}
              disabled={isJumping}
              className="bg-black/60 border border-white/10 hover:border-pink-500/50 text-white h-16 rounded-2xl group"
            >
              {isJumping ? <Loader2 className="animate-spin" /> : (
                <div className="flex flex-col items-center">
                  <MoveDown className="w-4 h-4 text-pink-400 group-hover:-translate-y-1 transition-transform" />
                  <span className="text-[10px] font-bold mt-1">REVERSE_TIME</span>
                </div>
              )}
            </Button>
            <Button 
              onClick={() => handleJump(1)}
              disabled={isJumping}
              className="bg-pink-600 hover:bg-pink-700 text-white h-16 rounded-2xl group border-none shadow-[0_0_30px_rgba(236,72,153,0.4)]"
            >
              {isJumping ? <Loader2 className="animate-spin" /> : (
                <div className="flex flex-col items-center">
                  <MoveUp className="w-4 h-4 text-white group-hover:translate-y-1 transition-transform" />
                  <span className="text-[10px] font-bold mt-1">ACCELERATE_TIME</span>
                </div>
              )}
            </Button>
          </div>
        </div>

        {isJumping && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-20 bg-white flex items-center justify-center mix-blend-overlay"
          >
            <div className="w-full h-1 bg-pink-500 shadow-[0_0_100px_#ec4899]" />
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
