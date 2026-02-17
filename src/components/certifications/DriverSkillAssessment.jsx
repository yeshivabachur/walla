import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Star, CheckCircle2 } from 'lucide-react';

export default function DriverSkillAssessment({ userEmail }) {
  return (
    <Card className="bg-white/5 border-white/10 overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-white/5 p-4">
        <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Brain className="w-3 h-3 text-purple-400" />
          Skill & Competency Matrix
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 grid grid-cols-2 gap-3">
        {[
          { label: 'Hyper-Routing', val: '94%' },
          { label: 'Passenger Care', val: '98%' },
          { label: 'EV Management', val: '82%' },
          { label: 'Night Ops', val: '100%' }
        ].map(s => (
          <div key={s.label} className="bg-black/20 p-3 rounded-xl border border-white/5 space-y-1">
            <p className="text-[8px] font-bold text-white/40 uppercase">{s.label}</p>
            <p className="text-sm font-black italic">{s.val}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
