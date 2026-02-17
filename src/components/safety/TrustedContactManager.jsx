import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, UserPlus, X } from 'lucide-react';
import { toast } from 'sonner';

export default function TrustedContactManager({ userEmail }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('');
  const queryClient = useQueryClient();

  const { data: contacts = [] } = useQuery({
    queryKey: ['trustedContacts', userEmail],
    queryFn: () => base44.entities.TrustedContact.filter({ user_email: userEmail })
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.TrustedContact.create({
        user_email: userEmail,
        contact_name: name,
        contact_email: email,
        contact_phone: phone,
        relationship,
        auto_notify: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['trustedContacts']);
      toast.success('Trusted contact added');
      setName('');
      setEmail('');
      setPhone('');
      setRelationship('');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.TrustedContact.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['trustedContacts']);
      toast.success('Contact removed');
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Shield className="w-4 h-4 text-green-600" />
          Trusted Contacts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {contacts.length > 0 && (
          <div className="space-y-2">
            {contacts.map(contact => (
              <div key={contact.id} className="flex justify-between items-center bg-green-50 rounded p-2">
                <div>
                  <p className="text-sm font-semibold">{contact.contact_name}</p>
                  <p className="text-xs text-gray-600">{contact.relationship}</p>
                </div>
                <Button
                  onClick={() => deleteMutation.mutate(contact.id)}
                  variant="ghost"
                  size="sm"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        <div className="border-t pt-3 space-y-2">
          <Input
            placeholder="Contact name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            placeholder="Relationship"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
          />
          <Button
            onClick={() => addMutation.mutate()}
            disabled={!name}
            className="w-full"
            size="sm"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Trusted Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}