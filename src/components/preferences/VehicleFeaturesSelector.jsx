import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Baby, Dog, Accessibility, Luggage } from 'lucide-react';

export default function VehicleFeaturesSelector({ onFeaturesChange }) {
  const [features, setFeatures] = useState({
    child_seat: false,
    pet_friendly: false,
    wheelchair_accessible: false,
    extra_luggage: false
  });

  const toggleFeature = (key) => {
    const updated = { ...features, [key]: !features[key] };
    setFeatures(updated);
    onFeaturesChange?.(updated);
  };

  const featuresList = [
    { key: 'child_seat', label: 'Child Seat', icon: Baby, color: 'text-pink-600' },
    { key: 'pet_friendly', label: 'Pet Friendly', icon: Dog, color: 'text-amber-600' },
    { key: 'wheelchair_accessible', label: 'Wheelchair Accessible', icon: Accessibility, color: 'text-blue-600' },
    { key: 'extra_luggage', label: 'Extra Luggage Space', icon: Luggage, color: 'text-purple-600' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Vehicle Features Required</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {featuresList.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className="flex items-center gap-2">
            <Checkbox
              checked={features[key]}
              onCheckedChange={() => toggleFeature(key)}
            />
            <Icon className={`w-4 h-4 ${color}`} />
            <label className="text-sm">{label}</label>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}