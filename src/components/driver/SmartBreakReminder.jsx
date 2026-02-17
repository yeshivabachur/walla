import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coffee, X } from 'lucide-react';
import { toast } from 'sonner';

export default function SmartBreakReminder({ driverEmail }) {
  const [reminder, setReminder] = useState(null);

  useEffect(() => {
    const checkBreak = async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Suggest optimal break time for driver.

Driver: ${driverEmail}
Current time: ${new Date().toLocaleTimeString()}

Consider:
1. Time since last break
2. Upcoming demand patterns
3. Nearby rest areas

Suggest break time and location.`,
        response_json_schema: {
          type: 'object',
          properties: {
            should_break: { type: 'boolean' },
            suggested_time: { type: 'string' },
            location: { type: 'string' },
            reason: { type: 'string' },
            duration: { type: 'number' }
          }
        }
      });

      if (result.should_break) {
        setReminder(result);
        
        await base44.entities.BreakReminder.create({
          driver_email: driverEmail,
          suggested_time: new Date().toISOString(),
          suggested_location: result.location,
          reason: result.reason,
          duration_minutes: result.duration
        });
      }
    };

    checkBreak();
  }, [driverEmail]);

  if (!reminder) return null;

  const acknowledge = async () => {
    setReminder(null);
    toast.success('Break reminder acknowledged');
  };

  return (
    <Card className="border-2 border-amber-200 bg-amber-50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Coffee className="w-5 h-5 text-amber-600 mt-1" />
            <div>
              <p className="font-semibold text-sm">Time for a break!</p>
              <p className="text-xs text-gray-700 mt-1">{reminder.reason}</p>
              <p className="text-xs text-gray-600 mt-1">
                📍 {reminder.location} • {reminder.duration} min
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={acknowledge}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}