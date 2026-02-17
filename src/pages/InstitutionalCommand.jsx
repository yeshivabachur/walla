import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, LineChart, Gavel, FileLock, 
  Target, Rocket, ShieldCheck, Landmark
} from 'lucide-react';
import { motion } from 'framer-motion';

const STATS = [
  { label: 'Pipeline Leads', val: '14.2k', delta: '+12%', color: 'text-blue-400' },
  { label: 'IP / Patents', val: '42', delta: '+2', color: 'text-cyan-400' },
  { label: 'Board Quorum', val: 'LOCKED', delta: 'SYNCED', color: 'text-indigo-400' },
  { label: 'IPO Readiness', val: '92%', delta: '+4%', color: 'text-emerald-400' }
];

export default function InstitutionalCommandDeck() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />
      
      <div className="max-w-[1800px] mx-auto relative z-10 space-y-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-8 gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic flex items-center gap-4">
              <Building2 className="w-12 h-12 text-indigo-400" />
              Institutional Command
            </h1>
            <p className="text-white/40 font-mono text-sm mt-2 uppercase">Executive Strategy & Corporate Governance Manifold</p>
          </div>
          <Badge className="bg-indigo-600 text-sm py-1 px-6 rounded-full font-black">ROOT_ACCESS_GRANTED</Badge>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="bg-white/5 border-white/10 hover:border-indigo-500/30 transition-all cursor-default">
                <CardContent className="p-6">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">{s.label}</p>
                  <div className="flex items-end justify-between">
                    <h4 className="text-3xl font-black italic tracking-tighter">{s.val}</h4>
                    <span className={`text-[10px] font-bold ${s.color}`}>{s.delta}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pipeline & Sales */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-white/5 border-white/10 p-8 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <LineChart className="w-64 h-64 text-blue-400" />
              </div>
              <h3 className="text-2xl font-black uppercase italic mb-6">Pipeline Velocity & Sales Enablement</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase text-blue-300 tracking-widest">Lead Qualification Manifold</h4>
                  <div className="flex items-center gap-1 h-20">
                    {[40, 70, 45, 90, 65, 30, 85].map((h, i) => (
                      <motion.div key={i} animate={{ height: `${h}%` }} className="flex-1 bg-blue-500/40 rounded-t-sm" />
                    ))}
                  </div>
                  <div className="flex justify-between text-[8px] font-mono text-white/40">
                    <span>MQL: 4.2k</span>
                    <span>SQL: 1.1k</span>
                  </div>
                </div>
                <div className="bg-black/40 rounded-2xl p-6 border border-white/5 space-y-4">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-indigo-400" />
                    <span className="text-[10px] font-black uppercase">Revenue Optimization Engine</span>
                  </div>
                  <p className="text-[8px] text-white/40 leading-relaxed uppercase">AI-Driven conversion modeling predicting 14.2% lift in renewal contracts for next quarter.</p>
                  <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] h-8 rounded-lg font-black uppercase">Execute Upsell Sprint</Button>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <Card className="bg-white/5 border-white/10 p-6 rounded-3xl space-y-4">
                 <div className="flex items-center gap-3 text-cyan-400">
                   <FileLock className="w-5 h-5" />
                   <h4 className="text-sm font-black uppercase">Intellectual Property Vault</h4>
                 </div>
                 <p className="text-[10px] text-white/40 uppercase leading-relaxed">42 Defensive Patents filed. 12 Pending. Quantum-resistant trade secret encryption active.</p>
                 <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">SECURED</Badge>
               </Card>
               <Card className="bg-white/5 border-white/10 p-6 rounded-3xl space-y-4">
                 <div className="flex items-center gap-3 text-purple-400">
                   <Gavel className="w-5 h-5" />
                   <h4 className="text-sm font-black uppercase">Board Governance Manifold</h4>
                 </div>
                 <p className="text-[10px] text-white/40 uppercase leading-relaxed">Stakeholder voting quorum synchronized. Next resolution: Inter-Sector M&A Strategy.</p>
                 <Button variant="ghost" className="w-full text-purple-400 hover:text-purple-300 text-[8px] font-black uppercase">Interrogate Ledger</Button>
               </Card>
            </div>
          </div>

          {/* Right Column - Org Frameworks */}
          <div className="space-y-8">
            <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 border-none p-8 rounded-3xl text-white shadow-2xl">
              <h3 className="text-xl font-black uppercase italic mb-6 italic">Strategic Moats</h3>
              <div className="space-y-6">
                {[
                  { label: 'Network Effects', val: '9.4/10' },
                  { label: 'Brand Equity', val: '8.8/10' },
                  { label: 'Switching Costs', val: 'HIGH' }
                ].map(m => (
                  <div key={m.label}>
                    <div className="flex justify-between text-[10px] font-bold uppercase mb-2">
                      <span>{m.label}</span>
                      <span>{m.val}</span>
                    </div>
                    <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '80%' }} className="h-full bg-white" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-white/5 border-white/10 p-6 rounded-3xl space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-cyan-400">Innovation Frameworks</h4>
              <div className="space-y-3">
                <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                  <p className="text-[9px] font-black uppercase text-white">Jobs-To-Be-Done</p>
                  <p className="text-[7px] text-white/40 mt-1 uppercase">"The user needs to traverse reality without friction."</p>
                </div>
                <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                  <p className="text-[9px] font-black uppercase text-white">Lean Startup Loop</p>
                  <p className="text-[7px] text-white/40 mt-1 uppercase">Build ➔ Measure ➔ Teleport ➔ Learn</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
