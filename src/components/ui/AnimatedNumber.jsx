import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AnimatedNumber({ 
  value,
  className = ''
}) {
  const digits = String(value).split('');

  return (
    <div className={`inline-flex ${className}`}>
      <AnimatePresence mode="popLayout">
        {digits.map((digit, index) => (
          <motion.span
            key={`${index}-${digit}-${value}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30,
              delay: index * 0.03
            }}
            className="inline-block tabular-nums"
          >
            {digit}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}