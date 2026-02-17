import React from 'react';
import { Star } from 'lucide-react';

export default function RatingDisplay({ rating, count, size = 'sm' }) {
  if (!rating && !count) return null;
  
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };
  
  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className="flex items-center gap-1">
      <Star className={`${sizeClasses[size]} fill-yellow-400 text-yellow-400`} />
      <span className={`font-semibold text-gray-900 ${textSizes[size]}`}>
        {rating ? rating.toFixed(1) : '0.0'}
      </span>
      {count !== undefined && (
        <span className={`text-gray-500 ${textSizes[size]}`}>
          ({count})
        </span>
      )}
    </div>
  );
}