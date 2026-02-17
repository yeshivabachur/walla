import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function AnalogClock({ 
  size = 200,
  showNumbers = true,
  className = ''
}) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourAngle = (hours * 30) + (minutes * 0.5) - 90;
  const minuteAngle = (minutes * 6) - 90;
  const secondAngle = (seconds * 6) - 90;

  return (
    <div 
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox="0 0 200 200">
        {/* Clock face */}
        <circle
          cx="100"
          cy="100"
          r="95"
          fill="white"
          stroke="#e5e7eb"
          strokeWidth="2"
        />

        {/* Hour markers */}
        {showNumbers && Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x = 100 + 70 * Math.cos(angle);
          const y = 100 + 70 * Math.sin(angle);

          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-sm font-bold fill-gray-700"
            >
              {i === 0 ? 12 : i}
            </text>
          );
        })}

        {/* Hour hand */}
        <motion.line
          x1="100"
          y1="100"
          x2="100"
          y2="60"
          stroke="#667eea"
          strokeWidth="6"
          strokeLinecap="round"
          animate={{ rotate: hourAngle }}
          style={{ originX: '100px', originY: '100px' }}
          transition={{ type: 'spring', stiffness: 50 }}
        />

        {/* Minute hand */}
        <motion.line
          x1="100"
          y1="100"
          x2="100"
          y2="40"
          stroke="#764ba2"
          strokeWidth="4"
          strokeLinecap="round"
          animate={{ rotate: minuteAngle }}
          style={{ originX: '100px', originY: '100px' }}
          transition={{ type: 'spring', stiffness: 50 }}
        />

        {/* Second hand */}
        <motion.line
          x1="100"
          y1="100"
          x2="100"
          y2="30"
          stroke="#f093fb"
          strokeWidth="2"
          strokeLinecap="round"
          animate={{ rotate: secondAngle }}
          style={{ originX: '100px', originY: '100px' }}
        />

        {/* Center dot */}
        <circle
          cx="100"
          cy="100"
          r="8"
          fill="#667eea"
        />
      </svg>

      {/* Digital time */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm font-mono"
      >
        {time.toLocaleTimeString()}
      </motion.div>
    </div>
  );
}