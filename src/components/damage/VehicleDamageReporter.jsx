import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function VehicleDamageReporter({ vehicleId, driverEmail }) {
  const [damageType, setDamageType] = useState('minor_scratch');
  const [description, setDescription] = useState('');

  const reportMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.VehicleDamage.create({
        vehicle_id: vehicleId,
        driver_email: driverEmail,
        damage_type: damageType,
        description,
        photo_urls: [],
        reported_date: new Date().toISOString().split('T')[0]
      });
    },
    onSuccess: () => {
      toast.success('Damage reported');
      setDescription('');
    }
  });

  return (
    <Card className="border-2 border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          Report Vehicle Damage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Select value={damageType} onValueChange={setDamageType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="minor_scratch">Minor Scratch</SelectItem>
            <SelectItem value="dent">Dent</SelectItem>
            <SelectItem value="broken_window">Broken Window</SelectItem>
            <SelectItem value="interior_damage">Interior Damage</SelectItem>
            <SelectItem value="major">Major Damage</SelectItem>
          </SelectContent>
        </Select>
        <Textarea
          placeholder="Describe the damage..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
        <Button 
          onClick={() => reportMutation.mutate()} 
          className="w-full bg-red-600 hover:bg-red-700"
          size="sm"
          disabled={!description}
        >
          Submit Report
        </Button>
      </CardContent>
    </Card>
  );
}