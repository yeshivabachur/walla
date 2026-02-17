import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navigation, Target, Activity, Zap, ShieldAlert } from 'lucide-react';

export default function HolographicWindshield({ active = true }) {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden perspective-[1000px]">
      {/* Scanlines Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] z-50 pointer-events-none opacity-20" />

      {/* Main HUD Container */}
      <motion.div 
        initial={{ opacity: 0, rotateX: 20 }}
        animate={{ 
          opacity: 1, 
          rotateX: 5,
          x: glitch ? [0, -5, 5, 0] : 0
        }}
        className="w-full h-full p-8 flex flex-col justify-between"
      >
        {/* Top HUD Bar */}
        <div className="flex justify-between items-start">
          <div className="bg-cyan-500/10 backdrop-blur-sm border border-cyan-500/30 p-4 rounded-br-3xl flex items-center gap-6 text-cyan-400">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-mono opacity-60">System Stability</span>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className={`w-1 h-4 ${i < 5 ? 'bg-cyan-400' : 'bg-cyan-900'} rounded-full`} />
                ))}
              </div>
            </div>
            <div className="h-10 w-px bg-cyan-500/20" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-mono opacity-60">Quantum Latency</span>
              <span className="text-xl font-black">0.004ms</span>
            </div>
          </div>

          <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/30 p-4 rounded-bl-3xl flex items-center gap-4 text-red-400">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
            <div>
              <span className="text-[10px] uppercase font-mono opacity-60">Threat Detection</span>
              <p className="text-xs font-bold uppercase tracking-tighter">Sky-Lane Clear</p>
            </div>
          </div>
        </div>

        {/* Center Reticle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-64 h-64 border border-dashed border-cyan-500 rounded-full flex items-center justify-center"
          >
            <div className="w-48 h-48 border border-cyan-500/30 rounded-full" />
          </motion.div>
          <Target className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-cyan-500" />
        </div>

        {/* Bottom HUD Bar */}
        <div className="flex justify-between items-end">
          <div className="space-y-4">
            <div className="bg-indigo-500/10 backdrop-blur-sm border border-indigo-500/30 p-4 rounded-tr-3xl text-indigo-400 w-64">
              <div className="flex items-center gap-3 mb-2">
                <Navigation className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest">Active Route</span>
              </div>
              <p className="text-sm font-mono truncate">CALIFORNIA_ST_TO_MARKET_HUB</p>
              <div className="w-full bg-indigo-900/50 h-1 mt-3 rounded-full overflow-hidden">
                <motion.div 
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="bg-indigo-400 h-full w-1/3"
                />
              </div>
            </div>
          </div>

          <div className="bg-cyan-500/10 backdrop-blur-sm border border-cyan-500/30 p-6 rounded-tl-3xl text-right text-cyan-400">
            <div className="flex items-center gap-3 justify-end mb-1">
              <span className="text-4xl font-black italic">142</span>
              <span className="text-xs font-mono uppercase">KM/H</span>
            </div>
            <div className="flex items-center gap-2 justify-end opacity-60">
              <Activity className="w-3 h-3" />
              <span className="text-[10px] font-mono uppercase">Telemetry Stream Active</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
