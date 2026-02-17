import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function DriverScheduleManager({ driverEmail }) {
  const queryClient = useQueryClient();
  const [day, setDay] = useState('monday');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');

  const { data: schedules = [] } = useQuery({
    queryKey: ['driverSchedule', driverEmail],
    queryFn: () => base44.entities.DriverSchedule.filter({ driver_email: driverEmail, active: true })
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.DriverSchedule.create({
        driver_email: driverEmail,
        day_of_week: day,
        start_time: startTime,
        end_time: endTime,
        recurring: true,
        active: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['driverSchedule']);
      toast.success('Schedule added');
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-blue-600" />
          Weekly Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <Select value={day} onValueChange={setDay}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(d => (
                <SelectItem key={d} value={d} className="capitalize">{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </div>
        <Button onClick={() => addMutation.mutate()} className="w-full" size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Add Shift
        </Button>
        <div className="space-y-1 text-xs">
          {schedules.map(s => (
            <div key={s.id} className="flex justify-between bg-blue-50 rounded p-2">
              <span className="capitalize">{s.day_of_week}</span>
              <span>{s.start_time} - {s.end_time}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}