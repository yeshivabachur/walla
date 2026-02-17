import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  HeartPulse, Landmark, Newspaper, Gamepad2, 
  ExternalLink, CheckCircle2, AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const INTEGRATIONS = [
  { id: 'fitness', name: 'Fitness & Vitality', icon: HeartPulse, color: 'text-pink-400', desc: 'HealthKit / Fitbit Sync', status: 'Syncing' },
  { id: 'banking', name: 'Banking & Ledger', icon: Landmark, color: 'text-green-400', desc: 'Direct Ledger Access', status: 'Wired' },
  { id: 'news', name: 'Contextual News', icon: Newspaper, color: 'text-blue-400', desc: 'AI Filtered Feeds', status: 'Active' },
  { id: 'gaming', name: 'Gaming Manifold', icon: Gamepad2, color: 'text-purple-400', desc: 'In-Ride Tournaments', status: 'Locked' }
];

export default function EcosystemMeshController() {
  return (
    <Card className="border border-indigo-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col">
      <CardHeader className="border-b border-white/5 bg-indigo-500/5 pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-indigo-400" />
            <span className="uppercase tracking-widest text-sm">Global Ecosystem Mesh</span>
          </div>
          <Badge className="bg-indigo-600">CONNECTED</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {INTEGRATIONS.map((int, i) => (
            <motion.div
              key={int.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-indigo-500/30 transition-all group"
            >
              <div className="flex justify-between items-start mb-3">
                <div className={`p-2 rounded-xl bg-white/5 ${int.color}`}>
                  <int.icon className="w-5 h-5" />
                </div>
                <Badge variant="outline" className="text-[8px] border-white/10 group-hover:border-indigo-500/50">
                  {int.status}
                </Badge>
              </div>
              <h4 className="text-sm font-bold uppercase tracking-tight">{int.name}</h4>
              <p className="text-[10px] text-white/40 mt-1">{int.desc}</p>
              
              <Button size="sm" className="w-full mt-4 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-100 text-[10px] h-8 rounded-lg">
                Manage Integration
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="pt-4 mt-4 border-t border-white/5">
          <div className="flex justify-between items-center text-[10px] font-mono">
            <span className="text-white/40">Neural Cross-Talk Fidelity</span>
            <span className="text-indigo-400 font-bold">99.98%</span>
          </div>
          <div className="w-full bg-indigo-900/20 h-1 mt-2 rounded-full overflow-hidden">
            <motion.div 
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="bg-indigo-500 h-full w-1/3" 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
