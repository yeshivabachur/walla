import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Wrench, AlertTriangle } from 'lucide-react';

export default function VehicleHealthCard() {
  return (
    <Card className="bg-white/5 border-white/10 overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-white/5 p-4">
        <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Activity className="w-3 h-3 text-yellow-400" />
          Vehicle Health Matrix
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase text-white">System Integrity</span>
          </div>
          <span className="text-sm font-black italic">94.2%</span>
        </div>
        <div className="p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20 flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-yellow-400" />
          <p className="text-[8px] font-bold uppercase text-yellow-400">Next Service in 1,240 miles</p>
        </div>
      </CardContent>
    </Card>
  );
}
