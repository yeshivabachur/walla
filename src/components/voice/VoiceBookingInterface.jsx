import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from 'lucide-react';
import { toast } from 'sonner';

export default function VoiceBookingInterface({ passengerEmail, onRideBooked }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const voiceMutation = useMutation({
    mutationFn: async (command) => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Parse this ride booking voice command and extract pickup and destination: "${command}"`,
        response_json_schema: {
          type: 'object',
          properties: {
            pickup: { type: 'string' },
            destination: { type: 'string' },
            confidence: { type: 'number' }
          }
        }
      });

      await base44.entities.VoiceBooking.create({
        passenger_email: passengerEmail,
        voice_command: command,
        parsed_pickup: result.pickup,
        parsed_destination: result.destination,
        confidence_score: result.confidence,
        ride_created: true,
        timestamp: new Date().toISOString()
      });

      return result;
    },
    onSuccess: (data) => {
      toast.success('Ride parsed from voice command!');
      onRideBooked?.(data);
    }
  });

  const startListening = () => {
    setIsListening(true);
    // Simulate voice recognition
    setTimeout(() => {
      const mockCommand = "Take me from Downtown to Airport";
      setTranscript(mockCommand);
      voiceMutation.mutate(mockCommand);
      setIsListening(false);
    }, 2000);
  };

  return (
    <Card className="border-2 border-purple-200 bg-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Mic className="w-4 h-4 text-purple-600" />
          Voice Booking
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          onClick={startListening}
          disabled={isListening}
          className={`w-full ${isListening ? 'bg-red-600' : 'bg-purple-600'}`}
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4 mr-2 animate-pulse" />
              Listening...
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 mr-2" />
              Tap to Speak
            </>
          )}
        </Button>
        {transcript && (
          <p className="text-xs text-gray-600 mt-2 italic">"{transcript}"</p>
        )}
      </CardContent>
    </Card>
  );
}