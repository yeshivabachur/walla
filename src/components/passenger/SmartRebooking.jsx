import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Clock, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function SmartRebooking({ pastRide }) {
  const navigate = useNavigate();
  const [calculating, setCalculating] = useState(false);
  const [savings, setSavings] = useState(null);

  const checkSavings = async () => {
    setCalculating(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Compare pricing for rebooking ride:
Original ride: ${pastRide.pickup_location} to ${pastRide.dropoff_location}
Original price: $${pastRide.estimated_price}
Original time: ${new Date(pastRide.created_date).toLocaleString()}

Current time: ${new Date().toLocaleString()}

Estimate current price and potential savings.`,
        response_json_schema: {
          type: 'object',
          properties: {
            current_price: { type: 'number' },
            savings: { type: 'number' },
            message: { type: 'string' }
          }
        }
      });

      setSavings(result);
    } catch (error) {
      console.error('Rebooking check failed:', error);
    } finally {
      setCalculating(false);
    }
  };

  const rebook = () => {
    navigate(createPageUrl('RequestRide'), {
      state: {
        pickup_location: pastRide.pickup_location,
        dropoff_location: pastRide.dropoff_location,
        passengers: pastRide.passengers
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">Rebook this ride?</span>
            <RefreshCw className="w-4 h-4 text-indigo-600" />
          </div>

          <div className="bg-white rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Previous Route</p>
            <p className="text-sm font-medium text-gray-900">
              {pastRide.pickup_location} → {pastRide.dropoff_location}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Original: ${pastRide.estimated_price}
            </p>
          </div>

          {!savings ? (
            <Button
              onClick={checkSavings}
              disabled={calculating}
              variant="outline"
              className="w-full"
            >
              {calculating ? 'Checking...' : 'Check Current Price'}
            </Button>
          ) : (
            <>
              {savings.savings > 0 && (
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingDown className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-semibold text-green-800">
                      Save ${savings.savings.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-green-700">{savings.message}</p>
                </div>
              )}
              
              <Button
                onClick={rebook}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                Book for ${savings.current_price.toFixed(2)}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}