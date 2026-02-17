import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Shield, Plus, X, Phone } from 'lucide-react';
import { toast } from 'sonner';

export default function EmergencyContactManager({ userEmail }) {
  const [showForm, setShowForm] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', email: '', relationship: '', primary: false });
  const queryClient = useQueryClient();

  const { data: emergencyData } = useQuery({
    queryKey: ['emergencyContacts', userEmail],
    queryFn: async () => {
      const contacts = await base44.entities.EmergencyContact.filter({ user_email: userEmail });
      if (contacts[0]) return contacts[0];
      
      return await base44.entities.EmergencyContact.create({
        user_email: userEmail,
        contacts: [],
        auto_share_trips: false
      });
    },
    enabled: !!userEmail
  });

  const addContactMutation = useMutation({
    mutationFn: async () => {
      const updatedContacts = [...(emergencyData.contacts || []), newContact];
      await base44.entities.EmergencyContact.update(emergencyData.id, {
        contacts: updatedContacts
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['emergencyContacts']);
      setNewContact({ name: '', phone: '', email: '', relationship: '', primary: false });
      setShowForm(false);
      toast.success('Emergency contact added');
    }
  });

  const removeContactMutation = useMutation({
    mutationFn: async (index) => {
      const updatedContacts = emergencyData.contacts.filter((_, i) => i !== index);
      await base44.entities.EmergencyContact.update(emergencyData.id, {
        contacts: updatedContacts
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['emergencyContacts']);
      toast.success('Contact removed');
    }
  });

  if (!emergencyData) return null;

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-600" />
          Emergency Contacts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between bg-blue-50 rounded-xl p-3">
          <span className="text-sm text-gray-700">Auto-share all trips</span>
          <Switch
            checked={emergencyData.auto_share_trips}
            onCheckedChange={async (checked) => {
              await base44.entities.EmergencyContact.update(emergencyData.id, {
                auto_share_trips: checked
              });
              queryClient.invalidateQueries(['emergencyContacts']);
            }}
          />
        </div>

        {emergencyData.contacts?.map((contact, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">{contact.name}</p>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {contact.phone}
              </p>
              <p className="text-xs text-gray-500">{contact.relationship}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeContactMutation.mutate(i)}
              className="text-red-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}

        {showForm ? (
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <Input
              placeholder="Name"
              value={newContact.name}
              onChange={(e) => setNewContact({...newContact, name: e.target.value})}
              className="rounded-xl"
            />
            <Input
              placeholder="Phone"
              value={newContact.phone}
              onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
              className="rounded-xl"
            />
            <Input
              placeholder="Email (optional)"
              value={newContact.email}
              onChange={(e) => setNewContact({...newContact, email: e.target.value})}
              className="rounded-xl"
            />
            <Input
              placeholder="Relationship"
              value={newContact.relationship}
              onChange={(e) => setNewContact({...newContact, relationship: e.target.value})}
              className="rounded-xl"
            />
            <div className="flex gap-2">
              <Button
                onClick={() => addContactMutation.mutate()}
                disabled={!newContact.name || !newContact.phone}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 rounded-xl"
              >
                Add Contact
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowForm(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setShowForm(true)}
            variant="outline"
            className="w-full rounded-xl"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Emergency Contact
          </Button>
        )}
      </CardContent>
    </Card>
  );
}