import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function WaterfallChart({ 
  data,
  className 
}) {
  let cumulative = 0;

  return (
    <div className={cn('space-y-3', className)}>
      {data.map((item, index) => {
        const previousCumulative = cumulative;
        cumulative += item.value;
        const isPositive = item.value >= 0;
        const barHeight = Math.abs(item.value);
        const maxValue = Math.max(...data.map(d => Math.abs(d.value)));
        const heightPercentage = (barHeight / maxValue) * 100;

        return (
          <div key={index} className="flex items-center gap-4">
            <div className="w-32 text-sm font-medium text-gray-700">{item.label}</div>

            <div className="flex-1 relative h-16">
              <div className="absolute inset-y-0 left-0 right-0 flex items-end">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercentage}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
                  className={cn(
                    'w-full rounded-lg relative overflow-hidden shadow-md',
                    isPositive
                      ? 'bg-gradient-to-t from-emerald-500 to-emerald-400'
                      : 'bg-gradient-to-t from-red-500 to-red-400'
                  )}
                >
                  {/* Value label */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {isPositive ? '+' : ''}{item.value}
                    </span>
                  </div>

                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 1.5, delay: index * 0.1 + 0.8 }}
                  />
                </motion.div>
              </div>
            </div>

            <div className="w-24 text-right">
              <div className="flex items-center justify-end gap-1 text-sm font-bold">
                {isPositive ? (
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className={isPositive ? 'text-emerald-600' : 'text-red-600'}>
                  {cumulative}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}