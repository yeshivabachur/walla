import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, RotateCcw } from 'lucide-react';
import { Button } from './button';
import ChipSelector from './ChipSelector';
import PriceSlider from './PriceSlider';
import StarRating from './StarRating';
import { cn } from '@/lib/utils';

export default function FilterPanel({ 
  filters,
  onApply,
  className 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});

  const handleApply = () => {
    onApply?.(activeFilters);
    setIsOpen(false);
  };

  const handleReset = () => {
    setActiveFilters({});
    onApply?.({});
  };

  const activeCount = Object.values(activeFilters).flat().filter(Boolean).length;

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          'relative px-4 py-2 bg-white border-2 border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all flex items-center gap-2 font-medium',
          className
        )}
      >
        <Filter className="w-4 h-4" />
        Filters
        
        {activeCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-5 h-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center font-bold"
          >
            {activeCount}
          </motion.div>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {activeCount > 0 && (
                  <motion.button
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={handleReset}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Clear all
                  </motion.button>
                )}
              </div>

              {/* Filters content */}
              <div className="p-6 space-y-8">
                {filters?.categories && (
                  <div>
                    <label className="text-sm font-semibold text-gray-900 mb-3 block">
                      Categories
                    </label>
                    <ChipSelector
                      options={filters.categories}
                      selected={activeFilters.categories || []}
                      onChange={(selected) => setActiveFilters({ ...activeFilters, categories: selected })}
                    />
                  </div>
                )}

                {filters?.priceRange && (
                  <div>
                    <PriceSlider
                      min={filters.priceRange.min}
                      max={filters.priceRange.max}
                      value={activeFilters.priceRange || [filters.priceRange.min, filters.priceRange.max]}
                      onChange={(range) => setActiveFilters({ ...activeFilters, priceRange: range })}
                    />
                  </div>
                )}

                {filters?.rating && (
                  <div>
                    <label className="text-sm font-semibold text-gray-900 mb-3 block">
                      Minimum Rating
                    </label>
                    <StarRating
                      rating={activeFilters.rating || 0}
                      onChange={(rating) => setActiveFilters({ ...activeFilters, rating })}
                    />
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
                <Button
                  onClick={handleApply}
                  className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl"
                >
                  Apply Filters
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}