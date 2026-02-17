import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function BarChartAnimated({ 
  data,
  dataKey = 'value',
  xAxisKey = 'name',
  color = '#667eea',
  height = 300,
  showGrid = true,
  horizontal = false,
  stacked = false,
  className = ''
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <ResponsiveContainer width="100%" height={height}>
        <BarChart 
          data={data}
          layout={horizontal ? 'vertical' : 'horizontal'}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          )}
          
          <XAxis 
            type={horizontal ? 'number' : 'category'}
            dataKey={horizontal ? undefined : xAxisKey}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            stroke="#e5e7eb"
          />
          
          <YAxis 
            type={horizontal ? 'category' : 'number'}
            dataKey={horizontal ? xAxisKey : undefined}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            stroke="#e5e7eb"
          />
          
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              padding: '12px'
            }}
            cursor={{ fill: 'rgba(102, 126, 234, 0.1)' }}
          />
          
          <Bar
            dataKey={dataKey}
            fill={color}
            radius={[8, 8, 0, 0]}
            animationDuration={1000}
            animationBegin={0}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}