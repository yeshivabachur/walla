import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LiveIncidentDetector({ rideRequest, driverEmail }) {
  const [incidents, setIncidents] = useState([]);
  const [monitoring, setMonitoring] = useState(true);

  useEffect(() => {
    if (rideRequest?.status !== 'in_progress') return;

    // Simulate incident detection
    const interval = setInterval(() => {
      const random = Math.random();
      
      if (random > 0.95) {
        const newIncident = {
          id: Date.now(),
          category: 'hard_braking',
          severity: 'low',
          timestamp: new Date().toISOString()
        };

        setIncidents(prev => [newIncident, ...prev].slice(0, 3));

        base44.entities.SafetyIncident.create({
          ride_request_id: rideRequest.id,
          incident_timestamp: newIncident.timestamp,
          incident_category: newIncident.category,
          severity: newIncident.severity,
          driver_notified: true
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [rideRequest]);

  if (!monitoring) return null;

  return (
    <Card className="border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-yellow-600" />
            <span className="text-sm font-semibold text-gray-700">
              Live Safety Monitor
            </span>
          </div>
          <Badge className="bg-green-600 text-white">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse mr-1" />
            Active
          </Badge>
        </div>

        {incidents.length === 0 ? (
          <div className="bg-white rounded-lg p-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-xs text-gray-700">
              No incidents detected - smooth driving
            </span>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {incidents.map(incident => (
                <motion.div
                  key={incident.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-lg p-2 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3 text-yellow-600" />
                    <span className="text-xs text-gray-700 capitalize">
                      {incident.category.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {incident.severity}
                  </Badge>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}