import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Music, Headphones, Gamepad2, Briefcase, Sparkles, Newspaper } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const activities = [
  {
    type: 'music',
    icon: Music,
    name: 'Music Mix',
    description: 'Curated playlist for your mood',
    color: 'bg-pink-100 text-pink-800'
  },
  {
    type: 'podcast',
    icon: Headphones,
    name: 'Podcasts',
    description: 'Educational & entertaining',
    color: 'bg-purple-100 text-purple-800'
  },
  {
    type: 'game',
    icon: Gamepad2,
    name: 'Quick Games',
    description: 'Short casual games',
    color: 'bg-blue-100 text-blue-800'
  },
  {
    type: 'work',
    icon: Briefcase,
    name: 'Productivity',
    description: 'Catch up on emails',
    color: 'bg-green-100 text-green-800'
  },
  {
    type: 'meditation',
    icon: Sparkles,
    name: 'Meditation',
    description: 'Relax and breathe',
    color: 'bg-indigo-100 text-indigo-800'
  },
  {
    type: 'news',
    icon: Newspaper,
    name: 'News Brief',
    description: 'Today\'s headlines',
    color: 'bg-orange-100 text-orange-800'
  }
];

export default function InRideEntertainmentHub({ rideRequestId, userEmail, rideDuration }) {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isActive, setIsActive] = useState(false);

  const startActivity = async (activity) => {
    setSelectedActivity(activity);
    setIsActive(true);

    await base44.entities.InRideActivity.create({
      ride_request_id: rideRequestId,
      user_email: userEmail,
      activity_type: activity.type,
      content_preferences: {
        genre: 'auto',
        energy_level: 'medium',
        duration: rideDuration || 15
      },
      productivity_score: 0
    });

    toast.success(`🎵 ${activity.name} started!`);
  };

  return (
    <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50 mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            In-Ride Entertainment
          </span>
          {isActive && (
            <Badge className="bg-green-600 text-white animate-pulse">
              Active
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <AnimatePresence>
          {!isActive ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 gap-2"
            >
              {activities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <motion.button
                    key={activity.type}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => startActivity(activity)}
                    className="bg-white rounded-xl p-4 hover:shadow-md transition-all border-2 border-transparent hover:border-purple-300"
                  >
                    <Icon className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-gray-900">{activity.name}</p>
                    <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
                  </motion.button>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 text-center"
            >
              {selectedActivity && (
                <>
                  <selectedActivity.icon className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {selectedActivity.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Enjoy your ride! {selectedActivity.description}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsActive(false);
                      setSelectedActivity(null);
                    }}
                    className="w-full"
                  >
                    Change Activity
                  </Button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white rounded-lg p-3 text-xs text-gray-600 text-center">
          ⏱️ Estimated ride time: {rideDuration || 15} minutes
        </div>
      </CardContent>
    </Card>
  );
}