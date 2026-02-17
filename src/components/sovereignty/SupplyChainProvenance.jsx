import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Package, MapPin, ShieldCheck, Database, 
  Globe, Zap, FileText, CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

const PARTS = [
  { id: 'CPU-88', name: 'Quantum Processor', origin: 'Luna-1', status: 'VERIFIED' },
  { id: 'ENG-42', name: 'Warp Manifold', origin: 'Mars Prime', status: 'AUDITED' },
  { id: 'SNK-01', name: 'Bio-Organic Snack', origin: 'Earth Neo', status: 'FAIR_TRADE' }
];

export default function SupplyChainProvenance() {
  return (
    <Card className="border border-indigo-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-indigo-500/5 p-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-400" />
            <span className="uppercase tracking-widest text-xs font-mono">Supply Chain & Ingredient Provenance</span>
          </div>
          <Badge className="bg-indigo-600">LEDGER_CERTIFIED</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1">
        <div className="space-y-3">
          {PARTS.map(p => (
            <div key={p.id} className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/20">
                  <Package className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase">{p.name}</p>
                  <p className="text-[8px] text-white/40 font-mono">ORIGIN: {p.origin}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-[8px] border-green-500/30 text-green-400">
                {p.status}
              </Badge>
            </div>
          ))}
        </div>

        {/* Global Transparency Block */}
        <div className="bg-indigo-500/10 p-4 rounded-2xl border border-indigo-500/20 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span className="text-[10px] font-black uppercase">Ethical Sourcing Score</span>
          </div>
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <p className="text-[8px] text-white/40 uppercase">Global Audit Status</p>
              <div className="flex gap-0.5">
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
                  <div key={i} className="w-1.5 h-4 bg-indigo-500 rounded-sm" />
                ))}
              </div>
            </div>
            <span className="text-xl font-black italic text-indigo-400 uppercase">Passed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
