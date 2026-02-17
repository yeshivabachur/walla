import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Key } from 'lucide-react';
import { toast } from 'sonner';

export default function SafeWordManager({ userEmail }) {
  const [phrase, setPhrase] = useState('');
  const [action, setAction] = useState('alert_contacts');

  const saveSafeWord = async () => {
    if (!phrase.trim()) {
      toast.error('Please enter a safe phrase');
      return;
    }

    await base44.entities.SafeWord.create({
      user_email: userEmail,
      safe_phrase: phrase,
      emergency_action: action,
      enabled: true
    });

    toast.success('Safe word configured');
    setPhrase('');
  };

  return (
    <Card className="border-2 border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Key className="w-4 h-4 text-red-600" />
          Emergency Safe Word
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input
          type="password"
          placeholder="Enter safe phrase..."
          value={phrase}
          onChange={(e) => setPhrase(e.target.value)}
        />
        <Select value={action} onValueChange={setAction}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alert_contacts">Alert Emergency Contacts</SelectItem>
            <SelectItem value="call_support">Call Support</SelectItem>
            <SelectItem value="call_authorities">Call Authorities</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={saveSafeWord} className="w-full bg-red-600 hover:bg-red-700">
          Save Safe Word
        </Button>
      </CardContent>
    </Card>
  );
}