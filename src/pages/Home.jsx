import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Clock, Zap, MapPin, Star, TrendingUp, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import GlassCard from '@/components/ui/GlassCard';
import GradientButton from '@/components/ui/GradientButton';
import BlobBackground from '@/components/ui/BlobBackground';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import CountUp from '@/components/ui/CountUp';
import ParticleBackground from '@/components/ui/ParticleBackground';
import ShinyButton from '@/components/ui/ShinyButton';
import TypewriterText from '@/components/ui/TypewriterText';

export default function Home() {
  const features = [
    { icon: Zap, title: 'Quick Pickups', desc: 'Get picked up in minutes' },
    { icon: Shield, title: 'Safe & Secure', desc: 'Verified drivers and 24/7 support' },
    { icon: Clock, title: 'Reliable Service', desc: 'Available when you need it' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white relative overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground particleCount={30} />
      
      {/* Animated Blobs */}
      <BlobBackground />
      
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-transparent to-transparent opacity-70" />
        
        <div className="relative max-w-6xl mx-auto px-4 pt-12 pb-20 sm:pt-20 sm:pb-28">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg mb-6 border border-indigo-100"
            >
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-700">Live in your city</span>
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="block"
              >
                Go Anywhere,
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
              >
                <TypewriterText text="Anytime" speed={100} />
              </motion.span>
            </h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8"
            >
              Request a ride with the tap of a button. Professional drivers, upfront pricing, and real-time tracking.
            </motion.p>
            
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex items-center justify-center gap-8 text-sm text-gray-600"
            >
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold"><CountUp end={4.9} decimals={1} /> rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <span className="font-semibold"><CountUp end={50000} separator="," />+ riders</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span className="font-semibold"><CountUp end={98} />% on-time</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex justify-center"
          >
            <Link to={createPageUrl('RequestRide')}>
              <ShinyButton className="h-16 px-12 text-lg rounded-full shadow-2xl">
                <MapPin className="w-6 h-6 mr-3" />
                Request a Ride Now
              </ShinyButton>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-4 py-16 relative">
        <RevealOnScroll direction="up" className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Choose <span className="text-gradient-primary">Walla</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience the future of ride-hailing with cutting-edge features
          </p>
        </RevealOnScroll>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <RevealOnScroll
              key={feature.title}
              direction="up"
              delay={index * 0.1}
            >
              <GlassCard className="text-center p-8 group">
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg"
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gradient-primary transition-all">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </GlassCard>
            </RevealOnScroll>
          ))}
        </div>


      </div>

      {/* CTA */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <RevealOnScroll direction="up">
          <div className="bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 rounded-3xl p-8 sm:p-16 text-center relative overflow-hidden shadow-2xl">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-grid" />
            </div>
            
            {/* Glowing orbs */}
            <motion.div
              className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl"
              animate={{
                x: [0, 100, 0],
                y: [0, 50, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
            <motion.div
              className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl"
              animate={{
                x: [0, -100, 0],
                y: [0, -50, 0],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
            
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
                  Drive and earn on <span className="text-gradient-warm">your schedule</span>
                </h2>
                <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                  Become a driver and start earning money on your own time. Flexible hours, competitive rates, and comprehensive support.
                </p>
                
                {/* Driver Stats */}
                <div className="flex items-center justify-center gap-8 mb-10 flex-wrap">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">
                      $<CountUp end={2500} separator="," />
                    </div>
                    <div className="text-sm text-gray-400">Avg weekly earnings</div>
                  </div>
                  <div className="w-px h-12 bg-white/20" />
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">
                      <CountUp end={10000} separator="," />+
                    </div>
                    <div className="text-sm text-gray-400">Active drivers</div>
                  </div>
                  <div className="w-px h-12 bg-white/20" />
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">
                      <CountUp end={24} />/7
                    </div>
                    <div className="text-sm text-gray-400">Support available</div>
                  </div>
                </div>
                
                <Link to={createPageUrl('DriverDashboard')}>
                  <GradientButton variant="success" className="h-16 px-10 text-lg rounded-full shadow-2xl">
                    Become a Driver
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </GradientButton>
                </Link>
              </motion.div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </div>
  );
}