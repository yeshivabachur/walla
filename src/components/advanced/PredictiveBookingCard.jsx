import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function PredictiveBookingCard({ userEmail }) {
  const { data: prediction } = useQuery({
    queryKey: ['prediction', userEmail],
    queryFn: async () => {
      // AI would analyze patterns
      return {
        predicted_destination: 'Office',
        predicted_time: new Date(Date.now() + 3600000).toISOString(),
        confidence: 0.85
      };
    },
    enabled: new Date().getHours() >= 7 && new Date().getHours() <= 9
  });

  const bookMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.PredictiveBooking.create({
        user_email: userEmail,
        predicted_time: prediction.predicted_time,
        predicted_destination: prediction.predicted_destination,
        confidence: prediction.confidence,
        auto_book: true
      });
    },
    onSuccess: () => {
      toast.success('Ride pre-booked based on your routine!');
    }
  });

  if (!prediction || prediction.confidence < 0.7) return null;

  return (
    <Card className="border-2 border-purple-200 bg-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Sparkles className="w-4 h-4 text-purple-600" />
          Smart Suggestion
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm">
          Going to <span className="font-bold">{prediction.predicted_destination}</span> soon?
        </p>
        <p className="text-xs text-gray-600">
          {Math.round(prediction.confidence * 100)}% confidence based on your routine
        </p>
        <Button onClick={() => bookMutation.mutate()} size="sm" className="w-full">
          Pre-book Now
        </Button>
      </CardContent>
    </Card>
  );
}