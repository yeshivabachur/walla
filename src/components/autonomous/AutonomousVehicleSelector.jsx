import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, Zap, MapPin, Loader2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function AutonomousVehicleSelector() {
  const [summoningId, setSummoningId] = useState(null);
  
  const { data: vehicles = [] } = useQuery({
    queryKey: ['autonomousVehicles'],
    queryFn: () => base44.entities.AutonomousVehicle.filter({ available_for_rides: true }),
    // Fallback if no data
    initialData: [
      { id: 'av-1', ai_driver_name: 'Unit-734', autonomy_level: 'Level 5', safety_score: 99.9, eta: '2 min' },
      { id: 'av-2', ai_driver_name: 'Unit-892', autonomy_level: 'Level 4+', safety_score: 98.5, eta: '5 min' },
    ]
  });

  const handleSummon = (id) => {
    setSummoningId(id);
    // Simulate API call
    setTimeout(() => {
      setSummoningId(null);
      toast.success("Autonomous Unit Dispatched to your coordinates.");
    }, 2000);
  };

  if (vehicles.length === 0) return null;

  return (
    <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50 h-full overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Bot className="w-5 h-5 text-blue-600" />
          Autonomous Fleet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <AnimatePresence>
          {vehicles.slice(0, 3).map((vehicle) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-blue-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs">
                    AV
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{vehicle.ai_driver_name}</p>
                    <p className="text-xs text-gray-500">{vehicle.autonomy_level}</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  <Zap className="w-3 h-3 mr-1" />
                  {vehicle.safety_score}%
                </Badge>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500 flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  ETA: {vehicle.eta || '3 min'}
                </span>
                <Button 
                  size="sm" 
                  className={`h-8 text-xs ${summoningId === vehicle.id ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                  onClick={() => handleSummon(vehicle.id)}
                  disabled={summoningId !== null}
                >
                  {summoningId === vehicle.id ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      Dispatching...
                    </>
                  ) : (
                    "Summon"
                  )}
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}