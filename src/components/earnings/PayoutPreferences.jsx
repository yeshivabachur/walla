import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, Calendar, DollarSign, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function PayoutPreferences({ profile }) {
  const [preference, setPreference] = useState(profile?.payout_preference || 'weekly');
  const queryClient = useQueryClient();

  const updatePreferenceMutation = useMutation({
    mutationFn: async (pref) => {
      await base44.entities.DriverProfile.update(profile.id, {
        payout_preference: pref
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['driverProfile']);
      toast.success('Payout preference updated');
    }
  });

  const options = [
    { 
      value: 'instant', 
      label: 'Instant Payout',
      icon: Zap,
      desc: 'Get paid within minutes (1.5% fee)',
      color: 'text-orange-600'
    },
    { 
      value: 'weekly', 
      label: 'Weekly Payout',
      icon: Calendar,
      desc: 'Every Monday (No fees)',
      color: 'text-indigo-600'
    },
    { 
      value: 'monthly', 
      label: 'Monthly Payout',
      icon: DollarSign,
      desc: 'First of each month (No fees)',
      color: 'text-green-600'
    }
  ];

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Payout Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = preference === option.value;
          
          return (
            <button
              key={option.value}
              onClick={() => setPreference(option.value)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                isSelected 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center ${
                  isSelected ? 'ring-2 ring-indigo-500' : ''
                }`}>
                  <Icon className={`w-5 h-5 ${option.color}`} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{option.label}</p>
                  <p className="text-sm text-gray-600">{option.desc}</p>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          );
        })}

        {preference !== profile?.payout_preference && (
          <Button
            onClick={() => updatePreferenceMutation.mutate(preference)}
            disabled={updatePreferenceMutation.isPending}
            className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl"
          >
            {updatePreferenceMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Preference
          </Button>
        )}
      </CardContent>
    </Card>
  );
}