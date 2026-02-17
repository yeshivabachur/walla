import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Palmtree } from 'lucide-react';
import { toast } from 'sonner';

export default function DriverVacationToggle({ driverEmail }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const activateMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.DriverVacationMode.create({
        driver_email: driverEmail,
        start_date: startDate,
        end_date: endDate,
        auto_decline_rides: true,
        notification_paused: true,
        active: true
      });
    },
    onSuccess: () => {
      toast.success('Vacation mode activated');
      setStartDate('');
      setEndDate('');
    }
  });

  return (
    <Card className="border-2 border-teal-200 bg-teal-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Palmtree className="w-4 h-4 text-teal-600" />
          Vacation Mode
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
          onClick={() => activateMutation.mutate()}
          disabled={!startDate || !endDate}
          className="w-full bg-teal-600 hover:bg-teal-700"
          size="sm"
        >
          Activate Vacation Mode
        </Button>
      </CardContent>
    </Card>
  );
}