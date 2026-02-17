import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Package, Truck, Box, Warehouse, 
  MapPin, Radio, ShieldCheck, Zap,
  CheckCircle2, Gauge
} from 'lucide-react';
import { motion } from 'framer-motion';

const ROVERS = [
  { id: 'RVR-01', name: 'Terran-Rover G4', battery: 88, status: 'DELIVERING', type: 'GROUND' },
  { id: 'RVR-02', name: 'Cyber-Atlas X', battery: 42, status: 'CHARGING', type: 'GROUND' }
];

export default function AdvancedLogisticsManifold() {
  return (
    <Card className="border border-yellow-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-yellow-500/5 p-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Warehouse className="w-4 h-4 text-yellow-400" />
            <span className="uppercase tracking-widest text-xs font-mono">Autonomous Logistics Grid</span>
          </div>
          <Badge className="bg-yellow-600">GRID_STABLE</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1">
        {/* Ground Rover Status */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black uppercase text-yellow-300 tracking-[0.2em]">Autonomous Ground Fleet</h4>
          {ROVERS.map(r => (
            <div key={r.id} className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/20">
                  <Truck className="w-4 h-4 text-yellow-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase">{r.name}</p>
                  <p className="text-[8px] text-white/40 font-mono">BATTERY: {r.battery}%</p>
                </div>
              </div>
              <Badge variant="outline" className={`text-[8px] border-white/10 ${r.status === 'DELIVERING' ? 'text-green-400' : 'text-yellow-400'}`}>
                {r.status}
              </Badge>
            </div>
          ))}
        </div>

        {/* Condition Monitoring */}
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] font-black uppercase">Package Condition Telemetry</span>
            </div>
            <Badge className="bg-cyan-600 text-[8px]">SENSING</Badge>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-black/40 rounded-lg border border-white/5 text-center">
              <p className="text-[7px] text-white/40 uppercase font-mono">Tilt_Sensor</p>
              <p className="text-[10px] font-bold text-green-400">0.02°</p>
            </div>
            <div className="p-2 bg-black/40 rounded-lg border border-white/5 text-center">
              <p className="text-[7px] text-white/40 uppercase font-mono">Impact_G</p>
              <p className="text-[10px] font-bold text-green-400">0.001g</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
            <Box className="w-4 h-4 text-indigo-400 mb-1" />
            <p className="text-[9px] font-bold uppercase">Locker_Sync</p>
            <p className="text-[7px] text-white/40">Hub-04 Linked</p>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
            <ShieldCheck className="w-4 h-4 text-green-400 mb-1" />
            <p className="text-[9px] font-bold uppercase">Condition</p>
            <p className="text-[7px] text-white/40">Secured_Payload</p>
          </div>
        </div>

        <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-black uppercase text-[10px] h-12 rounded-xl">
          Coordinate Last-Mile Deployment
        </Button>
      </CardContent>
    </Card>
  );
}
