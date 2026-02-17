import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle } from 'lucide-react';

export default function DriverRestComplianceMonitor({ driverEmail }) {
  const [restStatus, setRestStatus] = useState(null);

  useEffect(() => {
    const checkCompliance = async () => {
      const today = new Date().toISOString().split('T')[0];
      const rides = await base44.entities.RideRequest.filter({
        driver_email: driverEmail,
        status: { $in: ['completed', 'in_progress'] },
        created_date: { $gte: today }
      });

      const hoursWorked = rides.length * 0.5; // Estimate
      const restRequired = hoursWorked >= 8;
      const complianceStatus = restRequired ? 'warning' : 'compliant';

      const status = await base44.entities.DriverRestRequirement.create({
        driver_email: driverEmail,
        continuous_hours_driven: hoursWorked,
        last_break_time: new Date().toISOString(),
        rest_required: restRequired,
        compliance_status: complianceStatus
      });

      setRestStatus(status);
    };

    checkCompliance();
  }, [driverEmail]);

  if (!restStatus || restStatus.compliance_status === 'compliant') return null;

  return (
    <Card className="border-2 border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <AlertTriangle className="w-4 h-4 text-orange-600" />
          Rest Required
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-orange-700 mb-2">
          You've worked {restStatus.continuous_hours_driven.toFixed(1)} hours continuously
        </p>
        <Badge className="bg-orange-600">
          <Clock className="w-3 h-3 mr-1" />
          Take {restStatus.min_rest_minutes} min break
        </Badge>
      </CardContent>
    </Card>
  );
}