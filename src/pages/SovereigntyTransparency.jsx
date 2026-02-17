import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, BarChart, Users, Globe, 
  Scale, ShieldCheck, DollarSign, ExternalLink,
  PieChart, Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

const REPORTS = [
  { name: 'Diversity & Inclusion Report', val: '94.2%', icon: Users, color: 'text-indigo-400' },
  { name: 'Public Impact Metric', val: '4.9/5', icon: Globe, color: 'text-cyan-400' },
  { name: 'Supply Chain Audit', val: 'VERIFIED', icon: ShieldCheck, color: 'text-green-400' },
  { name: 'Financial Transparency', val: 'AUDITED', icon: DollarSign, color: 'text-yellow-400' }
];

export default function SovereigntyTransparencyHub() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10 relative overflow-hidden">
      {/* Background Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-12 border-b border-white/10 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic flex items-center gap-4">
              <Scale className="w-10 h-10 text-indigo-400" />
              Sovereignty & Transparency
            </h1>
            <p className="text-white/40 font-mono text-sm mt-2 uppercase">Public Governance & Accountability Dashboard</p>
          </div>
          <Badge className="bg-indigo-600 text-sm py-1 px-4 rounded-full">GLOBAL_AUDIT_READY</Badge>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {REPORTS.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                <CardContent className="p-6 space-y-4">
                  <div className={`p-3 rounded-2xl bg-white/5 w-fit ${r.color}`}>
                    <r.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-white/40">{r.name}</p>
                    <p className="text-2xl font-black italic tracking-tighter text-white">{r.val}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ethics & Fairness Auditor */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-white/5 border-white/10 p-8 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Activity className="w-64 h-64 text-white" />
              </div>
              <div className="relative z-10 space-y-6">
                <h3 className="text-2xl font-black uppercase italic">Ethical AI Decision Engine</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Algorithmic Fairness', val: 99.9 },
                    { label: 'Demographic Parity', val: 98.4 },
                    { label: 'Bias Mitigation', val: 100.0 }
                  ].map(m => (
                    <div key={m.label} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                        <span>{m.label}</span>
                        <span className="text-indigo-400">{m.val}%</span>
                      </div>
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${m.val}%` }} className="h-full bg-indigo-500" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-4 flex gap-4">
                  <Button className="bg-white text-black font-black uppercase text-xs h-12 px-8 rounded-xl">View Explainability Logs</Button>
                  <Button variant="outline" className="border-white/10 text-white font-black uppercase text-xs h-12 px-8 rounded-xl">Request Data Audit</Button>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <Card className="bg-white/5 border-white/10 p-6 rounded-3xl space-y-4">
                 <div className="flex items-center gap-3">
                   <Users className="w-5 h-5 text-purple-400" />
                   <h4 className="text-sm font-black uppercase">Pay Equity Manifold</h4>
                 </div>
                 <p className="text-[10px] text-white/40 uppercase leading-relaxed">Verified 1:1 wage ratio across all driver demographics. Real-time auditing active on the blockchain ledger.</p>
                 <Badge variant="outline" className="border-green-500/30 text-green-400">CERTIFIED</Badge>
               </Card>
               <Card className="bg-white/5 border-white/10 p-6 rounded-3xl space-y-4">
                 <div className="flex items-center gap-3">
                   <ShieldCheck className="w-5 h-5 text-cyan-400" />
                   <h4 className="text-sm font-black uppercase">Ingredient Transparency</h4>
                 </div>
                 <p className="text-[10px] text-white/40 uppercase leading-relaxed">Full provenance for all in-cabin snacks and beverages. 100% organic, fair-trade, and bio-available.</p>
                 <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">FAIR_TRADE</Badge>
               </Card>
            </div>
          </div>

          {/* Right Column - Financial & Summary */}
          <div className="space-y-8">
            <Card className="bg-indigo-600 border-none p-8 rounded-3xl text-white shadow-[0_0_50px_rgba(79,70,229,0.3)]">
              <h3 className="text-xl font-black uppercase italic mb-6">Financial Transparency</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-mono opacity-60 uppercase">System Gross Revenue</p>
                  <p className="text-3xl font-black tracking-tighter">$142.4M</p>
                </div>
                <div>
                  <p className="text-[10px] font-mono opacity-60 uppercase">Community Distribution</p>
                  <p className="text-3xl font-black tracking-tighter">$12.2M</p>
                </div>
                <Button className="w-full bg-black text-white font-black h-12 rounded-xl mt-4">Download Annual Report</Button>
              </div>
            </Card>

            <Card className="bg-white/5 border-white/10 p-6 rounded-3xl space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-indigo-300">Public Metrics Sync</h4>
              <div className="space-y-3">
                {[
                  { label: 'Uptime', val: '99.999%' },
                  { label: 'Latency', val: '0.002ms' },
                  { label: 'Encryption', val: 'Post-Quantum' }
                ].map(m => (
                  <div key={m.label} className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-white/40 uppercase">{m.label}</span>
                    <span className="text-indigo-400 font-bold">{m.val}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
