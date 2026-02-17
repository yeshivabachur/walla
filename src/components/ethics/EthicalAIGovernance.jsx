import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Scale, ShieldCheck, Eye, Binary, 
  Search, AlertTriangle, CheckCircle2, UserCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function EthicalAIGovernance() {
  return (
    <Card className="border border-emerald-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-emerald-500/5 p-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-emerald-400" />
            <span className="uppercase tracking-widest text-xs font-mono">Ethical AI & Fairness Audit</span>
          </div>
          <Badge className="bg-emerald-600">FAIR_ALGO_SYNC</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1">
        {/* Bias Mitigation */}
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-black uppercase">Bias Mitigation Active</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">99.9% FAIR</span>
          </div>
          <div className="flex gap-0.5 h-1">
            {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
              <div key={i} className="flex-1 bg-emerald-500 rounded-full" />
            ))}
          </div>
          <p className="text-[8px] text-white/40 uppercase">
            Pricing and dispatch algorithms are audited every 2ms for demographic neutrality.
          </p>
        </div>

        {/* Explainable AI */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold uppercase text-cyan-300">Explainable AI (XAI)</h4>
            <Badge variant="outline" className="text-[8px] border-white/10">TRANSPARENT</Badge>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-start gap-3">
            <Eye className="w-4 h-4 text-cyan-400 shrink-0 mt-1" />
            <div>
              <p className="text-[10px] font-black uppercase text-white">Route Decision Node</p>
              <p className="text-[8px] text-white/40 italic mt-1 uppercase">
                "Route selected based on: Traffic_Density (42%), Carbon_Savings (38%), Safety_Score (20%)"
              </p>
            </div>
          </div>
        </div>

        {/* Human-in-the-Loop */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-2">
            <UserCheck className="w-4 h-4 text-indigo-400" />
            <p className="text-[9px] font-bold uppercase">Human Oversight</p>
            <p className="text-[7px] text-white/40 uppercase">Ethics Board Linked</p>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-2">
            <Binary className="w-4 h-4 text-purple-400" />
            <p className="text-[9px] font-bold uppercase">Algo Auditing</p>
            <p className="text-[7px] text-white/40 uppercase">Real-time Logging</p>
          </div>
        </div>

        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[10px] h-12 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          View Full Transparency Report
        </Button>
      </CardContent>
    </Card>
  );
}
