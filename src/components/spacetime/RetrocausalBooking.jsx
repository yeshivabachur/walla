import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { History, GitPullRequest, FastForward, Loader2, Share2, CornerRightUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function RetrocausalBookingPanel({ userEmail }) {
  const [isComputing, setIsComputing] = useState(false);
  const [anomalies, setAnomalies] = useState([]);

  const findWormholeShortcuts = () => {
    setIsComputing(true);
    setTimeout(() => {
      setAnomalies([
        { id: 1, type: 'Wormhole', label: 'Sector 4 Sub-Space Fold', saved: '14 mins' },
        { id: 2, type: 'Parallel', label: 'Universe-B Expressway', saved: '8 mins' },
        { id: 3, type: 'Retro', label: 'Booking Finalized in Past', saved: 'Instant' },
      ]);
      setIsComputing(false);
      toast.success("Spacetime Manifold Scanned. 3 Shortcuts Detected.");
    }, 2500);
  };

  return (
    <Card className="border border-purple-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl overflow-hidden">
      <CardHeader className="pb-2 border-b border-white/5">
        <CardTitle className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em] text-purple-400">
          <span className="flex items-center gap-2">
            <History className="w-4 h-4" />
            Retrocausal & Spacetime Ops
          </span>
          <Badge variant="outline" className="border-purple-500 text-purple-400 text-[10px] animate-pulse">
            CAUSALITY_LOCKED
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="relative w-full h-24 bg-purple-950/20 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center">
             <motion.div 
               animate={{ rotate: 360, scale: [1, 1.2, 1] }}
               transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
               className="w-40 h-40 border border-purple-500/20 rounded-full flex items-center justify-center"
             >
               <div className="w-20 h-20 border border-purple-500/40 rounded-full" />
             </motion.div>
             <GitPullRequest className={`absolute w-8 h-8 text-purple-400 ${isComputing ? 'animate-spin' : ''}`} />
          </div>
          
          <Button 
            onClick={findWormholeShortcuts}
            disabled={isComputing}
            className="w-full bg-purple-600 hover:bg-purple-700 font-bold uppercase tracking-widest h-12"
          >
            {isComputing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Initialize Spacetime Scan"
            )}
          </Button>
        </div>

        <AnimatePresence>
          <div className="space-y-2">
            {anomalies.map((a, idx) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-purple-500/20 rounded-md">
                    {a.type === 'Wormhole' ? <CornerRightUp className="w-3 h-3 text-purple-400" /> : <Share2 className="w-3 h-3 text-cyan-400" />}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-white">{a.label}</p>
                    <p className="text-[8px] text-gray-500 font-mono">TYPE: {a.type.toUpperCase()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-green-400">-{a.saved}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        <div className="bg-purple-500/5 p-3 rounded-lg border border-purple-500/10">
          <p className="text-[9px] leading-relaxed text-purple-300/60 italic font-mono">
            "Retrocausal optimization allows the system to book your ride 5 minutes BEFORE you request it, ensuring 0.0ms wait time through temporal overlap."
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
