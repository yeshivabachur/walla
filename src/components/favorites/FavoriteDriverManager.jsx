import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, X } from 'lucide-react';
import { toast } from 'sonner';

export default function FavoriteDriverManager({ userEmail }) {
  const queryClient = useQueryClient();

  const { data: favorites = [] } = useQuery({
    queryKey: ['favoriteDrivers', userEmail],
    queryFn: () => base44.entities.FavoriteDriver.filter({ passenger_email: userEmail })
  });

  const removeMutation = useMutation({
    mutationFn: async (id) => {
      await base44.entities.FavoriteDriver.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['favoriteDrivers']);
      toast.success('Driver removed from favorites');
    }
  });

  if (favorites.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Star className="w-4 h-4 text-yellow-600 fill-yellow-600" />
          Favorite Drivers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {favorites.map(fav => (
          <div key={fav.id} className="bg-yellow-50 rounded-lg p-2 flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">{fav.driver_name}</p>
              <p className="text-xs text-gray-600">{fav.rides_together} rides together</p>
              {fav.average_rating && (
                <p className="text-xs text-gray-600">★ {fav.average_rating.toFixed(1)}</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeMutation.mutate(fav.id)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}