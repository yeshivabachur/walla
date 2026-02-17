import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card } from './card';

export default function HolographicCard({ 
  children, 
  className,
  ...props 
}) {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotX = ((y - centerY) / centerY) * -10;
    const rotY = ((x - centerX) / centerX) * 10;
    
    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ transformStyle: 'preserve-3d' }}
      className={cn('perspective-1000', className)}
    >
      <Card
        className={cn(
          'relative overflow-hidden',
          'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500',
          'shadow-2xl',
          className
        )}
        style={{
          background: `
            linear-gradient(
              ${135 + rotateY}deg,
              rgba(102, 126, 234, 1) 0%,
              rgba(118, 75, 162, 1) 25%,
              rgba(240, 147, 251, 1) 50%,
              rgba(79, 172, 254, 1) 75%,
              rgba(102, 126, 234, 1) 100%
            )
          `,
          backgroundSize: '400% 400%'
        }}
        {...props}
      >
        {/* Holographic shine */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(
              circle at ${50 + rotateY * 5}% ${50 + rotateX * 5}%,
              rgba(255, 255, 255, 0.8) 0%,
              transparent 60%
            )`
          }}
        />
        
        {/* Content */}
        <div className="relative z-10" style={{ transform: 'translateZ(50px)' }}>
          {children}
        </div>
      </Card>
    </motion.div>
  );
}