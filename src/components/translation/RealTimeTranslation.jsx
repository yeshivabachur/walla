import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Languages, Send, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' }
];

export default function RealTimeTranslation({ rideRequestId, userLanguage = 'en', otherPartyLanguage = 'en' }) {
  const [message, setMessage] = useState('');
  const [myLang, setMyLang] = useState(userLanguage);
  const [theirLang, setTheirLang] = useState(otherPartyLanguage);

  const translateMutation = useMutation({
    mutationFn: async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Translate this message from ${myLang} to ${theirLang}:
        
"${message}"

Provide natural, conversational translation.`,
        response_json_schema: {
          type: 'object',
          properties: {
            translated: { type: 'string' },
            original_detected_language: { type: 'string' }
          }
        }
      });

      await base44.entities.RideTranslation.create({
        ride_request_id: rideRequestId,
        passenger_language: myLang,
        driver_language: theirLang,
        translation_enabled: true,
        messages: [{
          original_text: message,
          translated_text: result.translated,
          from_lang: myLang,
          to_lang: theirLang,
          timestamp: new Date().toISOString()
        }]
      });

      return result;
    },
    onSuccess: (data) => {
      toast.success(`📨 Message sent: "${data.translated}"`);
      setMessage('');
    }
  });

  return (
    <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Languages className="w-5 h-5 text-blue-600" />
            Real-Time Translation
          </span>
          <Badge className="bg-blue-600 text-white">
            Beta
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <Select value={myLang} onValueChange={setMyLang}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map(lang => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={theirLang} onValueChange={setTheirLang}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map(lang => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && translateMutation.mutate()}
            className="flex-1"
          />
          <Button
            onClick={() => translateMutation.mutate()}
            disabled={!message || translateMutation.isPending}
            size="icon"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        <div className="bg-white rounded-lg p-3 text-xs text-gray-600">
          💬 Messages are automatically translated between {languages.find(l => l.code === myLang)?.name} and {languages.find(l => l.code === theirLang)?.name}
        </div>
      </CardContent>
    </Card>
  );
}