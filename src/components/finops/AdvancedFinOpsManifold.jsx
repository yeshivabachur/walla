import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  PiggyBank, Gavel, TrendingDown, 
  Wallet, Landmark, Receipt, Calculator,
  ShieldCheck, AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdvancedFinOpsManifold({ userEmail }) {
  return (
    <Card className="border border-green-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-green-500/5 p-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-green-400" />
            <span className="uppercase tracking-widest text-xs font-mono">Advanced Driver FinOps</span>
          </div>
          <Badge className="bg-green-600">LEDGER_SYNCED</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1">
        {/* 401k & Retirement */}
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <PiggyBank className="w-4 h-4 text-pink-400" />
              <span className="text-[10px] font-black uppercase">401k & Retirement Sync</span>
            </div>
            <span className="text-[10px] font-mono text-green-400">$12,402.00 Contribution</span>
          </div>
          <p className="text-[8px] text-white/40 uppercase">
            Auto-allocated 4% of gross earnings to diversified index manifold.
          </p>
        </div>

        {/* Depreciation Calculator */}
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-400" />
              <span className="text-[10px] font-black uppercase">Vehicle Depreciation AI</span>
            </div>
            <Badge variant="outline" className="text-[8px] border-red-500/30 text-red-400">-$0.12/mi</Badge>
          </div>
          <p className="text-[8px] text-white/40 uppercase">
            Real-time value tracking based on market volatility and mileage delta.
          </p>
        </div>

        {/* Traffic Citation Defense */}
        <div className="bg-red-500/10 p-4 rounded-2xl border border-red-500/20 space-y-3">
          <div className="flex items-center gap-2">
            <Gavel className="w-4 h-4 text-red-400" />
            <span className="text-[10px] font-black uppercase">Citation Defense Protocol</span>
          </div>
          <p className="text-[8px] text-white/80 uppercase leading-relaxed font-bold">
            "Automated legal response drafted for Speeding Ticket #8824. 92% reversal probability."
          </p>
          <Button size="sm" className="w-full bg-red-600 hover:bg-red-700 text-white text-[8px] h-8 rounded-lg font-black">
            Execute Legal Challenge
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex flex-col items-center text-center gap-1">
            <Calculator className="w-4 h-4 text-cyan-400" />
            <p className="text-[8px] font-bold uppercase">Lease vs Buy</p>
            <p className="text-[6px] text-white/40">AI Analysis Active</p>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex flex-col items-center text-center gap-1">
            <Receipt className="w-4 h-4 text-purple-400" />
            <p className="text-[8px] font-bold uppercase">Tax Deduction</p>
            <p className="text-[6px] text-white/40">Manual Export Ready</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
