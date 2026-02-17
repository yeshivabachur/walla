import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accessibility } from 'lucide-react';
import { motion } from 'framer-motion';

const accessibilityOptions = [
  { id: 'wheelchair_accessible', label: '♿ Wheelchair Accessible Vehicle', icon: '♿' },
  { id: 'hearing_impaired', label: '👂 Hearing Impaired Support', icon: '👂' },
  { id: 'vision_impaired', label: '👁️ Vision Impaired Support', icon: '👁️' },
  { id: 'service_animal', label: '🐕 Service Animal Friendly', icon: '🐕' },
  { id: 'extra_assistance', label: '🤝 Extra Assistance Needed', icon: '🤝' },
  { id: 'walker_accessible', label: '🚶 Walker/Mobility Aid Support', icon: '🚶' }
];

export default function AccessibilityOptions({ onSave, initialNeeds = [] }) {
  const [selectedNeeds, setSelectedNeeds] = useState(initialNeeds);
  const [details, setDetails] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleNeed = (needId) => {
    setSelectedNeeds(prev =>
      prev.includes(needId)
        ? prev.filter(n => n !== needId)
        : [...prev, needId]
    );
  };

  const handleSave = () => {
    onSave({ needs: selectedNeeds, details });
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <Button
        onClick={() => setIsExpanded(true)}
        variant="outline"
        className="w-full rounded-xl h-12 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
      >
        <Accessibility className="w-4 h-4 mr-2" />
        Accessibility Options
        {selectedNeeds.length > 0 && (
          <span className="ml-2 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
            {selectedNeeds.length}
          </span>
        )}
      </Button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Card className="border-2 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Accessibility className="w-5 h-5 text-indigo-600" />
            Accessibility Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {accessibilityOptions.map(option => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={option.id}
                  checked={selectedNeeds.includes(option.id)}
                  onCheckedChange={() => toggleNeed(option.id)}
                />
                <Label htmlFor={option.id} className="text-sm cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>

          <div>
            <Label>Additional Details (Optional)</Label>
            <Textarea
              placeholder="Any specific accessibility needs or preferences..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="mt-1.5 rounded-xl resize-none"
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 rounded-xl"
            >
              Save Preferences
            </Button>
            <Button
              onClick={() => setIsExpanded(false)}
              variant="outline"
              className="rounded-xl"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}