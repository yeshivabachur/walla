import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Radio, Share2, Zap, ShieldAlert, Cpu, Network } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function V2XMeshTacticalDisplay() {
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    const generateNodes = () => {
      const newNodes = [
        { id: 'V-102', dist: '14m', type: 'VEHICLE', action: 'Braking', color: 'text-red-400' },
        { id: 'I-HUB-04', dist: '142m', type: 'INFRA', action: 'Green Phase', color: 'text-green-400' },
        { id: 'V-882', dist: '42m', type: 'VEHICLE', action: 'Merging', color: 'text-yellow-400' }
      ];
      setNodes(newNodes);
    };
    generateNodes();
    const interval = setInterval(generateNodes, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="border border-red-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-red-500/5 p-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-red-400 animate-pulse" />
            <span className="uppercase tracking-widest text-xs font-mono">V2X Tactical Mesh</span>
          </div>
          <Badge className="bg-red-600 text-[10px]">DIRECT_LINK</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 p-6 space-y-4">
        <div className="relative h-32 bg-red-950/10 rounded-2xl border border-red-500/20 flex items-center justify-center overflow-hidden">
          {/* Radar Circles */}
          {[1,2,3].map(i => (
            <motion.div 
              key={i}
              animate={{ scale: [1, 2], opacity: [0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
              className="absolute w-24 h-24 border border-red-500/30 rounded-full"
            />
          ))}
          <Zap className="w-6 h-6 text-red-400 relative z-10" />
        </div>

        <div className="space-y-2">
          <AnimatePresence>
            {nodes.map((node, idx) => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5"
              >
                <div className="flex items-center gap-2">
                  <Cpu className="w-3 h-3 text-red-400" />
                  <span className="text-[10px] font-mono">{node.id}</span>
                  <span className="text-[8px] text-white/40 uppercase">({node.type})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-black uppercase ${node.color}`}>{node.action}</span>
                  <span className="text-[10px] text-white/60 font-mono">{node.dist}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] font-mono text-red-400/60">
            <Network className="w-3 h-3" />
            <span>MESH_FIDELITY: 0.9992</span>
          </div>
          <ShieldAlert className="w-4 h-4 text-green-400" />
        </div>
      </CardContent>
    </Card>
  );
}
