import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';

export default function AudioWaveform({ 
  src,
  bars = 40,
  className = ''
}) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const waveformData = Array.from({ length: bars }, () => Math.random() * 100);
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`flex items-center gap-4 glass rounded-xl p-4 ${className}`}>
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={togglePlay}
        className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0"
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 text-white" />
        ) : (
          <Play className="w-5 h-5 text-white ml-0.5" />
        )}
      </motion.button>

      <div className="flex-1 flex items-center gap-0.5 h-16">
        {waveformData.map((height, index) => {
          const isPast = (index / bars) * 100 < progress;

          return (
            <motion.div
              key={index}
              className="flex-1 rounded-full"
              style={{
                backgroundColor: isPast ? '#667eea' : '#e5e7eb',
                height: `${height}%`
              }}
              initial={{ scaleY: 0 }}
              animate={{ 
                scaleY: isPlaying ? [1, 1.3, 1] : 1 
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.02,
                repeat: isPlaying ? Infinity : 0,
                repeatDelay: 0.5
              }}
            />
          );
        })}
      </div>

      <div className="text-sm font-medium text-gray-700 w-16 text-right">
        {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}
      </div>
    </div>
  );
}