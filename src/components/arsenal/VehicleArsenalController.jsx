import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  ShieldAlert, Zap, Activity, Navigation, 
  Wind, Lock, Eye, Radio, Gauge
} from 'lucide-react';
import { motion } from 'framer-motion';

const SYSTEMS = [
  { id: 'acc', name: 'Adaptive Cruise Control', icon: Gauge, desc: 'Radar-synced velocity management' },
  { id: 'esc', name: 'Electronic Stability Control', icon: Activity, desc: 'Torque-vectoring yaw control' },
  { id: 'aeb', name: 'Auto Emergency Braking', icon: ShieldAlert, desc: 'Collision-mitigation manifold' },
  { id: 'ldw', name: 'Lane Departure Warning', icon: Navigation, desc: 'Sub-pixel lane tracking' }
];

export default function VehicleArsenalController() {
  const [activeSystems, setActiveSystems] = useState(['acc', 'esc', 'aeb']);

  const toggle = (id) => {
    setActiveSystems(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <Card className="border border-red-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-red-500/5 p-4">
        <CardTitle className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em] text-red-400">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 animate-pulse" />
            Active Mechanical Arsenal
          </div>
          <Badge className="bg-red-600 text-[8px]">PILOT_OVERRIDE_ENABLED</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
        <div className="space-y-4">
          {SYSTEMS.map(sys => (
            <div key={sys.id} className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center justify-between group hover:bg-red-500/10 transition-all">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl ${activeSystems.includes(sys.id) ? 'bg-red-500 text-white' : 'bg-white/5 text-white/40'}`}>
                  <sys.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-tight">{sys.name}</p>
                  <p className="text-[7px] text-white/40 uppercase">{sys.desc}</p>
                </div>
              </div>
              <Switch checked={activeSystems.includes(sys.id)} onCheckedChange={() => toggle(sys.id)} />
            </div>
          ))}
        </div>

        {/* Real-time Force Manifold */}
        <div className="bg-red-500/10 p-4 rounded-2xl border border-red-500/20 space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-red-400" />
            <span className="text-[10px] font-black uppercase">Collision Avoidance Logic</span>
          </div>
          <div className="relative h-12 bg-black/40 rounded-xl border border-white/5 flex items-center justify-center">
             <motion.div 
               animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="text-[10px] font-mono text-red-400"
             >
               RADAR_SWEEP: [CLEAR]
             </motion.div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
