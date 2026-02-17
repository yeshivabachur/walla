import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import GradientButton from './GradientButton';

export default function ErrorBoundaryUI({ 
  error,
  resetError,
  goHome
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-2xl"
      >
        {/* Error icon */}
        <motion.div
          animate={{
            rotate: [0, -10, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 2
          }}
          className="w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
        >
          <AlertTriangle className="w-12 h-12 text-white" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-gray-900 mb-4"
        >
          Oops! Something went wrong
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-gray-600 mb-8"
        >
          We're sorry for the inconvenience. Please try refreshing the page.
        </motion.p>

        {error && (
          <motion.details
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8 text-left bg-white/50 backdrop-blur-sm rounded-xl p-4"
          >
            <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
              Error details
            </summary>
            <code className="text-xs text-red-600 block overflow-auto">
              {error.toString()}
            </code>
          </motion.details>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-4"
        >
          <GradientButton onClick={resetError}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </GradientButton>

          {goHome && (
            <Button
              variant="outline"
              onClick={goHome}
              className="h-12 px-6 rounded-xl"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}