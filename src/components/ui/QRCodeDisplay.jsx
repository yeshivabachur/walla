import React from 'react';
import { motion } from 'framer-motion';
import { Download, Share2 } from 'lucide-react';
import { Button } from './button';

export default function QRCodeDisplay({ 
  data,
  size = 200,
  logo,
  className = ''
}) {
  // Simple QR code placeholder - in production use a QR library
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring' }}
      className={`inline-flex flex-col items-center ${className}`}
    >
      <div 
        className="bg-white p-6 rounded-2xl shadow-xl border-4 border-gray-100"
        style={{ width: size + 48, height: size + 48 }}
      >
        <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center relative">
          {/* QR pattern placeholder */}
          <div className="grid grid-cols-8 gap-1 p-4">
            {Array.from({ length: 64 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: Math.random() > 0.5 ? 1 : 0 }}
                transition={{ delay: i * 0.01 }}
                className="w-full aspect-square bg-white rounded-sm"
              />
            ))}
          </div>

          {logo && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-white rounded-lg p-2">
                <img src={logo} alt="Logo" className="w-full h-full object-contain" />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <Button variant="outline" size="sm" className="rounded-xl">
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
        <Button variant="outline" size="sm" className="rounded-xl">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>
    </motion.div>
  );
}