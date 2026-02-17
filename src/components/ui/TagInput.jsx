import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Input } from './input';
import { cn } from '@/lib/utils';

export default function TagInput({ 
  tags = [],
  onChange,
  placeholder = 'Add tags...',
  maxTags = 10,
  className 
}) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      if (tags.length < maxTags && !tags.includes(input.trim())) {
        onChange?.([...tags, input.trim()]);
        setInput('');
      }
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      onChange?.(tags.slice(0, -1));
    }
  };

  const removeTag = (index) => {
    onChange?.(tags.filter((_, i) => i !== index));
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-xl bg-white min-h-[50px]">
        <AnimatePresence>
          {tags.map((tag, index) => (
            <motion.div
              key={tag}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-1 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full"
            >
              <span className="text-sm font-medium">{tag}</span>
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                onClick={() => removeTag(index)}
                className="hover:bg-indigo-200 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] outline-none text-sm bg-transparent"
        />
      </div>

      {tags.length > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-gray-500"
        >
          {tags.length} / {maxTags} tags
        </motion.p>
      )}
    </div>
  );
}