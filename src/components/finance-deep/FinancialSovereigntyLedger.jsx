import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, Target, Share2, Rocket, 
  Zap, Magnet, GitBranch, Binary,
  PieChart, Landmark, Globe
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function FinancialSovereigntyLedger() {
  return (
    <Card className="border border-emerald-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-emerald-500/5 p-4">
        <CardTitle className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em] text-emerald-400">
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4" />
            Financial Sovereignty & Community Ledger
          </div>
          <Badge className="bg-emerald-600">DISTRIBUTED_STABLE</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
        {/* Community Distribution */}
        <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-black uppercase">Global Community Distribution</span>
            </div>
            <span className="text-xl font-black italic tracking-tighter text-emerald-400">$12.2M</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[8px] font-mono text-white/40">
              <span>LOCAL_POOL_RESERVE</span>
              <span>84.2%</span>
            </div>
            <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: '84%' }} className="h-full bg-emerald-500" />
            </div>
          </div>
        </div>

        {/* Attribution & Growth */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2 group hover:bg-emerald-500/10 transition-all">
            <div className="flex justify-between items-center">
              <Magnet className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] font-mono text-cyan-400">1.42</span>
            </div>
            <p className="text-[10px] font-black uppercase">Viral K-Factor</p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2 group hover:bg-emerald-500/10 transition-all">
            <div className="flex justify-between items-center">
              <Rocket className="w-4 h-4 text-purple-400" />
              <span className="text-[10px] font-mono text-purple-400">14.2x</span>
            </div>
            <p className="text-[10px] font-black uppercase">ROAS Target</p>
          </div>
        </div>

        {/* Distributed Ledger Sync */}
        <div className="space-y-2 pt-4 border-t border-white/5">
          <h4 className="text-[9px] font-black uppercase text-white/40 tracking-[0.2em]">Live Ledger Hashes</h4>
          <div className="space-y-1">
            {[1,2,3].map(i => (
              <div key={i} className="flex justify-between items-center text-[8px] font-mono p-2 bg-black/40 rounded-lg border border-white/5">
                <span className="text-white/40 uppercase">TX_NODE_{i*42}</span>
                <span className="text-emerald-400">0x82f...{(i*88).toString(16)}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
