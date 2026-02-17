import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Languages } from 'lucide-react';
import { toast } from 'sonner';

export default function LanguageMatchSelector({ userEmail }) {
  const [languages, setLanguages] = useState([]);
  const [requireMatch, setRequireMatch] = useState(false);

  const toggleLanguage = (lang) => {
    setLanguages(prev => 
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.LanguagePreference.create({
        user_email: userEmail,
        preferred_languages: languages,
        require_language_match: requireMatch,
        real_time_translation: !requireMatch
      });
    },
    onSuccess: () => {
      toast.success('Language preferences saved');
    }
  });

  const availableLanguages = ['English', 'Spanish', 'French', 'Chinese', 'Arabic', 'Hindi'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Languages className="w-4 h-4 text-blue-600" />
          Language Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          {availableLanguages.map(lang => (
            <div key={lang} className="flex items-center gap-2">
              <Checkbox checked={languages.includes(lang)} onCheckedChange={() => toggleLanguage(lang)} />
              <label className="text-sm">{lang}</label>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Checkbox checked={requireMatch} onCheckedChange={setRequireMatch} />
          <label className="text-sm">Require language match</label>
        </div>
        <Button onClick={() => saveMutation.mutate()} disabled={languages.length === 0} className="w-full" size="sm">
          Save Languages
        </Button>
      </CardContent>
    </Card>
  );
}