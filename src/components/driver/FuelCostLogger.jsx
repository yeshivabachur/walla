import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Fuel } from 'lucide-react';
import { toast } from 'sonner';

export default function FuelCostLogger({ driverEmail }) {
  const [gallons, setGallons] = useState('');
  const [pricePerGallon, setPricePerGallon] = useState('');
  const queryClient = useQueryClient();

  const { data: costs = [] } = useQuery({
    queryKey: ['fuelCosts', driverEmail],
    queryFn: () => base44.entities.FuelCostTracker.filter({ driver_email: driverEmail })
  });

  const logMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.FuelCostTracker.create({
        driver_email: driverEmail,
        date: new Date().toISOString().split('T')[0],
        gallons: parseFloat(gallons),
        price_per_gallon: parseFloat(pricePerGallon),
        total_cost: parseFloat(gallons) * parseFloat(pricePerGallon)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['fuelCosts']);
      toast.success('Fuel cost logged');
      setGallons('');
      setPricePerGallon('');
    }
  });

  const totalSpent = costs.reduce((sum, c) => sum + c.total_cost, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Fuel className="w-4 h-4 text-orange-600" />
          Fuel Cost Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-orange-50 rounded p-2">
          <p className="text-xs text-gray-600">Total Spent</p>
          <p className="text-xl font-bold text-orange-600">${totalSpent.toFixed(2)}</p>
        </div>
        <Input
          type="number"
          placeholder="Gallons"
          value={gallons}
          onChange={(e) => setGallons(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Price per gallon"
          value={pricePerGallon}
          onChange={(e) => setPricePerGallon(e.target.value)}
        />
        <Button onClick={() => logMutation.mutate()} disabled={!gallons || !pricePerGallon} className="w-full" size="sm">
          Log Fuel Purchase
        </Button>
      </CardContent>
    </Card>
  );
}