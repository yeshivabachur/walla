import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Fuel, Navigation } from 'lucide-react';

export default function FuelPriceTracker({ currentLocation }) {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    const findStations = async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Find cheapest fuel stations near ${currentLocation}.

Provide 3 stations with:
1. Station name
2. Location
3. Price per gallon
4. Distance in miles`,
        response_json_schema: {
          type: 'object',
          properties: {
            stations: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  location: { type: 'string' },
                  price: { type: 'number' },
                  distance: { type: 'number' }
                }
              }
            }
          }
        }
      });

      setStations(result.stations || []);

      for (const station of result.stations || []) {
        await base44.entities.FuelStation.create({
          station_name: station.name,
          location: station.location,
          price_per_gallon: station.price,
          distance_miles: station.distance,
          last_updated: new Date().toISOString()
        });
      }
    };

    findStations();
  }, [currentLocation]);

  if (stations.length === 0) return null;

  return (
    <Card className="border-2 border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Fuel className="w-4 h-4 text-green-600" />
          Cheapest Fuel Nearby
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {stations.map((station, idx) => (
          <div key={idx} className="bg-white rounded-lg p-2 flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">{station.name}</p>
              <p className="text-xs text-gray-600 flex items-center gap-1">
                <Navigation className="w-3 h-3" />
                {station.distance} mi
              </p>
            </div>
            <Badge className="bg-green-600 text-white">
              ${station.price}/gal
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}