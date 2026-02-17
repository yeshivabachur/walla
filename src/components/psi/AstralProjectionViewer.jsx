import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Map as MapIcon, Ghost, Eye, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function AstralProjectionViewer({ userEmail }) {
  const [isProjecting, setIsProjecting] = useState(false);

  const startProjection = () => {
    setIsProjecting(true);
    toast.info("Separating consciousness from physical vehicle. Projecting to Destination...");
    setTimeout(() => {
      toast.success("Astral Body arrived at Target. Remote visualization active.");
    }, 3000);
  };

  return (
    <Card className="border border-indigo-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl overflow-hidden min-h-[350px]">
      <CardHeader className="pb-2 border-b border-white/5 bg-indigo-500/5">
        <CardTitle className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em] text-indigo-400">
          <span className="flex items-center gap-2">
            <Ghost className="w-4 h-4" />
            Astral Projection Mode
          </span>
          {isProjecting && <Badge className="bg-indigo-600 animate-pulse">ETHERIC_LINK</Badge>}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 flex flex-col justify-between h-full">
        <div className="relative h-40 bg-black rounded-2xl border border-white/10 overflow-hidden flex items-center justify-center">
          <AnimatePresence>
            {!isProjecting ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center p-4"
              >
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                  <MapIcon className="w-8 h-8 text-white/20" />
                </div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Physical Plane Locked</p>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ scale: 2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full h-full relative"
              >
                {/* Simulated Astral Map View */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#4f46e5_0%,transparent_70%)] opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotateZ: [0, 360]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-32 h-32 border border-indigo-500/30 rounded-full flex items-center justify-center border-dashed"
                  />
                  <Navigation className="w-10 h-10 text-indigo-400 absolute animate-pulse" />
                </div>
                <div className="absolute bottom-3 left-3 bg-black/60 p-2 rounded-lg border border-white/10">
                  <span className="text-[8px] font-mono text-indigo-300 uppercase">Remote_POV: DEST_SECTOR_9</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-4 mt-6">
          <Button 
            onClick={startProjection}
            disabled={isProjecting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 font-black h-12 rounded-xl group overflow-hidden relative"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Project Consciousness
            </span>
            <motion.div 
              className="absolute inset-0 bg-white/20"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.5 }}
            />
          </Button>
          <p className="text-[9px] text-gray-500 text-center uppercase font-mono italic">
            "Experience the ride from your destination's perspective while your physical form remains in transit."
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
