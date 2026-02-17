import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function FunnelChart({ 
  stages,
  className 
}) {
  const maxValue = Math.max(...stages.map(s => s.value));

  return (
    <div className={cn('space-y-2', className)}>
      {stages.map((stage, index) => {
        const percentage = (stage.value / maxValue) * 100;
        const width = 100 - (index * 10);

        return (
          <motion.div
            key={stage.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">{stage.label}</span>
              <span className="text-sm font-bold text-gray-900">{stage.value.toLocaleString()}</span>
            </div>

            <div className="relative h-16">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${width}%` }}
                transition={{ duration: 1, delay: index * 0.1, ease: 'easeOut' }}
                className={cn(
                  'h-full mx-auto rounded-lg',
                  'bg-gradient-to-r from-indigo-500 to-purple-600',
                  'flex items-center justify-center',
                  'shadow-lg hover:shadow-xl transition-shadow',
                  'relative overflow-hidden'
                )}
              >
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, delay: index * 0.1 + 0.5, ease: 'easeInOut' }}
                />

                <span className="text-white font-semibold relative z-10">
                  {percentage.toFixed(1)}%
                </span>

                {index < stages.length - 1 && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs text-gray-500 bg-white px-2 py-0.5 rounded-full shadow">
                    -{((1 - stages[index + 1].value / stage.value) * 100).toFixed(0)}%
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}