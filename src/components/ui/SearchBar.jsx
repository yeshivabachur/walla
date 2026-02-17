import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp } from 'lucide-react';
import { Input } from './input';
import { cn } from '@/lib/utils';

export default function SearchBar({ 
  onSearch,
  suggestions = [],
  recentSearches = [],
  popularSearches = [],
  className 
}) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (value) => {
    setQuery(value);
    onSearch?.(value);
  };

  return (
    <div className={cn('relative', className)}>
      <motion.div
        animate={{
          scale: isFocused ? 1.02 : 1,
          boxShadow: isFocused 
            ? '0 10px 40px -10px rgba(102, 126, 234, 0.3)' 
            : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}
        transition={{ duration: 0.2 }}
        className="relative"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        
        <Input
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Search destinations, drivers..."
          className="pl-12 pr-12 h-14 rounded-2xl border-0 bg-white shadow-sm"
        />

        {query && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => handleSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </motion.button>
        )}
      </motion.div>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {isFocused && (suggestions.length > 0 || popularSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50"
          >
            {suggestions.length > 0 && (
              <div className="mb-2">
                <p className="text-xs font-semibold text-gray-500 px-3 py-2">Suggestions</p>
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleSearch(suggestion)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    <Search className="w-4 h-4 text-gray-400 inline mr-2" />
                    <span className="text-sm text-gray-900">{suggestion}</span>
                  </motion.button>
                ))}
              </div>
            )}

            {popularSearches.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 px-3 py-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Popular
                </p>
                {popularSearches.map((search, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    <span className="text-sm text-gray-900">{search}</span>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}