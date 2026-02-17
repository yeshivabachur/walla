import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function AvatarGroup({ 
  avatars = [],
  max = 5,
  size = 'md',
  className 
}) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const displayAvatars = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className={cn('flex items-center', className)}>
      {displayAvatars.map((avatar, index) => (
        <motion.div
          key={avatar.id || index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.1, zIndex: 10 }}
          className={cn(
            sizes[size],
            'rounded-full border-2 border-white bg-gradient-to-br from-indigo-500 to-purple-600',
            'flex items-center justify-center text-white font-semibold text-sm',
            'shadow-lg cursor-pointer',
            index > 0 && '-ml-3'
          )}
          style={{ zIndex: displayAvatars.length - index }}
        >
          {avatar.image ? (
            <img src={avatar.image} alt={avatar.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            avatar.name?.charAt(0)?.toUpperCase() || '?'
          )}
        </motion.div>
      ))}

      {remaining > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: max * 0.05 }}
          className={cn(
            sizes[size],
            'rounded-full border-2 border-white bg-gray-300',
            'flex items-center justify-center text-gray-700 font-semibold text-xs',
            'shadow-lg -ml-3'
          )}
        >
          +{remaining}
        </motion.div>
      )}
    </div>
  );
}