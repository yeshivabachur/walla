import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, TrendingUp, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function EventRideRecommendations({ userLocation }) {
  const navigate = useNavigate();

  const { data: events } = useQuery({
    queryKey: ['upcomingEvents'],
    queryFn: async () => {
      // Get AI recommendations for local events
      const recommendations = await base44.integrations.Core.InvokeLLM({
        prompt: `Find major upcoming events (concerts, sports, festivals) in the next 7 days near ${userLocation}. Return top 3 events with: name, type, venue, date (YYYY-MM-DD HH:mm), and surge warning (true if high demand expected).`,
        add_context_from_internet: true,
        response_json_schema: {
          type: 'object',
          properties: {
            events: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  type: { type: 'string' },
                  venue: { type: 'string' },
                  date: { type: 'string' },
                  surge_warning: { type: 'boolean' }
                }
              }
            }
          }
        }
      });

      return recommendations.events || [];
    },
    enabled: !!userLocation
  });

  if (!events || events.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          Upcoming Events Near You
        </h3>
        <p className="text-sm text-gray-600">Book ahead to avoid surge pricing</p>
      </div>
      
      <div className="space-y-3">
        {events.map((event, i) => (
          <Card key={i} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{event.name}</h4>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {event.venue}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {format(new Date(event.date), 'MMM d, h:mm a')}
                    </p>
                  </div>
                </div>
                {event.surge_warning && (
                  <Badge className="bg-orange-100 text-orange-800">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    High Demand
                  </Badge>
                )}
              </div>
              <Button
                onClick={() => navigate(createPageUrl('RequestRide'))}
                size="sm"
                variant="outline"
                className="w-full rounded-lg mt-2"
              >
                Book Ride
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}