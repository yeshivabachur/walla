import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Heart, Music, MessageCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function RideMatchmaking({ userEmail, route }) {
  const [interests, setInterests] = useState('');
  const [matches, setMatches] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const findMatches = async () => {
    setIsSearching(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Find compatible ride-share matches for a passenger with interests: ${interests}

Route: ${route}

Generate 3 fictional but realistic rider profiles that would be compatible based on:
- Similar interests
- Compatible personality
- Conversation preferences

Make them diverse and interesting.`,
        response_json_schema: {
          type: 'object',
          properties: {
            matches: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  interests: { type: 'array', items: { type: 'string' } },
                  compatibility: { type: 'number' },
                  vibe: { type: 'string' }
                }
              }
            }
          }
        }
      });

      setMatches(result.matches);
      toast.success('Found compatible riders!');
    } catch (error) {
      toast.error('Could not find matches');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Card className="border-2 border-pink-300 bg-gradient-to-br from-pink-50 to-rose-50 mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-600" />
          Social Ride Matching
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder="Your interests (e.g., music, tech, travel)"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={findMatches}
            disabled={!interests || isSearching}
            className="bg-pink-600 hover:bg-pink-700"
          >
            <Sparkles className="w-4 h-4 mr-1" />
            {isSearching ? 'Matching...' : 'Match'}
          </Button>
        </div>

        {matches.length > 0 && (
          <div className="space-y-2">
            {matches.map((match, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">{match.name}</p>
                    <p className="text-xs text-gray-600">{match.vibe}</p>
                  </div>
                  <Badge className="bg-pink-600 text-white">
                    {Math.round(match.compatibility * 100)}% match
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {match.interests.slice(0, 3).map((interest, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Connect
                </Button>
              </motion.div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-lg p-3 text-xs text-gray-600">
          💡 Share rides with people who have similar interests and vibe
        </div>
      </CardContent>
    </Card>
  );
}