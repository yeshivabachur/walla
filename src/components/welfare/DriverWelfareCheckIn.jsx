import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Heart } from 'lucide-react';
import { toast } from 'sonner';

export default function DriverWelfareCheckIn({ driverEmail }) {
  const [moodScore, setMoodScore] = useState([7]);
  const [sleepHours, setSleepHours] = useState([7]);

  const checkInMutation = useMutation({
    mutationFn: async () => {
      const stressLevel = moodScore[0] < 4 ? 'high' : moodScore[0] < 7 ? 'moderate' : 'low';
      return await base44.entities.DriverWelfareCheck.create({
        driver_email: driverEmail,
        check_date: new Date().toISOString(),
        mood_score: moodScore[0],
        stress_level: stressLevel,
        sleep_hours: sleepHours[0],
        concerns: [],
        support_offered: moodScore[0] < 4
      });
    },
    onSuccess: () => {
      toast.success('Check-in recorded. Thank you!');
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Heart className="w-4 h-4 text-pink-600" />
          Wellness Check-In
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs text-gray-600 mb-2">How are you feeling? (1-10)</p>
          <Slider value={moodScore} onValueChange={setMoodScore} max={10} step={1} />
          <p className="text-center text-sm font-semibold mt-1">{moodScore[0]}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-2">Hours slept last night</p>
          <Slider value={sleepHours} onValueChange={setSleepHours} max={12} step={1} />
          <p className="text-center text-sm font-semibold mt-1">{sleepHours[0]}h</p>
        </div>
        <Button onClick={() => checkInMutation.mutate()} className="w-full" size="sm">
          Submit Check-In
        </Button>
      </CardContent>
    </Card>
  );
}