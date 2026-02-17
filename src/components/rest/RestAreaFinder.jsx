import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coffee, Star } from 'lucide-react';

export default function RestAreaFinder({ currentLocation }) {
  const { data: restAreas = [] } = useQuery({
    queryKey: ['restAreas'],
    queryFn: () => base44.entities.RestArea.list()
  });

  if (restAreas.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Coffee className="w-4 h-4 text-brown-600" />
          Nearby Rest Areas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {restAreas.slice(0, 3).map(area => (
          <div key={area.id} className="bg-amber-50 rounded p-2">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold">{area.area_name}</p>
                <p className="text-xs text-gray-600">{area.location}</p>
              </div>
              {area.rating && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  {area.rating}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}