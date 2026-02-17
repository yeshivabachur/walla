import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Package, Truck, Box, Warehouse, 
  MapPin, Radio, ShieldCheck, Zap,
  CheckCircle2, Gauge, Anchor, ClipboardCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdvancedLogisticsHub() {
  const [telemetry, setTelemetry] = useState({ tilt: 0.02, impact: 0.001 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry({
        tilt: (Math.random() * 0.1).toFixed(3),
        impact: (Math.random() * 0.005).toFixed(3)
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="border border-yellow-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-yellow-500/5 p-4">
        <CardTitle className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em] text-yellow-400">
          <div className="flex items-center gap-2">
            <Warehouse className="w-4 h-4" />
            Global Logistics & Parcel Manifold
          </div>
          <Badge className="bg-yellow-600">GRID_STABLE</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1">
        {/* Package Condition */}
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] font-black uppercase">Active Parcel Telemetry</span>
            </div>
            <Badge variant="outline" className="text-[8px] border-cyan-500/30 text-cyan-400 animate-pulse">SENSING</Badge>
          </div>
          <div className="grid grid-cols-2 gap-3 font-mono text-[9px]">
            <div className="p-2 bg-black/40 rounded-lg border border-white/5 flex justify-between">
              <span className="opacity-40">TILT_ANGLE</span>
              <span className="text-green-400">{telemetry.tilt}°</span>
            </div>
            <div className="p-2 bg-black/40 rounded-lg border border-white/5 flex justify-between">
              <span className="opacity-40">IMPACT_G</span>
              <span className="text-green-400">{telemetry.impact}g</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
            <Anchor className="w-5 h-5 text-indigo-400" />
            <p className="text-[10px] font-black uppercase text-white">Locker Anchor</p>
            <p className="text-[7px] text-white/40">Hub-04 Linked Sync</p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
            <ClipboardCheck className="w-5 h-5 text-green-400" />
            <p className="text-[10px] font-black uppercase text-white">Proof of Arrival</p>
            <p className="text-[7px] text-white/40">Visual Confirmation Active</p>
          </div>
        </div>

        {/* Rover Command */}
        <div className="bg-yellow-500/10 p-4 rounded-2xl border border-yellow-500/20 space-y-3">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-yellow-400" />
            <span className="text-[10px] font-black uppercase">Autonomous Ground Rover</span>
          </div>
          <p className="text-[8px] text-white/60 leading-relaxed uppercase italic">
            "Unit RVR-01 is currently 142m from primary drop-off. Handoff protocol ready."
          </p>
          <div className="flex gap-1 h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              animate={{ left: ['-100%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="relative w-1/3 h-full bg-yellow-400" 
            />
          </div>
        </div>

        <div className="pt-2 flex justify-between items-center border-t border-white/5 font-mono text-[8px] text-white/20">
          <div className="flex items-center gap-2 uppercase">
            <Radio className="w-3 h-3 text-white/20" />
            Node_ID: WALLA_LOG_8824
          </div>
          <span className="uppercase">Condition: OPTIMAL</span>
        </div>
      </CardContent>
    </Card>
  );
}
