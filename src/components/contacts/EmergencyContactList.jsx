import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

export default function EmergencyContactList({ userEmail }) {
  const queryClient = useQueryClient();
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '' });

  const { data: contacts = [] } = useQuery({
    queryKey: ['emergencyContacts', userEmail],
    queryFn: () => base44.entities.EmergencyContact.filter({ user_email: userEmail })
  });

  const addMutation = useMutation({
    mutationFn: async (data) => {
      return await base44.entities.EmergencyContact.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['emergencyContacts']);
      setNewContact({ name: '', phone: '', relationship: '' });
      toast.success('Emergency contact added');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await base44.entities.EmergencyContact.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['emergencyContacts']);
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="w-5 h-5 text-red-600" />
          Emergency Contacts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {contacts.map(contact => (
          <div key={contact.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
            <div>
              <p className="font-semibold">{contact.contact_name}</p>
              <p className="text-sm text-gray-600">{contact.contact_phone}</p>
              <p className="text-xs text-gray-500">{contact.relationship}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteMutation.mutate(contact.id)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        
        <div className="space-y-2 pt-2 border-t">
          <Input
            placeholder="Name"
            value={newContact.name}
            onChange={(e) => setNewContact({...newContact, name: e.target.value})}
          />
          <Input
            placeholder="Phone"
            value={newContact.phone}
            onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
          />
          <Input
            placeholder="Relationship"
            value={newContact.relationship}
            onChange={(e) => setNewContact({...newContact, relationship: e.target.value})}
          />
          <Button
            className="w-full"
            onClick={() => addMutation.mutate({
              user_email: userEmail,
              ...newContact
            })}
            disabled={!newContact.name || !newContact.phone}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}