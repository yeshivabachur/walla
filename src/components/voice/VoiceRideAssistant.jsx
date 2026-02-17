import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function VoiceRideAssistant({ userEmail, onRideBooked }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleVoiceCommand = async () => {
    if (isListening) {
      setIsListening(false);
      if (!transcript) return;

      setIsProcessing(true);
      try {
        const result = await base44.integrations.Core.InvokeLLM({
          prompt: `Parse this voice command for a ride-hailing app: "${transcript}"

Extract:
- Intent (book_ride, check_status, cancel_ride, etc.)
- Pickup location (if mentioned)
- Dropoff location (if mentioned)
- Time preference (if mentioned)
- Any special requests

Provide a natural language confirmation message.`,
          response_json_schema: {
            type: 'object',
            properties: {
              intent: { type: 'string' },
              pickup: { type: 'string' },
              dropoff: { type: 'string' },
              time: { type: 'string' },
              confirmation: { type: 'string' },
              confidence: { type: 'number' }
            }
          }
        });

        await base44.entities.VoiceCommand.create({
          user_email: userEmail,
          command_text: transcript,
          intent: result.intent,
          parsed_data: {
            pickup: result.pickup,
            dropoff: result.dropoff,
            time: result.time
          },
          confidence: result.confidence,
          executed: false
        });

        toast.success(result.confirmation);
        
        if (result.intent === 'book_ride' && result.pickup && result.dropoff && onRideBooked) {
          onRideBooked({
            pickup: result.pickup,
            dropoff: result.dropoff,
            time: result.time
          });
        }

        setTranscript('');
      } catch (error) {
        toast.error('Could not process voice command');
      } finally {
        setIsProcessing(false);
      }
    } else {
      setIsListening(true);
      toast.info('🎤 Listening... Say "Book a ride from X to Y"');
      
      // Simulate voice input (in real app, use Web Speech API)
      setTimeout(() => {
        setTranscript('Book a ride from San Francisco to Los Angeles');
      }, 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50 mb-6">
        <CardContent className="p-6">
          <div className="text-center">
            <Button
              onClick={handleVoiceCommand}
              disabled={isProcessing}
              className={`h-20 w-20 rounded-full ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isProcessing ? (
                <Loader2 className="w-8 h-8 animate-spin text-white" />
              ) : isListening ? (
                <MicOff className="w-8 h-8 text-white" />
              ) : (
                <Mic className="w-8 h-8 text-white" />
              )}
            </Button>
            <p className="text-sm font-semibold text-gray-900 mt-4">
              {isListening ? '🎤 Listening...' : '🎙️ Voice Booking'}
            </p>
            <p className="text-xs text-gray-600">
              {isListening ? 'Say your destination' : 'Tap to start'}
            </p>
            
            <AnimatePresence>
              {transcript && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 bg-white rounded-lg p-3"
                >
                  <p className="text-sm text-gray-700">"{transcript}"</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}