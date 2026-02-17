import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MapPin, TrendingUp, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SmartDestinationSuggestions({ userEmail, onSelectDestination }) {
  const [suggestions, setSuggestions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentContext = () => {
    const hour = new Date().getHours();
    const day = new Date().getDay();
    
    if (day === 0 || day === 6) return 'weekend';
    if (hour >= 6 && hour < 11) return 'morning';
    if (hour >= 11 && hour < 14) return 'lunch';
    if (hour >= 17 && hour < 20) return 'evening';
    if (hour >= 20 && hour < 24) return 'date_night';
    return 'business';
  };

  const { data: pastRides = [] } = useQuery({
    queryKey: ['pastRides', userEmail],
    queryFn: () => base44.entities.RideRequest.filter(
      { passenger_email: userEmail, status: 'completed' },
      '-created_date',
      30
    ),
    enabled: !!userEmail
  });

  useEffect(() => {
    if (!userEmail || pastRides.length === 0) return;

    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        const context = getCurrentContext();
        const destinations = pastRides.map(r => r.dropoff_location);
        
        const result = await base44.integrations.Core.InvokeLLM({
          prompt: `Based on the user's past ride destinations and current context, suggest 3 smart destination recommendations.

Past destinations: ${destinations.slice(0, 20).join(', ')}
Current context: ${context}
Current time: ${new Date().toLocaleString()}

Consider:
1. User's patterns and preferences
2. Time of day and day of week
3. Popular venues for this context
4. Nearby interesting places

Provide creative, personalized suggestions that make sense for ${context}.`,
          response_json_schema: {
            type: 'object',
            properties: {
              suggestions: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    address: { type: 'string' },
                    category: { type: 'string' },
                    reason: { type: 'string' },
                    confidence: { type: 'number' }
                  }
                }
              }
            }
          }
        });

        setSuggestions(result.suggestions);
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [userEmail, pastRides]);

  if (isLoading) {
    return (
      <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 mb-6">
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-600 mr-2" />
          <span className="text-sm text-gray-600">Finding perfect destinations...</span>
        </CardContent>
      </Card>
    );
  }

  if (!suggestions || suggestions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            AI Destination Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onSelectDestination && onSelectDestination(suggestion.address)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                    <p className="font-semibold text-sm text-gray-900">{suggestion.name}</p>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{suggestion.address}</p>
                  <Badge variant="outline" className="text-xs">
                    {suggestion.category}
                  </Badge>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {Math.round(suggestion.confidence * 100)}%
                </Badge>
              </div>
              <p className="text-xs text-gray-700 mt-2 italic">
                💡 {suggestion.reason}
              </p>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}