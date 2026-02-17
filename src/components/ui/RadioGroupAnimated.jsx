import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RadioGroupAnimated({ 
  options,
  value,
  onChange,
  className 
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {options.map((option, index) => {
        const isSelected = value === option.value;

        return (
          <motion.label
            key={option.value}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ x: 4 }}
            className={cn(
              'flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all',
              isSelected
                ? 'border-indigo-600 bg-indigo-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50'
            )}
          >
            <div className="relative">
              <input
                type="radio"
                name="radio-group"
                value={option.value}
                checked={isSelected}
                onChange={() => onChange?.(option.value)}
                className="sr-only"
              />
              
              <div className={cn(
                'w-5 h-5 rounded-full border-2 transition-colors flex items-center justify-center',
                isSelected
                  ? 'border-indigo-600 bg-indigo-600'
                  : 'border-gray-300'
              )}>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring' }}
                  >
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </motion.div>
                )}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {option.icon && <option.icon className="w-5 h-5 text-gray-600" />}
                <span className="font-semibold text-gray-900">{option.label}</span>
              </div>
              
              {option.description && (
                <p className="text-sm text-gray-600">{option.description}</p>
              )}
            </div>

            {option.badge && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-semibold"
              >
                {option.badge}
              </motion.div>
            )}
          </motion.label>
        );
      })}
    </div>
  );
}