import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, MessageCircle } from 'lucide-react';
import AccordionAnimated from '@/components/ui/AccordionAnimated';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import GradientButton from '@/components/ui/GradientButton';

const faqs = [
  {
    title: 'How do I request a ride?',
    content: 'Simply enter your pickup and drop-off locations, choose your vehicle type, and tap "Request Ride". A nearby driver will be matched to you within seconds.',
    defaultOpen: true
  },
  {
    title: 'What payment methods do you accept?',
    content: 'We accept credit/debit cards, PayPal, Apple Pay, Google Pay, and cryptocurrency. You can also use ride credits and loyalty points.'
  },
  {
    title: 'Can I schedule rides in advance?',
    content: 'Yes! You can schedule rides up to 30 days in advance. Just toggle the "Schedule" option when booking.'
  },
  {
    title: 'What is surge pricing?',
    content: 'Surge pricing occurs during high-demand periods. Our app shows real-time surge multipliers and suggests the best times to ride for lower prices.'
  },
  {
    title: 'How do I become a driver?',
    content: 'Visit our Driver Dashboard, complete the onboarding process with your documents, pass the background check, and start earning. The entire process takes 2-3 days.'
  },
  {
    title: 'Is my ride insured?',
    content: 'Yes, all rides are covered by comprehensive insurance. Both drivers and passengers are protected throughout the journey.'
  }
];

export default function FAQSection({ className }) {
  return (
    <div className={`max-w-4xl mx-auto px-4 py-20 ${className}`}>
      <RevealOnScroll className="text-center mb-12">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl"
        >
          <HelpCircle className="w-8 h-8 text-white" />
        </motion.div>

        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Frequently Asked <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Questions</span>
        </h2>
        
        <p className="text-xl text-gray-600">
          Everything you need to know about Walla
        </p>
      </RevealOnScroll>

      <RevealOnScroll direction="up" delay={0.2}>
        <AccordionAnimated items={faqs} />
      </RevealOnScroll>

      <RevealOnScroll direction="up" delay={0.4} className="text-center mt-12">
        <div className="glass-strong rounded-2xl p-8">
          <MessageCircle className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Still have questions?</h3>
          <p className="text-gray-600 mb-6">Our support team is available 24/7 to help you</p>
          <GradientButton>
            Contact Support
          </GradientButton>
        </div>
      </RevealOnScroll>
    </div>
  );
}