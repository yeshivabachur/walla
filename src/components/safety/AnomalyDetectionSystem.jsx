import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AnomalyDetectionSystem({ rideRequest }) {
  const [anomalies, setAnomalies] = useState([]);

  useEffect(() => {
    const detectAnomalies = async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze ride for anomalies.

Route: ${rideRequest.pickup_location} to ${rideRequest.dropoff_location}
Status: ${rideRequest.status}
Duration: Active

Detect any:
1. Route deviations
2. Excessive speed patterns
3. Unusual stops
4. Suspicious patterns

Flag severity level for each.`,
        response_json_schema: {
          type: 'object',
          properties: {
            anomalies: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  anomaly_type: { type: 'string' },
                  severity: { type: 'string' },
                  details: { type: 'string' }
                }
              }
            }
          }
        }
      });

      if (result.anomalies?.length > 0) {
        setAnomalies(result.anomalies);
        
        for (const anomaly of result.anomalies) {
          await base44.entities.RideAnomalyDetection.create({
            ride_request_id: rideRequest.id,
            detection_timestamp: new Date().toISOString(),
            anomaly_type: anomaly.anomaly_type,
            severity: anomaly.severity,
            details: anomaly.details,
            resolved: false
          });
        }
      }
    };

    if (rideRequest.status === 'in_progress') {
      detectAnomalies();
    }
  }, [rideRequest]);

  if (anomalies.length === 0) {
    return (
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-800 font-semibold">All systems normal</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const severityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Anomaly Detection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {anomalies.map((anomaly, idx) => (
            <div key={idx} className="bg-white rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900 capitalize">
                  {anomaly.anomaly_type.replace(/_/g, ' ')}
                </span>
                <Badge className={severityColors[anomaly.severity]}>
                  {anomaly.severity}
                </Badge>
              </div>
              <p className="text-xs text-gray-600">{anomaly.details}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}