import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle } from 'lucide-react';

export default function VehicleTelemetryDashboard({ vehicleId, driverEmail }) {
  const { data: telemetry = [] } = useQuery({
    queryKey: ['telemetry', vehicleId],
    queryFn: () => base44.entities.VehicleTelemetry.filter({ vehicle_id: vehicleId }),
    refetchInterval: 5000
  });

  const latest = telemetry[0];
  if (!latest) return null;

  const harshEvents = latest.harsh_braking_count + latest.rapid_acceleration_count;

  return (
    <Card className="border-2 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Activity className="w-4 h-4 text-blue-600" />
          Vehicle Telemetry
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 mb-2">
          <div className="bg-white rounded p-2">
            <p className="text-xs text-gray-600">Speed</p>
            <p className="text-lg font-bold">{latest.speed || 0} mph</p>
          </div>
          <div className="bg-white rounded p-2">
            <p className="text-xs text-gray-600">Fuel</p>
            <p className="text-lg font-bold">{latest.fuel_level || 0}%</p>
          </div>
          <div className="bg-white rounded p-2">
            <p className="text-xs text-gray-600">Temp</p>
            <p className="text-lg font-bold">{latest.engine_temperature || 0}°</p>
          </div>
        </div>
        {harshEvents > 0 && (
          <div className="bg-orange-50 rounded p-2 flex items-center gap-2 border border-orange-200">
            <AlertTriangle className="w-4 h-4 text-orange-600" />
            <p className="text-xs text-orange-800">{harshEvents} harsh driving events</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}