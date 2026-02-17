import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ChartAnimated({ 
  data,
  dataKey = 'value',
  xAxisKey = 'name',
  color = '#667eea',
  height = 300,
  showGrid = true,
  gradient = true
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          )}
          
          <XAxis 
            dataKey={xAxisKey}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            stroke="#e5e7eb"
          />
          
          <YAxis 
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
          />
          
          {gradient ? (
            <>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={3}
                fill="url(#colorGradient)"
                animationDuration={1500}
                animationBegin={0}
              />
            </>
          ) : (
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={3}
              fill={color}
              fillOpacity={0.2}
              animationDuration={1500}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}