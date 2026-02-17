import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRideMode } from '@/state/RideModeProvider';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Zap, Cpu, Activity, Shield, Navigation, 
  Settings, Loader2, AlertTriangle, Radio, Globe, Plane, Glasses, Link2, Clock
} from 'lucide-react';
import QuantumRouteOptimizer from '@/components/ai/QuantumRouteOptimizer';
import NeuralInterface from '@/components/future/NeuralInterface';
import AutonomousVehicleSelector from '@/components/autonomous/AutonomousVehicleSelector';
import RiskAssessmentDisplay from '@/components/ai/RiskAssessmentDisplay';
import LiveTrafficUpdates from '@/components/traffic/LiveTrafficUpdates';
import VehicleTelemetryDashboard from '@/components/telemetry/VehicleTelemetryDashboard';
import PredictiveMaintenanceAlert from '@/components/maintenance/PredictiveMaintenanceAlert';
import DroneDeliverySystem from '@/components/delivery/DroneDeliverySystem';
import MetaversePortal from '@/components/social/MetaversePortal';
import HolographicWindshield from '@/components/ui/HolographicWindshield';
import QuantumEntanglementTracker from '@/components/ai/QuantumEntanglementTracker';
import AntiGravityDrive from '@/components/future/AntiGravityDrive';
import NeuralRegistryExplorer from '@/components/analytics/NeuralRegistryExplorer';
import QuantumTimeOptimizer from '@/components/ai/QuantumTimeOptimizer';
import GalacticHubMap from '@/components/maps/GalacticHubMap';
import { useQuery } from '@tanstack/react-query';

export default function MissionControl() {
  const { mode } = useRideMode();
  const [user, setUser] = useState(null);
  const [hologramActive, setHologramActive] = useState(false);
  const [simulatedLocation, setSimulatedLocation] = useState({ lat: 37.7749, lng: -122.4194 });

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  // Simulate movement for live data feel
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedLocation(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  const statusColor = mode === 'cyberpunk' ? 'text-neon-pink' : 'text-green-500';
  const bgColor = mode === 'cyberpunk' ? 'bg-black' : 'bg-gray-900';

  return (
    <div className={`min-h-screen ${bgColor} text-white p-6 relative overflow-hidden transition-colors duration-1000`}>
      {/* Holographic Overlay */}
      <HolographicWindshield active={hologramActive} />

      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="max-w-[1800px] mx-auto relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-white/10 pb-6 gap-4">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-[0.3em] flex items-center gap-3 italic">
              <Cpu className="w-10 h-10 text-cyan-400 animate-pulse" />
              Omni-Intelligence
            </h1>
            <p className="text-white/50 font-mono text-sm mt-1">
              PROTOCOL: <span className={statusColor}>ACTIVE</span> | NEURAL_LINK: <span className="text-cyan-400">SYNCED</span> | USER: {user?.email || 'GUEST_MODE'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              onClick={() => setHologramActive(!hologramActive)}
              className={`border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 ${hologramActive ? 'bg-cyan-500/20' : ''}`}
            >
              <Glasses className="w-4 h-4 mr-2" />
              {hologramActive ? 'HUD: ON' : 'HUD: OFF'}
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Settings className="w-4 h-4 mr-2" />
              SysConfig
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white font-bold shadow-[0_0_20px_rgba(220,38,38,0.4)]">
              <Shield className="w-4 h-4 mr-2" />
              EMERGENCY_OVERRIDE
            </Button>
          </div>
        </header>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6"
        >
          {/* Galactic Hub Map */}
          <motion.div variants={itemVariants} className="col-span-1 lg:col-span-3 2xl:col-span-4">
            <GalacticHubMap />
          </motion.div>

          {/* Temporal Optimizer */}
          <motion.div variants={itemVariants} className="col-span-1 lg:col-span-1 2xl:col-span-2">
            <QuantumTimeOptimizer />
          </motion.div>

          {/* Neural Registry - Full Width */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 2xl:col-span-6 h-[600px]">
            <NeuralRegistryExplorer />
          </motion.div>

          {/* Neural Interface */}
          <motion.div variants={itemVariants} className="col-span-1 lg:col-span-2">
            <NeuralInterface />
          </motion.div>

          {/* Anti-Gravity Drive */}
          <motion.div variants={itemVariants} className="col-span-1">
            <AntiGravityDrive />
          </motion.div>

          {/* Quantum Entanglement */}
          <motion.div variants={itemVariants} className="col-span-1">
            <QuantumEntanglementTracker />
          </motion.div>

          {/* Drone Hive Command */}
          <motion.div variants={itemVariants} className="col-span-1 lg:col-span-2">
            <DroneDeliverySystem userEmail={user?.email} />
          </motion.div>

          {/* Metaverse Node */}
          <motion.div variants={itemVariants} className="col-span-1 lg:col-span-2">
            <MetaversePortal />
          </motion.div>

          {/* Fleet Command */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-2">
            <Card className="bg-white/5 border-white/10 h-full backdrop-blur-sm border-2 border-indigo-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white uppercase tracking-widest text-sm">
                  <Navigation className="w-5 h-5 text-purple-400" />
                  Fleet Operations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AutonomousVehicleSelector />
              </CardContent>
            </Card>
          </motion.div>

          {/* Quantum Routing */}
          <motion.div variants={itemVariants} className="col-span-1 lg:col-span-3 2xl:col-span-4">
             <QuantumRouteOptimizer 
               pickup="Sector 7G Manifest" 
               dropoff="Galactic Core Hub" 
             />
          </motion.div>

          {/* Telemetry Diagnostics */}
          <motion.div variants={itemVariants} className="col-span-1">
            <Card className="bg-black/40 border-white/10 h-full border-t-4 border-t-yellow-500 shadow-2xl">
               <CardHeader>
                 <CardTitle className="text-white text-xs font-mono uppercase opacity-60">Engine Diagnostics</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="space-y-4">
                   <div className="flex justify-between items-center">
                     <span className="text-white/60 text-[10px] font-mono">CORE_STABILITY</span>
                     <Badge className="bg-green-500/20 text-green-400 border-green-500/50">98.4%</Badge>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-white/60 text-[10px] font-mono">ION_DRIVE_SYNC</span>
                     <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">LOCKED</Badge>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-white/60 text-[10px] font-mono">DARK_MATTER_RES</span>
                     <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">340.2kW</Badge>
                   </div>
                   <div className="pt-4 mt-4 border-t border-white/5">
                     <p className="text-[10px] text-white/40 mb-2 font-mono">BIOMETRIC_FEED:</p>
                     <div className="flex items-end gap-1 h-8">
                       {[40,70,45,90,65,30,85,50,75,40].map((h, i) => (
                         <motion.div 
                           key={i}
                           animate={{ height: [`${h}%`, `${Math.random()*100}%`, `${h}%`] }}
                           transition={{ duration: 1, repeat: Infinity }}
                           className="flex-1 bg-cyan-500/40 rounded-t-sm"
                         />
                       ))}
                     </div>
                   </div>
                 </div>
               </CardContent>
            </Card>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
