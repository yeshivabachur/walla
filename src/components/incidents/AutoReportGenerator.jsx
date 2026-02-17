import React from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function AutoReportGenerator({ rideRequest }) {
  const generateReport = async () => {
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Generate incident report for ride.

Ride: ${rideRequest.pickup_location} to ${rideRequest.dropoff_location}
Date: ${rideRequest.created_date}

Create professional incident report with:
1. Timeline of events
2. Severity assessment
3. Key observations
4. Recommended actions`,
      response_json_schema: {
        type: 'object',
        properties: {
          report: { type: 'string' },
          severity: { type: 'string' },
          key_events: { type: 'array', items: { type: 'string' } }
        }
      }
    });

    await base44.entities.AutoIncidentReport.create({
      ride_request_id: rideRequest.id,
      generated_report: result.report,
      incident_type: 'general',
      severity: result.severity,
      key_events: result.key_events,
      timestamp: new Date().toISOString()
    });

    toast.success('Report generated');
  };

  return (
    <Button variant="outline" size="sm" onClick={generateReport}>
      <FileText className="w-4 h-4 mr-2" />
      Generate Report
    </Button>
  );
}