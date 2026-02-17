import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Star } from 'lucide-react';

export default function DriverMentorMatch({ userEmail }) {
  return (
    <Card className="bg-white/5 border-white/10 overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-white/5 p-4">
        <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-indigo-400">
          <Users className="w-3 h-3" />
          Neural Mentor Match
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
          <Users className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase">Alpha_Pilot_88</p>
          <div className="flex items-center gap-1 mt-0.5">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-[8px] font-mono text-white/40 uppercase">Top 1% Mentor</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
