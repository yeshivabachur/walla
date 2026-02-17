import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Network, Search, Activity, Cpu, Shield, 
  Zap, Database, Binary, Radio, Globe, 
  Dna, Flame, Wind, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Entities from '@/api/entities';

const CATEGORIES = {
  BIO: { icon: Dna, color: 'text-pink-400', pattern: /Health|Biometric|Medical|Genetic|Welfare|Mood|Emotional/ },
  SEC: { icon: Shield, color: 'text-red-400', pattern: /Safety|Security|Fraud|Incident|Risk|Threat|Panic|Emergency|Safe/ },
  FIN: { icon: DollarSign, color: 'text-green-400', pattern: /Earnings|Payout|Bonus|Fee|Pricing|Payment|Wallet|Tax|Expense/ },
  OPS: { icon: Settings, color: 'text-blue-400', pattern: /Fleet|Dispatch|Route|Navigation|Vehicle|Maintenance|Shift|Schedule/ },
  ADV: { icon: Zap, color: 'text-cyan-400', pattern: /Quantum|Neural|AI|Autonomous|AR|Metaverse|Drone|Teleport|TimeTravel/ },
  SOC: { icon: Globe, color: 'text-purple-400', pattern: /Community|Social|Friend|Referral|Matching|Event|Story/ },
};

import { DollarSign, Settings } from 'lucide-react';

export default function NeuralRegistryExplorer() {
  const [search, setSearch] = useState('');
  const [hoveredEntity, setHoveredEntity] = useState(null);
  const [streamingData, setStreamingData] = useState({});

  const entityList = useMemo(() => {
    return Object.keys(Entities).map(name => {
      let category = 'GEN';
      for (const [key, config] of Object.entries(CATEGORIES)) {
        if (config.pattern.test(name)) {
          category = key;
          break;
        }
      }
      return { name, category };
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // Simulate live telemetry pulses for all entities
  useEffect(() => {
    const interval = setInterval(() => {
      const updates = {};
      entityList.forEach(e => {
        if (Math.random() > 0.95) {
          updates[e.name] = {
            val: (Math.random() * 100).toFixed(2),
            time: Date.now()
          };
        }
      });
      setStreamingData(prev => ({ ...prev, ...updates }));
    }, 1000);
    return () => clearInterval(interval);
  }, [entityList]);

  const filtered = entityList.filter(e => 
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="border border-indigo-500/30 bg-black/90 backdrop-blur-3xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/10 bg-indigo-500/5 pb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Network className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <span className="text-xl font-black uppercase tracking-[0.2em] italic">Neural Registry</span>
              <p className="text-[10px] font-mono text-indigo-300/60 uppercase">System Manifest v4.0.2 // Total Nodes: {entityList.length}</p>
            </div>
          </CardTitle>
          <div className="flex gap-2">
            {Object.entries(CATEGORIES).map(([key, config]) => (
              <div key={key} className={`p-1.5 rounded-md border border-white/5 bg-white/5 ${config.color}`} title={key}>
                <config.icon className="w-4 h-4" />
              </div>
            ))}
          </div>
        </div>
        <div className="relative mt-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400/50" />
          <Input 
            placeholder="Interrogate system nodes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-indigo-500/5 border-indigo-500/20 pl-12 h-12 rounded-2xl text-indigo-100 placeholder:text-indigo-500/30 focus:ring-indigo-500/40"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.05)_0%,transparent_100%)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          <AnimatePresence>
            {filtered.map((entity, i) => {
              const cat = CATEGORIES[entity.category] || { icon: Database, color: 'text-gray-400' };
              const live = streamingData[entity.name];
              const isHovered = hoveredEntity === entity.name;

              return (
                <motion.div
                  key={entity.name}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -2, scale: 1.02 }}
                  onMouseEnter={() => setHoveredEntity(entity.name)}
                  onMouseLeave={() => setHoveredEntity(null)}
                  className={`relative p-3 rounded-xl border ${isHovered ? 'border-indigo-500/50 bg-indigo-500/10' : 'border-white/5 bg-white/5'} transition-all cursor-crosshair group overflow-hidden`}
                >
                  {/* Background Pulse */}
                  {live && (
                    <motion.div 
                      initial={{ opacity: 0.5, scale: 0 }}
                      animate={{ opacity: 0, scale: 2 }}
                      className="absolute inset-0 bg-indigo-500 rounded-full pointer-events-none"
                    />
                  )}

                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <cat.icon className={`w-4 h-4 ${cat.color} shrink-0`} />
                      <span className="text-[11px] font-bold font-mono tracking-tighter truncate uppercase group-hover:text-white transition-colors">
                        {entity.name}
                      </span>
                    </div>
                    {live ? (
                      <Activity className="w-3 h-3 text-green-400 animate-pulse" />
                    ) : (
                      <Binary className="w-3 h-3 text-white/10" />
                    )}
                  </div>

                  <div className="mt-3 flex justify-between items-end relative z-10">
                    <div className="space-y-1">
                      <div className="flex gap-0.5">
                        {[1,2,3,4].map(b => (
                          <div key={b} className={`w-1 h-3 rounded-full ${b < 4 ? 'bg-indigo-500/40' : 'bg-indigo-900'}`} />
                        ))}
                      </div>
                      <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">
                        Node_Address: {entity.name.slice(0,4)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-black font-mono ${live ? 'text-indigo-400' : 'text-white/20'}`}>
                        {live ? `${live.val}%` : 'STABLE'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </CardContent>

      <div className="p-4 border-t border-white/10 bg-black/40 backdrop-blur-md flex justify-between items-center text-[10px] font-mono">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
            <span className="text-green-400 uppercase">Registry_Live</span>
          </div>
          <div className="flex items-center gap-2 text-white/40">
            <Radio className="w-3 h-3" />
            <span>ENCRYPTION: AES-256-GCM</span>
          </div>
        </div>
        <div className="text-indigo-400 font-black italic">
          WIRED_TO_BASE44_CORE // {filtered.length} NODES VISIBLE
        </div>
      </div>
    </Card>
  );
}
