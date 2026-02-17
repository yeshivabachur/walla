import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ghost, Layers, RefreshCw, Zap, Cpu, MousePointer2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SentientInterface({ userEmail }) {
  const [evolutionState, setEvolutionState] = useState(0);
  const [mousePos, setMousePointer] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Organic design evolution simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setEvolutionState(prev => (prev + 1) % 100);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePointer({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <Card 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="border-none bg-black/90 text-white shadow-2xl overflow-hidden relative group"
    >
      {/* Sentient Glow following mouse (Biomimetic interaction) */}
      <div 
        className="absolute w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none transition-transform duration-300"
        style={{ 
          transform: `translate(${mousePos.x - 128}px, ${mousePos.y - 128}px)` 
        }}
      />

      <CardHeader className="relative z-10 border-b border-white/5 bg-white/5 backdrop-blur-md">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ghost className="w-5 h-5 text-indigo-400 animate-pulse" />
            <span className="uppercase tracking-[0.2em] font-black italic text-sm">Conscious UI</span>
          </div>
          <Badge className="bg-indigo-600 text-[10px] font-mono">EVOLUTION_GEN_{evolutionState}</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 relative z-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">Sentient Recommender</span>
          </div>
          <p className="text-sm leading-relaxed text-gray-300 bg-white/5 p-4 rounded-2xl border border-white/10 italic">
            "I've sensed your heartbeat rising. Perhaps a scenic route through the park would stabilize your biometric manifold? I've already adjusted the cabin's organic light filters."
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-indigo-950/20 p-4 rounded-2xl border border-indigo-500/20 space-y-2">
            <div className="flex items-center gap-2">
              <Layers className="w-3 h-3 text-indigo-400" />
              <span className="text-[8px] font-black uppercase text-white">Shapeshifting UI</span>
            </div>
            <div className="h-1 bg-indigo-900 rounded-full overflow-hidden">
              <motion.div 
                animate={{ width: ['20%', '80%', '40%'] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="h-full bg-indigo-400" 
              />
            </div>
            <p className="text-[8px] text-gray-500">OPTIMIZING_LAYOUT_FOR_FATIGUE</p>
          </div>

          <div className="bg-purple-950/20 p-4 rounded-2xl border border-purple-500/20 space-y-2">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-3 h-3 text-purple-400" />
              <span className="text-[8px] font-black uppercase text-white">Organic Evolution</span>
            </div>
            <p className="text-[10px] font-bold text-purple-300">STABLE_EQUILIBRIUM</p>
            <p className="text-[8px] text-gray-500">GENETIC_UI_ALGORITHM_ACTIVE</p>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-yellow-400" />
            <span className="text-[10px] font-mono text-white/40">LIVING_SYSTEM_CORE</span>
          </div>
          <Badge variant="outline" className="text-[8px] border-white/10 text-white/40">CONSCIOUSNESS_LEVEL: 0.84</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
