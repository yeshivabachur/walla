import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from 'lucide-react';

export default function PersonalAIAssistant({ userEmail }) {
  const { data: personalAI } = useQuery({
    queryKey: ['personalAI', userEmail],
    queryFn: async () => {
      const ais = await base44.entities.PersonalAI.filter({ user_email: userEmail });
      if (ais[0]) return ais[0];
      return await base44.entities.PersonalAI.create({ user_email: userEmail });
    },
    enabled: !!userEmail
  });

  if (!personalAI) return null;

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-violet-50 to-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Sparkles className="w-4 h-4 text-violet-600" />
          {personalAI.ai_name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-gray-700 mb-2">
          Your AI assistant has made <span className="font-bold text-violet-600">{personalAI.proactive_suggestions}</span> helpful suggestions
        </p>
        <p className="text-xs text-violet-600">
          💡 Personality: {personalAI.personality_type}
        </p>
      </CardContent>
    </Card>
  );
}