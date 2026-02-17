import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function IncidentDetection({ rideRequest, driverEmail }) {
  const [incidentDetected, setIncidentDetected] = useState(false);
  const [countdown, setCountdown] = useState(30);

  // Simulate incident detection based on sudden stops, impact, etc.
  useEffect(() => {
    if (rideRequest?.status !== 'in_progress') return;

    const checkInterval = setInterval(() => {
      // Simulate detection logic (in real app, this would use accelerometer data)
      const randomCheck = Math.random();
      if (randomCheck < 0.005) { // 0.5% chance per check for demo
        setIncidentDetected(true);
        setCountdown(30);
      }
    }, 5000);

    return () => clearInterval(checkInterval);
  }, [rideRequest]);

  // Countdown timer
  useEffect(() => {
    if (!incidentDetected || countdown <= 0) return;

    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [incidentDetected, countdown]);

  const notifyEmergencyMutation = useMutation({
    mutationFn: async () => {
      // Create critical safety alert
      await base44.entities.SafetyAlert.create({
        driver_email: driverEmail,
        ride_request_id: rideRequest.id,
        alert_type: 'accident',
        severity: 'critical',
        description: 'Possible incident detected - sudden impact or unusual vehicle behavior',
        location: rideRequest.current_location,
        status: 'active',
        emergency_contacted: true
      });

      // Notify emergency services (simulated)
      await base44.integrations.Core.SendEmail({
        to: rideRequest.passenger_email,
        subject: 'Emergency Alert - Walla Safety',
        body: `EMERGENCY ALERT

An incident has been detected during your ride.

Ride ID: ${rideRequest.id}
Driver: ${rideRequest.driver_name}
Location: ${rideRequest.current_location?.latitude}, ${rideRequest.current_location?.longitude}

Emergency services have been notified. A support representative will contact you shortly.

If you need immediate assistance, call 911.

- Walla Safety Team`
      });

      // Notify support
      await base44.integrations.Core.SendEmail({
        to: 'support@walla.com',
        subject: 'CRITICAL: Incident Detected',
        body: `Incident detected on ride ${rideRequest.id}. Immediate attention required.`
      });
    },
    onSuccess: () => {
      toast.error('Emergency services have been notified');
    }
  });

  useEffect(() => {
    if (countdown === 0 && incidentDetected) {
      notifyEmergencyMutation.mutate();
      setIncidentDetected(false);
    }
  }, [countdown]);

  const handleDismiss = () => {
    setIncidentDetected(false);
    setCountdown(30);
    toast.success('Incident alert dismissed');
  };

  if (!incidentDetected) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Card className="border-red-300 bg-red-50 shadow-lg">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-900 mb-2">Incident Detected</h3>
              <p className="text-sm text-red-800 mb-4">
                Unusual vehicle behavior detected. Emergency services will be automatically contacted in {countdown} seconds unless dismissed.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => notifyEmergencyMutation.mutate()}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={notifyEmergencyMutation.isPending}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Emergency Now
                </Button>
                <Button
                  onClick={handleDismiss}
                  variant="outline"
                  className="border-red-300"
                >
                  I'm OK - Dismiss
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}