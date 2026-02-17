import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home, Briefcase, Dumbbell, School, Plane, MapPin, Plus, Trash2, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const LOCATION_ICONS = {
  home: Home,
  work: Briefcase,
  gym: Dumbbell,
  school: School,
  airport: Plane,
  custom: MapPin
};

const CITY_COORDS = {
  'San Francisco': { latitude: 37.7749, longitude: -122.4194 },
  'Los Angeles': { latitude: 34.0522, longitude: -118.2437 },
  'New York': { latitude: 40.7128, longitude: -74.006 },
  'Boston': { latitude: 42.3601, longitude: -71.0589 },
  'Seattle': { latitude: 47.6062, longitude: -122.3321 }
};

export default function FavoriteLocations({ userEmail, onSelectLocation }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newLocation, setNewLocation] = useState({
    label: 'home',
    custom_label: '',
    address: ''
  });
  const queryClient = useQueryClient();

  const { data: favorites = [] } = useQuery({
    queryKey: ['favoriteLocations', userEmail],
    queryFn: () => base44.entities.FavoriteLocation.filter({ user_email: userEmail }),
    enabled: !!userEmail
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const coords = CITY_COORDS[newLocation.address];
      await base44.entities.FavoriteLocation.create({
        user_email: userEmail,
        label: newLocation.label,
        custom_label: newLocation.custom_label,
        address: newLocation.address,
        coordinates: coords,
        icon: newLocation.label
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['favoriteLocations']);
      setIsAdding(false);
      setNewLocation({ label: 'home', custom_label: '', address: '' });
      toast.success('Location saved!');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.FavoriteLocation.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['favoriteLocations']);
      toast.success('Location removed');
    }
  });

  const handleSelect = (location) => {
    if (onSelectLocation) {
      onSelectLocation(location);
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Favorite Locations
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAdding(!isAdding)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 pb-3 border-b"
            >
              <Select
                value={newLocation.label}
                onValueChange={(value) => setNewLocation({ ...newLocation, label: value })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">🏠 Home</SelectItem>
                  <SelectItem value="work">💼 Work</SelectItem>
                  <SelectItem value="gym">💪 Gym</SelectItem>
                  <SelectItem value="school">🎓 School</SelectItem>
                  <SelectItem value="airport">✈️ Airport</SelectItem>
                  <SelectItem value="custom">📍 Custom</SelectItem>
                </SelectContent>
              </Select>

              {newLocation.label === 'custom' && (
                <Input
                  placeholder="Custom label (e.g., Mom's house)"
                  value={newLocation.custom_label}
                  onChange={(e) => setNewLocation({ ...newLocation, custom_label: e.target.value })}
                  className="rounded-xl"
                />
              )}

              <Select
                value={newLocation.address}
                onValueChange={(value) => setNewLocation({ ...newLocation, address: value })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select address" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(CITY_COORDS).map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={() => addMutation.mutate()}
                disabled={!newLocation.address || addMutation.isPending}
                className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl"
              >
                Save Location
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {favorites.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No saved locations yet. Add your favorite places for quick access!
          </p>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {favorites.map((location) => {
                const Icon = LOCATION_ICONS[location.label] || MapPin;
                const displayLabel = location.label === 'custom' 
                  ? location.custom_label 
                  : location.label.charAt(0).toUpperCase() + location.label.slice(1);

                return (
                  <motion.div
                    key={location.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => handleSelect(location)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{displayLabel}</p>
                          <p className="text-sm text-gray-600">{location.address}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMutation.mutate(location.id);
                        }}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}