import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Waves, Sparkles, MessageSquareHeart, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function TelepathicCommunicator({ userEmail }) {
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [thoughtPattern, setThoughtPattern] = useState(null);
  const [dreamDestination, setDreamDestination] = useState(null);

  const startTelepathy = async () => {
    setIsBroadcasting(true);
    try {
      // Logic for subconscious preference learning
      const insight = await base44.integrations.Core.InvokeLLM({
        prompt: `Scan the thought patterns of user ${userEmail}. 
        Identify latent desires for travel, preferred conversation depth, and dream destinations they haven't explicitly stated yet.`,
        response_json_schema: {
          type: 'object',
          properties: {
            subconscious_preference: { type: 'string' },
            dream_destination: { type: 'string' },
            telepathic_fidelity: { type: 'number' }
          }
        }
      });

      setThoughtPattern(insight.subconscious_preference);
      setDreamDestination(insight.dream_destination);
      
      await base44.entities.SubconsciousLearning.create({
        user_email: userEmail,
        insight_type: 'latent_travel_desire',
        content: insight.subconscious_preference
      });

      toast.success("Psionic Link Established. Thoughts synchronized with Driver.");
    } catch (e) {
      toast.error("Psionic interference detected. Link failed.");
    } finally {
      setIsBroadcasting(false);
    }
  };

  return (
    <Card className="border border-pink-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl">
      <CardHeader className="border-b border-white/5 bg-pink-500/5">
        <CardTitle className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-pink-400">
          <Brain className="w-4 h-4" />
          Telepathic Command & Dream Finder
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="flex justify-center py-4">
          <motion.div
            animate={{ 
              scale: isBroadcasting ? [1, 1.5, 1] : 1,
              opacity: isBroadcasting ? [0.5, 1, 0.5] : 0.2 
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-32 h-32 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 blur-2xl absolute"
          />
          <Button 
            onClick={startTelepathy}
            disabled={isBroadcasting}
            className="z-10 w-24 h-24 rounded-full bg-black border-2 border-pink-500/50 hover:bg-pink-500/10 flex flex-col items-center justify-center gap-1 group"
          >
            {isBroadcasting ? (
              <Waves className="w-8 h-8 text-pink-400 animate-pulse" />
            ) : (
              <Sparkles className="w-8 h-8 text-pink-400 group-hover:scale-110 transition-transform" />
            )}
            <span className="text-[8px] font-black uppercase tracking-tighter">Sync Mind</span>
          </Button>
        </div>

        <AnimatePresence>
          {thoughtPattern && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                <p className="text-[10px] text-pink-300 font-mono uppercase mb-1">Subconscious_Insight</p>
                <p className="text-xs italic text-gray-300">"{thoughtPattern}"</p>
              </div>
              
              <div className="bg-white/5 p-3 rounded-lg border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-indigo-300 font-mono uppercase mb-1">Dream_Destination_Located</p>
                  <p className="text-sm font-black text-white uppercase">{dreamDestination}</p>
                </div>
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 h-8 text-[10px]">
                  Book Now
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2 text-[8px] text-white/40 uppercase font-mono justify-center">
          <EyeOff className="w-3 h-3" />
          Zero-Interaction Interface Active
        </div>
      </CardContent>
    </Card>
  );
}
