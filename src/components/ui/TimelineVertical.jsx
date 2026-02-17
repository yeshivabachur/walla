import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function TimelineVertical({ items, className }) {
  return (
    <div className={cn('space-y-8', className)}>
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative pl-8"
        >
          {/* Line */}
          {index < items.length - 1 && (
            <div className="absolute left-2.5 top-8 w-0.5 h-full bg-gray-200">
              <motion.div
                className="w-full bg-indigo-600"
                initial={{ height: 0 }}
                animate={{ height: '100%' }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
              />
            </div>
          )}

          {/* Dot */}
          <motion.div
            className="absolute left-0 top-1 w-6 h-6 bg-indigo-600 rounded-full border-4 border-white shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1, type: 'spring' }}
          />

          {/* Content */}
          <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            {item.icon && (
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mb-2">
                <item.icon className="w-4 h-4 text-indigo-600" />
              </div>
            )}
            
            {item.time && (
              <p className="text-xs text-gray-500 mb-1">{item.time}</p>
            )}
            
            <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
            
            {item.description && (
              <p className="text-sm text-gray-600">{item.description}</p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}