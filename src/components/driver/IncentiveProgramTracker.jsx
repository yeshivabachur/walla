import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target } from 'lucide-react';

export default function IncentiveProgramTracker({ driverEmail }) {
  const { data: programs = [] } = useQuery({
    queryKey: ['incentives', driverEmail],
    queryFn: () => base44.entities.DriverIncentiveProgram.filter({
      driver_email: driverEmail,
      completed: false
    })
  });

  if (programs.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Target className="w-4 h-4 text-purple-600" />
          Active Incentives
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {programs.map(program => {
          const progress = (program.current_rides / program.target_rides) * 100;
          return (
            <div key={program.id} className="bg-purple-50 rounded p-2">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-semibold">{program.program_name}</span>
                <Badge className="bg-green-600">${program.bonus_amount}</Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                <div className="bg-purple-600 h-2 rounded-full" style={{width: `${progress}%`}}></div>
              </div>
              <div className="flex justify-between text-xs">
                <span>{program.current_rides} / {program.target_rides} rides</span>
                <span>Due: {program.deadline}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}