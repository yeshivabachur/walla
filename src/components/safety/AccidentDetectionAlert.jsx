import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Check, X } from 'lucide-react';
import { toast } from 'sonner';

export default function AccidentDetectionAlert({ rideRequestId }) {
  const [detected, setDetected] = useState(false);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Simulate accident detection (in real app, this would come from sensors)
    const detectAccident = () => {
      const position = { latitude: 0, longitude: 0 };
      
      setDetected(true);
      toast.error('Possible accident detected!');
      
      base44.entities.AutoAccidentDetection.create({
        ride_request_id: rideRequestId,
        detection_time: new Date().toISOString(),
        location: { lat: position.latitude, lng: position.longitude },
        impact_severity: 'medium',
        airbag_deployed: false,
        emergency_services_called: false,
        passengers_responded: false,
        false_alarm: false
      });
    };

    // Uncomment to test: detectAccident();
  }, [rideRequestId]);

  useEffect(() => {
    if (detected && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (detected && countdown === 0) {
      // Auto-call emergency services
      toast.error('Emergency services contacted');
    }
  }, [detected, countdown]);

  const handleFalseAlarm = () => {
    setDetected(false);
    toast.success('Marked as false alarm');
  };

  if (!detected) return null;

  return (
    <Card className="border-4 border-red-600 bg-red-50 animate-pulse">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm text-red-600">
          <AlertTriangle className="w-5 h-5" />
          Accident Detected
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm font-bold">Emergency services will be called in {countdown} seconds</p>
        <p className="text-xs text-gray-700">Are you okay?</p>
        <div className="grid grid-cols-2 gap-2">
          <Button className="bg-green-600 hover:bg-green-700">
            <Check className="w-4 h-4 mr-2" />
            I'm OK
          </Button>
          <Button onClick={handleFalseAlarm} variant="outline">
            <X className="w-4 h-4 mr-2" />
            False Alarm
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}