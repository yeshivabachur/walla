import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Volume2, Waves, Zap, Music, 
  Mic2, Radio, Speaker, Headphones,
  Fingerprint
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function SensoryDesignManifold() {
  const [activeTheme, setActiveTheme] = useState('Cybernetic');

  return (
    <Card className="border border-cyan-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-cyan-500/5 p-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <span className="uppercase tracking-widest text-xs font-mono">Sensory & Sonic Design</span>
          </div>
          <Badge className="bg-cyan-600 animate-pulse">HAPTIC_SYNC_ON</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1">
        {/* Audio Themes */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase text-cyan-300 italic">Audio Branding Themes</h4>
          <div className="grid grid-cols-2 gap-2">
            {['Cybernetic', 'Zen_Flow', 'Imperial', 'Minimal'].map(t => (
              <Button 
                key={t}
                variant="outline" 
                onClick={() => setActiveTheme(t)}
                className={`h-10 text-[8px] font-black uppercase rounded-lg border-white/10 ${activeTheme === t ? 'bg-cyan-600 text-white' : 'bg-white/5 text-white/40'}`}
              >
                {t}
              </Button>
            ))}
          </div>
        </div>

        {/* 3D Spatial Audio */}
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-indigo-400" />
              <span className="text-[10px] font-black uppercase">3D Spatial Audio Positioning</span>
            </div>
            <Badge variant="outline" className="text-[8px] border-indigo-500/30 text-indigo-400 italic">96kHz</Badge>
          </div>
          <div className="relative h-24 bg-black/40 rounded-xl border border-white/5 flex items-center justify-center overflow-hidden">
            <motion.div 
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute w-32 h-32 bg-indigo-500/20 rounded-full blur-xl"
            />
            <Speaker className="w-8 h-8 text-indigo-400 relative z-10" />
          </div>
        </div>

        {/* Haptic-Audio Sync */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-2">
            <Fingerprint className="w-4 h-4 text-pink-400" />
            <p className="text-[9px] font-bold uppercase">Haptic Sync</p>
            <p className="text-[7px] text-white/40 uppercase">Audio-Vibrational Manifold</p>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <p className="text-[9px] font-bold uppercase">UI Sound FX</p>
            <p className="text-[7px] text-white/40 uppercase">Low-Latency Pulse</p>
          </div>
        </div>

        <div className="pt-2 flex justify-between items-center border-t border-white/5">
          <div className="flex items-center gap-2">
            <Radio className="w-3 h-3 text-white/40" />
            <span className="text-[8px] font-mono text-white/40 uppercase">Sonic_ID: WALLA_CORE_04</span>
          </div>
          <div className="flex items-center gap-1 text-cyan-400">
            <div className="w-1 h-1 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[8px] font-bold uppercase">Mastering...</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
