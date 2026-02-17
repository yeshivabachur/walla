import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingDown } from 'lucide-react';

export default function SmartPricingEngine({ rideRequestId, basePrice, userEmail }) {
  const [pricing, setPricing] = useState(null);

  useEffect(() => {
    const calculate = async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Calculate personalized price.

Base price: $${basePrice}
User: ${userEmail}

Consider:
1. User loyalty
2. Time of day
3. Demand

Provide personalized price and breakdown.`,
        response_json_schema: {
          type: 'object',
          properties: {
            final_price: { type: 'number' },
            loyalty_discount: { type: 'number' },
            time_adjustment: { type: 'number' },
            demand_multiplier: { type: 'number' }
          }
        }
      });

      setPricing(result);

      await base44.entities.SmartPricing.create({
        ride_request_id: rideRequestId,
        base_price: basePrice,
        personalized_price: result.final_price,
        factors: {
          loyalty_discount: result.loyalty_discount,
          time_of_day: result.time_adjustment,
          demand_multiplier: result.demand_multiplier
        }
      });
    };

    calculate();
  }, [rideRequestId, basePrice, userEmail]);

  if (!pricing) return null;

  return (
    <Card className="border-2 border-green-200 bg-green-50">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold">Smart Price</span>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-green-700">${pricing.final_price}</p>
            {pricing.loyalty_discount > 0 && (
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingDown className="w-3 h-3" />
                Save ${pricing.loyalty_discount}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}