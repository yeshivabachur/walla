import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Zap, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DriverPreferredHours({ userEmail }) {
  return (
    <Card className="bg-white/5 border-white/10 overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-white/5 p-4">
        <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Clock className="w-3 h-3 text-indigo-400" />
          Preferred Working Hours
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-center bg-black/20 p-3 rounded-xl border border-white/5">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-yellow-400" />
            <span className="text-[10px] font-bold uppercase">Morning Peak</span>
          </div>
          <Badge className="bg-green-500/20 text-green-400 text-[8px]">OPTIMAL</Badge>
        </div>
        <div className="flex justify-between items-center bg-black/20 p-3 rounded-xl border border-white/5">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] font-bold uppercase">Late Night</span>
          </div>
          <Badge className="bg-indigo-500/20 text-indigo-400 text-[8px]">HIGH_DEMAND</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
