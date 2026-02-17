import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, Clock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RidePoolOption({ estimatedPrice, onToggle, isEnabled }) {
  const poolDiscount = 0.25;
  const poolPrice = (estimatedPrice * (1 - poolDiscount)).toFixed(2);
  const savings = (estimatedPrice * poolDiscount).toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Card className={`cursor-pointer transition-all ${isEnabled ? 'border-2 border-indigo-600 bg-indigo-50' : 'border-2 border-gray-200 hover:border-indigo-300'}`}
        onClick={onToggle}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <h3 className="font-semibold text-gray-900">Walla Pool</h3>
                <Badge className="bg-green-100 text-green-800 text-xs">
                  Save ${savings}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Share your ride with other passengers heading the same way
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-semibold">${poolPrice}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>+5-10 min</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Sparkles className="w-4 h-4" />
                  <span>1-3 riders</span>
                </div>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isEnabled ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
              {isEnabled && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}