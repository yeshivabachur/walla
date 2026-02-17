import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign } from 'lucide-react';

export default function EarningsForecast({ userEmail }) {
  return (
    <Card className="bg-white/5 border-white/10 overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-white/5 p-4">
        <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <TrendingUp className="w-3 h-3 text-cyan-400" />
          Neural Earnings Forecast
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[8px] font-bold text-white/40 uppercase">Next 24 Hours</p>
            <p className="text-xl font-black italic tracking-tighter text-white">+$242.00</p>
          </div>
          <div className="text-right">
            <p className="text-[8px] font-bold text-white/40 uppercase">Confidence</p>
            <p className="text-xs font-black italic text-cyan-400">92.4%</p>
          </div>
        </div>
        <div className="h-8 flex gap-1 items-end">
          {[4,7,3,9,5,2,8,4,6,3,5,8,4,9].map((h, i) => (
            <div key={i} className="flex-1 bg-cyan-500/20 rounded-t-sm" style={{ height: `${h * 10}%` }} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
