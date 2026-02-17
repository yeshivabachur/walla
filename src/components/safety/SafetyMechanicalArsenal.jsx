import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, Activity, Settings, Zap, 
  AlertTriangle, CheckCircle2, Lock,
  Eye, Wind, CloudRain, Thermometer
} from 'lucide-react';
import { motion } from 'framer-motion';

const SAFETY_SYSTEMS = [
  { name: 'Anti-Lock Brakes (ABS)', status: 'OPTIMAL', integrity: 0.99 },
  { name: 'Electronic Stability Control', status: 'ACTIVE', integrity: 0.98 },
  { name: 'Blind Spot Detection', status: 'ACTIVE', integrity: 1.0 },
  { name: 'Forward Collision Warning', status: 'ACTIVE', integrity: 0.97 },
  { name: 'Lane Departure Warning', status: 'STANDBY', integrity: 1.0 },
  { name: 'Adaptive Cruise Control', status: 'LOCKED', integrity: 0.99 },
  { name: 'Night Vision System', status: 'STANDBY', integrity: 0.94 },
  { name: 'Rain Sensing Wipers', status: 'AUTO', integrity: 1.0 },
  { name: 'Tire Pressure (TPMS)', status: 'OPTIMAL', integrity: 0.96 },
  { name: 'Auto High Beams', status: 'ACTIVE', integrity: 1.0 }
];

export default function SafetyMechanicalArsenal() {
  return (
    <Card className="border border-red-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-red-500/5 p-4">
        <CardTitle className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em] text-red-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 animate-pulse" />
            Safety & Mechanical Arsenal
          </div>
          <Badge className="bg-red-600">BATTLE_READY</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-2 gap-3">
          {SAFETY_SYSTEMS.map(sys => (
            <div key={sys.name} className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-2 group hover:bg-red-500/10 transition-all">
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-black uppercase text-white/60 group-hover:text-white transition-colors leading-tight">
                  {sys.name}
                </span>
                <div className={`w-1.5 h-1.5 rounded-full ${sys.status === 'OPTIMAL' || sys.status === 'ACTIVE' ? 'bg-green-500' : 'bg-yellow-500'}`} />
              </div>
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="text-[7px] border-white/10 text-white/40">{sys.status}</Badge>
                <span className="text-[8px] font-mono text-red-400/60">{(sys.integrity * 100).toFixed(0)}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Emergency Equipment Inventory */}
        <div className="space-y-3 pt-4 border-t border-white/5">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">On-Board Inventory</h4>
          <div className="flex flex-wrap gap-2">
            {['First Aid Kit', 'Fire Extinguisher', 'Emergency Beacon', 'Life Support', 'Defibrillator'].map(item => (
              <Badge key={item} className="bg-white/5 border border-white/10 text-white/60 text-[8px] py-1 px-3">
                <CheckCircle2 className="w-2 h-2 mr-1 text-green-500" />
                {item.toUpperCase()}
              </Badge>
            ))}
          </div>
        </div>

        {/* Real-time Telemetry Visualization */}
        <div className="bg-red-500/10 p-4 rounded-2xl border border-red-500/20 space-y-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-red-400" />
            <span className="text-[10px] font-black uppercase">Sub-System Heatmap</span>
          </div>
          <div className="flex gap-1 items-end h-8">
            {[40, 70, 45, 90, 65, 30, 85, 50, 75, 40].map((h, i) => (
              <motion.div 
                key={i}
                animate={{ height: [`${h}%`, `${Math.random()*100}%`, `${h}%`] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="flex-1 bg-red-500/40 rounded-t-sm"
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
