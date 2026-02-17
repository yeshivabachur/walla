import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp } from 'lucide-react';

export default function DriverTeamDashboard({ driverEmail }) {
  const { data: teams = [] } = useQuery({
    queryKey: ['driverTeams', driverEmail],
    queryFn: async () => {
      const allTeams = await base44.entities.DriverTeam.list();
      return allTeams.filter(t => 
        t.leader_email === driverEmail || t.member_emails?.includes(driverEmail)
      );
    }
  });

  if (teams.length === 0) return null;

  const team = teams[0];

  return (
    <Card className="border-2 border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-green-600" />
          Team: {team.team_name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Members</span>
            <Badge>{team.member_emails?.length || 0}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Team Earnings</span>
            <span className="font-bold text-green-700">${team.team_earnings || 0}</span>
          </div>
          {team.zone && (
            <div className="flex justify-between items-center">
              <span className="text-sm">Zone</span>
              <Badge variant="outline">{team.zone}</Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}