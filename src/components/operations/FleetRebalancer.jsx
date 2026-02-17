import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign } from 'lucide-react';

export default function FleetRebalancer() {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const analyze = async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze fleet distribution and suggest rebalancing.

Current time: ${new Date().toLocaleTimeString()}

Identify:
1. Oversupplied zones
2. Undersupplied zones
3. Incentive amounts to motivate drivers
4. Expected demand increase`,
        response_json_schema: {
          type: 'object',
          properties: {
            moves: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  from: { type: 'string' },
                  to: { type: 'string' },
                  incentive: { type: 'number' },
                  expected_demand: { type: 'number' }
                }
              }
            }
          }
        }
      });

      setSuggestions(result.moves || []);

      for (const move of result.moves || []) {
        await base44.entities.FleetRebalancing.create({
          timestamp: new Date().toISOString(),
          from_zone: move.from,
          to_zone: move.to,
          expected_demand: move.expected_demand,
          incentive_amount: move.incentive
        });
      }
    };

    analyze();
  }, []);

  if (suggestions.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4 text-indigo-600" />
          Fleet Rebalancing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {suggestions.map((s, idx) => (
          <div key={idx} className="bg-indigo-50 rounded-lg p-2 border border-indigo-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold">{s.from} → {s.to}</span>
              <Badge className="bg-green-600 text-white text-xs">
                <DollarSign className="w-3 h-3 mr-1" />
                +${s.incentive}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}