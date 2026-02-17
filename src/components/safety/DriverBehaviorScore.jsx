import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, ShieldCheck, Zap } from 'lucide-react';

export default function DriverBehaviorScore({ userEmail }) {
  return (
    <Card className="bg-white/5 border-white/10 overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-white/5 p-4">
        <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Activity className="w-3 h-3 text-cyan-400" />
          Neural Behavior Score
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-4xl font-black italic tracking-tighter text-white">98.4</h2>
          <Badge className="bg-green-500 text-white font-black uppercase text-[8px]">EXEMPLARY</Badge>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-[8px] font-mono text-white/40">
            <span>Smoothness</span>
            <span>99%</span>
          </div>
          <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-500 w-[99%]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
