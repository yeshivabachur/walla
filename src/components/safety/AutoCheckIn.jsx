import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Bell, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function AutoCheckIn({ rideRequest, userEmail }) {
  const [checkInRequired, setCheckInRequired] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes

  const checkInMutation = useMutation({
    mutationFn: async (status) => {
      await base44.entities.SafetyCheckIn.create({
        ride_request_id: rideRequest.id,
        user_email: userEmail,
        check_in_time: new Date().toISOString(),
        location: rideRequest.current_location,
        status: status,
        response_required: status !== 'ok',
        responded: true
      });

      if (status === 'needs_help' || status === 'emergency') {
        // Notify emergency contacts
        await base44.integrations.Core.SendEmail({
          to: 'support@walla.com',
          subject: `URGENT: Safety Check-In ${status}`,
          body: `User ${userEmail} requires assistance.
          
Ride ID: ${rideRequest.id}
Status: ${status}
Location: ${JSON.stringify(rideRequest.current_location)}

Immediate action required.`
        });
      }
    },
    onSuccess: (_, status) => {
      setCheckInRequired(false);
      setTimeRemaining(300);
      if (status === 'ok') {
        toast.success('Check-in complete. Stay safe!');
      } else {
        toast.success('Help is on the way. Stay calm.');
      }
    }
  });

  useEffect(() => {
    if (rideRequest.status !== 'in_progress') return;

    // Check in every 5 minutes
    const checkInInterval = setInterval(() => {
      setCheckInRequired(true);
      setTimeRemaining(300);
    }, 300000); // 5 minutes

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          // Auto check-in as OK if no response
          checkInMutation.mutate('ok');
          return 300;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(checkInInterval);
      clearInterval(countdownInterval);
    };
  }, [rideRequest.status]);

  if (!checkInRequired) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <Card className="border-0 shadow-2xl max-w-md w-full">
        <CardContent className="p-6 space-y-4">
          <div className="text-center">
            <Shield className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Safety Check-In</h3>
            <p className="text-gray-600 mb-4">
              Are you okay? Please respond within {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </p>
          </div>

          <div className="space-y-2">
            <Button
              onClick={() => checkInMutation.mutate('ok')}
              disabled={checkInMutation.isPending}
              className="w-full bg-green-600 hover:bg-green-700 rounded-xl h-12"
            >
              ✓ I'm OK
            </Button>
            <Button
              onClick={() => checkInMutation.mutate('needs_help')}
              disabled={checkInMutation.isPending}
              variant="outline"
              className="w-full rounded-xl h-12 border-orange-500 text-orange-600 hover:bg-orange-50"
            >
              <Bell className="w-4 h-4 mr-2" />
              I Need Help
            </Button>
            <Button
              onClick={() => checkInMutation.mutate('emergency')}
              disabled={checkInMutation.isPending}
              variant="outline"
              className="w-full rounded-xl h-12 border-red-500 text-red-600 hover:bg-red-50"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Emergency
            </Button>
          </div>

          <p className="text-xs text-center text-gray-500">
            If no response, we'll automatically check you in as OK
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}