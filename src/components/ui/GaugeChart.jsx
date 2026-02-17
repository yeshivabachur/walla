import React from 'react';
import { motion } from 'framer-motion';

export default function GaugeChart({ 
  value = 0,
  min = 0,
  max = 100,
  label,
  size = 200,
  color = '#667eea',
  className = ''
}) {
  const percentage = ((value - min) / (max - min)) * 100;
  const rotation = (percentage / 100) * 180 - 90;

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size / 2 + 20 }}>
      <svg width={size} height={size / 2} viewBox={`0 0 ${size} ${size / 2}`}>
        {/* Background arc */}
        <path
          d={`M ${size * 0.1} ${size / 2} A ${size * 0.4} ${size * 0.4} 0 0 1 ${size * 0.9} ${size / 2}`}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="20"
          strokeLinecap="round"
        />
        
        {/* Progress arc */}
        <motion.path
          d={`M ${size * 0.1} ${size / 2} A ${size * 0.4} ${size * 0.4} 0 0 1 ${size * 0.9} ${size / 2}`}
          fill="none"
          stroke={color}
          strokeWidth="20"
          strokeLinecap="round"
          strokeDasharray={`${(percentage / 100) * Math.PI * size * 0.4} ${Math.PI * size * 0.4}`}
          initial={{ strokeDasharray: `0 ${Math.PI * size * 0.4}` }}
          animate={{ strokeDasharray: `${(percentage / 100) * Math.PI * size * 0.4} ${Math.PI * size * 0.4}` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>

      {/* Needle */}
      <motion.div
        className="absolute bottom-0 left-1/2 origin-bottom"
        style={{
          width: 4,
          height: size * 0.35,
          backgroundColor: color,
          borderRadius: '2px'
        }}
        initial={{ rotate: -90 }}
        animate={{ rotate: rotation }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />

      {/* Center dot */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-4 rounded-full"
        style={{ borderColor: color }}
      />

      {/* Value */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center"
        style={{ transform: 'translate(-50%, 50%)' }}
      >
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        {label && <div className="text-sm text-gray-600">{label}</div>}
      </motion.div>
    </div>
  );
}