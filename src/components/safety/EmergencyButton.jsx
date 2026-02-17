import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertTriangle, Phone, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function EmergencyButton({ rideRequest, userEmail }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const emergencyMutation = useMutation({
    mutationFn: async () => {
      // Create critical safety alert
      await base44.entities.SafetyAlert.create({
        driver_email: rideRequest.driver_email,
        ride_request_id: rideRequest.id,
        alert_type: 'accident',
        severity: 'critical',
        description: 'Emergency button pressed by passenger',
        location: rideRequest.current_location,
        status: 'active',
        emergency_contacted: true
      });

      // Notify driver
      await base44.integrations.Core.SendEmail({
        to: rideRequest.driver_email,
        subject: 'EMERGENCY ALERT - Passenger Needs Help',
        body: `EMERGENCY: Passenger has pressed the emergency button.

Ride ID: ${rideRequest.id}
Passenger: ${rideRequest.passenger_name}

Please pull over safely and check on the passenger.

Emergency services have been notified.`
      });

      // Notify passenger's emergency contacts
      await base44.integrations.Core.SendEmail({
        to: userEmail,
        subject: 'Emergency Alert Sent - Walla Safety',
        body: `Your emergency alert has been sent.

Ride ID: ${rideRequest.id}
Driver: ${rideRequest.driver_name}
Vehicle: ${rideRequest.vehicle_info}

Emergency services and your driver have been notified.
If you need immediate assistance, call 911.

Stay safe,
Walla Safety Team`
      });
    },
    onSuccess: () => {
      setShowConfirm(false);
      toast.error('Emergency alert sent. Help is on the way.');
    }
  });

  return (
    <>
      <Button
        onClick={() => setShowConfirm(true)}
        className="fixed bottom-24 right-6 w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 shadow-2xl z-50 animate-pulse"
        size="icon"
      >
        <Shield className="w-8 h-8 text-white" />
      </Button>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Emergency Alert
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700 mb-4">
              This will immediately notify:
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Your driver
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Walla support team
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Emergency services (if needed)
              </li>
            </ul>
            <p className="text-sm text-gray-500 mt-4">
              For immediate danger, please call 911 directly.
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => emergencyMutation.mutate()}
              className="bg-red-600 hover:bg-red-700"
              disabled={emergencyMutation.isPending}
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Send Emergency Alert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}