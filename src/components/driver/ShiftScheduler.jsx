import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function ShiftScheduler({ driverEmail }) {
  const queryClient = useQueryClient();

  const { data: shifts = [] } = useQuery({
    queryKey: ['driverShifts', driverEmail],
    queryFn: () => base44.entities.DriverShift.filter({ driver_email: driverEmail }, '-shift_date')
  });

  const createShiftMutation = useMutation({
    mutationFn: async (shiftData) => {
      await base44.entities.DriverShift.create(shiftData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['driverShifts']);
      toast.success('Shift scheduled!');
    }
  });

  const upcomingShifts = shifts.filter(s => s.status === 'scheduled');

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          Shift Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {upcomingShifts.length === 0 ? (
          <p className="text-sm text-gray-500">No scheduled shifts</p>
        ) : (
          upcomingShifts.slice(0, 3).map(shift => (
            <div key={shift.id} className="bg-indigo-50 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">{shift.shift_date}</span>
                {shift.ai_recommended && (
                  <Badge className="bg-green-600 text-white text-xs">AI Pick</Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {shift.start_time} - {shift.end_time}
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  ${shift.target_earnings} goal
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}