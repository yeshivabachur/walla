import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function SankeyDiagram({ 
  flows,
  className 
}) {
  return (
    <div className={cn('glass-strong rounded-2xl p-6', className)}>
      <h3 className="font-bold text-gray-900 mb-6">User Flow</h3>
      
      <svg viewBox="0 0 600 400" className="w-full">
        {flows.map((flow, index) => {
          const startY = 50 + index * 80;
          const endY = flow.target === 'conversion' ? 200 : 50 + (index + 1) * 80;
          const curve = Math.abs(endY - startY) / 2;

          return (
            <g key={index}>
              {/* Flow path */}
              <motion.path
                d={`M 50 ${startY} C ${50 + curve} ${startY}, ${550 - curve} ${endY}, 550 ${endY}`}
                fill="none"
                stroke={flow.color || '#667eea'}
                strokeWidth={flow.value / 10}
                opacity={0.6}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: index * 0.2, ease: 'easeInOut' }}
              />

              {/* Labels */}
              <text x="10" y={startY + 5} className="text-xs fill-gray-700 font-medium">
                {flow.from}
              </text>
              
              <text x="560" y={endY + 5} className="text-xs fill-gray-700 font-medium">
                {flow.to}
              </text>

              {/* Value */}
              <motion.text
                x="300"
                y={(startY + endY) / 2}
                className="text-xs fill-gray-600 font-bold"
                textAnchor="middle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.2 + 1 }}
              >
                {flow.value}
              </motion.text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}