import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Folder, File } from 'lucide-react';
import { cn } from '@/lib/utils';

function TreeNode({ node, level = 0 }) {
  const [isOpen, setIsOpen] = useState(node.defaultOpen || false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className={cn(
          'flex items-center gap-2 py-2 px-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors',
          level > 0 && 'ml-6'
        )}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        {hasChildren && (
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </motion.div>
        )}
        
        {!hasChildren && <div className="w-4" />}
        
        {hasChildren ? (
          <Folder className={cn('w-4 h-4', isOpen ? 'text-indigo-600' : 'text-gray-400')} />
        ) : (
          <File className="w-4 h-4 text-gray-400" />
        )}
        
        <span className="text-sm font-medium text-gray-700">{node.label}</span>
      </motion.div>

      <AnimatePresence>
        {isOpen && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {node.children.map((child, index) => (
              <TreeNode key={index} node={child} level={level + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TreeView({ data, className }) {
  return (
    <div className={cn('bg-white rounded-xl p-4 shadow-sm', className)}>
      {data.map((node, index) => (
        <TreeNode key={index} node={node} />
      ))}
    </div>
  );
}