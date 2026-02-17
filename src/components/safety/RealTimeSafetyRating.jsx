import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Star } from 'lucide-react';
import { toast } from 'sonner';

export default function RealTimeSafetyRating({ rideRequestId, userEmail }) {
  const [rating, setRating] = useState(0);

  const submitRating = async () => {
    await base44.entities.SafetyRating.create({
      ride_request_id: rideRequestId,
      rater_email: userEmail,
      safety_score: rating,
      categories: {
        driving_safety: rating,
        vehicle_condition: rating,
        route_safety: rating,
        overall_comfort: rating
      }
    });

    toast.success('Safety rating submitted');
  };

  return (
    <Card className="border-2 border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Shield className="w-4 h-4 text-green-600" />
          Rate Safety (Real-time)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-3">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className="focus:outline-none"
            >
              <Star
                className={`w-6 h-6 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
              />
            </button>
          ))}
        </div>
        <Button onClick={submitRating} disabled={rating === 0} size="sm" className="w-full">
          Submit Safety Rating
        </Button>
      </CardContent>
    </Card>
  );
}