import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings } from 'lucide-react';
import { toast } from 'sonner';

export default function TravelPreferencesManager({ passengerEmail }) {
  const queryClient = useQueryClient();
  const [conversation, setConversation] = useState('moderate');
  const [seat, setSeat] = useState('back');

  const saveMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.PassengerTravelPreference.create({
        passenger_email: passengerEmail,
        conversation_preference: conversation,
        seat_preference: seat
      });
    },
    onSuccess: () => {
      toast.success('Preferences saved');
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Settings className="w-4 h-4 text-indigo-600" />
          Travel Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <label className="text-xs text-gray-600">Conversation Level</label>
          <Select value={conversation} onValueChange={setConversation}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="quiet">Quiet Ride</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="chatty">Chatty</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs text-gray-600">Seat Preference</label>
          <Select value={seat} onValueChange={setSeat}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="front">Front Seat</SelectItem>
              <SelectItem value="back">Back Seat</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => saveMutation.mutate()} className="w-full" size="sm">
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );
}