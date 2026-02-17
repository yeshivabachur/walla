import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Atom, Wind, Droplets, Sun, 
  FlaskConical, ShieldCheck, Activity, Dna
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function MolecularEnvironmentController() {
  const [o2Level, setO2] = useState(21.4);

  return (
    <Card className="border border-pink-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-pink-500/5 p-4">
        <CardTitle className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em] text-pink-400">
          <div className="flex items-center gap-2">
            <Atom className="w-4 h-4" />
            Molecular Environment Control
          </div>
          <Badge className="bg-pink-600 animate-pulse">DNA_MATCH_LOCKED</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
            <div className="flex justify-between items-center">
              <Wind className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] font-mono text-cyan-400">{o2Level}%</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-tighter">O2 Concentration</p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
            <div className="flex justify-between items-center">
              <Sun className="w-4 h-4 text-yellow-400" />
              <span className="text-[10px] font-mono text-yellow-400">420nm</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-tighter">Photon Wavelength</p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-[10px] font-black uppercase text-pink-300 tracking-widest">Nano-Sanitation Loop</h4>
          <div className="flex gap-1 h-2">
            {[1,2,3,4,5,6,7,8,9,10].map(i => (
              <motion.div 
                key={i}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                className="flex-1 bg-pink-500 rounded-sm" 
              />
            ))}
          </div>
          <p className="text-[8px] text-white/40 uppercase text-center">UV-C Molecular Scrubbing Active</p>
        </div>

        <div className="bg-pink-500/10 p-4 rounded-2xl border border-pink-500/20">
          <p className="text-[9px] leading-relaxed text-white/80 uppercase font-bold italic text-center">
            "Your cabin has been re-molecularized to match your current stress-cortisol levels."
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
