import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  History, Camera, Share2, Heart, 
  MessageSquare, UserPlus, Globe, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STORIES = [
  { id: 's1', user: 'AlphaPilot', content: 'Just set a new FTL speed record in Sector 7G! #WallaSpeed', likes: 142 },
  { id: 's2', user: 'ZenRider', content: 'The Interactive Yoga mode is a game-changer for long-haul routes.', likes: 88 }
];

export default function RideSocialNetwork() {
  return (
    <Card className="border border-indigo-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-indigo-500/5 p-4">
        <CardTitle className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em] text-indigo-400">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Walla Social & Ride Stories
          </div>
          <Badge className="bg-indigo-600">LIVE_FEED</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
        {/* Story Feed */}
        <div className="space-y-4">
          {STORIES.map(story => (
            <div key={story.id} className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-indigo-500 flex items-center justify-center text-[10px] font-black uppercase">
                    {story.user[0]}
                  </div>
                  <span className="text-[10px] font-black uppercase text-white">{story.user}</span>
                </div>
                <Badge variant="outline" className="text-[7px] border-white/10 text-white/40">MEMORY_LANE</Badge>
              </div>
              <p className="text-[10px] text-white/60 leading-relaxed uppercase">{story.content}</p>
              <div className="flex gap-4 pt-2 border-t border-white/5">
                <button className="flex items-center gap-1 text-[8px] font-black uppercase text-pink-400">
                  <Heart className="w-3 h-3 fill-pink-400" /> {story.likes}
                </button>
                <button className="flex items-center gap-1 text-[8px] font-black uppercase text-white/40">
                  <MessageSquare className="w-3 h-3" /> COMMENT
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Global Connections */}
        <div className="bg-indigo-500/10 p-4 rounded-2xl border border-indigo-500/20 space-y-3">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-indigo-400" />
            <span className="text-[10px] font-black uppercase">Nearby Mesh Citizens</span>
          </div>
          <div className="flex -space-x-2">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-indigo-600 flex items-center justify-center text-[10px] font-black italic">
                U{i}
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-black bg-white/10 flex items-center justify-center text-[8px] font-black">+42</div>
          </div>
        </div>

        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[10px] h-12 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)]">
          Post Ride Memory
        </Button>
      </CardContent>
    </Card>
  );
}
