import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Link2, Share2, Binary } from 'lucide-react';
import { motion } from 'framer-motion';

export default function QuantumEntanglementTracker({ rideRequest }) {
  // Generate "Quantum Hash" from ride ID
  const quantumHash = useMemo(() => {
    return btoa(rideRequest?.id || 'default').slice(0, 16).toUpperCase();
  }, [rideRequest?.id]);

  return (
    <Card className="border border-cyan-500/30 bg-black/80 backdrop-blur-xl text-white overflow-hidden shadow-2xl">
      <CardHeader className="pb-2 border-b border-white/5">
        <CardTitle className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em] text-cyan-400">
          <span className="flex items-center gap-2">
            <Link2 className="w-4 h-4" />
            Quantum Entanglement State
          </span>
          <Badge variant="outline" className="border-cyan-500 text-cyan-400 text-[10px] animate-pulse">
            LOCKED
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex justify-between items-center relative mb-8">
          {/* Particle Connection Line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-cyan-500/0 via-cyan-500/50 to-cyan-500/0 z-0" />
          
          <motion.div 
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="z-10 bg-black border border-cyan-500 p-4 rounded-2xl flex flex-col items-center"
          >
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <span className="text-sm font-bold">P</span>
            </div>
            <span className="text-[10px] opacity-60">Passenger</span>
          </motion.div>

          <div className="z-10 flex flex-col items-center">
            <Binary className="w-6 h-6 text-cyan-400 mb-1" />
            <span className="text-[10px] font-mono text-cyan-500">{quantumHash}</span>
          </div>

          <motion.div 
            animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 2 }}
            className="z-10 bg-black border border-purple-500 p-4 rounded-2xl flex flex-col items-center"
          >
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
              <span className="text-sm font-bold">D</span>
            </div>
            <span className="text-[10px] opacity-60">Driver</span>
          </motion.div>
        </div>

        <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10">
          <div className="flex justify-between items-center text-[10px] font-mono">
            <span className="text-gray-400">Entanglement Fidelity</span>
            <span className="text-green-400">99.99992%</span>
          </div>
          <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
            <motion.div 
              animate={{ width: ['0%', '100%', '99%'] }}
              transition={{ duration: 2 }}
              className="h-full bg-cyan-500" 
            />
          </div>
          <p className="text-[10px] leading-relaxed text-gray-400 italic">
            "Both observers currently share a single quantum state. Any change in the driver's vector is instantly reflected in the passenger's navigation manifold."
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
