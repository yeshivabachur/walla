import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Vote, MessageCircle, Map as MapIcon, 
  ParkingCircle, Heart, ThermometerSun, 
  CloudRain, Wind, AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function OperationalExcellenceHub({ userEmail }) {
  return (
    <Card className="border border-indigo-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-indigo-500/5 p-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-indigo-400" />
            <span className="uppercase tracking-widest text-xs font-mono">Operational Excellence Hub</span>
          </div>
          <Badge className="bg-indigo-600 text-[10px]">OPTIMIZED</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {/* Service Area Voting */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2 group cursor-pointer hover:bg-indigo-500/10 transition-colors">
            <Vote className="w-5 h-5 text-indigo-400 group-hover:animate-bounce" />
            <p className="text-[10px] font-black uppercase">Expansion Voting</p>
            <p className="text-[8px] text-white/40">Next Zone: North Sector</p>
          </div>

          {/* Predictive Parking */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2 group cursor-pointer hover:bg-cyan-500/10 transition-colors">
            <ParkingCircle className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <p className="text-[10px] font-black uppercase">Smart Parking</p>
            <p className="text-[8px] text-white/40">Available: 4 spots nearby</p>
          </div>
        </div>

        {/* Community & Well-being */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase text-purple-300">Driver & Community Vibe</h4>
          <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-4 h-4 text-purple-400" />
              <span className="text-[10px] uppercase font-mono">Live Community Feed</span>
            </div>
            <Badge variant="outline" className="text-[8px] border-white/10 text-purple-400">12 NEW</Badge>
          </div>
          <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <Heart className="w-4 h-4 text-red-400" />
              <span className="text-[10px] uppercase font-mono">Mental Well-being Sync</span>
            </div>
            <Badge variant="outline" className="text-[8px] border-white/10 text-green-400 italic">STABLE</Badge>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase text-blue-300">Micro-Weather Manifold</h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center p-2 bg-white/5 rounded-lg border border-white/5">
              <ThermometerSun className="w-3 h-3 text-orange-400 mb-1" />
              <span className="text-[8px] font-mono uppercase text-white/40">Temp</span>
              <span className="text-[10px] font-bold">22°C</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-white/5 rounded-lg border border-white/5">
              <Wind className="w-3 h-3 text-cyan-400 mb-1" />
              <span className="text-[8px] font-mono uppercase text-white/40">Wind</span>
              <span className="text-[10px] font-bold">4km/h</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-white/5 rounded-lg border border-white/5">
              <CloudRain className="w-3 h-3 text-blue-400 mb-1" />
              <span className="text-[8px] font-mono uppercase text-white/40">Rain</span>
              <span className="text-[10px] font-bold">0.0%</span>
            </div>
          </div>
        </div>

        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[10px] h-12 rounded-xl">
          Enter Operational Command
        </Button>
      </CardContent>
    </Card>
  );
}
