import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Stepper({ 
  steps,
  currentStep,
  className 
}) {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <React.Fragment key={index}>
              {/* Step */}
              <div className="flex flex-col items-center">
                <motion.div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2',
                    'transition-all duration-300',
                    isCompleted && 'bg-emerald-500 text-white',
                    isCurrent && 'bg-indigo-600 text-white ring-4 ring-indigo-100',
                    isUpcoming && 'bg-gray-200 text-gray-600'
                  )}
                  animate={{
                    scale: isCurrent ? [1, 1.1, 1] : 1
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: isCurrent ? Infinity : 0,
                    repeatDelay: 1
                  }}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring' }}
                    >
                      <Check className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    index + 1
                  )}
                </motion.div>
                
                <span className={cn(
                  'text-xs font-medium text-center',
                  isCurrent ? 'text-indigo-600' : 'text-gray-500'
                )}>
                  {step}
                </span>
              </div>

              {/* Connector */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 bg-gray-200 mx-2 mb-8">
                  <motion.div
                    className="h-full bg-emerald-500"
                    initial={{ width: '0%' }}
                    animate={{ width: index < currentStep ? '100%' : '0%' }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}