import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Box, Zap, MapPin, Radio, 
  ExternalLink, Loader2, Gauge, ShieldCheck,
  Truck, Plane
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function FTLDeliveryManifold() {
  const [isJumping, setIsJumping] = useState(false);

  const handleFTL = () => {
    setIsJumping(true);
    toast.info("Calibrating FTL Drive. Sub-space entry authorized.");
    setTimeout(() => {
      setIsJumping(false);
      toast.success("FTL Delivery Successful. Payload arrived in Sector 9.");
    }, 2500);
  };

  return (
    <Card className="border border-yellow-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-yellow-500/5 p-4">
        <CardTitle className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em] text-yellow-400">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            FTL & Wormhole Logistics
          </div>
          <Badge className="bg-yellow-600 animate-pulse text-[8px]">RAW_SPEED</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1">
        <div className="relative h-32 bg-black rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden">
          <AnimatePresence>
            {!isJumping ? (
              <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-4">
                <Truck className="w-8 h-8 text-yellow-400 mx-auto mb-2 opacity-40" />
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black italic">FTL_STATE: IDLE</p>
              </motion.div>
            ) : (
              <motion.div 
                key="warp"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: [1, 50, 1], opacity: [1, 1, 0] }}
                transition={{ duration: 2.5 }}
                className="w-full h-0.5 bg-yellow-400 shadow-[0_0_50px_#facc15]"
              />
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center text-[10px] font-mono">
            <span className="text-white/40 uppercase tracking-widest">Velocity Profile</span>
            <span className="text-yellow-400 font-bold">FASTER_THAN_LIGHT</span>
          </div>
          
          <Button 
            onClick={handleFTL}
            disabled={isJumping}
            className="w-full bg-yellow-600 hover:bg-yellow-700 font-black h-12 rounded-xl shadow-[0_0_30px_rgba(250,204,21,0.2)] uppercase tracking-tighter"
          >
            {isJumping ? <Loader2 className="animate-spin" /> : "Initiate FTL Delivery Sequence"}
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <Gauge className="w-3 h-3 text-cyan-400" />
                <span className="text-[8px] font-black uppercase text-white">Pressure</span>
              </div>
              <p className="text-[10px] font-mono text-cyan-400">0.002psi</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-3 h-3 text-green-400" />
                <span className="text-[8px] font-black uppercase text-white">Security</span>
              </div>
              <p className="text-[10px] font-mono text-green-400">LOCKED</p>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-white/5 flex items-center justify-center gap-2">
          <Radio className="w-3 h-3 text-white/20 animate-pulse" />
          <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Sub-Space Network v9.4</span>
        </div>
      </CardContent>
    </Card>
  );
}
