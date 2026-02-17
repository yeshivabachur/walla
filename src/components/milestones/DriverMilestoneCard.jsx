import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from 'lucide-react';

export default function DriverMilestoneCard({ driverEmail }) {
  const { data: milestones = [] } = useQuery({
    queryKey: ['driverMilestones', driverEmail],
    queryFn: () => base44.entities.DriverMilestone.filter({ driver_email: driverEmail })
  });

  if (milestones.length === 0) return null;

  return (
    <Card className="border-2 border-purple-200 bg-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Trophy className="w-4 h-4 text-purple-600" />
          Milestones
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-purple-700">{milestones.length}</p>
        <p className="text-xs text-gray-600">Achievements unlocked</p>
      </CardContent>
    </Card>
  );
}