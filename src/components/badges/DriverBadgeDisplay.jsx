import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award } from 'lucide-react';

export default function DriverBadgeDisplay({ driverEmail }) {
  const { data: badges = [] } = useQuery({
    queryKey: ['driverBadges', driverEmail],
    queryFn: () => base44.entities.DriverBadge.filter({ driver_email: driverEmail, display_on_profile: true })
  });

  if (badges.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Award className="w-4 h-4 text-yellow-600" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {badges.map(badge => (
            <Badge key={badge.id} className="bg-yellow-500 hover:bg-yellow-600 capitalize">
              {badge.badge_type.replace('_', ' ')}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}