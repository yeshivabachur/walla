import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar } from 'lucide-react';

export default function MentorshipProgram({ driverEmail }) {
  const { data: sessions = [] } = useQuery({
    queryKey: ['mentorshipSessions', driverEmail],
    queryFn: async () => {
      const all = await base44.entities.MentorshipSession.list();
      return all.filter(s => s.mentor_email === driverEmail || s.mentee_email === driverEmail);
    }
  });

  if (sessions.length === 0) return null;

  const isMentor = sessions[0]?.mentor_email === driverEmail;

  return (
    <Card className="border-2 border-indigo-200 bg-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-indigo-600" />
          {isMentor ? 'Mentoring' : 'Learning Program'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {sessions.slice(0, 2).map(session => (
          <div key={session.id} className="bg-white rounded p-2">
            <p className="text-xs font-semibold">
              {isMentor ? `Mentee: ${session.mentee_email}` : `Mentor: ${session.mentor_email}`}
            </p>
            {session.next_session && (
              <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                <Calendar className="w-3 h-3" />
                Next: {new Date(session.next_session).toLocaleDateString()}
              </p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}