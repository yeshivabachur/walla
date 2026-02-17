import React, { createContext, useContext, useCallback, useState } from 'react';

const SensoryContext = createContext(null);

export const SensoryProvider = ({ children }) => {
  const [audioTheme, setAudioTheme] = useState('cybernetic');
  const [hapticEnabled, setHapticEnabled] = useState(true);

  const playSound = useCallback((type) => {
    // In a real app, we'd use new Audio(`/sounds/${audioTheme}/${type}.mp3`).play();
    console.log(`[SensoryEngine] Playing ${type} sound in ${audioTheme} theme`);
    
    // Simulate haptic feedback
    if (hapticEnabled && window.navigator.vibrate) {
      const patterns = {
        success: [10, 30, 10],
        error: [50, 100, 50],
        click: [5]
      };
      window.navigator.vibrate(patterns[type] || [5]);
    }
  }, [audioTheme, hapticEnabled]);

  const triggerEasterEgg = useCallback((name) => {
    console.log(`[SensoryEngine] Easter Egg Triggered: ${name}`);
    playSound('success');
    // Implement specific whimsical logic
  }, [playSound]);

  return (
    <SensoryContext.Provider value={{ audioTheme, setAudioTheme, playSound, triggerEasterEgg }}>
      {children}
    </SensoryContext.Provider>
  );
};

export const useSensory = () => {
  const context = useContext(SensoryContext);
  if (!context) throw new Error('useSensory must be used within SensoryProvider');
  return context;
};
