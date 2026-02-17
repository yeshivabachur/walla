import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Video, Mic } from 'lucide-react';
import { toast } from 'sonner';

export default function RideRecordingToggle({ rideRequestId }) {
  const [type, setType] = useState('audio');
  const [recording, setRecording] = useState(false);

  const startRecording = useMutation({
    mutationFn: async () => {
      return await base44.entities.RideRecording.create({
        ride_request_id: rideRequestId,
        recording_type: type,
        started_at: new Date().toISOString(),
        encrypted: true
      });
    },
    onSuccess: () => {
      setRecording(true);
      toast.success('Recording started');
    }
  });

  return (
    <Card className="border-2 border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          {type === 'audio' ? <Mic className="w-4 h-4 text-red-600" /> : <Video className="w-4 h-4 text-red-600" />}
          Ride Recording
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Select value={type} onValueChange={setType} disabled={recording}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="audio">Audio Only</SelectItem>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="both">Both</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={() => startRecording.mutate()}
          disabled={recording}
          className={recording ? 'bg-red-600 animate-pulse' : ''}
          size="sm"
        >
          {recording ? 'Recording...' : 'Start Recording'}
        </Button>
        <p className="text-xs text-gray-600">All recordings are encrypted and stored securely</p>
      </CardContent>
    </Card>
  );
}