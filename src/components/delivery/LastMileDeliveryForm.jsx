import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Package } from 'lucide-react';
import { toast } from 'sonner';

export default function LastMileDeliveryForm({ senderEmail }) {
  const [pickup, setPickup] = useState('');
  const [delivery, setDelivery] = useState('');
  const [size, setSize] = useState('small');
  const [fragile, setFragile] = useState(false);
  const [signature, setSignature] = useState(false);

  const deliveryMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.LastMileDelivery.create({
        sender_email: senderEmail,
        pickup_location: pickup,
        delivery_location: delivery,
        package_size: size,
        fragile,
        signature_required: signature,
        status: 'pending'
      });
    },
    onSuccess: () => {
      toast.success('Delivery requested!');
      setPickup('');
      setDelivery('');
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Package className="w-4 h-4 text-orange-600" />
          Last-Mile Delivery
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input placeholder="Pickup address" value={pickup} onChange={(e) => setPickup(e.target.value)} />
        <Input placeholder="Delivery address" value={delivery} onChange={(e) => setDelivery(e.target.value)} />
        <Select value={size} onValueChange={setSize}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small Package</SelectItem>
            <SelectItem value="medium">Medium Package</SelectItem>
            <SelectItem value="large">Large Package</SelectItem>
          </SelectContent>
        </Select>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox checked={fragile} onCheckedChange={setFragile} />
            <label className="text-sm">Fragile items (+$5)</label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox checked={signature} onCheckedChange={setSignature} />
            <label className="text-sm">Signature required (+$3)</label>
          </div>
        </div>
        <Button onClick={() => deliveryMutation.mutate()} disabled={!pickup || !delivery} className="w-full">
          Request Delivery
        </Button>
      </CardContent>
    </Card>
  );
}