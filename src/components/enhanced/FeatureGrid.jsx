import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Clock, DollarSign, Heart, Star } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import RevealOnScroll from '@/components/ui/RevealOnScroll';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Get picked up in under 3 minutes',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    icon: Shield,
    title: 'Safe & Secure',
    description: '24/7 support and verified drivers',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Clock,
    title: 'Always Available',
    description: 'Ride anytime, anywhere',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: DollarSign,
    title: 'Best Prices',
    description: 'Transparent pricing, no surprises',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Heart,
    title: 'Customer First',
    description: 'Your satisfaction is our priority',
    color: 'from-red-500 to-pink-500'
  },
  {
    icon: Star,
    title: 'Top Rated',
    description: '4.9/5 stars from 50,000+ riders',
    color: 'from-indigo-500 to-purple-500'
  }
];

export default function FeatureGrid({ className }) {
  return (
    <div className={`max-w-6xl mx-auto px-4 py-20 ${className}`}>
      <RevealOnScroll className="text-center mb-16">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="inline-block mb-4"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </motion.div>

        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Why Choose <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Walla</span>
        </h2>
        
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Experience the future of transportation with cutting-edge features
        </p>
      </RevealOnScroll>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <RevealOnScroll
            key={feature.title}
            direction="up"
            delay={index * 0.1}
          >
            <GlassCard className="p-8 h-full group relative overflow-hidden">
              {/* Gradient background on hover */}
              <div className={cn(
                'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300',
                feature.color
              )} />

              <motion.div
                whileHover={{ 
                  rotate: [0, -10, 10, -10, 0],
                  scale: 1.1
                }}
                transition={{ duration: 0.5 }}
                className={cn(
                  'w-16 h-16 bg-gradient-to-br rounded-2xl flex items-center justify-center mb-6 shadow-lg',
                  feature.color
                )}
              >
                <feature.icon className="w-8 h-8 text-white" />
              </motion.div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover indicator */}
              <motion.div
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                className={cn('absolute bottom-0 left-0 h-1 bg-gradient-to-r', feature.color)}
              />
            </GlassCard>
          </RevealOnScroll>
        ))}
      </div>
    </div>
  );
}