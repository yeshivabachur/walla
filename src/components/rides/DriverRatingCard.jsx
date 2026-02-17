import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Star, Car } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DriverRatingCard({ 
  driverEmail, 
  driverName, 
  ridesCount, 
  averageRating, 
  isFavorite,
  onToggleFavorite 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {driverName?.charAt(0)?.toUpperCase() || 'D'}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleFavorite}
              className={isFavorite ? 'text-red-600' : 'text-gray-400'}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
          </div>

          <h3 className="font-semibold text-gray-900 mb-1">{driverName || 'Driver'}</h3>
          <p className="text-xs text-gray-500 mb-4">{driverEmail}</p>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 flex items-center gap-1">
                <Car className="w-4 h-4" />
                Rides Together
              </span>
              <span className="font-semibold text-gray-900">{ridesCount}</span>
            </div>

            {averageRating > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  Your Rating
                </span>
                <span className="font-semibold text-gray-900">{averageRating.toFixed(1)}/5</span>
              </div>
            )}
          </div>

          {isFavorite && (
            <Badge className="mt-4 bg-red-100 text-red-800 w-full justify-center">
              Favorite Driver
            </Badge>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}