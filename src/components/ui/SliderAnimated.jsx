import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function SliderAnimated({ 
  value = 50,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  showValue = true,
  label,
  className 
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {label && (
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-700">{label}</label>
          {showValue && (
            <motion.span
              key={value}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-sm font-semibold text-indigo-600"
            >
              {value}
            </motion.span>
          )}
        </div>
      )}

      <div className="relative">
        {/* Track */}
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
            animate={{ width: `${((value - min) / (max - min)) * 100}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>

        {/* Thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange?.(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />

        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-indigo-600 rounded-full shadow-lg pointer-events-none"
          animate={{ 
            left: `calc(${((value - min) / (max - min)) * 100}% - 10px)` 
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          whileHover={{ scale: 1.2 }}
        />
      </div>
    </div>
  );
}