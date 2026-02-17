import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Popup, useMap } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import 'leaflet/dist/leaflet.css';

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 11);
    }
  }, [center, map]);
  return null;
}

export default function SurgePricingMap({ userLocation, onZoneClick, className = "" }) {
  const [mapCenter] = useState([37.7749, -122.4194]); // San Francisco
  const [selectedZone, setSelectedZone] = useState(null);

  const { data: surgeZones = [] } = useQuery({
    queryKey: ['surgeZones'],
    queryFn: () => base44.entities.SurgeZone.list(),
    refetchInterval: 10000
  });

  const { data: pendingRequests = [] } = useQuery({
    queryKey: ['pendingRequestsCount'],
    queryFn: () => base44.entities.RideRequest.filter({ status: 'pending' })
  });

  // Calculate surge for each zone based on demand
  const getZoneColor = (multiplier) => {
    if (multiplier >= 2.0) return '#dc2626'; // red
    if (multiplier >= 1.5) return '#ea580c'; // orange
    if (multiplier >= 1.2) return '#f59e0b'; // yellow
    return '#10b981'; // green
  };

  const getZoneLabel = (multiplier) => {
    if (multiplier >= 2.0) return 'Very High Surge';
    if (multiplier >= 1.5) return 'High Surge';
    if (multiplier >= 1.2) return 'Moderate Surge';
    return 'Normal';
  };

  // Notify when surge drops (simulated)
  useEffect(() => {
    const checkSurgeDrops = () => {
      surgeZones.forEach(zone => {
        if (zone.current_multiplier < 1.3 && zone.demand_level !== 'low') {
          // Simulate push notification
          console.log(`Surge dropped in ${zone.zone_name}!`);
        }
      });
    };
    
    const interval = setInterval(checkSurgeDrops, 30000);
    return () => clearInterval(interval);
  }, [surgeZones]);

  const calculateEstimatedFare = (basePrice, multiplier) => {
    return (basePrice * multiplier).toFixed(2);
  };

  return (
    <Card className={`border-0 shadow-lg ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          Live Surge Pricing Map
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-blue-200 bg-blue-50">
          <AlertDescription className="text-sm text-blue-800 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Click zones to see estimated fares with surge pricing. We'll notify you when surge drops.
          </AlertDescription>
        </Alert>

        {selectedZone && (
          <Alert className="border-indigo-200 bg-indigo-50">
            <AlertDescription className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-indigo-900">{selectedZone.zone_name}</span>
                <Badge className="bg-indigo-600 text-white">
                  {selectedZone.current_multiplier}x Surge
                </Badge>
              </div>
              <div className="text-sm text-indigo-800 space-y-1">
                <div className="flex justify-between">
                  <span>Base Fare ($15):</span>
                  <span className="font-semibold">${calculateEstimatedFare(15, selectedZone.current_multiplier)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Base Fare ($25):</span>
                  <span className="font-semibold">${calculateEstimatedFare(25, selectedZone.current_multiplier)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Base Fare ($40):</span>
                  <span className="font-semibold">${calculateEstimatedFare(40, selectedZone.current_multiplier)}</span>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="h-[400px] rounded-xl overflow-hidden">
          <MapContainer
            center={mapCenter}
            zoom={11}
            style={{ width: '100%', height: '100%' }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <MapUpdater center={mapCenter} />

            {surgeZones.map((zone) => (
              <Circle
                key={zone.id}
                center={[zone.center_coords.latitude, zone.center_coords.longitude]}
                radius={(zone.radius_km || 2) * 1000}
                fillColor={getZoneColor(zone.current_multiplier)}
                fillOpacity={0.4}
                color={getZoneColor(zone.current_multiplier)}
                weight={3}
                eventHandlers={{
                  click: () => {
                    setSelectedZone(zone);
                    if (onZoneClick) onZoneClick(zone);
                  }
                }}
              >
                <Popup>
                  <div className="p-3 min-w-[200px]">
                    <p className="font-bold text-gray-900 text-base mb-2">{zone.zone_name}</p>
                    <p className="text-sm text-gray-600 mb-3">
                      {getZoneLabel(zone.current_multiplier)}
                    </p>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Surge:</span>
                        <Badge className={`${
                          zone.current_multiplier >= 1.5 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {zone.current_multiplier}x
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Active Requests:</span>
                        <span className="font-semibold">{zone.active_requests}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Available Drivers:</span>
                        <span className="font-semibold">{zone.available_drivers}</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t space-y-1">
                      <p className="text-xs font-semibold text-gray-700">Estimated Fares:</p>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Short ride ($15):</span>
                        <span className="font-bold text-indigo-600">${calculateEstimatedFare(15, zone.current_multiplier)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Medium ride ($25):</span>
                        <span className="font-bold text-indigo-600">${calculateEstimatedFare(25, zone.current_multiplier)}</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Circle>
            ))}
          </MapContainer>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500" />
            <span className="text-xs text-gray-600">Normal (1.0-1.1x)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500" />
            <span className="text-xs text-gray-600">Moderate (1.2-1.4x)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-500" />
            <span className="text-xs text-gray-600">High (1.5-1.9x)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-600" />
            <span className="text-xs text-gray-600">Very High (2.0x+)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}