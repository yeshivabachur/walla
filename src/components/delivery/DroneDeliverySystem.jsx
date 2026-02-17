import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plane, Radio, Loader2, Target, Zap, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function DroneDeliverySystem({ userEmail }) {
  const [drones, setDrones] = useState([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [selectedDrone, setSelectedDrone] = useState(null);

  // Fetch or simulate live drone data via SDK
  useEffect(() => {
    const syncDrones = async () => {
      try {
        const liveDrones = await base44.entities.DroneDelivery.filter({ status: 'active' });
        if (liveDrones.length > 0) {
          setDrones(liveDrones);
        } else {
          // Auto-populate if none exist for demo/live feel
          const demoDrones = [
            { id: 'DR-90', model: 'AeroLift X1', altitude: '150m', speed: '45km/h', battery: 88 },
            { id: 'DR-42', model: 'SkySwift 4', altitude: '120m', speed: '60km/h', battery: 42 }
          ];
          setDrones(demoDrones);
        }
      } catch (e) {
        console.error("Drone Sync Error", e);
      }
    };
    syncDrones();
    const interval = setInterval(syncDrones, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleDeploy = async () => {
    setIsDeploying(true);
    try {
      const newDrone = await base44.entities.DroneDelivery.create({
        user_email: userEmail,
        model: 'Centurion Heavy-Lift',
        status: 'deploying',
        current_location: { lat: 37.7749, lng: -122.4194 },
        payload_capacity: '5kg'
      });
      toast.success("Drone Deployment Authorized. Launching from Hive-Alpha.");
      setDrones(prev => [...prev, newDrone]);
    } catch (e) {
      toast.error("Launch sequence aborted: Insufficient skyway clearance.");
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <Card className="border border-orange-500/30 bg-black/60 backdrop-blur-xl text-white overflow-hidden shadow-2xl">
      <CardHeader className="border-b border-white/10 bg-orange-500/5">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Plane className="w-6 h-6 text-orange-400 animate-bounce" />
            <span className="tracking-tighter uppercase font-black italic">Hive Command</span>
          </span>
          <Badge className="bg-orange-500 text-black font-bold">LIVE_FEED</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <AnimatePresence>
            {drones.map(drone => (
              <motion.div
                key={drone.id}
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`p-3 rounded-lg border ${selectedDrone?.id === drone.id ? 'border-orange-400 bg-orange-400/10' : 'border-white/10 bg-white/5'} cursor-pointer`}
                onClick={() => setSelectedDrone(drone)}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-mono text-orange-400">{drone.id}</span>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-green-500 animate-ping" />
                    <Radio className="w-3 h-3 text-white/40" />
                  </div>
                </div>
                <p className="text-xs font-bold truncate">{drone.model}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 bg-white/10 h-1 rounded-full overflow-hidden">
                    <div className="bg-orange-400 h-full" style={{ width: `${drone.battery}%` }} />
                  </div>
                  <span className="text-[8px] text-white/60">{drone.battery}%</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {selectedDrone && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="bg-white/5 p-3 rounded-lg border border-white/10"
          >
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-orange-300">Tactical Overlay</h4>
              <ShieldCheck className="w-4 h-4 text-green-400" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-white/40">ALTITUDE</span>
                <span>{selectedDrone.altitude || '142m'}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-white/40">AIRSPEED</span>
                <span>{selectedDrone.speed || '52km/h'}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-white/40">PAYLOAD</span>
                <span>SECURED</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-white/40">ETA</span>
                <span className="text-orange-400">4:12</span>
              </div>
            </div>
          </motion.div>
        )}

        <Button 
          onClick={handleDeploy}
          disabled={isDeploying}
          className="w-full bg-orange-500 hover:bg-orange-600 text-black font-black uppercase tracking-tighter h-12"
        >
          {isDeploying ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Target className="w-4 h-4 mr-2" />
              Initialize Drone Deployment
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
