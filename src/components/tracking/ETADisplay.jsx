import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Clock, MapPin, TrendingDown, Loader2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
};

export default function ETADisplay({ currentLocation, destination, status }) {
  if (!currentLocation?.latitude || !destination?.latitude || status !== 'in_progress') {
    return null;
  }

  const distance = calculateDistance(
    currentLocation.latitude,
    currentLocation.longitude,
    destination.latitude,
    destination.longitude
  );

  // Use AI for predictive ETA
  const { data: etaData, isLoading } = useQuery({
    queryKey: ['predictiveETA', currentLocation.latitude, destination.latitude],
    queryFn: async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Calculate predictive ETA for ride in progress:

Distance remaining: ${distance.toFixed(1)} km
Current time: ${new Date().toLocaleTimeString()}
Day: ${new Date().toLocaleDateString('en-US', { weekday: 'long' })}

Consider:
1. Time of day traffic patterns
2. Day of week patterns
3. Typical delays on urban routes
4. Historical data for this time

Provide realistic ETA in minutes and confidence level.`,
        response_json_schema: {
          type: 'object',
          properties: {
            estimated_minutes: { type: 'number' },
            confidence: { type: 'string' },
            factors: { type: 'string' }
          }
        }
      });
      return result;
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const estimatedMinutes = etaData?.estimated_minutes || Math.round((distance / 60) * 60);
  const estimatedHours = Math.floor(estimatedMinutes / 60);
  const remainingMinutes = estimatedMinutes % 60;

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
            {isLoading ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Clock className="w-6 h-6 text-white" />}
          </div>
          <div>
            <p className="text-sm text-gray-600">Predictive ETA</p>
            <p className="text-2xl font-bold text-gray-900">
              {estimatedHours > 0 ? `${estimatedHours}h ${remainingMinutes}m` : `${remainingMinutes} min`}
            </p>
            {etaData?.confidence && (
              <p className="text-xs text-gray-500">{etaData.confidence} confidence</p>
            )}
          </div>
        </div>
        <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
          <TrendingDown className="w-3 h-3 mr-1" />
          En Route
        </Badge>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <MapPin className="w-4 h-4" />
        <span>{distance.toFixed(1)} km remaining</span>
      </div>

      {etaData?.factors && (
        <div className="mt-3 pt-3 border-t border-indigo-200">
          <p className="text-xs text-gray-600">
            <span className="font-medium">Factors:</span> {etaData.factors}
          </p>
        </div>
      )}

      {currentLocation.timestamp && (
        <div className="mt-2">
          <p className="text-xs text-gray-500">
            Last updated: {new Date(currentLocation.timestamp).toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  );
}