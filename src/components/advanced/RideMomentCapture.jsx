import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Share2 } from 'lucide-react';
import { toast } from 'sonner';

export default function RideMomentCapture({ rideRequestId }) {
  const [capturing, setCapturing] = useState(false);

  const captureMutation = useMutation({
    mutationFn: async () => {
      // Simulate capture
      const file = new File([''], 'moment.jpg', { type: 'image/jpeg' });
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      return await base44.entities.RideMomentCapture.create({
        ride_request_id: rideRequestId,
        moment_type: 'scenic_view',
        photo_url: file_url,
        location: 'Current Location',
        shared: false
      });
    },
    onSuccess: () => {
      toast.success('Moment captured!');
      setCapturing(false);
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Camera className="w-4 h-4 text-indigo-600" />
          Capture Ride Moment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={() => captureMutation.mutate()} 
          disabled={capturing}
          className="w-full"
          size="sm"
        >
          <Camera className="w-4 h-4 mr-2" />
          Capture Moment
        </Button>
      </CardContent>
    </Card>
  );
}