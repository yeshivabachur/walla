import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Radio, Zap, Shield } from 'lucide-react';

// Custom icon for hubs
const hubIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2098/2098567.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

const INTERDIMENSIONAL_HUBS = [
  { id: 1, name: 'Chronos Hub', coords: [37.7749, -122.4194], type: 'TIME_NODE', status: 'STABLE' },
  { id: 2, name: 'Aether Station', coords: [34.0522, -118.2437], type: 'QUANTUM_PORT', status: 'ACTIVE' },
  { id: 3, name: 'Nebula Gates', coords: [40.7128, -74.0060], type: 'DIMENSIONAL_LINK', status: 'LOCKED' },
  { id: 4, name: 'Singularity Point', coords: [51.5074, -0.1278], type: 'VOID_ENTRY', status: 'UNSTABLE' }
];

export default function GalacticHubMap() {
  return (
    <Card className="border border-indigo-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-[600px] flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-indigo-500/5">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-6 h-6 text-indigo-400" />
            <span className="uppercase tracking-[0.2em] font-black italic">Galactic Hub Network</span>
          </div>
          <Badge className="bg-indigo-600">4 NODES DETECTED</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 relative">
        <MapContainer 
          center={[20, 0]} 
          zoom={2} 
          style={{ height: '100%', width: '100%', background: '#000' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          
          {INTERDIMENSIONAL_HUBS.map(hub => (
            <React.Fragment key={hub.id}>
              <Marker position={hub.coords} icon={hubIcon}>
                <Popup className="custom-popup">
                  <div className="bg-gray-900 text-white p-3 rounded-lg border border-indigo-500 font-mono">
                    <h4 className="font-bold text-indigo-400">{hub.name}</h4>
                    <p className="text-[10px] text-gray-400 mt-1">TYPE: {hub.type}</p>
                    <p className="text-[10px] text-green-400">STATUS: {hub.status}</p>
                  </div>
                </Popup>
              </Marker>
              <Circle 
                center={hub.coords} 
                radius={500000} 
                pathOptions={{ 
                  color: hub.status === 'ACTIVE' ? '#4f46e5' : '#ec4899', 
                  fillColor: hub.status === 'ACTIVE' ? '#4f46e5' : '#ec4899',
                  fillOpacity: 0.1,
                  weight: 1
                }} 
              />
            </React.Fragment>
          ))}
        </MapContainer>

        {/* Tactical Legend Overlay */}
        <div className="absolute bottom-6 left-6 z-[1000] bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 w-48">
          <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-3">Tactical Legend</h5>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="text-[10px] text-white/60">Quantum Port</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-pink-500" />
              <span className="text-[10px] text-white/60">Void Entry</span>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
              <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-tighter">Scanning...</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
