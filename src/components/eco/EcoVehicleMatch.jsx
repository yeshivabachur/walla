import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Leaf, Zap, Droplet } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EcoVehicleMatch({ enabled, onToggle }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-emerald-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-gray-900">Eco-Friendly Vehicles</span>
            </div>
            <Switch checked={enabled} onCheckedChange={onToggle} />
          </div>

          {enabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-2"
            >
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-green-600 text-white">
                  <Zap className="w-3 h-3 mr-1" />
                  Electric
                </Badge>
                <Badge className="bg-blue-600 text-white">
                  <Droplet className="w-3 h-3 mr-1" />
                  Hybrid
                </Badge>
              </div>
              <p className="text-xs text-gray-600">
                We'll match you with eco-certified vehicles to reduce your carbon footprint. May take slightly longer.
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}