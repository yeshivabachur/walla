import React, { useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';

export default function DriverLocationTracker({ driverEmail, isActive }) {
  const updateLocationMutation = useMutation({
    mutationFn: async (position) => {
      return await base44.entities.DriverLocation.create({
        driver_email: driverEmail,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        heading: position.coords.heading || 0,
        speed: position.coords.speed || 0,
        timestamp: new Date().toISOString(),
        available: isActive
      });
    }
  });

  useEffect(() => {
    if (!isActive) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        updateLocationMutation.mutate(position);
      },
      (error) => console.error('Location error:', error),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isActive, driverEmail]);

  return null;
}