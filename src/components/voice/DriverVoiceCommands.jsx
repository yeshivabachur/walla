import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from 'lucide-react';
import { toast } from 'sonner';

export default function DriverVoiceCommands({ driverEmail }) {
  const [listening, setListening] = useState(false);

  const commandMutation = useMutation({
    mutationFn: async (command) => {
      return await base44.entities.DriverVoiceCommand.create({
        driver_email: driverEmail,
        command_text: command.text,
        command_type: command.type,
        executed: true,
        timestamp: new Date().toISOString()
      });
    }
  });

  const handleVoiceCommand = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error('Voice commands not supported');
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      
      let commandType = 'navigate';
      if (transcript.includes('accept')) commandType = 'accept_ride';
      else if (transcript.includes('start')) commandType = 'start_ride';
      else if (transcript.includes('complete')) commandType = 'complete_ride';
      else if (transcript.includes('break')) commandType = 'break';

      commandMutation.mutate({ text: transcript, type: commandType });
      toast.success(`Command: ${transcript}`);
    };

    recognition.start();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          {listening ? <Mic className="w-4 h-4 text-red-600 animate-pulse" /> : <MicOff className="w-4 h-4 text-gray-400" />}
          Voice Commands
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={handleVoiceCommand} 
          className={`w-full ${listening ? 'bg-red-600' : 'bg-indigo-600'}`}
          size="sm"
        >
          {listening ? 'Listening...' : 'Tap to Speak'}
        </Button>
        <p className="text-xs text-gray-600 mt-2">
          Try: "Accept ride", "Start ride", "Complete ride", "Take a break"
        </p>
      </CardContent>
    </Card>
  );
}