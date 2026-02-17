import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Calendar } from 'lucide-react';

export default function VehicleInspectionTracker({ driverEmail, vehicleId }) {
  const { data: inspections = [] } = useQuery({
    queryKey: ['vehicleInspections', vehicleId],
    queryFn: () => base44.entities.VehicleInspection.filter({ vehicle_id: vehicleId })
  });

  const latest = inspections[0];

  if (!latest) return null;

  return (
    <Card className={`border-2 ${latest.passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          {latest.passed ? <CheckCircle className="w-4 h-4 text-green-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
          Vehicle Inspection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm">Status</span>
          <Badge className={latest.passed ? 'bg-green-600' : 'bg-red-600'}>
            {latest.passed ? 'Passed' : 'Failed'}
          </Badge>
        </div>
        {latest.next_inspection_date && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Calendar className="w-3 h-3" />
            Next: {new Date(latest.next_inspection_date).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}