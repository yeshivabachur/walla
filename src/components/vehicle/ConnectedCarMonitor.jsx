import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Battery, AlertTriangle } from 'lucide-react';

export default function ConnectedCarMonitor({ vehicleId, driverEmail }) {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    const checkHealth = async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Simulate vehicle health diagnostics.

Vehicle: ${vehicleId}

Generate realistic health data:
1. Overall health score (0-100)
2. Battery health percentage
3. Engine status
4. Tire pressure status
5. Oil life percentage
6. Any critical alerts`,
        response_json_schema: {
          type: 'object',
          properties: {
            health_score: { type: 'number' },
            battery_health: { type: 'number' },
            engine_status: { type: 'string' },
            tire_pressure: { type: 'string' },
            oil_life: { type: 'number' },
            alerts: { type: 'array', items: { type: 'string' } }
          }
        }
      });

      setHealth(result);

      await base44.entities.VehicleHealth.create({
        vehicle_id: vehicleId,
        driver_email: driverEmail,
        health_score: result.health_score,
        diagnostics: {
          engine_status: result.engine_status,
          battery_health: result.battery_health,
          tire_pressure: result.tire_pressure,
          oil_life: result.oil_life
        },
        alerts: result.alerts,
        last_check: new Date().toISOString()
      });
    };

    checkHealth();
  }, [vehicleId, driverEmail]);

  if (!health) return null;

  return (
    <Card className="border-2 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Car className="w-4 h-4 text-blue-600" />
          Vehicle Health
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Overall Health</span>
          <Badge className={health.health_score > 80 ? 'bg-green-600' : 'bg-orange-600'}>
            {health.health_score}%
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white rounded-lg p-2">
            <div className="flex items-center gap-1 mb-1">
              <Battery className="w-3 h-3 text-gray-600" />
              <span className="text-xs text-gray-600">Battery</span>
            </div>
            <p className="text-sm font-bold">{health.battery_health}%</p>
          </div>
          <div className="bg-white rounded-lg p-2">
            <p className="text-xs text-gray-600 mb-1">Oil Life</p>
            <p className="text-sm font-bold">{health.oil_life}%</p>
          </div>
        </div>

        {health.alerts?.length > 0 && (
          <div className="bg-red-50 rounded-lg p-2 border border-red-200">
            <p className="text-xs font-semibold text-red-800 mb-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Alerts
            </p>
            {health.alerts.map((alert, idx) => (
              <p key={idx} className="text-xs text-red-700">{alert}</p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}