import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, ExternalLink, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MetaversePortal() {
  const [isEntering, setIsEntering] = useState(false);

  return (
    <Card className="border border-purple-500/30 bg-black text-white overflow-hidden h-[450px] relative shadow-2xl">
      {/* Animated background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-black to-indigo-900/40" />
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-purple-500/30"
            style={{ width: 80 + i * 60, height: 80 + i * 60, top: '50%', left: '50%', marginTop: -(40 + i * 30), marginLeft: -(40 + i * 30) }}
            animate={{ rotate: 360, scale: [1, 1.05, 1] }}
            transition={{ duration: 8 + i * 2, repeat: Infinity, ease: 'linear' }}
          />
        ))}
        <motion.div
          className="absolute w-32 h-32 bg-purple-600/30 rounded-full blur-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>

      <CardContent className="relative z-10 h-full flex flex-col justify-between p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tighter italic flex items-center gap-2">
              <Globe className="w-6 h-6 text-purple-400" />
              Metaverse Node
            </h3>
            <p className="text-purple-300/60 text-xs font-mono">VR_PROTOCOL_ACTIVE_0.9.4</p>
          </div>
          <Badge className="bg-purple-600">VR READY</Badge>
        </div>

        <AnimatePresence>
          {!isEntering ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 2 }}
              className="space-y-4"
            >
              <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10">
                <p className="text-sm leading-relaxed text-gray-300">
                  Step inside the virtual ride experience. Seamlessly transition from your physical commute to a productivity-focused metaverse workspace or social hub.
                </p>
              </div>
              <Button
                onClick={() => setIsEntering(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold h-12 rounded-xl group"
              >
                <Sparkles className="w-4 h-4 mr-2 group-hover:animate-spin" />
                Initialize Neural Link
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center space-y-4"
            >
              <div className="w-20 h-20 bg-purple-600 rounded-full mx-auto flex items-center justify-center animate-pulse shadow-[0_0_50px_rgba(139,92,246,0.5)]">
                <ExternalLink className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold">Synchronizing...</h4>
              <p className="text-xs text-gray-400 font-mono">UPLOADING_CONSCIOUSNESS_STATE</p>
              <Button variant="ghost" onClick={() => setIsEntering(false)} className="text-purple-400 hover:text-purple-300">
                Abort Link
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}