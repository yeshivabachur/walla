import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, TrendingUp, DollarSign } from 'lucide-react';

export default function SmartEarningsOptimizer({ userEmail }) {
  return (
    <Card className="bg-emerald-500/10 border-emerald-500/20 overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.1)]">
      <CardHeader className="border-b border-emerald-500/10 bg-emerald-500/5 p-4">
        <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-emerald-400">
          <Zap className="w-3 h-3" />
          Smart Earnings Optimizer
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <p className="text-[10px] text-white/60 leading-relaxed uppercase">
          Move to **Sector 4** now to capture a 1.4x surge bounty. Estimated gain: **+$42.00**.
        </p>
        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400">
          <TrendingUp className="w-4 h-4" />
          POTENTIAL_LIFT: 24%
        </div>
      </CardContent>
    </Card>
  );
}
