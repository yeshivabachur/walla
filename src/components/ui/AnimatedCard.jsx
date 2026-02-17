import React from 'react';
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";

export default function AnimatedCard({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className={className}
    >
      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
        {children}
      </Card>
    </motion.div>
  );
}