import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  HeartPulse, Activity, Wind, Droplets, 
  UserCheck, AlertCircle, Zap, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { motion as Motion, AnimatePresence as Presence } from 'framer-motion';

export default function HumanFlourishingManifold() {
  const [vitals, setVitals] = useState({
    stress: 42,
    posture: 'OPTIMAL',
    hydration: 88
  });

  return (
    <Card className="border border-pink-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-pink-500/5 p-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-pink-400" />
            <span className="uppercase tracking-widest text-xs font-mono">Human Flourishing Manifold</span>
          </div>
          <Badge className="bg-pink-600 text-[10px]">BIO_SYNC_OK</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-center space-y-1">
            <Activity className="w-4 h-4 text-red-400 mx-auto" />
            <p className="text-[8px] text-white/40 uppercase font-mono">Stress</p>
            <p className="text-[10px] font-black">{vitals.stress}%</p>
          </div>
          <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-center space-y-1">
            <UserCheck className="w-4 h-4 text-green-400 mx-auto" />
            <p className="text-[8px] text-white/40 uppercase font-mono">Posture</p>
            <p className="text-[10px] font-black">{vitals.posture}</p>
          </div>
          <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-center space-y-1">
            <Droplets className="w-4 h-4 text-blue-400 mx-auto" />
            <p className="text-[8px] text-white/40 uppercase font-mono">Water</p>
            <p className="text-[10px] font-black">{vitals.hydration}%</p>
          </div>
        </div>

        {/* Deep Bio-Monitoring */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase text-pink-300">Neural Health Scanners</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-4 h-4 text-orange-400" />
                <span className="text-[10px] uppercase font-mono tracking-tighter">Seizure Prediction AI</span>
              </div>
              <Badge variant="outline" className="text-[8px] border-green-500/30 text-green-400">NO_RISK</Badge>
            </div>
            <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-4 h-4 text-purple-400" />
                <span className="text-[10px] uppercase font-mono tracking-tighter">Pain Detection Node</span>
              </div>
              <Badge variant="outline" className="text-[8px] border-white/10 text-white/40">INACTIVE</Badge>
            </div>
          </div>
        </div>

        {/* Reminders */}
        <div className="bg-pink-500/10 p-4 rounded-2xl border border-pink-500/20 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase">Personal Best Suggestion</span>
            <Zap className="w-3 h-3 text-pink-400" />
          </div>
          <p className="text-[10px] text-white/80 leading-relaxed italic">
            "Your stress manifold is slightly elevated. I've initiated a 3-minute guided breathing session via the Spatial Audio Engine."
          </p>
          <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white h-8 text-[10px] font-black rounded-lg">
            Start Breathing Session
          </Button>
        </div>

        <div className="flex items-center gap-2 text-[8px] text-white/40 uppercase font-mono justify-center">
          <Droplets className="w-3 h-3 animate-bounce" />
          Hydration Reminder set for 12:45
        </div>
      </CardContent>
    </Card>
  );
}
