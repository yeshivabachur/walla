import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Headphones, BookOpen, Video } from 'lucide-react';

export default function InRideContentPlayer({ rideRequestId }) {
  const [contentType, setContentType] = useState('music');

  const contentOptions = [
    { type: 'music', icon: Music, label: 'Music', color: 'text-purple-600' },
    { type: 'podcast', icon: Headphones, label: 'Podcasts', color: 'text-blue-600' },
    { type: 'audiobook', icon: BookOpen, label: 'Audiobooks', color: 'text-green-600' },
    { type: 'video', icon: Video, label: 'Videos', color: 'text-red-600' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">In-Ride Entertainment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-4 gap-2">
          {contentOptions.map(option => {
            const Icon = option.icon;
            return (
              <Button
                key={option.type}
                variant={contentType === option.type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setContentType(option.type)}
                className="flex flex-col h-16"
              >
                <Icon className={`w-4 h-4 ${option.color}`} />
                <span className="text-xs mt-1">{option.label}</span>
              </Button>
            );
          })}
        </div>
        <div className="bg-gray-50 rounded p-3">
          <p className="text-xs text-gray-600">Now playing: Chill Vibes Playlist</p>
        </div>
      </CardContent>
    </Card>
  );
}