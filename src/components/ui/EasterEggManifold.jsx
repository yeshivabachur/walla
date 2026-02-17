import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Ghost, Zap, Gift, Music } from 'lucide-react';
import { toast } from 'sonner';
import { useSensory } from '@/state/SensoryProvider';

export default function EasterEggManifold() {
  const { triggerEasterEgg, playSound } = useSensory();
  const [sequence, setSequence] = useState([]);
  const secret = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown'];

  useEffect(() => {
    const handleKeyDown = (e) => {
      const newSequence = [...sequence, e.key].slice(-4);
      setSequence(newSequence);
      
      if (newSequence.join(',') === secret.join(',')) {
        triggerEasterEgg('QUANTUM_REVEAL');
        toast("Easter Egg Unlocked: Multiverse Mode Engaged!", {
          icon: <Sparkles className="text-yellow-400" />,
          description: "Localized reality has been slightly shifted."
        });
        setSequence([]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sequence, triggerEasterEgg]);

  return null; // Invisible listener
}
