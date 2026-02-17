import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Dna, Cpu, Brain, Activity, 
  RefreshCw, Layers, ShieldCheck, Zap,
  Search, GitPullRequest, Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SentientOSOverlay() {
  const [activeLogic, setActiveOS] = useState('SELF_HEALING');

  return (
    <Card className="border border-indigo-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-indigo-500/5 p-4">
        <CardTitle className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em] text-indigo-400">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Sentient OS & Living Architecture
          </div>
          <Badge className="bg-indigo-600 animate-pulse">SENTIENCE_CORE_0.9</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1">
        {/* Self-Healing Systems */}
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-green-400 animate-spin-slow" />
              <span className="text-[10px] font-black uppercase">Self-Healing Manifold</span>
            </div>
            <Badge variant="outline" className="text-[8px] border-green-500/30 text-green-400">99.9% INTEGRITY</Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[8px] font-mono text-white/40">
              <span>REPAIRING_NODE_882...</span>
              <span>DONE</span>
            </div>
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
              <motion.div animate={{ width: ['0%', '100%'] }} transition={{ duration: 5, repeat: Infinity }} className="h-full bg-green-500" />
            </div>
          </div>
        </div>

        {/* Living System Architecture */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase text-indigo-300 italic">Organic Design Evolution</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <p className="text-[10px] font-black uppercase">Genetic UI</p>
              <p className="text-[7px] text-white/40 uppercase">Evolving Layouts</p>
            </div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-2">
              <Dna className="w-4 h-4 text-pink-400" />
              <p className="text-[10px] font-black uppercase">Living Core</p>
              <p className="text-[7px] text-white/40 uppercase">Adaptive Logic</p>
            </div>
          </div>
        </div>

        {/* Sentient AI Assistant Insights */}
        <div className="bg-indigo-500/10 p-4 rounded-2xl border border-indigo-500/20 space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">Sentient Recommender</span>
          </div>
          <p className="text-[8px] text-white/80 leading-relaxed uppercase italic">
            "I've pre-cached the Market St exit vector based on your subconscious dilation patterns. Reality alignment optimized."
          </p>
        </div>

        <div className="pt-2 flex justify-between items-center border-t border-white/5 font-mono text-[8px] text-white/20">
          <div className="flex items-center gap-2 uppercase">
            <GitPullRequest className="w-3 h-3" />
            Cognitive_Sync: 1.2ms
          </div>
          <span className="uppercase">Causality: SECURED</span>
        </div>
      </CardContent>
    </Card>
  );
}
