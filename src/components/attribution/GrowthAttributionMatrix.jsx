import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Rocket, Search, Target, BarChart3, 
  Share2, Zap, GitBranch, Binary,
  PieChart, Magnet
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function GrowthAttributionMatrix() {
  return (
    <Card className="border border-indigo-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-indigo-500/5 p-4">
        <CardTitle className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em] text-indigo-400">
          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4" />
            Growth & Attribution Matrix
          </div>
          <Badge className="bg-indigo-600">MARKETING_OPS_LIVE</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1">
        {/* Multi-touch Attribution */}
        <div className="space-y-4">
          <div className="flex justify-between items-center text-[10px] font-black uppercase">
            <span>Multi-Touch Attribution Model</span>
            <span className="text-indigo-400">v4.2 PRO</span>
          </div>
          <div className="grid grid-cols-4 gap-2 h-16">
            {[
              { label: 'SEO', val: 42, color: 'bg-blue-500' },
              { label: 'VIRAL', val: 88, color: 'bg-cyan-500' },
              { label: 'PAID', val: 25, color: 'bg-purple-500' },
              { label: 'DIRECT', val: 64, color: 'bg-indigo-500' }
            ].map(m => (
              <div key={m.label} className="flex flex-col items-center justify-end gap-1">
                <div className="w-full bg-white/5 rounded-t-lg overflow-hidden flex items-end h-full">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${m.val}%` }}
                    className={`w-full ${m.color}`} 
                  />
                </div>
                <span className="text-[6px] font-mono text-white/40">{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Viral Loop / K-Factor */}
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Magnet className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] font-black uppercase">Viral K-Factor Analysis</span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400">1.428 (CRITICAL_MASS)</span>
          </div>
          <p className="text-[8px] text-white/40 uppercase">
            Organic user expansion loop is currently self-sustaining across 14 geographic sectors.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
            <Share2 className="w-4 h-4 text-purple-400 mb-1" />
            <p className="text-[9px] font-bold uppercase">Referral Vel</p>
            <p className="text-[7px] text-white/40 italic">+$420 LTV/user</p>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
            <BarChart3 className="w-4 h-4 text-green-400 mb-1" />
            <p className="text-[9px] font-bold uppercase">ROAS Target</p>
            <p className="text-[7px] text-white/40 italic">Achieved: 14.2x</p>
          </div>
        </div>

        <div className="pt-2 flex justify-between items-center border-t border-white/5 font-mono text-[8px] text-white/20">
          <div className="flex items-center gap-2 uppercase">
            <Binary className="w-3 h-3 text-white/20" />
            Attribution_Hash: 0x82f...
          </div>
          <Zap className="w-3 h-3 text-yellow-400 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}
