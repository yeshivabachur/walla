import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, Navigation, TrendingUp, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function SmartRouteSuggestion({ currentLocation, timeOfDay }) {
  const [suggestion, setSuggestion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSuggestion = async () => {
      setIsLoading(true);
      try {
        const result = await base44.integrations.Core.InvokeLLM({
          prompt: `As a driver AI assistant, suggest optimal driving strategy for current conditions:

Current Location: ${currentLocation}
Time: ${timeOfDay || new Date().toLocaleTimeString()}
Day: ${new Date().toLocaleDateString('en', { weekday: 'long' })}

Provide:
- Best area to position for next ride
- Expected demand and wait time
- Earning potential
- Strategic advice`,
          response_json_schema: {
            type: 'object',
            properties: {
              recommended_area: { type: 'string' },
              reason: { type: 'string' },
              expected_demand: { type: 'string' },
              earning_potential: { type: 'string' },
              strategy_tip: { type: 'string' }
            }
          }
        });

        setSuggestion(result);
      } catch (error) {
        console.error('Failed to fetch suggestion:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentLocation) {
      fetchSuggestion();
    }
  }, [currentLocation, timeOfDay]);

  if (!suggestion || isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50 mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-blue-600" />
            AI Strategy Suggestion
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-white rounded-xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Recommended Area</p>
                <p className="font-bold text-gray-900 text-lg">{suggestion.recommended_area}</p>
              </div>
              <Badge className="bg-blue-600 text-white">
                {suggestion.expected_demand}
              </Badge>
            </div>
            
            <p className="text-sm text-gray-700 mb-3">{suggestion.reason}</p>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-green-50 rounded-lg p-2">
                <p className="text-xs text-gray-600">Earning Potential</p>
                <p className="font-semibold text-green-700">{suggestion.earning_potential}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-2">
                <p className="text-xs text-gray-600">Demand Level</p>
                <p className="font-semibold text-blue-700">{suggestion.expected_demand}</p>
              </div>
            </div>

            {suggestion.strategy_tip && (
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                <p className="text-xs font-semibold text-amber-800 mb-1">💡 PRO TIP</p>
                <p className="text-xs text-amber-900">{suggestion.strategy_tip}</p>
              </div>
            )}
          </div>

          <Button 
            onClick={() => toast.success('Navigate to recommended area')}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Navigate There
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}