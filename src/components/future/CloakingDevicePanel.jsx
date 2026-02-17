import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, ShieldCheck, Zap, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function CloakingDevicePanel({ userEmail }) {
  const [isCloaked, setIsCloaked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const toggleCloak = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsCloaked(!isCloaked);
      setIsProcessing(false);
      toast.success(isCloaked ? "Cloaking Terminated. Vehicle visible to local sensors." : "Vehicle Cloaked. Ghost-mode initiated.");
    }, 2000);
  };

  return (
    <Card className="border border-gray-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl overflow-hidden relative">
      <AnimatePresence>
        {isCloaked && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white pointer-events-none z-0"
          />
        )}
      </AnimatePresence>

      <CardHeader className="relative z-10 border-b border-white/5">
        <CardTitle className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em] text-gray-400">
          <span className="flex items-center gap-2">
            <EyeOff className="w-4 h-4" />
            Invisible Vehicle & Cloaking
          </span>
          {isCloaked && <Badge className="bg-white text-black font-black animate-pulse">GHOST</Badge>}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 relative z-10">
        <div className="flex justify-center h-32 items-center">
          <motion.div 
            animate={{ 
              opacity: isCloaked ? 0.05 : 1,
              scale: isCloaked ? 0.95 : 1,
              filter: isCloaked ? 'blur(10px)' : 'blur(0px)'
            }}
            className="w-40 h-20 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full flex items-center justify-center relative border border-white/10"
          >
            <Zap className={`w-8 h-8 ${isCloaked ? 'text-white/20' : 'text-yellow-400'}`} />
            {isCloaked && <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.1)_2px,rgba(255,255,255,0.1)_4px)]" />}
          </motion.div>
        </div>

        <Button 
          onClick={toggleCloak}
          disabled={isProcessing}
          className={`w-full h-14 rounded-2xl font-black uppercase tracking-[0.3em] transition-all ${
            isCloaked ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-800 hover:bg-gray-700'
          }`}
        >
          {isProcessing ? <Loader2 className="animate-spin" /> : (
            isCloaked ? "Disengage Cloak" : "Engage Invisibility"
          )}
        </Button>

        <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
          <ShieldCheck className="w-4 h-4 text-green-400" />
          <p className="text-[10px] text-gray-400 font-mono">STEALTH_SIGNATURE: {isCloaked ? '0.0004db' : '94.2db'}</p>
        </div>
      </CardContent>
    </Card>
  );
}
