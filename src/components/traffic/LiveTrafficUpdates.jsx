import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LiveTrafficUpdates({ location }) {
  const { data: alerts = [] } = useQuery({
    queryKey: ['trafficAlerts', location],
    queryFn: () => base44.entities.TrafficAlert.filter({ location }),
    refetchInterval: 30000
  });

  const severityConfig = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  };

  if (alerts.length === 0) return null;

  return (
    <Card className="border-0 shadow-lg mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          Traffic Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {alerts.slice(0, 3).map((alert, i) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-gray-50 rounded-xl p-3"
          >
            <div className="flex items-start justify-between mb-2">
              <Badge className={severityConfig[alert.severity]}>
                {alert.alert_type}
              </Badge>
              {alert.estimated_delay && (
                <span className="flex items-center gap-1 text-xs text-gray-600">
                  <Clock className="w-3 h-3" />
                  +{alert.estimated_delay} min
                </span>
              )}
            </div>
            <p className="text-sm text-gray-700">{alert.description}</p>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}