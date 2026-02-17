import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ComparisonTable({ 
  features,
  plans,
  className 
}) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <motion.table 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full"
      >
        <thead>
          <tr>
            <th className="text-left p-4 font-bold text-gray-900">Features</th>
            {plans.map((plan, index) => (
              <motion.th
                key={plan.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  'p-4 text-center',
                  plan.highlighted && 'bg-gradient-to-br from-indigo-50 to-purple-50 border-l border-r border-indigo-200'
                )}
              >
                <div className="font-bold text-gray-900 mb-1">{plan.name}</div>
                <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ${plan.price}
                </div>
                <div className="text-xs text-gray-600">per month</div>
              </motion.th>
            ))}
          </tr>
        </thead>
        
        <tbody>
          {features.map((feature, featureIndex) => (
            <motion.tr
              key={feature.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: featureIndex * 0.05 }}
              className="border-t border-gray-200"
            >
              <td className="p-4 font-medium text-gray-700">{feature.name}</td>
              {plans.map((plan, planIndex) => (
                <td
                  key={plan.name}
                  className={cn(
                    'p-4 text-center',
                    plan.highlighted && 'bg-gradient-to-br from-indigo-50/50 to-purple-50/50 border-l border-r border-indigo-100'
                  )}
                >
                  {feature.values[planIndex] === true ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: featureIndex * 0.05 + planIndex * 0.02, type: 'spring' }}
                      className="inline-flex"
                    >
                      <Check className="w-5 h-5 text-emerald-600" />
                    </motion.div>
                  ) : feature.values[planIndex] === false ? (
                    <X className="w-5 h-5 text-gray-300 inline-block" />
                  ) : (
                    <span className="text-sm text-gray-700">{feature.values[planIndex]}</span>
                  )}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </motion.table>
    </div>
  );
}