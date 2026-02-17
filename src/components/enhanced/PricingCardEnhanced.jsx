import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, Info } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import TooltipAnimated from '@/components/ui/TooltipAnimated';

export default function PricingCardEnhanced({ 
  price,
  surge = 1.0,
  discount = 0,
  breakdown = {}
}) {
  const finalPrice = price - discount;
  const isSurge = surge > 1.0;

  return (
    <GlassCard className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">Estimated Fare</p>
          <div className="flex items-baseline gap-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-4xl font-bold text-gray-900"
            >
              $<AnimatedCounter value={finalPrice} decimals={2} />
            </motion.div>
            
            {discount > 0 && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-lg text-gray-400 line-through"
              >
                ${price}
              </motion.span>
            )}
          </div>
        </div>

        {isSurge && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring' }}
            className="flex items-center gap-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full"
          >
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-semibold">{surge}x</span>
          </motion.div>
        )}

        {discount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full"
          >
            <TrendingDown className="w-4 h-4" />
            <span className="text-sm font-semibold">-${discount}</span>
          </motion.div>
        )}
      </div>

      {/* Price breakdown */}
      <div className="space-y-2 border-t border-gray-200 pt-4">
        {Object.entries(breakdown).map(([key, value], index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-gray-600 flex items-center gap-1">
              {key}
              <TooltipAnimated content={`${key} details`}>
                <Info className="w-3 h-3 text-gray-400" />
              </TooltipAnimated>
            </span>
            <span className="font-medium text-gray-900">${value}</span>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-xs text-gray-500 mt-4 text-center"
      >
        Final price may vary based on actual route
      </motion.p>
    </GlassCard>
  );
}