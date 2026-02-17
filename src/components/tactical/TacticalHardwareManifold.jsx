import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, Activity, Zap, AlertTriangle, 
  Eye, Lock, Radio, Crosshair,
  Terminal, Cpu, Flame, HeartPulse
} from 'lucide-react';
import { motion } from 'framer-motion';

const TACTICAL_ASSETS = [
  { name: 'Night Vision (Thermal)', status: 'ACTIVE', integrity: 0.98, icon: Eye },
  { name: 'Electronic Countermeasures', status: 'STANDBY', integrity: 1.0, icon: Radio },
  { name: 'Targeting Link (V2X)', status: 'SYNCED', integrity: 0.94, icon: Crosshair },
  { name: 'Fire Suppression System', status: 'READY', integrity: 1.0, icon: Flame }
];

export default function TacticalHardwareManifold() {
  return (
    <Card className="border border-red-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-red-500/5 p-4">
        <CardTitle className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em] text-red-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 animate-pulse" />
            Tactical Hardware & V2X Systems
          </div>
          <Badge className="bg-red-600">DEFENSE_ACTIVE</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
        {/* Hardware Asset Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TACTICAL_ASSETS.map(asset => (
            <div key={asset.name} className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-3 group hover:bg-red-500/10 transition-all">
              <div className="flex justify-between items-start">
                <asset.icon className="w-5 h-5 text-red-400" />
                <Badge variant="outline" className="text-[7px] border-white/10 text-white/40">{asset.status}</Badge>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-white/80">{asset.name}</p>
                <div className="flex justify-between items-center mt-2">
                  <div className="w-full bg-white/10 h-1 rounded-full mr-2">
                    <div className="bg-red-500 h-full rounded-full" style={{ width: `${asset.integrity * 100}%` }} />
                  </div>
                  <span className="text-[8px] font-mono text-red-400">{(asset.integrity * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Life Support & Medical */}
        <div className="bg-red-500/10 p-4 rounded-2xl border border-red-500/20 space-y-3">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-red-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">Medical Inventory</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['First Aid v4', 'Defibrillator', 'Oxygen Reserve', 'SOS Beacon'].map(m => (
              <Badge key={m} className="bg-black/40 border border-white/10 text-white/60 text-[8px]">{m.toUpperCase()}</Badge>
            ))}
          </div>
        </div>

        {/* Tactical Feed */}
        <div className="space-y-2">
          <h4 className="text-[9px] font-black uppercase text-white/40">Sub-Space Link Logs</h4>
          <div className="bg-black p-3 rounded-xl border border-white/5 font-mono text-[8px] space-y-1 text-red-400/60">
            <p>[09:32:12] V2X_MESH: Detecting 4 vehicles in sector</p>
            <p>[09:32:14] RADAR: Sub-surface scan complete</p>
            <p>[09:32:18] CORE: Defense manifold synchronized</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
