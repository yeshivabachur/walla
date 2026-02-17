import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function RideNotesPanel({ rideRequestId, userEmail }) {
  const queryClient = useQueryClient();
  const [note, setNote] = useState('');

  const { data: notes = [] } = useQuery({
    queryKey: ['rideNotes', rideRequestId],
    queryFn: () => base44.entities.RideNote.filter({ ride_request_id: rideRequestId })
  });

  const addNoteMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.RideNote.create({
        ride_request_id: rideRequestId,
        author_email: userEmail,
        note_type: 'special',
        content: note,
        private: false
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['rideNotes']);
      setNote('');
      toast.success('Note added');
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <FileText className="w-4 h-4 text-gray-600" />
          Ride Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Textarea
          placeholder="Add a note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
        />
        <Button size="sm" onClick={() => addNoteMutation.mutate()} disabled={!note.trim()}>
          Add Note
        </Button>
        {notes.map(n => (
          <div key={n.id} className="bg-gray-50 rounded p-2 text-xs">
            <p className="text-gray-700">{n.content}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}