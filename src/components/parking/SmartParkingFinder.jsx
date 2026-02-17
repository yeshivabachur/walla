import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ParkingCircle, Zap } from 'lucide-react';

export default function SmartParkingFinder({ location }) {
  const [parking, setParking] = useState([]);

  useEffect(() => {
    const findParking = async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Find 3 nearby parking spots near ${location} with availability and pricing.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: 'object',
          properties: {
            spots: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  available: { type: 'number' },
                  rate: { type: 'number' },
                  distance: { type: 'number' }
                }
              }
            }
          }
        }
      });

      setParking(result.spots || []);
    };

    findParking();
  }, [location]);

  if (parking.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <ParkingCircle className="w-4 h-4 text-blue-600" />
          Nearby Parking
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {parking.map((spot, idx) => (
          <div key={idx} className="bg-blue-50 rounded p-2">
            <div className="flex justify-between">
              <span className="text-sm font-semibold">{spot.name}</span>
              <Badge>{spot.available} spots</Badge>
            </div>
            <p className="text-xs text-gray-600">${spot.rate}/hr • {spot.distance}m away</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}