import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock } from 'lucide-react';

export default function SmartDestinationWidget({ userEmail, onSelect }) {
  const [suggestion, setSuggestion] = useState(null);

  useEffect(() => {
    const getSuggestion = async () => {
      const hour = new Date().getHours();
      let destination = '';
      let reason = '';

      if (hour >= 7 && hour < 9) {
        destination = 'Work';
        reason = 'Morning commute time';
      } else if (hour >= 17 && hour < 19) {
        destination = 'Home';
        reason = 'Evening commute time';
      } else if (hour >= 12 && hour < 13) {
        destination = 'Nearby restaurants';
        reason = 'Lunch time';
      }

      if (destination) {
        await base44.entities.SmartDestinationSuggestion.create({
          user_email: userEmail,
          suggested_destination: destination,
          reason,
          confidence: 0.85,
          based_on: 'time',
          accepted: false
        });
        setSuggestion({ destination, reason });
      }
    };

    getSuggestion();
  }, [userEmail]);

  if (!suggestion) return null;

  return (
    <Card className="border-2 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-blue-600" />
          Suggested Destination
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="font-semibold">{suggestion.destination}</p>
        <p className="text-xs text-gray-600 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {suggestion.reason}
        </p>
        <Button onClick={() => onSelect(suggestion.destination)} size="sm" className="w-full">
          Use This Destination
        </Button>
      </CardContent>
    </Card>
  );
}