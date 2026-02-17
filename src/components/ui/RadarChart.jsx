import React from 'react';
import { motion } from 'framer-motion';
import { RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

export default function RadarChart({ 
  data,
  dataKey = 'value',
  color = '#667eea',
  height = 400,
  className = ''
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={className}
    >
      <ResponsiveContainer width="100%" height={height}>
        <RechartsRadar data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]}
            tick={{ fill: '#6b7280', fontSize: 10 }}
          />
          <Radar
            name="Score"
            dataKey={dataKey}
            stroke={color}
            fill={color}
            fillOpacity={0.6}
            animationDuration={1500}
          />
        </RechartsRadar>
      </ResponsiveContainer>
    </motion.div>
  );
}