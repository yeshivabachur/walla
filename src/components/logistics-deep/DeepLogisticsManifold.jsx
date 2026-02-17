import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Box, Package, Truck, Compass, 
  Activity, Gauge, Anchor, ClipboardCheck,
  Zap, MapPin, Radio, ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function DeepLogisticsManifold() {
  const [telemetry, setTelemetry] = useState({ tilt: 0.01, impact: 0.002, humidity: 42.1 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry({
        tilt: (Math.random() * 0.05).toFixed(3),
        impact: (Math.random() * 0.004).toFixed(3),
        humidity: (40 + Math.random() * 5).toFixed(1)
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="border border-yellow-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-yellow-500/5 p-4">
        <CardTitle className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em] text-yellow-400">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Deep Logistics & Condition Monitoring
          </div>
          <Badge className="bg-yellow-600">BIT_PERFECT_DELIVERY</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
        {/* Live Environmental Sync */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
            <p className="text-[7px] text-white/40 uppercase mb-1">Tilt_Angle</p>
            <p className="text-xs font-black italic">{telemetry.tilt}°</p>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
            <p className="text-[7px] text-white/40 uppercase mb-1">Impact_G</p>
            <p className="text-xs font-black italic">{telemetry.impact}g</p>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
            <p className="text-[7px] text-white/40 uppercase mb-1">Humidity</p>
            <p className="text-xs font-black italic">{telemetry.humidity}%</p>
          </div>
        </div>

        {/* Handoff & Node Tracking */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-yellow-400" />
              <span className="text-[10px] font-black uppercase">Autonomous Rover Handoff</span>
            </div>
            <Badge variant="outline" className="text-[8px] border-yellow-500/30 text-yellow-400">READY</Badge>
          </div>
          
          <div className="relative h-12 bg-black/40 rounded-xl border border-white/5 flex items-center px-4 overflow-hidden">
            <motion.div 
              animate={{ x: [0, 200, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="flex items-center gap-2 text-[9px] font-mono text-yellow-400/60"
            >
              <Box className="w-3 h-3" />
              <span>[UNIT_RVR_88] POSITION: SECTOR_7G</span>
            </motion.div>
          </div>
        </div>

        {/* Condition Assurance */}
        <div className="bg-yellow-500/10 p-4 rounded-2xl border border-yellow-500/20 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-yellow-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">Condition Assurance v2</span>
          </div>
          <p className="text-[8px] text-white/60 leading-relaxed uppercase italic">
            "Molecular scanning confirmed 100% integrity of parcel Snk-01. Sub-space route verified stable."
          </p>
        </div>

        <div className="pt-2 flex justify-between items-center border-t border-white/5 font-mono text-[8px] text-white/20">
          <div className="flex items-center gap-2 uppercase">
            <Radio className="w-3 h-3 text-white/20 animate-pulse" />
            Mesh_Node: LOG_DELTA_42
          </div>
          <span className="uppercase">Causality: SECURED</span>
        </div>
      </CardContent>
    </Card>
  );
}
