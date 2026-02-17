import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Activity } from 'lucide-react';

export default function HealthMonitoringCard({ userEmail }) {
  const { data: health } = useQuery({
    queryKey: ['health', userEmail],
    queryFn: async () => {
      const healths = await base44.entities.HealthMonitoring.filter({ user_email: userEmail });
      if (healths[0]) return healths[0];
      return await base44.entities.HealthMonitoring.create({ user_email: userEmail });
    },
    enabled: !!userEmail
  });

  if (!health || !health.health_tracking_enabled) return null;

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-pink-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Heart className="w-4 h-4 text-red-600" />
          Health Monitoring
        </CardTitle>
      </CardHeader>
      <CardContent>
        {health.vital_signs && (
          <div className="space-y-2">
            {health.vital_signs.heart_rate && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Heart Rate</span>
                <span className="font-bold text-red-600">{health.vital_signs.heart_rate} bpm</span>
              </div>
            )}
            {health.vital_signs.stress_level && (
              <div className="flex items-center gap-2 text-xs">
                <Activity className="w-3 h-3 text-orange-500" />
                <span className="text-gray-700">Stress: {health.vital_signs.stress_level}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}