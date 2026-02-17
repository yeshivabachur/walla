import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Activity, Filter, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuantumUIContainer() {
  const [isSuperposition, setIsSuperposition] = useState(true);
  const [collapsedState, setCollapsedState] = useState(null);

  const collapseWaveFunction = () => {
    setIsSuperposition(false);
    setCollapsedState(Math.random() > 0.5 ? 'ROUTE_OPTIMIZED' : 'FARE_REDUCED');
    setTimeout(() => {
      setIsSuperposition(true);
      setCollapsedState(null);
    }, 5000);
  };

  return (
    <Card className="border border-cyan-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl overflow-hidden min-h-[300px] flex flex-col">
      <CardHeader className="pb-2 border-b border-white/5">
        <CardTitle className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em] text-cyan-400">
          <span className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Quantum UI & Superposition
          </span>
          <Badge className="bg-cyan-600 animate-pulse">{isSuperposition ? "SUPERPOSITION" : "COLLAPSED"}</Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 p-6 flex flex-col justify-between">
        <div className="relative h-24 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isSuperposition ? (
              <motion.div
                key="super"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 gap-8"
              >
                <div className="flex flex-col items-center opacity-40 blur-[2px]">
                  <Zap className="w-8 h-8 text-cyan-400 mb-2" />
                  <span className="text-[10px] font-mono">State A</span>
                </div>
                <div className="flex flex-col items-center opacity-40 blur-[2px]">
                  <Filter className="w-8 h-8 text-purple-400 mb-2" />
                  <span className="text-[10px] font-mono">State B</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-2 shadow-[0_0_30px_rgba(250,204,21,0.5)]" />
                <h4 className="text-xl font-black font-mono text-white">{collapsedState}</h4>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] leading-relaxed text-gray-400 font-mono text-center italic">
            "The interface exists in all possible configurations until observed. Interacting with this button collapses the wave function into an optimal user state."
          </p>
          <Button 
            onClick={collapseWaveFunction}
            disabled={!isSuperposition}
            className="w-full bg-cyan-600 hover:bg-cyan-700 font-black h-12 rounded-xl border border-white/10"
          >
            Collapse Wave Function
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
