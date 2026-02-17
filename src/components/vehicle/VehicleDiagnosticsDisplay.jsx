import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, AlertCircle, CheckCircle } from 'lucide-react';

export default function VehicleDiagnosticsDisplay({ vehicleId }) {
  const { data: diagnostics } = useQuery({
    queryKey: ['diagnostics', vehicleId],
    queryFn: async () => {
      const result = await base44.entities.VehicleDiagnostics.filter({ vehicle_id: vehicleId });
      return result[0];
    }
  });

  if (!diagnostics) return null;

  const hasIssues = diagnostics.check_engine_light || diagnostics.tire_pressure_warning;

  return (
    <Card className={hasIssues ? 'border-2 border-red-200' : ''}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Car className="w-4 h-4 text-blue-600" />
          Vehicle Health
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm">Check Engine</span>
          {diagnostics.check_engine_light ? 
            <AlertCircle className="w-4 h-4 text-red-600" /> : 
            <CheckCircle className="w-4 h-4 text-green-600" />
          }
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">Oil Life</span>
          <Badge className={diagnostics.oil_life_percent > 30 ? 'bg-green-600' : 'bg-red-600'}>
            {diagnostics.oil_life_percent}%
          </Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">Battery Health</span>
          <Badge className={diagnostics.battery_health > 80 ? 'bg-green-600' : 'bg-yellow-600'}>
            {diagnostics.battery_health}%
          </Badge>
        </div>
        {diagnostics.dtc_codes && diagnostics.dtc_codes.length > 0 && (
          <div className="bg-red-50 rounded p-2">
            <p className="text-xs font-semibold text-red-700">Diagnostic codes:</p>
            {diagnostics.dtc_codes.map(code => (
              <p key={code} className="text-xs text-red-600">{code}</p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}