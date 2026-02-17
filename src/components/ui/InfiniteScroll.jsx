import React, { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

export default function InfiniteScroll({ 
  children,
  hasMore,
  loading,
  onLoadMore,
  threshold = 100,
  className = ''
}) {
  const observerRef = useRef(null);
  const loadingRef = useRef(null);

  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore?.();
        }
      },
      { threshold: 0, rootMargin: `${threshold}px` }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, onLoadMore, threshold]);

  return (
    <div className={className}>
      {children}
      
      {hasMore && (
        <div ref={loadingRef} className="flex justify-center py-8">
          {loading && (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading more...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}