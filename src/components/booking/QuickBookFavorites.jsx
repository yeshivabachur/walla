import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Home, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

export default function QuickBookFavorites({ userEmail, onLocationSelect }) {
  const { data: locations = [] } = useQuery({
    queryKey: ['quickBookLocations', userEmail],
    queryFn: () => base44.entities.QuickBookLocation.filter({ user_email: userEmail })
  });

  const getIcon = (type) => {
    switch(type) {
      case 'home': return Home;
      case 'work': return Briefcase;
      default: return Star;
    }
  };

  const selectLocation = (location) => {
    onLocationSelect?.(location.address);
    toast.success('Location selected: ' + location.location_name);
  };

  if (locations.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Star className="w-4 h-4 text-yellow-600" />
          Quick Book Favorites
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {locations.slice(0, 4).map(loc => {
          const Icon = getIcon(loc.location_type);
          return (
            <Button
              key={loc.id}
              onClick={() => selectLocation(loc)}
              variant="outline"
              className="w-full justify-start"
            >
              <Icon className="w-4 h-4 mr-2" />
              {loc.location_name}
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}