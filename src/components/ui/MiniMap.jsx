import React from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MiniMap({ 
  mainContent,
  miniContent,
  defaultExpanded = false,
  className 
}) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

  return (
    <div className={cn('relative', className)}>
      {mainContent}

      <motion.div
        animate={{
          width: isExpanded ? 300 : 150,
          height: isExpanded ? 200 : 100
        }}
        transition={{ type: 'spring', damping: 25 }}
        className="absolute bottom-4 right-4 glass-strong rounded-xl shadow-2xl overflow-hidden border border-white/20"
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute top-2 right-2 w-6 h-6 bg-white/80 hover:bg-white rounded-lg flex items-center justify-center transition-colors z-10"
        >
          {isExpanded ? (
            <Minimize2 className="w-3 h-3" />
          ) : (
            <Maximize2 className="w-3 h-3" />
          )}
        </button>

        <div className="w-full h-full">
          {miniContent}
        </div>
      </motion.div>
    </div>
  );
}