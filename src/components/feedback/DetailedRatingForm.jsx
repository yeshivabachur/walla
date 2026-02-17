import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from 'lucide-react';
import { toast } from 'sonner';

export default function DetailedRatingForm({ rideRequestId, reviewerEmail, targetEmail }) {
  const [ratings, setRatings] = useState({
    overall: 0,
    punctuality: 0,
    cleanliness: 0,
    communication: 0,
    safety: 0,
    professionalism: 0
  });
  const [comments, setComments] = useState('');

  const submitMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.DetailedFeedback.create({
        ride_request_id: rideRequestId,
        reviewer_email: reviewerEmail,
        target_email: targetEmail,
        rating: ratings.overall,
        categories: {
          punctuality: ratings.punctuality,
          cleanliness: ratings.cleanliness,
          communication: ratings.communication,
          safety: ratings.safety,
          professionalism: ratings.professionalism
        },
        comments,
        tags: []
      });
    },
    onSuccess: () => {
      toast.success('Feedback submitted!');
      setComments('');
    }
  });

  const RatingRow = ({ label, value, onChange }) => (
    <div className="flex justify-between items-center">
      <span className="text-sm">{label}</span>
      <div className="flex gap-1">
        {[1,2,3,4,5].map(n => (
          <Star
            key={n}
            className={`w-4 h-4 cursor-pointer ${n <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            onClick={() => onChange(n)}
          />
        ))}
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Rate Your Experience</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <RatingRow label="Overall" value={ratings.overall} onChange={(v) => setRatings({...ratings, overall: v})} />
        <RatingRow label="Punctuality" value={ratings.punctuality} onChange={(v) => setRatings({...ratings, punctuality: v})} />
        <RatingRow label="Cleanliness" value={ratings.cleanliness} onChange={(v) => setRatings({...ratings, cleanliness: v})} />
        <RatingRow label="Communication" value={ratings.communication} onChange={(v) => setRatings({...ratings, communication: v})} />
        <RatingRow label="Safety" value={ratings.safety} onChange={(v) => setRatings({...ratings, safety: v})} />
        <RatingRow label="Professionalism" value={ratings.professionalism} onChange={(v) => setRatings({...ratings, professionalism: v})} />
        
        <Textarea
          placeholder="Additional comments..."
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows={3}
        />
        <Button onClick={() => submitMutation.mutate()} disabled={ratings.overall === 0} className="w-full">
          Submit Feedback
        </Button>
      </CardContent>
    </Card>
  );
}