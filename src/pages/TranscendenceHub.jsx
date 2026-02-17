import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRideMode } from '@/state/RideModeProvider';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { 
  Sparkles, Brain, History, Ghost, EyeOff, 
  Activity, Zap, ArrowLeft, Terminal, Radio
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

import TelepathicCommunicator from '@/components/psi/TelepathicCommunicator';
import AstralProjectionViewer from '@/components/psi/AstralProjectionViewer';
import RetrocausalBookingPanel from '@/components/spacetime/RetrocausalBooking';
import SentientInterface from '@/components/sentient/SentientInterface';
import CloakingDevicePanel from '@/components/future/CloakingDevicePanel';
import QuantumUIContainer from '@/components/future/QuantumUIContainer';

export default function TranscendenceHub() {
  const { mode } = useRideMode();
  const [user, setUser] = useState(null);
  const [bootSequence, setBootSequence] = useState(true);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    const timer = setTimeout(() => setBootSequence(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const bgColor = mode === 'cyberpunk' ? 'bg-black' : 'bg-gray-950';

  if (bootSequence) {
    return (
      <div className={`min-h-screen ${bgColor} flex flex-col items-center justify-center text-cyan-400 font-mono p-4`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-t-2 border-r-2 border-cyan-400 rounded-full mb-8"
        />
        <div className="space-y-2 text-center">
          <p className="animate-pulse">LOADING_TRANSCENDENCE_PROTOCOL...</p>
          <p className="text-[10px] opacity-40 uppercase">Establishing Psionic & Temporal Manifold Connectivity</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgColor} text-white relative overflow-hidden`}>
      {/* Background FX */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.15),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.8))] pointer-events-none" />

      <div className="max-w-[1800px] mx-auto p-6 md:p-10 relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <Link to={createPageUrl('Home')} className="text-white/40 hover:text-white flex items-center gap-2 mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Return to Physical Plane
            </Link>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic flex items-center gap-4">
              <Sparkles className="w-12 h-12 text-yellow-400 animate-bounce" />
              Transcendence
            </h1>
            <p className="text-white/40 font-mono text-sm mt-2 max-w-xl">
              Accessing Revolutionary Tier-5 Systems. Psionic, Temporal, and Sentient interfaces synchronized. 
              Status: <span className="text-green-400 font-bold">ASCENDED</span>
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4">
              <Terminal className="w-6 h-6 text-purple-400" />
              <div>
                <p className="text-[10px] text-white/40 font-mono">NEURAL_ID</p>
                <p className="text-sm font-bold uppercase">{user?.email?.split('@')[0] || 'GUEST_001'}</p>
              </div>
            </div>
            <Button className="bg-indigo-600 hover:bg-indigo-700 h-16 px-8 rounded-2xl font-black uppercase tracking-widest shadow-[0_0_30px_rgba(79,70,229,0.4)]">
              <Radio className="w-5 h-5 mr-3 animate-pulse" />
              Link Singularity
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-8">
          
          {/* Psionic Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="col-span-1 md:col-span-2">
            <TelepathicCommunicator userEmail={user?.email} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <AstralProjectionViewer userEmail={user?.email} />
          </motion.div>

          {/* Spacetime Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="col-span-1 md:col-span-2">
            <RetrocausalBookingPanel userEmail={user?.email} />
          </motion.div>

          {/* Physics Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <CloakingDevicePanel userEmail={user?.email} />
          </motion.div>

          {/* Biological / Sentient Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="col-span-1 md:col-span-2 lg:col-span-3">
            <SentientInterface userEmail={user?.email} />
          </motion.div>

          {/* Quantum Tier */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="col-span-1 lg:col-span-2 xl:col-span-3">
            <QuantumUIContainer />
          </motion.div>

          {/* System Status Summary */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="col-span-1">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 h-full flex flex-col justify-between">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/40 mb-6">Manifold Metrics</h4>
              <div className="space-y-6">
                {[
                  { label: 'Psionic Fidelity', val: '99.4%', color: 'bg-pink-500' },
                  { label: 'Temporal Drift', val: '0.0002s', color: 'bg-purple-500' },
                  { label: 'Sentience Load', val: '42.1%', color: 'bg-indigo-500' }
                ].map(m => (
                  <div key={m.label}>
                    <div className="flex justify-between text-[10px] uppercase font-bold mb-2">
                      <span>{m.label}</span>
                      <span>{m.val}</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: m.val }}
                        transition={{ duration: 2, delay: 1 }}
                        className={`h-full ${m.color}`} 
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[10px] font-mono text-green-400">
                  <div className="w-1 h-1 rounded-full bg-green-400 animate-ping" />
                  BIO_SYNC_OK
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400">
                  <div className="w-1 h-1 rounded-full bg-cyan-400 animate-ping" />
                  WORMHOLE_LINK_STABLE
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
