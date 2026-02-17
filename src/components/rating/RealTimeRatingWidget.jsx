import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function RealTimeRatingWidget({ rideRequestId, userEmail }) {
  const [ratings, setRatings] = useState({
    driving: 0,
    cleanliness: 0,
    comfort: 0,
    professionalism: 0
  });

  const ratingMutation = useMutation({
    mutationFn: async ({ type, rating }) => {
      await base44.entities.RealTimeRating.create({
        ride_request_id: rideRequestId,
        rater_email: userEmail,
        rating_type: type,
        rating,
        timestamp: new Date().toISOString(),
        anonymous: true
      });
    },
    onSuccess: () => {
      toast.success('Thank you for your feedback!');
    }
  });

  const handleRate = (type, rating) => {
    setRatings(prev => ({ ...prev, [type]: rating }));
    ratingMutation.mutate({ type, rating });
  };

  const categories = [
    { key: 'driving', label: 'Driving' },
    { key: 'cleanliness', label: 'Cleanliness' },
    { key: 'comfort', label: 'Comfort' },
    { key: 'professionalism', label: 'Service' }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <ThumbsUp className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-gray-900">Rate Your Experience</span>
          </div>

          {categories.map(({ key, label }) => (
            <div key={key} className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-2">{label}</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => handleRate(key, star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= ratings[key]
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}