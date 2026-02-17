import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Gift, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const presetAmounts = [25, 50, 100, 200];

export default function GiftCardPurchase({ userEmail }) {
  const [formData, setFormData] = useState({
    recipient_email: '',
    recipient_name: '',
    amount: 50,
    message: ''
  });

  const purchaseMutation = useMutation({
    mutationFn: async () => {
      const code = `GIFT${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);

      await base44.entities.GiftCard.create({
        code: code,
        sender_email: userEmail,
        recipient_email: formData.recipient_email,
        recipient_name: formData.recipient_name,
        amount: formData.amount,
        balance: formData.amount,
        message: formData.message,
        status: 'active',
        expiry_date: expiryDate.toISOString().split('T')[0]
      });

      // Send email to recipient
      await base44.integrations.Core.SendEmail({
        to: formData.recipient_email,
        subject: '🎁 You received a Walla gift card!',
        body: `Hi ${formData.recipient_name},

You've received a ${formData.amount} Walla gift card!

Code: ${code}
Message: ${formData.message}

Use this code when booking your next ride. Valid for 1 year.

Happy riding!
- Walla Team`
      });

      return code;
    },
    onSuccess: (code) => {
      toast.success(`Gift card sent! Code: ${code}`);
      setFormData({
        recipient_email: '',
        recipient_name: '',
        amount: 50,
        message: ''
      });
    }
  });

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-indigo-600" />
          Send a Gift Card
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); purchaseMutation.mutate(); }} className="space-y-4">
          <div>
            <Label>Recipient Name</Label>
            <Input
              placeholder="John Doe"
              value={formData.recipient_name}
              onChange={(e) => setFormData({...formData, recipient_name: e.target.value})}
              className="rounded-xl mt-1.5"
              required
            />
          </div>

          <div>
            <Label>Recipient Email</Label>
            <Input
              type="email"
              placeholder="john@example.com"
              value={formData.recipient_email}
              onChange={(e) => setFormData({...formData, recipient_email: e.target.value})}
              className="rounded-xl mt-1.5"
              required
            />
          </div>

          <div>
            <Label>Amount</Label>
            <div className="grid grid-cols-4 gap-2 mt-1.5">
              {presetAmounts.map(amount => (
                <Button
                  key={amount}
                  type="button"
                  variant={formData.amount === amount ? "default" : "outline"}
                  onClick={() => setFormData({...formData, amount})}
                  className="rounded-xl"
                >
                  ${amount}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label>Personal Message (Optional)</Label>
            <Textarea
              placeholder="Happy birthday! Enjoy some free rides..."
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="rounded-xl resize-none mt-1.5"
              rows={3}
            />
          </div>

          <Button
            type="submit"
            disabled={purchaseMutation.isPending}
            className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl h-12"
          >
            {purchaseMutation.isPending ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</>
            ) : (
              <><Gift className="w-4 h-4 mr-2" />Purchase Gift Card</>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}