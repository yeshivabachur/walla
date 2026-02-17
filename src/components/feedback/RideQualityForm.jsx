import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from 'lucide-react';
import { toast } from 'sonner';

export default function RideQualityForm({ rideRequestId, userEmail, onComplete }) {
  const [ratings, setRatings] = useState({
    cleanliness: 5,
    comfort: 5,
    safety: 5,
    overall: 5
  });
  const [suggestions, setSuggestions] = useState('');

  const submitMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.RideQualityFeedback.create({
        ride_request_id: rideRequestId,
        user_email: userEmail,
        cleanliness_rating: ratings.cleanliness,
        comfort_rating: ratings.comfort,
        driving_safety_rating: ratings.safety,
        overall_experience: ratings.overall,
        suggestions
      });
    },
    onSuccess: () => {
      toast.success('Feedback submitted');
      onComplete?.();
    }
  });

  const StarRating = ({ value, onChange, label }) => (
    <div className="space-y-1">
      <p className="text-sm text-gray-600">{label}</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`w-5 h-5 cursor-pointer ${star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            onClick={() => onChange(star)}
          />
        ))}
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Rate Your Ride Quality</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <StarRating label="Cleanliness" value={ratings.cleanliness} onChange={(v) => setRatings({...ratings, cleanliness: v})} />
        <StarRating label="Comfort" value={ratings.comfort} onChange={(v) => setRatings({...ratings, comfort: v})} />
        <StarRating label="Driving Safety" value={ratings.safety} onChange={(v) => setRatings({...ratings, safety: v})} />
        <StarRating label="Overall Experience" value={ratings.overall} onChange={(v) => setRatings({...ratings, overall: v})} />
        <Textarea
          placeholder="Suggestions for improvement..."
          value={suggestions}
          onChange={(e) => setSuggestions(e.target.value)}
          rows={2}
        />
        <Button onClick={() => submitMutation.mutate()} className="w-full" size="sm">
          Submit Feedback
        </Button>
      </CardContent>
    </Card>
  );
}