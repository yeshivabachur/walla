import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

export default function PullToRefresh({ 
  onRefresh,
  children,
  threshold = 80,
  className = ''
}) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, threshold], [0, 1]);
  const rotate = useTransform(y, [0, threshold], [0, 360]);

  const handleDragEnd = async (event, info) => {
    if (info.offset.y > threshold && !isRefreshing) {
      setIsRefreshing(true);
      await onRefresh?.();
      setIsRefreshing(false);
    }
    y.set(0);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Pull indicator */}
      <motion.div
        style={{ opacity }}
        className="absolute top-0 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          style={{ rotate }}
          className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg"
        >
          <RefreshCw className="w-5 h-5 text-white" />
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.3}
        onDragEnd={handleDragEnd}
        style={{ y }}
      >
        {children}
      </motion.div>

      {/* Refreshing overlay */}
      {isRefreshing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-4 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <RefreshCw className="w-5 h-5 text-indigo-600" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
}