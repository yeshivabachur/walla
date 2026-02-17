import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Eye, Fingerprint, ShieldCheck, Lock, 
  Binary, Cpu, Key, ScanLine, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function NeuralAuthenticationManifold() {
  const [authStage, setAuthStage] = useState('IDLE'); // IDLE, SCANNING, VERIFIED

  const startIrisScan = () => {
    setAuthStage('SCANNING');
    setTimeout(() => {
      setAuthStage('VERIFIED');
      toast.success("Iris Signature Verified. Biometric + PIN combination locked.");
    }, 3000);
  };

  return (
    <Card className="border border-cyan-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-cyan-500/5 p-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="uppercase tracking-widest text-xs font-mono">Neural Auth & Security</span>
          </div>
          <Badge className={authStage === 'VERIFIED' ? "bg-green-600" : "bg-cyan-600"}>
            {authStage}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1">
        <div className="relative h-40 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            {authStage === 'IDLE' && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-2">
                <Eye className="w-12 h-12 text-white/20" />
                <p className="text-[10px] font-bold text-white/40 uppercase">Ready for Optical Sync</p>
              </motion.div>
            )}
            {authStage === 'SCANNING' && (
              <motion.div key="scan" className="w-full h-full relative">
                <div className="absolute inset-0 bg-cyan-500/10 animate-pulse" />
                <motion.div 
                  initial={{ top: 0 }}
                  animate={{ top: '100%' }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_15px_#22d3ee] z-10"
                />
                <div className="flex flex-col items-center justify-center h-full gap-2">
                  <ScanLine className="w-12 h-12 text-cyan-400" />
                  <p className="text-[10px] font-mono text-cyan-400 animate-pulse">EXTRACTING_IRIS_HASH...</p>
                </div>
              </motion.div>
            )}
            {authStage === 'VERIFIED' && (
              <motion.div key="verified" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                  <ShieldCheck className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-[10px] font-black text-green-400 uppercase tracking-widest mt-2">Identity Confirmed</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
            <p className="text-[8px] text-white/40 uppercase font-mono">Biometric_Fidelity</p>
            <p className="text-sm font-black">0.99992</p>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
            <p className="text-[8px] text-white/40 uppercase font-mono">Encryption_State</p>
            <p className="text-sm font-black text-cyan-400 italic">GCM_AES</p>
          </div>
        </div>

        <Button 
          onClick={startIrisScan}
          disabled={authStage === 'SCANNING'}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-black uppercase text-[10px] h-12 rounded-xl"
        >
          {authStage === 'VERIFIED' ? "Re-Authenticate" : "Initiate Biometric Sync"}
        </Button>

        <div className="flex justify-between items-center text-[8px] font-mono text-white/20 uppercase mt-2">
          <div className="flex items-center gap-2">
            <Binary className="w-3 h-3" />
            <span>Zero-Knowledge Handshake</span>
          </div>
          <Activity className="w-3 h-3 text-cyan-400" />
        </div>
      </CardContent>
    </Card>
  );
}
