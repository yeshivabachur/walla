import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  ShieldCheck, ShieldAlert, Eye, Wind, 
  CloudRain, Gauge, Activity, Radio,
  Camera, Zap, Navigation, Lock
} from 'lucide-react';
import { motion } from 'framer-motion';

const ADAS_SYSTEMS = [
  { id: 'abs', name: 'Anti-Lock Brakes', status: 'OPTIMAL' },
  { id: 'esc', name: 'Electronic Stability Control', status: 'ACTIVE' },
  { id: 'acc', name: 'Adaptive Cruise Control', status: 'READY' },
  { id: 'ldw', name: 'Lane Departure Warning', status: 'ACTIVE' },
  { id: 'fcw', name: 'Forward Collision Warning', status: 'ACTIVE' },
  { id: 'aeb', name: 'Auto Emergency Braking', status: 'READY' },
  { id: 'bsd', name: 'Blind Spot Detection', status: 'ACTIVE' },
  { id: 'nvs', name: 'Night Vision System', status: 'STANDBY' },
  { id: 'rsw', name: 'Rain Sensing Wipers', status: 'AUTO' },
  { id: 'ahb', name: 'Auto High Beams', status: 'ACTIVE' },
  { id: 'tcs', name: 'Traction Control', status: 'OPTIMAL' },
  { id: 'tpms', name: 'Tire Pressure Monitor', status: 'OPTIMAL' }
];

export default function VehicleSystemsArsenal() {
  const [activeIds, setActiveIds] = useState(ADAS_SYSTEMS.map(s => s.id));

  const toggle = (id) => {
    setActiveIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <Card className="border border-red-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-red-500/5 p-4">
        <CardTitle className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em] text-red-400">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 animate-pulse" />
            Active Mechanical Arsenal (ADAS)
          </div>
          <Badge className="bg-red-600">PILOT_CONTROL_ACTIVE</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ADAS_SYSTEMS.map(sys => (
            <div key={sys.id} className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center justify-between group hover:bg-red-500/10 transition-all">
              <div>
                <p className="text-[9px] font-black uppercase tracking-tight">{sys.name}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className={`w-1 h-1 rounded-full ${activeIds.includes(sys.id) ? 'bg-green-500' : 'bg-white/20'}`} />
                  <span className="text-[7px] font-mono text-white/40 uppercase">{sys.status}</span>
                </div>
              </div>
              <Switch 
                checked={activeIds.includes(sys.id)} 
                onCheckedChange={() => toggle(sys.id)}
                className="scale-75 data-[state=checked]:bg-red-500"
              />
            </div>
          ))}
        </div>

        {/* Hardware Status */}
        <div className="bg-red-500/10 p-4 rounded-2xl border border-red-500/20 space-y-3">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-red-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">Optical Hardware Array</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-[8px] font-mono uppercase">
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span>Dashcam_Feed</span>
              <span className="text-green-400">ENCRYPTED</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span>Backup_Cam</span>
              <span className="text-green-400">READY</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span>LiDAR_Array</span>
              <span className="text-green-400">SYNCED</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span>Parking_Sensors</span>
              <span className="text-green-400">ONLINE</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
