import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench, AlertCircle } from 'lucide-react';

export default function PredictiveMaintenanceCard({ driverEmail }) {
  const { data: alerts = [] } = useQuery({
    queryKey: ['maintenance', driverEmail],
    queryFn: () => base44.entities.PredictiveMaintenanceAlert.filter({
      driver_email: driverEmail,
      severity: 'high'
    })
  });

  if (alerts.length === 0) return null;

  const severityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  };

  return (
    <Card className="border-2 border-orange-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Wrench className="w-4 h-4 text-orange-600" />
          Maintenance Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {alerts.slice(0, 3).map(alert => (
          <div key={alert.id} className="bg-orange-50 rounded p-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold">{alert.component}</p>
                <p className="text-xs text-gray-600">{alert.current_condition}</p>
              </div>
              <Badge className={severityColors[alert.severity]}>{alert.severity}</Badge>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-gray-600">Est. cost: ${alert.estimated_repair_cost}</span>
              <span className="text-gray-600">{Math.round(alert.confidence * 100)}% confidence</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}