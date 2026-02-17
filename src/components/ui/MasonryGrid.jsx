import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function MasonryGrid({ 
  items,
  columns = 3,
  gap = 4,
  className 
}) {
  const columnItems = Array.from({ length: columns }, () => []);
  
  items.forEach((item, index) => {
    columnItems[index % columns].push(item);
  });

  return (
    <div className={cn('flex gap-4', className)} style={{ gap: `${gap * 0.25}rem` }}>
      {columnItems.map((column, colIndex) => (
        <div key={colIndex} className="flex-1 space-y-4" style={{ gap: `${gap * 0.25}rem` }}>
          {column.map((item, itemIndex) => (
            <motion.div
              key={item.id || itemIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (colIndex * 0.1) + (itemIndex * 0.05) }}
              whileHover={{ scale: 1.02, zIndex: 10 }}
              className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              {item.content}
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}