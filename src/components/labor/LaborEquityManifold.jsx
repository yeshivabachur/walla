import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, Scale, Heart, ShieldCheck, 
  Landmark, Gavel, BarChart3, Globe
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LaborEquityManifold({ userEmail }) {
  return (
    <Card className="border border-emerald-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-emerald-500/5 p-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <span className="uppercase tracking-widest text-xs font-mono">Labor Equity & Worker Rights</span>
          </div>
          <Badge className="bg-emerald-600">FAIR_TRADE_CERTIFIED</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1">
        {/* Pay Equity Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold uppercase text-emerald-300 italic">Pay Equity Audit</h4>
            <span className="text-[10px] font-mono text-emerald-400">1:1 PARITY ACHIEVED</span>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-white/40 uppercase font-mono">Living Wage Index</p>
              <p className="text-xl font-black italic tracking-tighter text-white">+$4.20/hr Above Market</p>
            </div>
            <div className="p-2 bg-emerald-500/20 rounded-xl">
              <Scale className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Worker Rights Manifest */}
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] font-black uppercase">Worker Rights & Ownership</span>
          </div>
          <p className="text-[8px] text-white/60 leading-relaxed uppercase">
            Every 1,000 miles driven grants 1 unit of **Walla Equity**. Employee ownership currently at 12.4%.
          </p>
          <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: '12.4%' }} className="h-full bg-blue-500" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex flex-col items-center text-center gap-1">
            <Heart className="w-4 h-4 text-pink-400" />
            <p className="text-[8px] font-bold uppercase">Collective Bargaining</p>
            <p className="text-[6px] text-white/40 italic">NODE_SYNCED</p>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex flex-col items-center text-center gap-1">
            <Gavel className="w-4 h-4 text-yellow-400" />
            <p className="text-[8px] font-bold uppercase">Ethical Sourcing</p>
            <p className="text-[6px] text-white/40 italic">100% Provenance</p>
          </div>
        </div>

        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[10px] h-12 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          Download Transparency Report
        </Button>
      </CardContent>
    </Card>
  );
}
