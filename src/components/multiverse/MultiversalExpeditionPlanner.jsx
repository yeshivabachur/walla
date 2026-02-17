import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Globe, Share2, CornerUpRight, Zap, 
  MapPin, Radio, Activity, Link2, GitPullRequest
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const UNIVERSES = [
  { id: 'uni-a', name: 'Prime Timeline', status: 'SYNCHRONIZED', fidelity: 1.0 },
  { id: 'uni-b', name: 'Alpha-Omega Reality', status: 'DIVERGENT', fidelity: 0.84 },
  { id: 'uni-c', name: 'Cybernetic Earth', status: 'COLLAPSING', fidelity: 0.12 }
];

export default function MultiversalExpeditionPlanner() {
  const [selectedUniverse, setSelectedUniverse] = useState(UNIVERSES[0]);
  const [isSyncing, setIsSyncing] = useState(false);

  const switchReality = (uni) => {
    setIsSyncing(true);
    toast.info(`Attempting shift to ${uni.name}. Calibrating phase variance...`);
    setTimeout(() => {
      setSelectedUniverse(uni);
      setIsSyncing(false);
      toast.success(`Reality Shift Successful. Now operating in ${uni.name}.`);
    }, 2500);
  };

  return (
    <Card className="border border-indigo-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-indigo-500/5 p-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-400 animate-spin-slow" />
            <span className="uppercase tracking-[0.2em] font-black italic text-xs">Cross-Reality Expedition</span>
          </div>
          <Badge className="bg-indigo-600 text-[8px] tracking-widest uppercase">Reality_Index: {selectedUniverse.fidelity.toFixed(2)}</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1">
        <div className="space-y-3">
          <h4 className="text-[10px] font-black uppercase text-indigo-300 tracking-widest">Reality Manifold Selector</h4>
          <div className="grid grid-cols-1 gap-2">
            {UNIVERSES.map(u => (
              <div 
                key={u.id}
                onClick={() => switchReality(u)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${selectedUniverse.id === u.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5 bg-white/5'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${u.status === 'SYNCHRONIZED' ? 'bg-green-500' : u.status === 'DIVERGENT' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                  <div>
                    <p className="text-[10px] font-black uppercase">{u.name}</p>
                    <p className="text-[8px] text-white/40 font-mono">{u.status}</p>
                  </div>
                </div>
                <CornerUpRight className={`w-4 h-4 ${selectedUniverse.id === u.id ? 'text-indigo-400' : 'text-white/10 group-hover:text-indigo-400'} transition-colors`} />
              </div>
            ))}
          </div>
        </div>

        {/* Wormhole Shortcutting */}
        <div className="bg-indigo-500/10 p-4 rounded-2xl border border-indigo-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-[10px] font-black uppercase tracking-widest">Wormhole Optimization</span>
            </div>
            <Badge variant="outline" className="text-[8px] border-yellow-500/30 text-yellow-400">-14m ETA</Badge>
          </div>
          <p className="text-[8px] text-white/60 leading-relaxed uppercase">
            Localized sub-space fold detected between California St and Market Hub. Parallel ride sharing authorized.
          </p>
          <div className="relative h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              animate={{ left: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute w-1/3 h-full bg-gradient-to-r from-transparent via-indigo-400 to-transparent" 
            />
          </div>
        </div>

        <div className="pt-2 flex justify-between items-center border-t border-white/5">
          <div className="flex items-center gap-2">
            <GitPullRequest className="w-3 h-3 text-white/40" />
            <span className="text-[8px] font-mono text-white/40 uppercase">Bridge_Sync: STABLE</span>
          </div>
          <div className="flex items-center gap-1 text-indigo-400">
            <Link2 className="w-3 h-3" />
            <span className="text-[8px] font-bold uppercase">Multiverse Connected</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
