import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock } from 'lucide-react';

export default function DynamicSurgeMonitor({ zone }) {
  const { data: surges = [] } = useQuery({
    queryKey: ['dynamicSurge', zone],
    queryFn: () => base44.entities.DynamicSurge.filter({ zone }),
    refetchInterval: 10000
  });

  const activeSurge = surges.find(s => new Date(s.expected_end_time) > new Date());
  if (!activeSurge) return null;

  return (
    <Card className="border-2 border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4 text-orange-600" />
          Surge Pricing Active
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-white rounded p-3 mb-2">
          <p className="text-2xl font-bold text-orange-600">{activeSurge.surge_multiplier}x</p>
          <p className="text-xs text-gray-600 capitalize">{activeSurge.reason.replace('_', ' ')}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-orange-800">
          <Clock className="w-3 h-3" />
          <span>Ends {new Date(activeSurge.expected_end_time).toLocaleTimeString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}