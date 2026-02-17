import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import { motion } from 'framer-motion';
import { Navigation, MapPin, Flag } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom animated marker icons
const createPulsingIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="relative">
        <div class="w-8 h-8 bg-${color}-500 rounded-full animate-ping absolute"></div>
        <div class="w-8 h-8 bg-${color}-600 rounded-full relative shadow-lg border-4 border-white"></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

export default function LiveMapEnhanced({ 
  origin,
  destination,
  currentLocation,
  driverName,
  className = ''
}) {
  const [map, setMap] = useState(null);
  const [route, setRoute] = useState([]);

  useEffect(() => {
    if (origin && destination) {
      // Simulate route points
      const points = [];
      const steps = 20;
      for (let i = 0; i <= steps; i++) {
        const lat = origin.latitude + (destination.latitude - origin.latitude) * (i / steps);
        const lng = origin.longitude + (destination.longitude - origin.longitude) * (i / steps);
        points.push([lat, lng]);
      }
      setRoute(points);
    }
  }, [origin, destination]);

  if (!origin || !destination) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center rounded-xl`}>
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  const center = currentLocation 
    ? [currentLocation.latitude, currentLocation.longitude]
    : [(origin.latitude + destination.latitude) / 2, (origin.longitude + destination.longitude) / 2];

  return (
    <div className={`relative ${className} rounded-xl overflow-hidden shadow-2xl`}>
      <MapContainer
        center={center}
        zoom={12}
        className="h-full w-full z-0"
        whenCreated={setMap}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {/* Origin marker */}
        <Marker position={[origin.latitude, origin.longitude]} icon={createPulsingIcon('indigo')}>
          <Popup>
            <div className="text-center">
              <MapPin className="w-4 h-4 mx-auto mb-1 text-indigo-600" />
              <p className="font-semibold">Pickup</p>
            </div>
          </Popup>
        </Marker>

        {/* Destination marker */}
        <Marker position={[destination.latitude, destination.longitude]} icon={createPulsingIcon('emerald')}>
          <Popup>
            <div className="text-center">
              <Flag className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
              <p className="font-semibold">Drop-off</p>
            </div>
          </Popup>
        </Marker>

        {/* Current location */}
        {currentLocation && (
          <>
            <Marker 
              position={[currentLocation.latitude, currentLocation.longitude]}
              icon={createPulsingIcon('blue')}
            >
              <Popup>
                <div className="text-center">
                  <Navigation className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                  <p className="font-semibold">{driverName || 'Driver'}</p>
                </div>
              </Popup>
            </Marker>
            
            {/* Accuracy circle */}
            <Circle
              center={[currentLocation.latitude, currentLocation.longitude]}
              radius={100}
              pathOptions={{ 
                color: '#3b82f6', 
                fillColor: '#3b82f6',
                fillOpacity: 0.1 
              }}
            />
          </>
        )}

        {/* Route line */}
        {route.length > 0 && (
          <Polyline
            positions={route}
            pathOptions={{
              color: '#667eea',
              weight: 4,
              opacity: 0.7,
              dashArray: '10, 10',
              lineCap: 'round'
            }}
          />
        )}
      </MapContainer>

      {/* Map overlay controls */}
      <div className="absolute top-4 right-4 z-[1000] space-y-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50"
          onClick={() => map?.setView(center, 12)}
        >
          <Navigation className="w-5 h-5 text-gray-700" />
        </motion.button>
      </div>

      {/* Distance indicator */}
      <div className="absolute bottom-4 left-4 right-4 z-[1000]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-3 rounded-xl"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700 font-medium">Estimated distance</span>
            <span className="font-bold text-indigo-600">
              {(Math.abs(destination.latitude - origin.latitude) * 111).toFixed(1)} km
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}