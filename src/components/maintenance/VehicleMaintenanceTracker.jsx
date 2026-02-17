import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench, TrendingUp } from 'lucide-react';

export default function VehicleMaintenanceTracker({ driverEmail }) {
  const { data: maintenance } = useQuery({
    queryKey: ['vehicleMaintenance', driverEmail],
    queryFn: async () => {
      const maint = await base44.entities.VehicleMaintenance.filter({ driver_email: driverEmail });
      return maint[0];
    }
  });

  if (!maintenance) return null;

  const upcomingServices = maintenance.maintenance_schedule?.filter(s => !s.completed).slice(0, 3) || [];

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-blue-600" />
          Vehicle Maintenance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {upcomingServices.length === 0 ? (
          <p className="text-sm text-gray-500">No upcoming maintenance</p>
        ) : (
          upcomingServices.map((service, i) => (
            <div key={i} className="bg-blue-50 rounded-xl p-3">
              <p className="font-semibold text-sm text-gray-900">{service.service_type}</p>
              <p className="text-xs text-gray-600">Due: {service.due_date}</p>
            </div>
          ))
        )}
        {maintenance.ai_predictions && (
          <div className="bg-indigo-50 rounded-xl p-3 border-l-4 border-indigo-600">
            <p className="text-xs font-semibold text-indigo-900 mb-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              AI Prediction
            </p>
            <p className="text-xs text-indigo-700">
              Est. costs: ${maintenance.ai_predictions.estimated_costs}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}