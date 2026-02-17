import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Waves, Sparkles, Activity, Eye, 
  Wind, Zap, Droplets, Sun, Box,
  Database, Radio
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sensory5DImmersionManifold() {
  const [immersionLevel, setImmersionLevel] = useState(0.84);

  return (
    <Card className="border border-cyan-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-cyan-500/5 p-4">
        <CardTitle className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em] text-cyan-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            5D Sensory Immersion Manifold
          </div>
          <Badge className="bg-cyan-600 animate-pulse">REPLICATING_REALITY</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1">
        {/* 5D Control */}
        <div className="space-y-4">
          <div className="flex justify-between items-center text-[10px] font-black uppercase">
            <span>Immersion Fidelity</span>
            <span className="text-cyan-400">{(immersionLevel * 100).toFixed(1)}%</span>
          </div>
          <div className="flex gap-1 h-8 items-end">
            {[1,4,2,8,5,3,9,4,2,6,8,3,5,1].map((h, i) => (
              <motion.div 
                key={i}
                animate={{ height: [`${h*10}%`, `${Math.random()*100}%`, `${h*10}%`] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="flex-1 bg-cyan-500/40 border border-cyan-500/20 rounded-t-sm shadow-[0_0_10px_rgba(6,182,212,0.2)]"
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2 group hover:bg-cyan-500/10 transition-colors cursor-pointer">
            <div className="flex justify-between">
              <Wind className="w-5 h-5 text-indigo-400" />
              <Badge variant="outline" className="text-[6px] border-indigo-500/30">LOCKED</Badge>
            </div>
            <p className="text-[10px] font-black uppercase">4D Scent Sync</p>
            <p className="text-[7px] text-white/40 uppercase tracking-widest">Pinewood_Manifold</p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2 group hover:bg-cyan-500/10 transition-colors cursor-pointer">
            <div className="flex justify-between">
              <Droplets className="w-5 h-5 text-blue-400" />
              <Badge variant="outline" className="text-[6px] border-blue-500/30">ACTIVE</Badge>
            </div>
            <p className="text-[10px] font-black uppercase">Atmospheric Sync</p>
            <p className="text-[7px] text-white/40 uppercase tracking-widest">Humidity: 42.1%</p>
          </div>
        </div>

        <div className="bg-cyan-500/10 p-4 rounded-2xl border border-cyan-500/20 space-y-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">Synesthetic Mapping</span>
          </div>
          <p className="text-[8px] text-white/60 leading-relaxed uppercase italic">
            "Your visual music streams are being translated into vibrational seat feedback and ambient cabin colors."
          </p>
        </div>

        <div className="pt-2 flex justify-between items-center border-t border-white/5 font-mono text-[8px] text-white/20">
          <div className="flex items-center gap-2 uppercase">
            <Radio className="w-3 h-3" />
            Reality_Buffer: 4.2ms
          </div>
          <span className="uppercase">Wave_Function: COLLAPSED</span>
        </div>
      </CardContent>
    </Card>
  );
}
