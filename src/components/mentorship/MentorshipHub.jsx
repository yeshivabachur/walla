import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Users, Award, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function MentorshipHub({ driverEmail }) {
  const queryClient = useQueryClient();

  const { data: mentorships = [] } = useQuery({
    queryKey: ['mentorships', driverEmail],
    queryFn: () => base44.entities.DriverMentorship.filter({
      $or: [{ mentor_email: driverEmail }, { mentee_email: driverEmail }]
    })
  });

  const requestMentorMutation = useMutation({
    mutationFn: async () => {
      await base44.entities.DriverMentorship.create({
        mentor_email: 'senior.driver@example.com',
        mentee_email: driverEmail,
        status: 'active',
        focus_areas: ['Navigation', 'Customer Service', 'Route Optimization']
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['mentorships']);
      toast.success('Mentor assigned! Check your dashboard for session details.');
    }
  });

  const activeMentorship = mentorships.find(m => m.status === 'active');
  const isMentor = activeMentorship?.mentor_email === driverEmail;
  const isMentee = activeMentorship?.mentee_email === driverEmail;

  return (
    <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-indigo-600" />
          Mentorship Program
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activeMentorship ? (
          <>
            <div className="bg-white rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <Badge className={isMentor ? 'bg-purple-600' : 'bg-indigo-600'}>
                  {isMentor ? 'Mentor' : 'Mentee'}
                </Badge>
                <Badge variant="outline" className="border-green-500 text-green-700">
                  Active
                </Badge>
              </div>
              <p className="text-sm text-gray-700 mb-1">
                {isMentor ? 'Mentoring' : 'Learning from'}: {isMentor ? activeMentorship.mentee_email : activeMentorship.mentor_email}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-600 mt-2">
                <div className="flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  <span>{activeMentorship.sessions_completed} sessions</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Progress: {activeMentorship.mentee_progress}%</span>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
              <p className="text-xs font-semibold text-indigo-800 mb-2">Focus Areas</p>
              <div className="flex flex-wrap gap-1">
                {activeMentorship.focus_areas?.map((area, idx) => (
                  <Badge key={idx} className="bg-indigo-100 text-indigo-800 text-xs">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white rounded-lg p-4 text-center">
              <Users className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
              <p className="text-sm text-gray-700 mb-3">
                Get paired with an experienced driver to improve your skills
              </p>
              <Button
                onClick={() => requestMentorMutation.mutate()}
                disabled={requestMentorMutation.isPending}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                Request a Mentor
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}