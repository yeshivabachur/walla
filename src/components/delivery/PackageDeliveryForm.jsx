import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Loader2, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const CITY_COORDS = {
  'San Francisco': { latitude: 37.7749, longitude: -122.4194 },
  'Los Angeles': { latitude: 34.0522, longitude: -118.2437 },
  'New York': { latitude: 40.7128, longitude: -74.006 }
};

export default function PackageDeliveryForm({ userEmail }) {
  const [formData, setFormData] = useState({
    sender_name: '',
    sender_phone: '',
    recipient_name: '',
    recipient_phone: '',
    pickup_location: '',
    delivery_location: '',
    package_size: 'small',
    package_description: '',
    special_instructions: ''
  });

  const deliveryMutation = useMutation({
    mutationFn: async () => {
      const pickupCoords = CITY_COORDS[formData.pickup_location];
      const deliveryCoords = CITY_COORDS[formData.delivery_location];
      
      const price = formData.package_size === 'small' ? 8 : formData.package_size === 'medium' ? 12 : 18;
      const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      await base44.entities.PackageDelivery.create({
        sender_email: userEmail,
        ...formData,
        pickup_coords: pickupCoords,
        delivery_coords: deliveryCoords,
        estimated_price: price,
        verification_code: verificationCode,
        status: 'pending'
      });

      return { price, verificationCode };
    },
    onSuccess: ({ price, verificationCode }) => {
      toast.success(`Package delivery requested! Verification code: ${verificationCode}`);
      setFormData({
        sender_name: '',
        sender_phone: '',
        recipient_name: '',
        recipient_phone: '',
        pickup_location: '',
        delivery_location: '',
        package_size: 'small',
        package_description: '',
        special_instructions: ''
      });
    }
  });

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5 text-indigo-600" />
          Send a Package
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); deliveryMutation.mutate(); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Your name"
              value={formData.sender_name}
              onChange={(e) => setFormData({...formData, sender_name: e.target.value})}
              className="rounded-xl"
              required
            />
            <Input
              placeholder="Your phone"
              value={formData.sender_phone}
              onChange={(e) => setFormData({...formData, sender_phone: e.target.value})}
              className="rounded-xl"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Recipient name"
              value={formData.recipient_name}
              onChange={(e) => setFormData({...formData, recipient_name: e.target.value})}
              className="rounded-xl"
              required
            />
            <Input
              placeholder="Recipient phone"
              value={formData.recipient_phone}
              onChange={(e) => setFormData({...formData, recipient_phone: e.target.value})}
              className="rounded-xl"
              required
            />
          </div>

          <Select value={formData.pickup_location} onValueChange={(v) => setFormData({...formData, pickup_location: v})}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Pickup location" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(CITY_COORDS).map((city) => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={formData.delivery_location} onValueChange={(v) => setFormData({...formData, delivery_location: v})}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Delivery location" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(CITY_COORDS).map((city) => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={formData.package_size} onValueChange={(v) => setFormData({...formData, package_size: v})}>
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">📦 Small ($8)</SelectItem>
              <SelectItem value="medium">📦 Medium ($12)</SelectItem>
              <SelectItem value="large">📦 Large ($18)</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Package description"
            value={formData.package_description}
            onChange={(e) => setFormData({...formData, package_description: e.target.value})}
            className="rounded-xl"
          />

          <Textarea
            placeholder="Special instructions (optional)"
            value={formData.special_instructions}
            onChange={(e) => setFormData({...formData, special_instructions: e.target.value})}
            className="rounded-xl resize-none"
            rows={2}
          />

          <Button
            type="submit"
            disabled={deliveryMutation.isPending}
            className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl h-12"
          >
            {deliveryMutation.isPending ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</>
            ) : (
              <><Package className="w-4 h-4 mr-2" />Send Package</>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}