import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Coffee } from 'lucide-react';
import { toast } from 'sonner';

export default function FatigueMonitor({ driverEmail }) {
  const [fatigueLevel, setFatigueLevel] = useState(0);
  const [drivingMinutes, setDrivingMinutes] = useState(0);

  useEffect(() => {
    const interval = setInterval(async () => {
      setDrivingMinutes(prev => prev + 1);
      
      if (drivingMinutes > 0 && drivingMinutes % 120 === 0) {
        const score = Math.min(100, (drivingMinutes / 240) * 100);
        setFatigueLevel(score);
        
        await base44.entities.DriverFatigueDetection.create({
          driver_email: driverEmail,
          detection_time: new Date().toISOString(),
          continuous_driving_minutes: drivingMinutes,
          yawn_count: 0,
          eye_closure_events: 0,
          lane_deviation_count: 0,
          fatigue_score: score,
          alert_triggered: score > 70,
          break_recommended: score > 70
        });

        if (score > 70) {
          toast.error('Fatigue detected! Take a break soon.');
        }
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [driverEmail, drivingMinutes]);

  if (fatigueLevel < 50) return null;

  return (
    <Card className={`border-2 ${fatigueLevel > 70 ? 'border-red-400 bg-red-50' : 'border-yellow-400 bg-yellow-50'}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <AlertTriangle className={`w-4 h-4 ${fatigueLevel > 70 ? 'text-red-600' : 'text-yellow-600'}`} />
          Fatigue Monitor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm">Driving time</span>
          <span className="font-bold">{Math.floor(drivingMinutes / 60)}h {drivingMinutes % 60}m</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className={`h-2 rounded-full ${fatigueLevel > 70 ? 'bg-red-600' : 'bg-yellow-600'}`} 
               style={{width: `${fatigueLevel}%`}}></div>
        </div>
        {fatigueLevel > 70 && (
          <Button size="sm" className="w-full">
            <Coffee className="w-4 h-4 mr-2" />
            Find Rest Area
          </Button>
        )}
      </CardContent>
    </Card>
  );
}