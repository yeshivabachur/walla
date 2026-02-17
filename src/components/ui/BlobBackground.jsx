import React from 'react';
import { motion } from 'framer-motion';

export default function BlobBackground({ className = '' }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Blob 1 */}
      <motion.div
        className="absolute top-0 -left-20 w-96 h-96 bg-indigo-400/30 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      
      {/* Blob 2 */}
      <motion.div
        className="absolute top-40 right-0 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl"
        animate={{
          x: [0, -80, 0],
          y: [0, 100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1
        }}
      />
      
      {/* Blob 3 */}
      <motion.div
        className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-400/30 rounded-full blur-3xl"
        animate={{
          x: [0, -50, 0],
          y: [0, -80, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2
        }}
      />
    </div>
  );
}