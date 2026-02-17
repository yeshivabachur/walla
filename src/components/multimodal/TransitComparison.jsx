import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car, Train, Bike, Footprints, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

const modeIcons = {
  ride: Car,
  transit: Train,
  bike: Bike,
  walk: Footprints
};

export default function TransitComparison({ pickup, dropoff, onSelect }) {
  const { data: options } = useQuery({
    queryKey: ['transitOptions', pickup, dropoff],
    queryFn: async () => {
      const comparison = await base44.integrations.Core.InvokeLLM({
        prompt: `Compare travel options from ${pickup} to ${dropoff}: 1) Walla ride, 2) Public transit, 3) Bike/scooter. Return: mode, duration_minutes, cost, carbon_kg, pros array.`,
        response_json_schema: {
          type: 'object',
          properties: {
            options: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  mode: { type: 'string' },
                  duration_minutes: { type: 'number' },
                  cost: { type: 'number' },
                  carbon_kg: { type: 'number' },
                  pros: { type: 'array', items: { type: 'string' } }
                }
              }
            }
          }
        }
      });

      return comparison.options || [];
    },
    enabled: !!pickup && !!dropoff
  });

  if (!options || options.length === 0) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Compare Travel Options</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {options.map((option, i) => {
          const Icon = modeIcons[option.mode] || Car;
          return (
            <Card key={i} className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => option.mode === 'ride' && onSelect?.()}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <Icon className="w-5 h-5 text-indigo-600" />
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    <Leaf className="w-3 h-3 mr-1" />
                    {option.carbon_kg}kg CO₂
                  </Badge>
                </div>
                <p className="font-semibold text-gray-900 capitalize mb-2">{option.mode}</p>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-gray-600">{option.duration_minutes} min</span>
                  <span className="font-semibold">${option.cost}</span>
                </div>
                <div className="space-y-1">
                  {option.pros?.slice(0, 2).map((pro, j) => (
                    <p key={j} className="text-xs text-gray-600">• {pro}</p>
                  ))}
                </div>
                {option.mode === 'ride' && (
                  <Button size="sm" className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg">
                    Book Ride
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
}