import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  History, GitMerge, RotateCcw, Zap, 
  MapPin, Clock, Globe, FastForward, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function NonLinearTimeNavigation() {
  const [activeEra, setActiveEra] = useState('PRESENT');
  const [isNavigating, setIsNavigating] = useState(false);

  const navigateTime = (era) => {
    setIsNavigating(true);
    toast.info(`Shifting Temporal Manifold to ${era}...`);
    setTimeout(() => {
      setActiveEra(era);
      setIsNavigating(false);
      toast.success(`Causality Restored. Now in ${era} state.`);
    }, 3000);
  };

  return (
    <Card className="border border-pink-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-pink-500/5 p-4">
        <CardTitle className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em] text-pink-400">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4" />
            Non-Linear Time Navigation
          </div>
          <Badge className="bg-pink-600 animate-pulse">{activeEra}</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1">
        <div className="relative h-24 bg-pink-950/10 rounded-2xl border border-pink-500/20 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            {!isNavigating ? (
              <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-1">
                <Clock className="w-8 h-8 text-pink-400 opacity-40" />
                <span className="text-[10px] font-black uppercase text-pink-300">Temporal State: {activeEra}</span>
              </motion.div>
            ) : (
              <motion.div key="warp" animate={{ rotate: 360, scale: [1, 2, 1] }} transition={{ duration: 1, repeat: Infinity }} className="w-12 h-12 border-2 border-t-pink-500 border-r-pink-500 rounded-full" />
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {['PAST', 'PRESENT', 'FUTURE'].map(era => (
            <Button 
              key={era}
              variant="outline" 
              onClick={() => navigateTime(era)}
              disabled={isNavigating || activeEra === era}
              className={`h-12 text-[8px] font-black uppercase rounded-lg border-white/10 ${activeEra === era ? 'bg-pink-600 text-white' : 'bg-white/5'}`}
            >
              {era === 'PAST' && <RotateCcw className="w-3 h-3 mr-1" />}
              {era === 'PRESENT' && <Globe className="w-3 h-3 mr-1" />}
              {era === 'FUTURE' && <FastForward className="w-3 h-3 mr-1" />}
              {era}
            </Button>
          ))}
        </div>

        <div className="bg-pink-500/10 p-4 rounded-2xl border border-pink-500/20 space-y-3">
          <div className="flex items-center gap-2">
            <GitMerge className="w-4 h-4 text-pink-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">Temporal Convergence</span>
          </div>
          <p className="text-[8px] text-white/60 leading-relaxed uppercase">
            Merge multiple booking events into a singular non-linear thread to eliminate wait times.
          </p>
        </div>

        <div className="pt-2 flex justify-between items-center border-t border-white/5 font-mono text-[8px] text-white/20">
          <span className="uppercase">Temporal_Fidelity: 0.9992</span>
          <Zap className="w-3 h-3 text-yellow-400 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}
