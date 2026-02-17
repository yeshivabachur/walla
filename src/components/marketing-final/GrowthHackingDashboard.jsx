import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Rocket, Mail, Share2, BarChart, 
  Target, Zap, PieChart, Users, Repeat
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function GrowthHackingDashboard() {
  return (
    <Card className="border border-indigo-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-indigo-500/5 p-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-indigo-400" />
            <span className="uppercase tracking-widest text-xs font-mono">Viral & Growth Engine</span>
          </div>
          <Badge className="bg-indigo-600">GROWTH_SYNCED</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
            <div className="flex justify-between items-center">
              <Repeat className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] font-mono text-cyan-400">K-FACTOR: 1.4</span>
            </div>
            <p className="text-[10px] font-black uppercase">Viral Loop Strength</p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
            <div className="flex justify-between items-center">
              <Target className="w-4 h-4 text-purple-400" />
              <span className="text-[10px] font-mono text-purple-400">LTV: $4.2k</span>
            </div>
            <p className="text-[10px] font-black uppercase">Lifetime Value</p>
          </div>
        </div>

        {/* Drip Campaigns */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase text-indigo-300 italic">Active Drip Sequences</h4>
          <div className="space-y-2">
            {[
              { name: 'Nurture Series', rate: '82%' },
              { name: 'Win-back Drip', rate: '45%' },
              { name: 'Alpha Invitation', rate: '94%' }
            ].map(s => (
              <div key={s.name} className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/5">
                <span className="text-[10px] font-mono text-white/60">{s.name}</span>
                <span className="text-[10px] font-black text-indigo-400">{s.rate} OPEN</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-indigo-500/10 p-4 rounded-2xl border border-indigo-500/20 space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-[10px] font-black uppercase">A/B Testing Variant_B Winning</span>
          </div>
          <p className="text-[8px] text-white/40 uppercase">"Dynamic price-drop notifications increased retention by 14%."</p>
        </div>
      </CardContent>
    </Card>
  );
}
