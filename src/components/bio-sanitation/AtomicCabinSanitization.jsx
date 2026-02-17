import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Atom, Wind, Droplets, Sun, 
  FlaskConical, ShieldCheck, Activity, Dna,
  Zap, RefreshCw, Thermometer
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AtomicCabinSanitization() {
  const [isScrubbing, setIsScrubbing] = useState(false);

  return (
    <Card className="border border-pink-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-pink-500/5 p-4">
        <CardTitle className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em] text-pink-400">
          <div className="flex items-center gap-2">
            <Atom className="w-4 h-4" />
            Molecular Cabin Sanitization
          </div>
          <Badge className="bg-pink-600">UV_C_ACTIVE</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
        {/* Real-time Bio-metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
            <div className="flex justify-between items-center">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] font-mono text-cyan-400">99.99%</span>
            </div>
            <p className="text-[10px] font-black uppercase">Air Purity</p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
            <div className="flex justify-between items-center">
              <Thermometer className="w-4 h-4 text-yellow-400" />
              <span className="text-[10px] font-mono text-yellow-400">72.4°F</span>
            </div>
            <p className="text-[10px] font-black uppercase">Molecular Temp</p>
          </div>
        </div>

        {/* Bio-Scrubbing Loop */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-[10px] font-black uppercase text-pink-300 tracking-widest italic">Nanoscale Scrubbing Path</h4>
            <Badge variant="outline" className="text-[7px] border-pink-500/30 text-pink-400">SCANNING...</Badge>
          </div>
          <div className="relative h-24 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden">
            {[1,2,3].map(i => (
              <motion.div 
                key={i}
                animate={{ 
                  scale: [1, 2, 1], 
                  opacity: [0.1, 0.3, 0.1],
                  rotateZ: [0, 120 * i]
                }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute w-16 h-16 border border-pink-500/20 rounded-full"
              />
            ))}
            <Dna className="w-8 h-8 text-pink-400 animate-pulse relative z-10" />
          </div>
        </div>

        <div className="bg-pink-500/10 p-4 rounded-2xl border border-pink-500/20 space-y-3">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-pink-400 animate-spin-slow" />
            <span className="text-[10px] font-black uppercase">Stress-Cortisol Matcher</span>
          </div>
          <p className="text-[8px] text-white/60 leading-relaxed uppercase">
            Cabin atmospheric density is being dynamically re-molecularized to offset detected cortisol elevations.
          </p>
        </div>

        <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-black uppercase text-[10px] h-12 rounded-xl">
          Execute Atomic Scrub
        </Button>
      </CardContent>
    </Card>
  );
}
