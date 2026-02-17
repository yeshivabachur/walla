import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers not showing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom icons
const createCustomIcon = (color, icon) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 40px;
        height: 40px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="
          transform: rotate(45deg);
          color: white;
          font-size: 20px;
        ">${icon}</span>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
};

const originIcon = createCustomIcon('#6366f1', '📍');
const destinationIcon = createCustomIcon('#10b981', '🎯');
const driverIcon = createCustomIcon('#f59e0b', '🚗');

function MapUpdater({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom(), { animate: true });
    }
  }, [center, zoom, map]);
  
  return null;
}

export default function LiveMap({ 
  origin, 
  destination, 
  currentLocation,
  driverName,
  className = "" 
}) {
  const [mapCenter, setMapCenter] = useState(null);

  useEffect(() => {
    // Center on current location if available, otherwise origin
    if (currentLocation?.latitude && currentLocation?.longitude) {
      setMapCenter([currentLocation.latitude, currentLocation.longitude]);
    } else if (origin?.latitude && origin?.longitude) {
      setMapCenter([origin.latitude, origin.longitude]);
    }
  }, [currentLocation, origin]);

  if (!mapCenter) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  // Create route line
  const routePoints = [];
  if (origin?.latitude && origin?.longitude) {
    routePoints.push([origin.latitude, origin.longitude]);
  }
  if (currentLocation?.latitude && currentLocation?.longitude) {
    routePoints.push([currentLocation.latitude, currentLocation.longitude]);
  }
  if (destination?.latitude && destination?.longitude) {
    routePoints.push([destination.latitude, destination.longitude]);
  }

  return (
    <div className={className}>
      <MapContainer
        center={mapCenter}
        zoom={11}
        style={{ width: '100%', height: '100%', borderRadius: '16px' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater center={mapCenter} />

        {/* Origin Marker */}
        {origin?.latitude && origin?.longitude && (
          <Marker position={[origin.latitude, origin.longitude]} icon={originIcon}>
            <Popup>
              <div className="text-center">
                <p className="font-semibold">Starting Point</p>
                <p className="text-sm text-gray-600">Origin</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Destination Marker */}
        {destination?.latitude && destination?.longitude && (
          <Marker position={[destination.latitude, destination.longitude]} icon={destinationIcon}>
            <Popup>
              <div className="text-center">
                <p className="font-semibold">Destination</p>
                <p className="text-sm text-gray-600">Drop-off Point</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Current Location Marker */}
        {currentLocation?.latitude && currentLocation?.longitude && (
          <Marker position={[currentLocation.latitude, currentLocation.longitude]} icon={driverIcon}>
            <Popup>
              <div className="text-center">
                <p className="font-semibold">{driverName || 'Driver'}</p>
                <p className="text-sm text-gray-600">Current Location</p>
                {currentLocation.timestamp && (
                  <p className="text-xs text-gray-500 mt-1">
                    Updated: {new Date(currentLocation.timestamp).toLocaleTimeString()}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route Line */}
        {routePoints.length >= 2 && (
          <Polyline 
            positions={routePoints} 
            color="#6366f1" 
            weight={4}
            opacity={0.7}
            dashArray="10, 10"
          />
        )}
      </MapContainer>
    </div>
  );
}