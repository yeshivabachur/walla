import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Cpu, Thermometer, Droplets, Sun, 
  Waves, Gauge, Scan, Radio, Network
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SENSORS = [
  { id: 'RFID-42', name: 'Cargo RFID', status: 'LOCKED', icon: Scan, color: 'text-blue-400' },
  { id: 'PRS-09', name: 'Seat Pressure', status: 'ACTIVE', icon: Gauge, color: 'text-green-400' },
  { id: 'LGT-12', name: 'Cabin Lux', status: 'AUTO', icon: Sun, color: 'text-yellow-400' },
  { id: 'HUM-88', name: 'Atmosphere', status: 'OPTIMAL', icon: Droplets, color: 'text-cyan-400' }
];

export default function IndustrialIoTGrid() {
  const [readings, setReadings] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      const newReadings = {};
      SENSORS.forEach(s => {
        newReadings[s.id] = (Math.random() * 100).toFixed(1);
      });
      setReadings(newReadings);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="border border-orange-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-orange-500/5 p-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-orange-400" />
            <span className="uppercase tracking-widest text-xs font-mono">Massive IoT & Industrial Grid</span>
          </div>
          <Badge className="bg-orange-600">MASSIVE_IOT_ACTIVE</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1">
        <div className="grid grid-cols-2 gap-4">
          {SENSORS.map(s => (
            <div key={s.id} className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-2">
              <div className="flex justify-between items-start">
                <s.icon className={`w-4 h-4 ${s.color}`} />
                <Badge variant="outline" className="text-[6px] border-white/10 opacity-60">{s.status}</Badge>
              </div>
              <p className="text-[9px] font-black uppercase text-white">{s.name}</p>
              <p className="text-[12px] font-mono font-bold text-orange-400">
                {readings[s.id] || '--.-'}<span className="text-[8px] text-white/20 ml-1">Hz</span>
              </p>
            </div>
          ))}
        </div>

        {/* Industrial IoT Block */}
        <div className="bg-orange-500/10 p-4 rounded-2xl border border-orange-500/20 space-y-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-orange-400" />
            <span className="text-[10px] font-black uppercase">Asset Lifecycle Monitoring</span>
          </div>
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <p className="text-[8px] text-white/40 uppercase">Component Health</p>
              <div className="flex gap-0.5">
                {[1,2,3,4,5,6,7,8,9,10].map(i => (
                  <div key={i} className={`w-1.5 h-4 rounded-sm ${i < 9 ? 'bg-orange-500' : 'bg-orange-950'}`} />
                ))}
              </div>
            </div>
            <span className="text-xl font-black italic tracking-tighter text-orange-400">92%</span>
          </div>
        </div>

        <div className="pt-2 flex justify-between items-center border-t border-white/5">
          <div className="flex items-center gap-2">
            <Radio className="w-3 h-3 text-white/40" />
            <span className="text-[8px] font-mono text-white/40 uppercase">Node_ID: I-IOT-8824</span>
          </div>
          <div className="flex items-center gap-1 text-orange-400">
            <div className="w-1 h-1 rounded-full bg-orange-400 animate-ping" />
            <span className="text-[8px] font-bold uppercase">Streaming...</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
