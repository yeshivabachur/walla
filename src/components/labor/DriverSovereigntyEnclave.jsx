import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, Scale, Heart, ShieldCheck, 
  Landmark, Gavel, BarChart3, Globe,
  Briefcase, PiggyBank, GraduationCap,
  Baby, Home, Hospital
} from 'lucide-react';
import { motion } from 'framer-motion';

const BENEFITS = [
  { name: 'Health Insurance', status: 'ACTIVE', category: 'MEDICAL', icon: Hospital },
  { name: 'Retirement (401k)', status: 'MATCHING', category: 'FINANCE', icon: PiggyBank },
  { name: 'Driver Union', status: 'MEMBER', category: 'GOVERNANCE', icon: Users },
  { name: 'Childcare Support', status: 'CLAIMABLE', category: 'FAMILY', icon: Baby },
  { name: 'Housing Assistance', status: 'QUALIFIED', category: 'SHELTER', icon: Home },
  { name: 'Tuition Credit', status: 'AVAILABLE', category: 'EDUCATION', icon: GraduationCap }
];

export default function DriverSovereigntyEnclave() {
  return (
    <Card className="border border-emerald-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-emerald-500/5 p-4">
        <CardTitle className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em] text-emerald-400">
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 animate-bounce-slow" />
            Driver Sovereignty & Benefits
          </div>
          <Badge className="bg-emerald-600">FULLY_OWNED</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
        {/* Equity Program */}
        <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-black uppercase">Institutional Equity</span>
            </div>
            <span className="text-xl font-black italic tracking-tighter text-emerald-400">14.2%</span>
          </div>
          <p className="text-[8px] text-white/40 uppercase leading-relaxed">
            Your ownership stake in Walla is currently valued at **$142,400.00**. Stock options vested.
          </p>
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: '42%' }} className="h-full bg-emerald-500" />
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BENEFITS.map(b => (
            <div key={b.name} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4 group hover:bg-white/10 transition-all">
              <div className="p-2 rounded-xl bg-white/5 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                <b.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase leading-tight">{b.name}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[7px] font-mono text-white/40 uppercase">{b.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Legal Defense & Protection */}
        <div className="space-y-3 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">Worker Rights Protection</h4>
          </div>
          <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-[9px] uppercase leading-relaxed text-white/60">
            Legal defense fund active. You have **Full Indemnity** for all mission-critical operations within Sector 7G.
          </div>
          <Button className="w-full bg-white text-black font-black uppercase text-[10px] h-10 rounded-xl hover:bg-emerald-400 hover:text-white transition-all">
            Access Counsel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
