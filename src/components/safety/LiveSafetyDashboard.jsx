import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, CheckCircle, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LiveSafetyDashboard({ rideRequest }) {
  const [safetyChecks, setSafetyChecks] = useState({
    route_monitored: true,
    emergency_contacts_notified: false,
    driver_verified: true,
    location_shared: true,
    sos_available: true
  });

  const allChecksPass = Object.values(safetyChecks).every(v => v);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Safety Status
            </span>
            <Badge className={allChecksPass ? 'bg-green-600' : 'bg-yellow-600'}>
              {allChecksPass ? 'All Clear' : 'Monitoring'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(safetyChecks).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between bg-white rounded-lg p-2">
              <span className="text-xs text-gray-700 capitalize">
                {key.replace(/_/g, ' ')}
              </span>
              {value ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
              )}
            </div>
          ))}

          <div className="bg-red-50 rounded-lg p-3 border border-red-200 mt-3">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-red-600" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-red-800">Emergency</p>
                <p className="text-xs text-red-600">911 • One tap to call</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}