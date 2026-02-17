import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Download, ArrowRight } from 'lucide-react';
import GradientButton from '@/components/ui/GradientButton';
import BlobBackground from '@/components/ui/BlobBackground';
import CountUp from '@/components/ui/CountUp';

export default function CTASection({ className }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <BlobBackground />
      
      <div className="relative max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Download the app and
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                start riding today
              </span>
            </h2>

            <p className="text-xl text-gray-600 mb-8">
              Join over 50,000 riders who trust Walla for their daily commute
            </p>

            <div className="flex items-center gap-4 mb-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors"
              >
                <Download className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="font-semibold">App Store</div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors"
              >
                <Download className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-xs">GET IT ON</div>
                  <div className="font-semibold">Google Play</div>
                </div>
              </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { value: 50000, suffix: '+', label: 'Active Users' },
                { value: 4.9, decimals: 1, label: 'App Rating' },
                { value: 10, suffix: 'M+', label: 'Rides Completed' }
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    <CountUp end={stat.value} decimals={stat.decimals || 0} suffix={stat.suffix || ''} />
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right side - Phone mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="relative z-10"
            >
              <div className="w-full max-w-sm mx-auto">
                {/* Phone frame */}
                <div className="relative bg-gray-900 rounded-[3rem] p-4 shadow-2xl">
                  <div className="bg-white rounded-[2.5rem] overflow-hidden">
                    {/* Notch */}
                    <div className="h-6 bg-gray-900 rounded-b-3xl w-40 mx-auto" />
                    
                    {/* Screen content */}
                    <div className="aspect-[9/19] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 flex flex-col justify-between">
                      <div>
                        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 mb-4">
                          <div className="h-4 bg-white/40 rounded mb-2 w-3/4" />
                          <div className="h-4 bg-white/40 rounded w-1/2" />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4">
                          <div className="h-3 bg-white/40 rounded mb-2" />
                          <div className="h-3 bg-white/40 rounded w-2/3" />
                        </div>
                        <div className="bg-white rounded-2xl p-4 shadow-xl">
                          <div className="h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating elements */}
            <motion.div
              animate={{
                y: [0, -15, 0],
                rotate: [0, 5, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: 0.5
              }}
              className="absolute top-10 -left-10 w-24 h-24 bg-indigo-400/30 rounded-2xl blur-xl"
            />

            <motion.div
              animate={{
                y: [0, 15, 0],
                rotate: [0, -5, 0]
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                delay: 1
              }}
              className="absolute bottom-10 -right-10 w-32 h-32 bg-purple-400/30 rounded-2xl blur-xl"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}