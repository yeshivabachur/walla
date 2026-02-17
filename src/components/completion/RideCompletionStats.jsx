import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from 'lucide-react';

export default function RideCompletionStats({ driverEmail }) {
  const { data: completions = [] } = useQuery({
    queryKey: ['completionStats', driverEmail],
    queryFn: async () => {
      const rides = await base44.entities.RideRequest.filter({ 
        driver_email: driverEmail, 
        status: 'completed' 
      });
      return rides.slice(0, 10);
    }
  });

  const avgVariance = completions.length > 0 
    ? completions.reduce((sum, c) => sum + Math.abs((c.estimated_price || 0) - (c.estimated_price || 0)), 0) / completions.length 
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <CheckCircle className="w-4 h-4 text-green-600" />
          Completion Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total Completed</span>
            <span className="font-bold">{completions.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Avg Variance</span>
            <span className="font-bold">{avgVariance.toFixed(1)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}