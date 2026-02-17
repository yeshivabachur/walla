import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Eye, Fingerprint, Lock, ShieldCheck, 
  Trash2, Database, Key, Radio,
  Smartphone, UserCheck, Search, Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function BiometricPrivacyManifold() {
  const [activeLayer, setActiveLayer] = useState('ENCRYPTION');

  return (
    <Card className="border border-indigo-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-indigo-500/5 p-4">
        <CardTitle className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em] text-indigo-400">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-4 h-4 animate-pulse" />
            Biometric & Privacy Sovereignty
          </div>
          <Badge className="bg-indigo-600">ZERO_KNOWLEDGE</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
        {/* Biometric Registry */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black uppercase text-indigo-300 italic">Biometric Authentication Layers</h4>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'Iris Scan', status: 'VERIFIED', icon: Eye },
              { name: 'Voice Print', status: 'LOCKED', icon: Radio },
              { name: 'Face ID v2', status: 'ACTIVE', icon: UserCheck },
              { name: 'Neural Link', status: 'READY', icon: Activity }
            ].map(bio => (
              <div key={bio.name} className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center gap-3">
                <bio.icon className="w-4 h-4 text-indigo-400" />
                <div>
                  <p className="text-[9px] font-black uppercase leading-tight">{bio.name}</p>
                  <p className="text-[7px] text-white/40 uppercase">{bio.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Rights */}
        <div className="bg-indigo-500/10 p-4 rounded-2xl border border-indigo-500/20 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span className="text-[10px] font-black uppercase">Data Sovereignty Control</span>
            </div>
            <Badge variant="outline" className="text-[8px] border-indigo-500/30 text-indigo-400">ENFORCED</Badge>
          </div>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start text-[9px] font-black uppercase hover:bg-white/5 text-white/60">
              <Database className="w-3 h-3 mr-2" /> Request Total Data Access Log
            </Button>
            <Button variant="ghost" className="w-full justify-start text-[9px] font-black uppercase hover:bg-red-500/10 text-red-400">
              <Trash2 className="w-3 h-3 mr-2" /> Execute "Right to be Forgotten"
            </Button>
          </div>
        </div>

        {/* Encryption Status */}
        <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-mono text-white/40 uppercase">Encryption_State</span>
            <span className="text-[9px] font-mono text-green-400 uppercase tracking-widest">Post-Quantum_Locked</span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              animate={{ x: ['-100%', '100%'] }} 
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-1/2 h-full bg-indigo-500" 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
