import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CommandPalette({ 
  commands = [],
  isOpen,
  onClose,
  onSelect
}) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(0);

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(search.toLowerCase()) ||
    cmd.description?.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelected((prev) => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelected((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter' && filteredCommands[selected]) {
        e.preventDefault();
        onSelect?.(filteredCommands[selected]);
        onClose?.();
      } else if (e.key === 'Escape') {
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selected, onSelect, onClose]);

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelected(0);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Palette */}
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
            >
              {/* Search */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Type a command or search..."
                  className="flex-1 outline-none text-sm"
                  autoFocus
                />
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Command className="w-3 h-3" />
                  <span>K</span>
                </div>
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto p-2">
                {filteredCommands.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No results found
                  </div>
                ) : (
                  filteredCommands.map((command, index) => (
                    <motion.button
                      key={command.id || index}
                      onClick={() => {
                        onSelect?.(command);
                        onClose?.();
                      }}
                      onMouseEnter={() => setSelected(index)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
                        selected === index
                          ? 'bg-indigo-50 text-indigo-900'
                          : 'hover:bg-gray-50'
                      )}
                    >
                      {command.icon && (
                        <div className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center',
                          selected === index ? 'bg-indigo-100' : 'bg-gray-100'
                        )}>
                          <command.icon className="w-4 h-4" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{command.label}</p>
                        {command.description && (
                          <p className="text-xs text-gray-500 truncate">{command.description}</p>
                        )}
                      </div>

                      {command.shortcut && (
                        <div className="flex items-center gap-1">
                          {command.shortcut.map((key, i) => (
                            <kbd key={i} className="px-2 py-1 bg-gray-100 text-xs rounded">
                              {key}
                            </kbd>
                          ))}
                        </div>
                      )}

                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </motion.button>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}