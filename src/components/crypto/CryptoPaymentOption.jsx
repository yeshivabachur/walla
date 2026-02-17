import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins } from 'lucide-react';

export default function CryptoPaymentOption({ userEmail }) {
  const { data: cryptoWallet } = useQuery({
    queryKey: ['crypto', userEmail],
    queryFn: async () => {
      const wallets = await base44.entities.BlockchainPayment.filter({ user_email: userEmail });
      if (wallets[0]) return wallets[0];
      return await base44.entities.BlockchainPayment.create({ user_email: userEmail });
    },
    enabled: !!userEmail
  });

  if (!cryptoWallet) return null;

  return (
    <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Coins className="w-4 h-4 text-yellow-600" />
          Crypto Payments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {cryptoWallet.supported_currencies?.map(curr => (
            <Badge key={curr} variant="outline" className="bg-white">
              {curr}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}