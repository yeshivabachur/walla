import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wind, Zap, Lock, Unlock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AntiGravityDrive() {
  const [isHovering, setIsHovering] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleHover = () => {
    setLoading(true);
    setTimeout(() => {
      setIsHovering(!isHovering);
      setLoading(false);
    }, 1500);
  };

  return (
    <Card className="border border-cyan-500/30 bg-black/80 backdrop-blur-xl text-white overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.2)]">
      <CardHeader className="pb-2 border-b border-white/5">
        <CardTitle className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em] text-cyan-400">
          <span className="flex items-center gap-2">
            <Wind className="w-4 h-4" />
            Anti-Gravity Manifold
          </span>
          <Badge className={isHovering ? "bg-cyan-500 text-black" : "bg-gray-800 text-white"}>
            {isHovering ? "LEVTIATION_ACTIVE" : "G_LOCK"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 flex flex-col items-center">
        <div className="relative w-full h-32 flex items-center justify-center">
          <motion.div
            animate={{ 
              y: isHovering ? -20 : 0,
              rotateZ: isHovering ? [0, 2, -2, 0] : 0
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatType: "reverse" 
            }}
            className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl shadow-[0_0_40px_rgba(6,182,212,0.4)] flex items-center justify-center border border-white/20"
          >
            <Zap className={`w-10 h-10 ${isHovering ? 'text-white' : 'text-cyan-900'} transition-colors`} />
          </motion.div>
          
          {isHovering && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 opacity-40">
              {[1,2,3].map(i => (
                <motion.div 
                  key={i}
                  animate={{ y: [0, 40], opacity: [1, 0] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
                  className="w-8 h-1 bg-cyan-400 blur-sm rounded-full"
                />
              ))}
            </div>
          )}
        </div>

        <div className="w-full mt-6 space-y-4">
          <div className="flex justify-between text-[10px] font-mono opacity-60 uppercase">
            <span>Mass Displacement</span>
            <span>{isHovering ? "100.00%" : "0.00%"}</span>
          </div>
          <Button 
            onClick={toggleHover}
            disabled={loading}
            className={`w-full h-12 rounded-xl font-black uppercase tracking-widest transition-all ${
              isHovering ? 'bg-red-500 hover:bg-red-600' : 'bg-cyan-600 hover:bg-cyan-700'
            }`}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isHovering ? (
              <><Lock className="w-4 h-4 mr-2" /> Engage G-Lock</>
            ) : (
              <><Unlock className="w-4 h-4 mr-2" /> Disengage Gravity</>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
