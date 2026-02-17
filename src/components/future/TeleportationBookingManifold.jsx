import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Zap, Map, FastForward, Loader2, 
  Sparkles, ExternalLink, Target, Radio
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function TeleportationBookingManifold() {
  const [isJumping, setIsJumping] = useState(false);

  const handleTeleport = () => {
    setIsJumping(true);
    toast.info("Initializing Quantum Displacement. Calibrating Entanglement...");
    setTimeout(() => {
      setIsJumping(false);
      toast.success("Arrival Confirmed. Spatial Co-ordinates Re-materialized.");
    }, 3000);
  };

  return (
    <Card className="border border-cyan-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl overflow-hidden min-h-[400px] flex flex-col">
      <CardHeader className="pb-2 border-b border-white/5 bg-cyan-500/5 p-4">
        <CardTitle className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em] text-cyan-400">
          <span className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Teleportation Booking (Beta)
          </span>
          <Badge className="bg-cyan-600 animate-pulse text-[8px]">FUTURE_READY</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1 flex flex-col justify-between">
        <div className="relative h-40 bg-black/40 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden">
          <AnimatePresence>
            {!isJumping ? (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-4">
                <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/30">
                  <Target className="w-8 h-8 text-cyan-400 opacity-40" />
                </div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Molecular Buffer: CLEAR</p>
              </motion.div>
            ) : (
              <motion.div 
                key="jump"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [1, 5, 0], opacity: [1, 1, 0] }}
                transition={{ duration: 3 }}
                className="w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_100px_#22d3ee]"
              />
            )}
          </AnimatePresence>
          {isJumping && (
            <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl animate-pulse" />
          )}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center text-[10px] font-mono">
            <span className="text-white/40">Fidelity Probability</span>
            <span className="text-green-400">0.999999994</span>
          </div>
          
          <Button 
            onClick={handleTeleport}
            disabled={isJumping}
            className="w-full bg-cyan-600 hover:bg-cyan-700 font-black h-14 rounded-xl shadow-[0_0_30px_rgba(6,182,212,0.4)] uppercase tracking-widest"
          >
            {isJumping ? <Loader2 className="animate-spin" /> : "Request Instant Displacement"}
          </Button>
          
          <p className="text-[8px] text-center text-white/20 uppercase font-mono italic">
            "Beta testers only. Re-materialization guaranteed in 99% of reality outcomes."
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
