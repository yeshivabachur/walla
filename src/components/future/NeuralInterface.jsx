import React, { useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BrainCircuit, Activity } from 'lucide-react';
import { useRideMode } from '@/state/RideModeProvider';

export default function NeuralInterface({ userState = 'active' }) {
  const canvasRef = useRef(null);
  const { mode } = useRideMode();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    const render = () => {
      time += 0.05;
      const width = canvas.width;
      const height = canvas.height;
      
      // Clear with trailing effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, width, height);

      // Color based on mode
      const colors = mode === 'cyberpunk' 
        ? ['#ff00ff', '#00ffff', '#ffff00'] 
        : ['#4f46e5', '#8b5cf6', '#ec4899'];

      // Draw brainwaves
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = colors[i % colors.length];
        
        for (let x = 0; x < width; x += 5) {
          const y = height / 2 + 
            Math.sin(x * 0.02 + time + i) * 30 * Math.sin(time * 0.5) +
            Math.cos(x * 0.05 - time) * 10;
          
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [mode]);

  return (
    <Card className="overflow-hidden border-indigo-500/50 bg-black/80 backdrop-blur-xl shadow-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-white text-sm uppercase tracking-widest">
          <span className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-indigo-400" />
            Neural Link
          </span>
          <span className="flex items-center gap-1 text-xs text-green-400">
            <Activity className="w-3 h-3 animate-pulse" />
            Connected
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 relative h-32">
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={128} 
          className="w-full h-full block"
        />
        <div className="absolute bottom-2 left-3 text-[10px] text-white/50 font-mono">
          BETA_WAVE_AMPLITUDE: {(Math.random() * 100).toFixed(2)}Hz
        </div>
      </CardContent>
    </Card>
  );
}
