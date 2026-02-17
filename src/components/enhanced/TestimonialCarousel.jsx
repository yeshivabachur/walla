import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Daily Commuter',
    avatar: 'SJ',
    rating: 5,
    text: 'Best ride-hailing experience ever! The drivers are professional and the app is super easy to use.',
    image: null
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Business Traveler',
    avatar: 'MC',
    rating: 5,
    text: 'I use Walla for all my business trips. Reliable, comfortable, and always on time.',
    image: null
  },
  {
    id: 3,
    name: 'Emma Davis',
    role: 'Student',
    avatar: 'ED',
    rating: 5,
    text: 'Affordable prices and great rewards program. Perfect for students!',
    image: null
  }
];

export default function TestimonialCarousel({ className }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    })
  };

  return (
    <div className={cn('relative max-w-4xl mx-auto px-4', className)}>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          What Our Riders Say
        </h2>
        <p className="text-gray-600">Join thousands of satisfied customers</p>
      </div>

      <div className="relative h-[400px] flex items-center">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 }
            }}
            className="absolute inset-0"
          >
            <div className="h-full flex items-center justify-center">
              <div className="glass-strong rounded-3xl p-8 md:p-12 max-w-2xl">
                <Quote className="w-12 h-12 text-indigo-600/20 mb-6" />

                <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed italic">
                  "{testimonials[current].text}"
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {testimonials[current].avatar}
                    </div>
                    
                    <div>
                      <p className="font-bold text-gray-900">{testimonials[current].name}</p>
                      <p className="text-sm text-gray-600">{testimonials[current].role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <button
          onClick={prev}
          className="absolute left-0 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>

        <button
          onClick={next}
          className="absolute right-0 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > current ? 1 : -1);
              setCurrent(index);
            }}
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              index === current
                ? 'w-8 bg-indigo-600'
                : 'w-2 bg-gray-300 hover:bg-gray-400'
            )}
          />
        ))}
      </div>
    </div>
  );
}