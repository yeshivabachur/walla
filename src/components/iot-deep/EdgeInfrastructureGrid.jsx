import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Wifi, Zap, Share2, Gamepad2, 
  Tv, Cpu, Network, Radio,
  Activity, CloudLightning
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function EdgeInfrastructureGrid() {
  const [activeSlice, setActiveSlice] = useState('V2X');

  return (
    <Card className="border border-cyan-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-cyan-500/5 p-4">
        <CardTitle className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em] text-cyan-400">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            5G Edge & Infrastructure
          </div>
          <Badge className="bg-cyan-600">ULTRA_LOW_LATENCY</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1">
        {/* Network Slicing */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-[10px] font-black uppercase">
            <span>Dynamic Network Slicing</span>
            <span className="text-cyan-400">0.0004ms Jitter</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {['V2X', 'INFOTAINMENT', 'SYSTEM'].map(slice => (
              <Button 
                key={slice}
                variant="outline" 
                onClick={() => setActiveSlice(slice)}
                className={`h-10 text-[8px] font-black uppercase rounded-lg border-white/10 ${activeSlice === slice ? 'bg-cyan-600 text-white' : 'bg-white/5 text-white/40'}`}
              >
                {slice}
              </Button>
            ))}
          </div>
        </div>

        {/* 8K VR & Cloud Gaming Ports */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2 group hover:bg-indigo-500/10 transition-colors">
            <Tv className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
            <p className="text-[10px] font-black uppercase">8K VR Stream</p>
            <p className="text-[7px] text-white/40 uppercase">Bitrate: 1.2 Gbps</p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2 group hover:bg-purple-500/10 transition-colors">
            <Gamepad2 className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
            <p className="text-[10px] font-black uppercase">Cloud Gaming</p>
            <p className="text-[7px] text-white/40 uppercase">Latency: <span className="text-green-400">OPTIMAL</span></p>
          </div>
        </div>

        {/* IoT Fleet Status */}
        <div className="bg-cyan-500/10 p-4 rounded-2xl border border-cyan-500/20 space-y-3">
          <div className="flex items-center gap-2">
            <CloudLightning className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] font-black uppercase">Edge Compute Load</span>
          </div>
          <div className="flex gap-1 items-end h-8">
            {[4, 7, 3, 9, 5, 2, 8, 4, 6, 3].map((h, i) => (
              <div key={i} className="flex-1 bg-cyan-500/40 rounded-t-sm" style={{ height: `${h * 10}%` }} />
            ))}
          </div>
        </div>

        <div className="pt-2 flex justify-between items-center border-t border-white/5 font-mono text-[8px] text-white/20">
          <div className="flex items-center gap-2 uppercase">
            <Network className="w-3 h-3 text-indigo-400" />
            Sub-Space Fidelity: 0.999
          </div>
          <span className="uppercase">Encryption: QUANTUM_SEC</span>
        </div>
      </CardContent>
    </Card>
  );
}
