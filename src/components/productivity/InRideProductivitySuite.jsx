import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, Mail, Calendar, CheckSquare, 
  Terminal, Globe, BookOpen, Mic2, Languages
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InRideProductivitySuite({ userEmail }) {
  const [activeMode, setActiveMode] = useState('work'); // 'work' or 'learn'

  return (
    <Card className="border border-indigo-500/30 bg-black/80 backdrop-blur-xl text-white shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-indigo-500/5 p-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xs font-mono uppercase tracking-widest text-indigo-400">
            Intelligent Cabin Environment
          </CardTitle>
          <div className="flex bg-white/5 rounded-lg p-1">
            <button 
              onClick={() => setActiveMode('work')}
              className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${activeMode === 'work' ? 'bg-indigo-600 text-white' : 'text-white/40'}`}
            >
              WORK
            </button>
            <button 
              onClick={() => setActiveMode('learn')}
              className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${activeMode === 'learn' ? 'bg-indigo-600 text-white' : 'text-white/40'}`}
            >
              LEARN
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-6">
        <AnimatePresence mode="wait">
          {activeMode === 'work' ? (
            <motion.div 
              key="work"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <Mail className="w-5 h-5 text-blue-400 mb-2" />
                  <p className="text-[10px] font-black uppercase">Email Sync</p>
                  <p className="text-[8px] text-white/40 italic">3 priority threads found</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <Calendar className="w-5 h-5 text-purple-400 mb-2" />
                  <p className="text-[10px] font-black uppercase">Schedule</p>
                  <p className="text-[8px] text-white/40 italic">Next: Client Sync (12m)</p>
                </div>
              </div>
              <div className="bg-indigo-500/10 p-4 rounded-2xl border border-indigo-500/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold uppercase">Active Task Manifold</span>
                  <Badge className="bg-indigo-600 text-[8px]">AUTO_RESOLVING</Badge>
                </div>
                <div className="space-y-2">
                  {[1,2].map(i => (
                    <div key={i} className="flex items-center gap-3 text-[10px]">
                      <CheckSquare className="w-3 h-3 text-indigo-400" />
                      <span className="text-white/60">Finalize Q3 Routing Projections</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="learn"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex flex-col items-center text-center p-4 bg-white/5 rounded-3xl border border-white/10">
                <Languages className="w-10 h-10 text-cyan-400 mb-4 animate-pulse" />
                <h4 className="text-lg font-black uppercase tracking-tighter italic">In-Car Language Learning</h4>
                <p className="text-[10px] text-white/40 mt-1 uppercase">Today's Lesson: Business Japanese</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-mono">
                  <span>Lesson Progress</span>
                  <span className="text-cyan-400">64%</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '64%' }}
                    className="h-full bg-cyan-500" 
                  />
                </div>
              </div>

              <Button className="w-full bg-cyan-600 hover:bg-cyan-700 h-12 rounded-xl group">
                <Mic2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Begin Vocal Assessment
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>

      <div className="p-4 border-t border-white/5 bg-white/5 flex justify-between items-center text-[8px] font-mono">
        <span className="text-white/20 uppercase">Environment_Protocol: v2.1.0</span>
        <div className="flex items-center gap-2">
          <Terminal className="w-3 h-3 text-indigo-400" />
          <span className="text-indigo-400">POD_DOCK_AUTHORIZED</span>
        </div>
      </div>
    </Card>
  );
}
