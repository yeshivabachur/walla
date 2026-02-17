import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, ShieldAlert, Zap, Globe, 
  MapPin, Radio, HeartPulse, LifeBuoy
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function CrisisRecoveryCommand() {
  return (
    <Card className="border border-red-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-red-500/5 p-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span className="uppercase tracking-widest text-xs font-mono">Crisis & Disaster Recovery</span>
          </div>
          <Badge className="bg-red-600 animate-pulse">RECOVERY_MODE_READY</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2 group cursor-pointer hover:bg-red-500/10 transition-colors">
            <Globe className="w-5 h-5 text-red-400 group-hover:animate-spin-slow" />
            <p className="text-[10px] font-black uppercase">Disaster Relief</p>
            <p className="text-[8px] text-white/40">Logistics Support Active</p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2 group cursor-pointer hover:bg-red-500/10 transition-colors">
            <Radio className="w-5 h-5 text-red-400 group-hover:animate-pulse" />
            <p className="text-[10px] font-black uppercase">Emergency Evac</p>
            <p className="text-[8px] text-white/40">Tier-1 Protocol Ready</p>
          </div>
        </div>

        {/* Victim Support & Trauma */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase text-red-300">Victim & Trauma Support</h4>
          <div className="bg-red-500/10 p-4 rounded-2xl border border-red-500/20 space-y-3">
            <div className="flex items-center gap-2">
              <LifeBuoy className="w-4 h-4 text-red-400" />
              <span className="text-[10px] font-black uppercase">Counseling Integration</span>
            </div>
            <p className="text-[8px] text-white/80 leading-relaxed uppercase">
              Instant access to trauma resources and legal assistance coordination for any suspected incidents.
            </p>
            <Button size="sm" className="w-full bg-red-600/20 hover:bg-red-600 text-red-100 text-[8px] h-8 rounded-lg font-bold">
              Access Support Manifold
            </Button>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center text-[10px] font-bold uppercase text-white/40">
            <span>Community Healing Sync</span>
            <span className="text-red-400 font-mono">NODE_ACTIVE</span>
          </div>
          <div className="flex gap-1 h-1">
            {[1,2,3,4,5,6,7,8,9,10].map(i => (
              <div key={i} className="flex-1 bg-red-900 rounded-full" />
            ))}
          </div>
        </div>

        <Button variant="destructive" className="w-full h-12 rounded-xl font-black uppercase tracking-tighter text-[10px] bg-red-950/40 hover:bg-red-600 border border-red-500/30 shadow-[0_0_20px_rgba(220,38,38,0.3)]">
          Execute Global Emergency Override
        </Button>
      </CardContent>
    </Card>
  );
}
