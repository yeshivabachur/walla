import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart } from 'lucide-react';
import { toast } from 'sonner';

export default function MoodBasedMatching({ userEmail, userType }) {
  const [style, setStyle] = useState('professional');

  const saveMutation = async () => {
    await base44.entities.DriverMoodProfile.create({
      driver_email: userEmail,
      conversation_style: style
    });
    toast.success('Preferences saved');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Heart className="w-4 h-4 text-pink-600" />
          Match Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-xs text-gray-600 mb-2">Conversation Style</p>
          <Select value={style} onValueChange={setStyle}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="quiet">🤫 Quiet</SelectItem>
              <SelectItem value="friendly">😊 Friendly</SelectItem>
              <SelectItem value="chatty">💬 Chatty</SelectItem>
              <SelectItem value="professional">👔 Professional</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={saveMutation} className="w-full">
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );
}