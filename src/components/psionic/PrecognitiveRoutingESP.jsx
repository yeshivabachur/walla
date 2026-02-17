import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, Brain, Waves, Sparkles, 
  Search, ShieldCheck, Zap, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PrecognitiveRoutingESP() {
  const [precogAlert, setPrecogAlert] = useState(null);

  // Simulate Precognitive Echoes (ESP-based ETA)
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setPrecogAlert({
          id: Date.now(),
          type: 'TRAFFIC_ECHO',
          msg: 'Sensing massive slowdown 4.2 minutes in the future. Suggesting precognitive detour.',
          confidence: 94
        });
        setTimeout(() => setPrecogAlert(null), 8000);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="border border-purple-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-purple-500/5 p-4">
        <CardTitle className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em] text-purple-400">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            ESP-Based ETA & Precognitive Logic
          </div>
          <Badge className="bg-purple-600 animate-pulse">SIXTH_SENSE_SYNC</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1">
        <div className="relative h-32 bg-purple-950/10 rounded-2xl border border-purple-500/20 flex items-center justify-center overflow-hidden">
          {/* Neural Waves */}
          {[1,2,3,4].map(i => (
            <motion.div 
              key={i}
              animate={{ 
                scale: [1, 2], 
                opacity: [0.3, 0],
                rotateZ: [0, 90 * i]
              }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 1 }}
              className="absolute w-24 h-24 border border-purple-500/20 rounded-full"
            />
          ))}
          <Activity className="w-8 h-8 text-purple-400 relative z-10 animate-pulse" />
        </div>

        <AnimatePresence>
          {precogAlert && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white/5 p-4 rounded-2xl border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.2)] space-y-3"
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-purple-300 italic">Precognitive Echo Detected</span>
                <Badge variant="outline" className="text-[8px] border-purple-500/30 text-purple-400">{precogAlert.confidence}% CONFIDENCE</Badge>
              </div>
              <p className="text-[10px] text-white/80 leading-relaxed uppercase font-bold">
                "{precogAlert.msg}"
              </p>
              <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-white text-[8px] h-8 rounded-lg font-black uppercase">
                Authorize Precognitive Detour
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-center text-[10px] font-mono uppercase text-white/20">
            <span>Neural Bandwidth</span>
            <span>1.2 THz</span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              animate={{ width: ['40%', '85%', '55%'] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="h-full bg-purple-500" 
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-[8px] text-white/40 uppercase font-mono justify-center">
          <ShieldCheck className="w-3 h-3 text-green-400" />
          Quantum Causality Protection Active
        </div>
      </CardContent>
    </Card>
  );
}
