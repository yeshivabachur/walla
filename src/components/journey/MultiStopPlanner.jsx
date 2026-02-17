import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

export default function MultiStopPlanner({ userEmail }) {
  const [stops, setStops] = useState([{ location: '', duration: 5 }]);

  const addStop = () => {
    setStops([...stops, { location: '', duration: 5 }]);
  };

  const removeStop = (index) => {
    setStops(stops.filter((_, i) => i !== index));
  };

  const optimizeRoute = async () => {
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Optimize multi-stop route.

Stops: ${stops.map(s => s.location).join(' → ')}

Provide:
1. Optimal order of stops
2. Total estimated time
3. Total estimated price`,
      response_json_schema: {
        type: 'object',
        properties: {
          optimized_route: { type: 'string' },
          total_time: { type: 'number' },
          total_price: { type: 'number' }
        }
      }
    });

    await base44.entities.MultiStopJourney.create({
      passenger_email: userEmail,
      stops: stops,
      optimized_route: result.optimized_route,
      total_estimated_time: result.total_time,
      total_estimated_price: result.total_price
    });

    toast.success('Route optimized!');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Multi-Stop Journey
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {stops.map((stop, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <Input
              placeholder={`Stop ${idx + 1}`}
              value={stop.location}
              onChange={(e) => {
                const newStops = [...stops];
                newStops[idx].location = e.target.value;
                setStops(newStops);
              }}
            />
            {stops.length > 1 && (
              <Button variant="ghost" size="icon" onClick={() => removeStop(idx)}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        <div className="flex gap-2">
          <Button variant="outline" onClick={addStop} className="flex-1">
            <Plus className="w-4 h-4 mr-2" />
            Add Stop
          </Button>
          <Button onClick={optimizeRoute} className="flex-1">
            Optimize Route
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}