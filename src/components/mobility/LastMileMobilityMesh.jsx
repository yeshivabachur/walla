import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bike, Battery, MapPin, Zap, Navigation, Wind } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEVICES = [
  { id: 'SC-42', name: 'Nano-Scooter X', type: 'SCOOTER', battery: 92, dist: '4m', color: 'text-green-400' },
  { id: 'BK-09', name: 'Cyber-Bike v4', type: 'BIKE', battery: 45, dist: '12m', color: 'text-blue-400' }
];

export default function LastMileMobilityMesh({ userEmail }) {
  const [selectedId, setSelectedId] = useState(null);

  return (
    <Card className="border border-indigo-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-indigo-500/5 p-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bike className="w-4 h-4 text-indigo-400" />
            <span className="uppercase tracking-widest text-xs font-mono">Last-Mile Micro-Mobility</span>
          </div>
          <Badge className="bg-indigo-600 text-[10px]">READY</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 p-6 space-y-4">
        <div className="space-y-3">
          {DEVICES.map(dev => (
            <motion.div
              key={dev.id}
              whileHover={{ x: 5 }}
              onClick={() => setSelectedId(dev.id)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${selectedId === dev.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5 bg-white/5'}`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-white/5 ${dev.color}`}>
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase">{dev.name}</p>
                    <p className="text-[8px] text-white/40 font-mono">{dev.dist} away</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Battery className={`w-3 h-3 ${dev.battery > 50 ? 'text-green-400' : 'text-yellow-400'}`} />
                    <span className="text-[10px] font-bold">{dev.battery}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedId && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-4"
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">Reserve Unit</span>
                <span className="text-[8px] font-mono text-white/40">ID: {selectedId}</span>
              </div>
              <p className="text-[10px] text-gray-400 leading-relaxed uppercase">
                Seamless transition authorized. Vehicle-to-Bike handoff sequence will initiate at Drop-off Sector.
              </p>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[10px] h-10 rounded-xl">
                Authorize Handoff
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-center gap-2 pt-2">
          <Navigation className="w-3 h-3 text-white/20" />
          <span className="text-[8px] font-mono text-white/20 uppercase tracking-tighter">Unified Transport Protocol v4.2</span>
        </div>
      </CardContent>
    </Card>
  );
}
