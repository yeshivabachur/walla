import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Calendar } from 'lucide-react';

export default function HolidayBonusTracker({ driverEmail }) {
  const { data: bonuses = [] } = useQuery({
    queryKey: ['holidayBonuses'],
    queryFn: async () => {
      const upcoming = await base44.entities.HolidaySurgeSchedule.filter({
        date: { $gte: new Date().toISOString().split('T')[0] }
      });
      return upcoming.slice(0, 3);
    }
  });

  if (bonuses.length === 0) return null;

  return (
    <Card className="border-2 border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Gift className="w-4 h-4 text-green-600" />
          Upcoming Holiday Bonuses
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {bonuses.map(bonus => (
          <div key={bonus.id} className="bg-white rounded p-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold">{bonus.holiday_name}</p>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {bonus.date}
                </p>
              </div>
              <Badge className="bg-green-600">{bonus.surge_multiplier}x</Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}