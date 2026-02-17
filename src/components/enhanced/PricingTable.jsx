import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap } from 'lucide-react';
import GradientCard from '@/components/ui/GradientCard';
import GradientButton from '@/components/ui/GradientButton';
import RevealOnScroll from '@/components/ui/RevealOnScroll';

const plans = [
  {
    name: 'Basic',
    price: 0,
    period: 'month',
    description: 'Perfect for occasional riders',
    features: [
      'Pay per ride',
      'Standard vehicles',
      'Basic support',
      'Standard pricing'
    ],
    gradient: 'cool',
    popular: false
  },
  {
    name: 'Premium',
    price: 29,
    period: 'month',
    description: 'Best for regular commuters',
    features: [
      '20% off all rides',
      'Premium vehicles',
      'Priority support',
      'No surge pricing',
      'Exclusive rewards',
      'Free cancellations'
    ],
    gradient: 'primary',
    popular: true
  },
  {
    name: 'Elite',
    price: 99,
    period: 'month',
    description: 'Ultimate luxury experience',
    features: [
      '40% off all rides',
      'Luxury vehicles only',
      'Dedicated concierge',
      'No surge, ever',
      'VIP rewards',
      'Unlimited cancellations',
      'Airport lounge access',
      'Personal driver matching'
    ],
    gradient: 'warm',
    popular: false
  }
];

export default function PricingTable({ className }) {
  return (
    <div className={`max-w-6xl mx-auto px-4 py-20 ${className}`}>
      <RevealOnScroll className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Choose Your <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Plan</span>
        </h2>
        <p className="text-xl text-gray-600">Save more with our subscription plans</p>
      </RevealOnScroll>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <RevealOnScroll
            key={plan.name}
            direction="up"
            delay={index * 0.1}
          >
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="h-full relative"
            >
              {plan.popular && (
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="absolute -top-4 left-1/2 -translate-x-1/2 z-10"
                >
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg flex items-center gap-1">
                    <Star className="w-3 h-3 fill-white" />
                    Most Popular
                  </div>
                </motion.div>
              )}

              <GradientCard 
                gradient={plan.gradient}
                className={cn(
                  'h-full p-8',
                  plan.popular && 'ring-4 ring-indigo-200 scale-105'
                )}
              >
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-white/80 text-sm">{plan.description}</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-white">${plan.price}</span>
                    <span className="text-white/80">/{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + i * 0.05 }}
                      className="flex items-center gap-3 text-white/90"
                    >
                      <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                <GradientButton
                  variant="success"
                  className="w-full h-12 bg-white text-gray-900 hover:bg-gray-50"
                >
                  {plan.price === 0 ? 'Get Started' : 'Subscribe Now'}
                  <Zap className="w-4 h-4 ml-2" />
                </GradientButton>
              </GradientCard>
            </motion.div>
          </RevealOnScroll>
        ))}
      </div>
    </div>
  );
}