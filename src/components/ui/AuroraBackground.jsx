import React from 'react';
import { motion } from 'framer-motion';

export default function AuroraBackground({ className = '' }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <motion.div
        className="absolute inset-0 opacity-50"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3), transparent 50%), radial-gradient(circle at 80% 80%, rgba(74, 86, 226, 0.3), transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(120, 119, 198, 0.3), transparent 50%), radial-gradient(circle at 20% 80%, rgba(74, 86, 226, 0.3), transparent 50%)',
            'radial-gradient(circle at 50% 20%, rgba(120, 119, 198, 0.3), transparent 50%), radial-gradient(circle at 50% 80%, rgba(74, 86, 226, 0.3), transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3), transparent 50%), radial-gradient(circle at 80% 80%, rgba(74, 86, 226, 0.3), transparent 50%)',
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </div>
  );
}