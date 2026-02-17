import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Share2 } from 'lucide-react';
import { toast } from 'sonner';

export default function RideMemories({ passengerEmail }) {
  const [newMemory, setNewMemory] = useState('');
  const [selectedRide, setSelectedRide] = useState(null);
  const queryClient = useQueryClient();

  const { data: memories = [] } = useQuery({
    queryKey: ['rideMemories', passengerEmail],
    queryFn: () => base44.entities.RideMemory.filter({ passenger_email: passengerEmail })
  });

  const { data: recentRides = [] } = useQuery({
    queryKey: ['recentRides', passengerEmail],
    queryFn: () => base44.entities.RideRequest.filter({ 
      passenger_email: passengerEmail,
      status: 'completed'
    }, '-created_date', 5)
  });

  const createMemoryMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.RideMemory.create({
        passenger_email: passengerEmail,
        ride_request_id: selectedRide,
        memorable_moment: newMemory,
        sentiment: 'positive',
        tags: [],
        shared: false
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['rideMemories']);
      toast.success('Memory saved!');
      setNewMemory('');
      setSelectedRide(null);
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Heart className="w-4 h-4 text-pink-600" />
          Ride Memories
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {memories.length > 0 && (
          <div className="space-y-2">
            {memories.slice(0, 3).map(memory => (
              <div key={memory.id} className="bg-pink-50 rounded p-2 border border-pink-200">
                <p className="text-xs text-gray-700">{memory.memorable_moment}</p>
              </div>
            ))}
          </div>
        )}
        {recentRides.length > 0 && (
          <div className="border-t pt-3">
            <p className="text-xs text-gray-600 mb-2">Add memory from recent ride</p>
            <select
              className="w-full border rounded p-2 text-xs mb-2"
              value={selectedRide || ''}
              onChange={(e) => setSelectedRide(e.target.value)}
            >
              <option value="">Select ride</option>
              {recentRides.map(ride => (
                <option key={ride.id} value={ride.id}>
                  {ride.pickup_location} → {ride.dropoff_location}
                </option>
              ))}
            </select>
            <Textarea
              placeholder="What made this ride special?"
              value={newMemory}
              onChange={(e) => setNewMemory(e.target.value)}
              className="text-xs"
              rows={2}
            />
            <Button
              onClick={() => createMemoryMutation.mutate()}
              disabled={!selectedRide || !newMemory}
              size="sm"
              className="w-full mt-2"
            >
              Save Memory
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}