import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, TrendingUp, Star } from 'lucide-react';

export default function SocialProofWidget() {
  const [currentProof, setCurrentProof] = useState(null);
  const [proofs, setProofs] = useState([]);

  useEffect(() => {
    const generateProofs = async () => {
      const messages = [
        { type: 'recent_booking', message: 'Sarah just booked a ride to Airport', icon: Users },
        { type: 'milestone', message: '10,000 rides completed today!', icon: TrendingUp },
        { type: 'high_rating', message: 'Mike rated his driver 5 stars', icon: Star },
        { type: 'popular_route', message: '15 people riding to Downtown now', icon: TrendingUp }
      ];

      const generatedProofs = [];
      for (const msg of messages) {
        const proof = await base44.entities.SocialProof.create({
          type: msg.type,
          message: msg.message,
          timestamp: new Date().toISOString(),
          location: 'Downtown'
        });
        generatedProofs.push({ ...proof, icon: msg.icon });
      }
      
      setProofs(generatedProofs);
      setCurrentProof(generatedProofs[0]);
    };

    generateProofs();
  }, []);

  useEffect(() => {
    if (proofs.length === 0) return;

    const interval = setInterval(() => {
      setCurrentProof(prev => {
        const currentIndex = proofs.findIndex(p => p.id === prev?.id);
        return proofs[(currentIndex + 1) % proofs.length];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [proofs]);

  if (!currentProof) return null;

  const Icon = currentProof.icon;

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentProof.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="bg-white rounded-xl shadow-lg p-4 max-w-sm border border-gray-100"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <Icon className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-sm text-gray-800">{currentProof.message}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}