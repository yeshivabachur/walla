import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function DriverTimeOffManager({ driverEmail }) {
  const queryClient = useQueryClient();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const requestMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.DriverTimeOff.create({
        driver_email: driverEmail,
        start_date: startDate,
        end_date: endDate,
        reason: 'Personal',
        approved: false
      });
    },
    onSuccess: () => {
      toast.success('Time off requested');
      setStartDate('');
      setEndDate('');
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-blue-600" />
          Request Time Off
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Start date"
        />
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="End date"
        />
        <Button
          onClick={() => requestMutation.mutate()}
          disabled={!startDate || !endDate}
          className="w-full"
          size="sm"
        >
          Submit Request
        </Button>
      </CardContent>
    </Card>
  );
}