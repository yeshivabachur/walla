import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Send, Mail, Users, TrendingUp, 
  Zap, Rocket, Share2, BarChart
} from 'lucide-react';
import { motion } from 'framer-motion';

const SEQUENCES = [
  { id: 'seq-01', name: 'Welcome Series', status: 'ACTIVE', open_rate: '82%' },
  { id: 'seq-02', name: 'Re-engagement Drip', status: 'ACTIVE', open_rate: '45%' },
  { id: 'seq-03', name: 'Viral Loop Referral', status: 'PAUSED', open_rate: '--' },
];

export default function MarketingAutomationEngine() {
  return (
    <Card className="border border-indigo-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-indigo-500/5 p-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-indigo-400" />
            <span className="uppercase tracking-widest text-xs font-mono">Marketing & Viral Engine</span>
          </div>
          <Badge className="bg-indigo-600">AUTOMATED</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1">
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase text-indigo-300">Campaign Sequences</h4>
          {SEQUENCES.map(s => (
            <div key={s.id} className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <Send className="w-4 h-4 text-white/20 group-hover:text-indigo-400 transition-colors" />
                <div>
                  <p className="text-[10px] font-black uppercase">{s.name}</p>
                  <p className="text-[8px] text-white/40">Status: {s.status}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-indigo-400">{s.open_rate}</span>
                <p className="text-[6px] text-white/20 uppercase">Open Rate</p>
              </div>
            </div>
          ))}
        </div>

        {/* Viral Loop Concept */}
        <div className="bg-indigo-500/10 p-4 rounded-2xl border border-indigo-500/20 space-y-3">
          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-indigo-400" />
            <span className="text-[10px] font-black uppercase">Viral Growth Loop</span>
          </div>
          <p className="text-[8px] text-white/60 leading-relaxed uppercase italic">
            "K-Factor analysis predicts a 14% user growth jump in the next cycle based on current referral velocity."
          </p>
          <div className="flex justify-between items-center text-[10px] font-mono">
            <span>K-FACTOR</span>
            <span className="text-indigo-400 font-bold">1.42</span>
          </div>
        </div>

        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[10px] h-12 rounded-xl">
          Deploy Marketing Sprint
        </Button>
      </CardContent>
    </Card>
  );
}
