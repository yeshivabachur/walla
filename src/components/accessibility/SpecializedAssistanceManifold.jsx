import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, Accessibility, UserCheck, ShieldPlus, 
  Stethoscope, Crosshair, HelpCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const SERVICES = [
  { id: 'senior', name: 'Senior Assist', desc: 'Door-to-door escort & extra wait time', icon: Heart, color: 'text-red-400' },
  { id: 'medical', name: 'Hospital Discharge', desc: 'Medical-grade protocol & sanitation', icon: Stethoscope, color: 'text-blue-400' },
  { id: 'disability', name: 'Accessibility Pro', desc: 'Certified driver & equipment prep', icon: Accessibility, color: 'text-cyan-400' },
  { id: 'youth', name: 'Youth Guardian', desc: 'Safe-pass code & parent live-link', icon: ShieldPlus, color: 'text-indigo-400' }
];

export default function SpecializedAssistanceManifold() {
  const [selected, setSelected] = useState([]);

  const toggle = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <Card className="border border-red-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-red-500/5 p-4">
        <CardTitle className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em] text-red-400">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Specialized Assistance Manifold
          </div>
          <Badge className="bg-red-600">TIER_1_PROTOCOLS</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-4 flex-1">
        <div className="grid grid-cols-1 gap-3">
          {SERVICES.map(s => (
            <motion.div
              key={s.id}
              onClick={() => toggle(s.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between group ${selected.includes(s.id) ? 'border-red-500 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'border-white/10 bg-white/5'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl bg-white/5 ${s.color}`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase">{s.name}</p>
                  <p className="text-[8px] text-white/40 uppercase">{s.desc}</p>
                </div>
              </div>
              {selected.includes(s.id) && <UserCheck className="w-4 h-4 text-red-400" />}
            </motion.div>
          ))}
        </div>

        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 mt-2">
          <div className="flex items-center gap-2 mb-2">
            <ShieldPlus className="w-4 h-4 text-green-400" />
            <span className="text-[9px] font-black uppercase text-white">Driver Certification Verify</span>
          </div>
          <p className="text-[8px] text-white/40 uppercase">
            All assistance requests are matched only with Level 4+ Certified Assist Drivers.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
