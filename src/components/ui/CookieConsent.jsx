import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Settings } from 'lucide-react';
import GradientButton from './GradientButton';
import { Button } from './button';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookieConsent', JSON.stringify({ necessary: true, analytics: true, marketing: true }));
    setIsVisible(false);
  };

  const handleAcceptSelected = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', JSON.stringify({ necessary: true, analytics: false, marketing: false }));
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />

          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4"
          >
            <div className="max-w-4xl mx-auto glass-strong rounded-3xl p-6 shadow-2xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Cookie className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">We value your privacy</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                    {!showSettings && (
                      <button
                        onClick={() => setShowSettings(true)}
                        className="text-indigo-600 hover:text-indigo-700 ml-1 font-medium"
                      >
                        Customize preferences
                      </button>
                    )}
                  </p>

                  {showSettings && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="space-y-3 mb-4"
                    >
                      {[
                        { key: 'necessary', label: 'Necessary', description: 'Required for the site to function', disabled: true },
                        { key: 'analytics', label: 'Analytics', description: 'Help us improve our service' },
                        { key: 'marketing', label: 'Marketing', description: 'Personalized advertisements' }
                      ].map((cookie) => (
                        <div key={cookie.key} className="flex items-center justify-between bg-white/50 p-3 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-sm text-gray-900">{cookie.label}</p>
                            <p className="text-xs text-gray-600">{cookie.description}</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={preferences[cookie.key]}
                            onChange={(e) => setPreferences({ ...preferences, [cookie.key]: e.target.checked })}
                            disabled={cookie.disabled}
                            className="w-5 h-5"
                          />
                        </div>
                      ))}
                    </motion.div>
                  )}

                  <div className="flex items-center gap-3 flex-wrap">
                    <GradientButton onClick={handleAcceptAll} className="h-10 px-6">
                      Accept All
                    </GradientButton>

                    {showSettings && (
                      <Button onClick={handleAcceptSelected} className="h-10 px-6 rounded-xl">
                        Save Preferences
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      onClick={handleReject}
                      className="h-10 px-6 rounded-xl"
                    >
                      Reject All
                    </Button>
                  </div>
                </div>

                <button
                  onClick={() => setIsVisible(false)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}