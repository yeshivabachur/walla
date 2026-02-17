import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, DollarSign, Users, Clock, Star, TrendingUp,
  ArrowRight, Receipt, CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import RatingDisplay from '@/components/reviews/RatingDisplay';

export default function RideDetailView({ request, onRebook, onFavorite, isFavorited, driverRating }) {
  const baseFare = request.estimated_price / (request.surge_multiplier || 1);
  const surgeFee = request.estimated_price - baseFare;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">Ride Details</CardTitle>
              <p className="text-sm text-gray-500">
                {format(new Date(request.created_date), 'EEEE, MMMM d, yyyy • h:mm a')}
              </p>
            </div>
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Completed
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Route */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Route</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-1">
                  <div className="w-3 h-3 rounded-full bg-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pickup</p>
                  <p className="font-semibold text-gray-900">{request.pickup_location}</p>
                </div>
              </div>

              <div className="ml-4 border-l-2 border-dashed border-gray-200 h-8" />

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-1">
                  <div className="w-3 h-3 rounded-full bg-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Drop-off</p>
                  <p className="font-semibold text-gray-900">{request.dropoff_location}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Fare Breakdown */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Receipt className="w-4 h-4" />
              Fare Breakdown
            </h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Base Fare</span>
                <span className="font-semibold">${baseFare.toFixed(2)}</span>
              </div>
              {surgeFee > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-orange-600" />
                    Surge ({request.surge_multiplier}x)
                  </span>
                  <span className="font-semibold text-orange-600">+${surgeFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  <Users className="w-3 h-3 inline mr-1" />
                  Passengers
                </span>
                <span className="font-semibold">{request.passengers}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-base">
                <span className="font-semibold text-gray-900">Total Paid</span>
                <span className="font-bold text-xl text-gray-900">${request.estimated_price.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Driver Info */}
          {request.driver_name && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Your Driver</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-semibold">
                    {request.driver_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{request.driver_name}</p>
                    {request.vehicle_info && (
                      <p className="text-sm text-gray-500">{request.vehicle_info}</p>
                    )}
                    {driverRating && (
                      <div className="mt-1">
                        <RatingDisplay rating={driverRating.rating} count={driverRating.count} size="sm" />
                      </div>
                    )}
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onFavorite(request.driver_email)}
                  className={`rounded-lg ${isFavorited ? 'border-yellow-400 bg-yellow-50' : ''}`}
                >
                  <Star className={`w-4 h-4 mr-1 ${isFavorited ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                  {isFavorited ? 'Favorited' : 'Favorite'}
                </Button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={onRebook}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 rounded-xl"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Rebook This Ride
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}