import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plane, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function AirportQueueMonitor({ driverEmail }) {
  const queryClient = useQueryClient();
  const [selectedAirport, setSelectedAirport] = useState('SFO');

  const { data: queuePosition } = useQuery({
    queryKey: ['airportQueue', driverEmail],
    queryFn: async () => {
      const positions = await base44.entities.AirportQueue.filter({ 
        driver_email: driverEmail, 
        status: 'waiting' 
      });
      return positions[0];
    }
  });

  const joinQueueMutation = useMutation({
    mutationFn: async () => {
      const existingQueue = await base44.entities.AirportQueue.filter({ airport_code: selectedAirport, status: 'waiting' });
      const position = existingQueue.length + 1;
      
      return await base44.entities.AirportQueue.create({
        airport_code: selectedAirport,
        driver_email: driverEmail,
        queue_position: position,
        estimated_wait_minutes: position * 15,
        joined_at: new Date().toISOString(),
        status: 'waiting'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['airportQueue']);
      toast.success('Joined airport queue');
    }
  });

  return (
    <Card className="border-2 border-sky-200 bg-sky-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Plane className="w-4 h-4 text-sky-600" />
          Airport Queue
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {queuePosition ? (
          <div className="bg-white rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">{queuePosition.airport_code}</span>
              <Badge className="bg-sky-600">Position #{queuePosition.queue_position}</Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Clock className="w-3 h-3" />
              <span>Est. wait: {queuePosition.estimated_wait_minutes} min</span>
            </div>
          </div>
        ) : (
          <>
            <Select value={selectedAirport} onValueChange={setSelectedAirport}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SFO">San Francisco (SFO)</SelectItem>
                <SelectItem value="LAX">Los Angeles (LAX)</SelectItem>
                <SelectItem value="JFK">New York JFK</SelectItem>
                <SelectItem value="ORD">Chicago (ORD)</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => joinQueueMutation.mutate()} className="w-full bg-sky-600" size="sm">
              Join Queue
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}