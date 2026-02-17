import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Cpu, MapPin, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import QuantumVisualization from './QuantumVisualization';

export default function QuantumRouteOptimizer({ pickup, dropoff }) {
  const [quantumAnalysis, setQuantumAnalysis] = useState(null);
  const [isComputing, setIsComputing] = useState(false);
  const [activePathIndex, setActivePathIndex] = useState(0);

  // Simulate quantum pathfinding (simulated annealing visualization)
  useEffect(() => {
    if (isComputing) {
      const interval = setInterval(() => {
        // Randomly switch "active" superposition path to visualize search
        setActivePathIndex(Math.floor(Math.random() * 20));
      }, 150);
      return () => clearInterval(interval);
    }
  }, [isComputing]);

  useEffect(() => {
    if (!pickup || !dropoff) return;

    const runQuantumOptimization = async () => {
      setIsComputing(true);
      
      // Simulate heavy computation delay for dramatic effect + actual API call
      const minDelay = new Promise(resolve => setTimeout(resolve, 3000));
      
      const apiCall = base44.integrations.Core.InvokeLLM({
        prompt: `You are a quantum computing AI routing system.
        
Analyze route from "${pickup}" to "${dropoff}" using quantum-inspired algorithms:
- Consider all possible routes simultaneously (quantum superposition)
- Calculate optimal path using quantum annealing principles
- Predict traffic flow using quantum ML
- Factor in real-time variables with quantum probability

Provide concise JSON output.`,
        response_json_schema: {
          type: 'object',
          properties: {
            quantum_confidence: { type: 'number', description: "Confidence percentage (80-99)" },
            time_saved_minutes: { type: 'number', description: "Minutes saved vs standard GPS" },
            route_efficiency: { type: 'string', description: "Efficiency rating (e.g., '98.5% Optimal')" },
            quantum_advantage: { type: 'string', description: "Short explanation of why this route is better" }
          }
        }
      });

      const [_, result] = await Promise.all([minDelay, apiCall]);

      setQuantumAnalysis(result);
      setIsComputing(false);
    };

    runQuantumOptimization();
  }, [pickup, dropoff]);

  if (!pickup && !dropoff) return null;

  return (
    <Card className="border border-blue-500/30 bg-black/40 backdrop-blur-md overflow-hidden shadow-xl">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-white">
          <span className="flex items-center gap-2">
            <Cpu className={`w-5 h-5 text-cyan-400 ${isComputing ? 'animate-pulse' : ''}`} />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Quantum Route Optimizer
            </span>
          </span>
          {isComputing ? (
            <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 animate-pulse">
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              Processing Qubits
            </Badge>
          ) : (
            <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/50 hover:bg-cyan-500/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Optimized
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* 3D Visualization */}
        <div className="relative">
          <QuantumVisualization activePathIndex={isComputing ? activePathIndex : 4} />
          
          <AnimatePresence>
            {!isComputing && quantumAnalysis && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-sm p-3 rounded-lg border border-white/10"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Quantum Advantage</span>
                  <span className="text-xs font-bold text-green-400">+{quantumAnalysis.time_saved_minutes} min saved</span>
                </div>
                <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${quantumAnalysis.quantum_confidence}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
                  />
                </div>
                <div className="flex justify-between mt-1 text-[10px] text-gray-500">
                  <span>Confidence: {quantumAnalysis.quantum_confidence}%</span>
                  <span>Efficiency: {quantumAnalysis.route_efficiency}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Text Analysis */}
        {!isComputing && quantumAnalysis && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-sm text-gray-300 bg-white/5 p-3 rounded-lg border border-white/5"
          >
            <p className="leading-relaxed">
              <span className="text-cyan-400 font-semibold">Insight: </span>
              {quantumAnalysis.quantum_advantage}
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}