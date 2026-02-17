import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function CalendarIntegration({ userEmail }) {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const loadEvents = async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate upcoming calendar events for user.

User: ${userEmail}
Date: ${new Date().toLocaleDateString()}

Create 2 realistic events with:
1. Event title
2. Location
3. Time
4. Suggested departure time`,
        response_json_schema: {
          type: 'object',
          properties: {
            events: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  location: { type: 'string' },
                  time: { type: 'string' },
                  departure_time: { type: 'string' }
                }
              }
            }
          }
        }
      });

      setEvents(result.events || []);

      for (const event of result.events || []) {
        await base44.entities.CalendarEvent.create({
          user_email: userEmail,
          event_title: event.title,
          event_location: event.location,
          event_time: new Date().toISOString(),
          ride_suggested: true,
          suggested_departure_time: new Date().toISOString()
        });
      }
    };

    loadEvents();
  }, [userEmail]);

  if (events.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-indigo-600" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {events.map((event, idx) => (
          <div key={idx} className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
            <p className="font-semibold text-sm">{event.title}</p>
            <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3" />
              {event.location}
            </p>
            <p className="text-xs text-gray-500 mt-1">Depart: {event.departure_time}</p>
            <Button
              size="sm"
              className="w-full mt-2"
              onClick={() => navigate(createPageUrl('RequestRide'), {
                state: { dropoff_location: event.location }
              })}
            >
              Book Ride
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}