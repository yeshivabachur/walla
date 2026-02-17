import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MapPin, ArrowRight, Clock, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function ProactiveRideAssistant({ userEmail }) {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [dismissed, setDismissed] = useState([]);

  const { data: patterns = [] } = useQuery({
    queryKey: ['ridePatterns', userEmail],
    queryFn: () => base44.entities.RidePattern.filter({ passenger_email: userEmail }),
    enabled: !!userEmail
  });

  const { data: pastRides = [] } = useQuery({
    queryKey: ['pastRidesForPatterns', userEmail],
    queryFn: () => base44.entities.RideRequest.filter({ passenger_email: userEmail, status: 'completed' }),
    enabled: !!userEmail
  });

  useEffect(() => {
    if (!userEmail || patterns.length === 0) return;

    const checkForSuggestions = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
      const currentTime = `${currentHour}:${currentMinute.toString().padStart(2, '0')}`;

      const relevant = patterns.filter(pattern => {
        if (dismissed.includes(pattern.id)) return false;
        
        // Check if it's the right day
        if (!pattern.typical_days?.includes(currentDay)) return false;
        
        // Check if it's within 30 minutes of typical time
        const [patternHour, patternMinute] = pattern.typical_time.split(':').map(Number);
        const patternTotalMinutes = patternHour * 60 + patternMinute;
        const currentTotalMinutes = currentHour * 60 + currentMinute;
        const diff = Math.abs(patternTotalMinutes - currentTotalMinutes);
        
        return diff <= 30 && pattern.ai_confidence >= 70;
      });

      setSuggestions(relevant);
    };

    checkForSuggestions();
    const interval = setInterval(checkForSuggestions, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [patterns, userEmail, dismissed]);

  const handleBookNow = (pattern) => {
    navigate(createPageUrl('RequestRide'), {
      state: {
        pickup_location: pattern.pickup_location,
        dropoff_location: pattern.dropoff_location
      }
    });
  };

  const handleDismiss = (patternId) => {
    setDismissed([...dismissed, patternId]);
  };

  if (suggestions.length === 0) return null;

  return (
    <AnimatePresence>
      {suggestions.map((suggestion, index) => (
        <motion.div
          key={suggestion.id}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ delay: index * 0.1 }}
          className="mb-4"
        >
          <Card className="border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <span className="font-semibold text-indigo-900">AI Suggestion</span>
                  <Badge className="bg-indigo-600 text-white">
                    {suggestion.ai_confidence}% confident
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDismiss(suggestion.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </Button>
              </div>

              <p className="text-sm text-gray-700 mb-3">
                Based on your {suggestion.pattern_type.replace('_', ' ')}, you usually take this ride around this time
              </p>

              <div className="flex items-center gap-2 mb-4 text-sm text-gray-900">
                <MapPin className="w-4 h-4 text-indigo-600" />
                <span className="font-medium">{suggestion.pickup_location}</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{suggestion.dropoff_location}</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-600 mb-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Usually at {suggestion.typical_time}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {suggestion.frequency} times before
                </span>
              </div>

              <Button
                onClick={() => handleBookNow(suggestion)}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                size="sm"
              >
                Book This Ride Now
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </AnimatePresence>
  );
}