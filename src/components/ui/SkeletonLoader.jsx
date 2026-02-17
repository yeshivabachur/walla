import React from 'react';
import { cn } from '@/lib/utils';

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-3 w-32 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="h-6 w-16 bg-gray-200 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3, className }) {
  return (
    <div className={cn('space-y-2 animate-pulse', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className="h-4 bg-gray-200 rounded"
          style={{ width: `${100 - (i * 10)}%` }}
        />
      ))}
    </div>
  );
}

export function SkeletonImage({ className }) {
  return (
    <div className={cn('bg-gray-200 rounded-lg animate-pulse', className)} />
  );
}

export function SkeletonButton({ className }) {
  return (
    <div className={cn('h-10 bg-gray-200 rounded-lg animate-pulse', className)} />
  );
}