import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle } from 'lucide-react';

export default function CancellationReasonTracker({ userEmail }) {
  const { data: cancellations = [] } = useQuery({
    queryKey: ['cancellations', userEmail],
    queryFn: () => base44.entities.RideCancellationReason.filter({ cancelled_by: userEmail })
  });

  if (cancellations.length === 0) return null;

  const reasonCounts = cancellations.reduce((acc, c) => {
    acc[c.reason] = (acc[c.reason] || 0) + 1;
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <XCircle className="w-4 h-4 text-red-600" />
          Cancellation History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 text-sm">
          {Object.entries(reasonCounts).map(([reason, count]) => (
            <div key={reason} className="flex justify-between">
              <span className="capitalize">{reason.replace('_', ' ')}</span>
              <span className="font-semibold">{count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}