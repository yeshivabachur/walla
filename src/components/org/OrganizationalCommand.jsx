import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, UserPlus, Target, Briefcase, 
  BarChart, Rocket, ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrganizationalCommand({ userEmail }) {
  return (
    <Card className="border border-blue-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl overflow-hidden h-full flex flex-col">
      <CardHeader className="border-b border-white/5 bg-blue-500/5">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-400" />
            <span className="uppercase tracking-[0.2em] font-black italic text-sm">Strategic Org Control</span>
          </div>
          <Badge className="bg-blue-600">ENTERPRISE</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Recruitment Funnel */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase text-blue-300">Driver Recruitment Funnel</h4>
          <div className="flex items-center gap-1 h-12">
            {[80, 65, 40, 20, 15].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-blue-500/20 rounded-t-lg overflow-hidden flex items-end h-full">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    className="w-full bg-blue-500" 
                  />
                </div>
                <span className="text-[6px] text-white/40">STEP_{i+1}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[8px] font-mono text-white/60">
            <span>Leads: 14.2k</span>
            <span>Verified: 1.2k</span>
          </div>
        </div>

        {/* Talent Management */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
            <UserPlus className="w-4 h-4 text-cyan-400" />
            <p className="text-[10px] font-black text-white uppercase">Talent Acquisition</p>
            <p className="text-[8px] text-white/40">AI Vetting Active</p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
            <Target className="w-4 h-4 text-purple-400" />
            <p className="text-[10px] font-black text-white uppercase">Goal Alignment</p>
            <p className="text-[8px] text-white/40">OKRs Syncing</p>
          </div>
        </div>

        {/* Culture & Governance */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center text-[10px] font-bold uppercase">
            <span>Culture Sat Score</span>
            <span className="text-green-400">94%</span>
          </div>
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '94%' }}
              transition={{ duration: 1.5 }}
              className="h-full bg-gradient-to-r from-blue-500 to-green-500" 
            />
          </div>
        </div>

        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-[10px] h-12 rounded-xl">
          Enter Strategic Command Center
        </Button>
      </CardContent>
    </Card>
  );
}
