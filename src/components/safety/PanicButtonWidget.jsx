import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertOctagon } from 'lucide-react';
import { toast } from 'sonner';

export default function PanicButtonWidget({ rideRequestId, userEmail }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const panicMutation = useMutation({
    mutationFn: async () => {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      return await base44.entities.PanicButton.create({
        triggered_by: userEmail,
        ride_request_id: rideRequestId,
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        },
        timestamp: new Date().toISOString(),
        response_status: 'triggered'
      });
    },
    onSuccess: () => {
      toast.error('Emergency services notified. Help is on the way.');
      setShowConfirm(false);
    }
  });

  return (
    <>
      <Button
        onClick={() => setShowConfirm(true)}
        className="fixed bottom-20 right-4 w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 shadow-2xl z-50"
        size="lg"
      >
        <AlertOctagon className="w-8 h-8 text-white" />
      </Button>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <AlertOctagon className="w-5 h-5" />
              Emergency Alert
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              Are you in immediate danger? This will notify emergency services and your emergency contacts.
            </p>
            <div className="flex gap-2">
              <Button onClick={() => setShowConfirm(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={() => panicMutation.mutate()} 
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Yes, Alert Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}