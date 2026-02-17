import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from "@/components/ui/card";
import { Star } from 'lucide-react';

export default function DriverRatingDisplay({ driverEmail }) {
  const { data: rating } = useQuery({
    queryKey: ['driverRating', driverEmail],
    queryFn: async () => {
      const ratings = await base44.entities.DriverRating.filter({ driver_email: driverEmail });
      return ratings[0];
    }
  });

  if (!rating) return null;

  return (
    <Card className="border-2 border-yellow-200 bg-yellow-50">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-600 fill-yellow-600" />
            <span className="text-2xl font-bold">{rating.average_rating.toFixed(2)}</span>
          </div>
          <div className="text-right text-xs text-gray-600">
            <p>{rating.total_ratings} ratings</p>
            <p>{rating.five_star_count} ★★★★★</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}