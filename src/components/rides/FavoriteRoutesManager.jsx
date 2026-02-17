import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { MapPin, ArrowRight, Trash2, Plus, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function FavoriteRoutesManager({ userEmail }) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newRoute, setNewRoute] = useState({ route_name: '', pickup_location: '', dropoff_location: '' });
  const queryClient = useQueryClient();

  const { data: routes = [] } = useQuery({
    queryKey: ['favoriteRoutes', userEmail],
    queryFn: () => base44.entities.FavoriteRoute.filter({ passenger_email: userEmail }),
    enabled: !!userEmail
  });

  const addRouteMutation = useMutation({
    mutationFn: async (routeData) => {
      return await base44.entities.FavoriteRoute.create({
        ...routeData,
        passenger_email: userEmail,
        pickup_coords: { latitude: 37.7749, longitude: -122.4194 }, // Demo coords
        dropoff_coords: { latitude: 34.0522, longitude: -118.2437 }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['favoriteRoutes']);
      setShowAddDialog(false);
      setNewRoute({ route_name: '', pickup_location: '', dropoff_location: '' });
      toast.success('Route saved to favorites!');
    }
  });

  const deleteRouteMutation = useMutation({
    mutationFn: async (routeId) => {
      await base44.entities.FavoriteRoute.delete(routeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['favoriteRoutes']);
      toast.success('Route removed');
    }
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Favorite Routes</h2>
          <p className="text-sm text-gray-600">Save frequently used routes for quick booking</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Route
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {routes.map((route, index) => (
          <motion.div
            key={route.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <CardTitle className="text-lg">{route.route_name}</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteRouteMutation.mutate(route.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                    <span className="text-gray-900">{route.pickup_location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{route.dropoff_location}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Used {route.use_count || 0} times</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {routes.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No favorite routes yet</p>
            <p className="text-sm text-gray-400">Add frequently used routes for quick rebooking</p>
          </CardContent>
        </Card>
      )}

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Favorite Route</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Route Name</label>
              <Input
                placeholder="e.g., Home to Work"
                value={newRoute.route_name}
                onChange={(e) => setNewRoute({ ...newRoute, route_name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Pickup Location</label>
              <Input
                placeholder="Enter pickup address"
                value={newRoute.pickup_location}
                onChange={(e) => setNewRoute({ ...newRoute, pickup_location: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Drop-off Location</label>
              <Input
                placeholder="Enter drop-off address"
                value={newRoute.dropoff_location}
                onChange={(e) => setNewRoute({ ...newRoute, dropoff_location: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => addRouteMutation.mutate(newRoute)}
              disabled={!newRoute.route_name || !newRoute.pickup_location || !newRoute.dropoff_location}
            >
              Save Route
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}