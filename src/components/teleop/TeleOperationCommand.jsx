import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Gamepad, Wifi, Share2, Video, 
  Settings, Zap, AlertCircle, Radio
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function TeleOperationCommand() {
  const [controlActive, setControlActive] = useState(false);

  return (
    <Card className="border border-red-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl overflow-hidden h-full flex flex-col">
      <CardHeader className="border-b border-white/5 bg-red-500/5 p-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gamepad className="w-4 h-4 text-red-400 animate-pulse" />
            <span className="uppercase tracking-widest text-xs font-mono">Tele-Op & 5G Slicing</span>
          </div>
          <Badge className="bg-red-600 text-[10px]">ULTRA_LOW_LATENCY</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* 5G Network Slicing */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-[10px] font-bold uppercase">
            <span>Network Slice: V2X_CRITICAL</span>
            <span className="text-red-400">0.002ms</span>
          </div>
          <div className="flex gap-1 h-2">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className={`flex-1 rounded-sm ${i < 7 ? 'bg-red-500' : 'bg-red-900'}`} />
            ))}
          </div>
        </div>

        {/* Remote Control Interface */}
        <div className="relative aspect-video bg-black rounded-2xl border border-white/10 overflow-hidden flex items-center justify-center">
          <Video className="w-8 h-8 text-white/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className="bg-green-500/20 text-green-400 text-[8px]">8K_RAW_STREAM</Badge>
            <Badge className="bg-blue-500/20 text-blue-400 text-[8px]">V2V_SYNC</Badge>
          </div>
          <div className="absolute bottom-3 right-3 flex gap-2">
             <div className="flex items-center gap-1 text-[8px] font-mono text-red-400">
               <Radio className="w-3 h-3" />
               REMOTE_PILOT_READY
             </div>
          </div>
        </div>

        <Button 
          onClick={() => setControlActive(!controlActive)}
          className={`w-full h-12 rounded-xl font-black uppercase tracking-widest transition-all ${
            controlActive ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-800 hover:bg-gray-700'
          }`}
        >
          {controlActive ? "Terminate Tele-Op Link" : "Engage Remote Control"}
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-2 bg-white/5 rounded-lg border border-white/5 text-center">
            <p className="text-[8px] text-white/40 uppercase">Bitrate</p>
            <p className="text-[10px] font-bold">1.2 Gbps</p>
          </div>
          <div className="p-2 bg-white/5 rounded-lg border border-white/5 text-center">
            <p className="text-[8px] text-white/40 uppercase">Reliability</p>
            <p className="text-[10px] font-bold">99.9999%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
