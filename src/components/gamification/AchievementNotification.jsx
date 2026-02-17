import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AchievementNotification({ achievement, onClose }) {
  React.useEffect(() => {
    if (achievement) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [achievement]);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-yellow-50 to-orange-50 overflow-hidden">
            <CardContent className="p-6 relative">
              <Sparkles className="absolute top-2 right-2 w-5 h-5 text-yellow-500 animate-pulse" />
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-3xl">
                  {achievement.icon || '🏆'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="w-4 h-4 text-yellow-600" />
                    <span className="text-xs font-semibold text-yellow-700 uppercase">Achievement Unlocked!</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{achievement.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                  {achievement.reward_amount > 0 && (
                    <p className="text-sm font-semibold text-green-600">
                      +${achievement.reward_amount} Bonus!
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}