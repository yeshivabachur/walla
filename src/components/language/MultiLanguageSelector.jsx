import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Languages } from 'lucide-react';
import { toast } from 'sonner';

export default function MultiLanguageSelector({ userEmail, userType }) {
  const [language, setLanguage] = useState('english');

  const saveMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.LanguageSupport.create({
        user_email: userEmail,
        user_type: userType,
        primary_language: language,
        translation_enabled: true
      });
    },
    onSuccess: () => {
      toast.success('Language preference saved');
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Languages className="w-4 h-4 text-blue-600" />
          Language
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="spanish">Español</SelectItem>
            <SelectItem value="french">Français</SelectItem>
            <SelectItem value="chinese">中文</SelectItem>
            <SelectItem value="arabic">العربية</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => saveMutation.mutate()} className="w-full" size="sm">
          Save Language
        </Button>
      </CardContent>
    </Card>
  );
}