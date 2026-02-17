import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Box, Lock, MapPin, Truck, 
  Package, CheckCircle2, QrCode
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LogisticsLockerManifold({ userEmail }) {
  const [activeLocker, setActiveLocker] = useState(null);

  const lockers = [
    { id: 'LCK-01', location: '7th Ave Hub', status: 'READY', code: '8824' },
    { id: 'LCK-42', location: 'Market St Port', status: 'IN_TRANSIT', code: '----' }
  ];

  return (
    <Card className="border border-yellow-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-yellow-500/5 p-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Box className="w-4 h-4 text-yellow-400" />
            <span className="uppercase tracking-widest text-xs font-mono">Logistics & Locker Mesh</span>
          </div>
          <Badge className="bg-yellow-600 text-[10px]">SYNCED</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-4 flex-1">
        <div className="space-y-3">
          {lockers.map(l => (
            <div key={l.id} className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/20">
                  <Lock className="w-4 h-4 text-yellow-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase">{l.id}</p>
                  <p className="text-[8px] text-white/40">{l.location}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline" className={`text-[8px] border-white/10 ${l.status === 'READY' ? 'text-green-400' : 'text-yellow-400'}`}>
                  {l.status}
                </Badge>
                <p className="text-[10px] font-mono mt-1 tracking-widest">{l.code}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-yellow-500/10 p-4 rounded-2xl border border-yellow-500/20 space-y-3">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-yellow-400" />
            <span className="text-[10px] font-black uppercase">Autonomous Courier Sync</span>
          </div>
          <p className="text-[8px] text-white/60 leading-relaxed">
            Your package is being transferred from Drone Unit DR-90 to Autonomous Ground Rover V-102.
          </p>
          <div className="flex gap-2">
            <div className="flex-1 h-1 bg-yellow-500 rounded-full" />
            <div className="flex-1 h-1 bg-yellow-500 rounded-full animate-pulse" />
            <div className="flex-1 h-1 bg-white/10 rounded-full" />
          </div>
        </div>

        <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-black uppercase text-[10px] h-12 rounded-xl">
          <QrCode className="w-4 h-4 mr-2" />
          Generate Access Token
        </Button>
      </CardContent>
    </Card>
  );
}
