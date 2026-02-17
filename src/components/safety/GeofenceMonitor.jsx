import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, AlertTriangle } from 'lucide-react';

export default function GeofenceMonitor({ rideRequestId }) {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const checkGeofence = async () => {
      navigator.geolocation.getCurrentPosition(async (position) => {
        // Simulated geofence check
        const result = await base44.entities.GeofenceAlert.create({
          ride_request_id: rideRequestId,
          geofence_name: 'Home Zone',
          alert_type: 'exited',
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          },
          timestamp: new Date().toISOString(),
          notification_sent: true
        });
        setAlerts([result]);
      });
    };

    const interval = setInterval(checkGeofence, 60000);
    return () => clearInterval(interval);
  }, [rideRequestId]);

  if (alerts.length === 0) return null;

  return (
    <Card className="border-2 border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-yellow-600" />
          Geofence Alert
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.map(alert => (
          <div key={alert.id} className="flex items-center justify-between">
            <span className="text-sm">{alert.alert_type} {alert.geofence_name}</span>
            <Badge className="bg-yellow-600">{alert.alert_type}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}