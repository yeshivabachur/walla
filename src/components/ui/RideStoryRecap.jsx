import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, Star, Share2, Heart, Download } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import confetti from 'canvas-confetti';

export default function RideStoryRecap({ rideRequest }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showStory, setShowStory] = useState(false);

  const triggerCelebration = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4f46e5', '#ec4899', '#06b6d4']
    });
  };

  const slides = [
    { title: "The Journey Begins", desc: `Picked up at ${rideRequest?.pickup_location}`, icon: Star },
    { title: "Quantum Speed", desc: "Top velocity reached: 142km/h", icon: Sparkles },
    { title: "Eco Impact", desc: "Saved 4.2kg of CO2 this trip", icon: Heart },
    { title: "Arrival", desc: `Successfully docked at ${rideRequest?.dropoff_location}`, icon: Trophy }
  ];

  return (
    <div className="w-full">
      {!showStory ? (
        <Button 
          onClick={() => { setShowStory(true); triggerCelebration(); }}
          className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-black h-12 rounded-xl"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          View Your Ride Story
        </Button>
      ) : (
        <Card className="bg-black text-white border-white/10 h-[400px] relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.2)_0%,transparent_70%)]" />
              
              <div className="p-4 bg-white/5 rounded-full mb-6 border border-white/10">
                {React.createElement(slides[currentSlide].icon, { className: "w-8 h-8 text-cyan-400" })}
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-2 italic">
                {slides[currentSlide].title}
              </h3>
              <p className="text-sm text-white/60 font-mono">{slides[currentSlide].desc}</p>
            </motion.div>
          </AnimatePresence>

          {/* Progress Bars */}
          <div className="absolute top-4 left-4 right-4 flex gap-1">
            {slides.map((_, i) => (
              <div key={i} className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: i <= currentSlide ? '100%' : '0%' }}
                  className="h-full bg-cyan-400" 
                />
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="absolute bottom-6 left-6 right-6 flex justify-between gap-4">
            <Button 
              variant="outline" 
              onClick={() => setShowStory(false)}
              className="bg-white/5 border-white/10 text-[10px] uppercase font-bold"
            >
              Close
            </Button>
            <div className="flex gap-2">
              <Button size="icon" className="bg-indigo-600 rounded-full">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button 
                onClick={() => setCurrentSlide((currentSlide + 1) % slides.length)}
                className="bg-white text-black font-black px-6 rounded-xl"
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
