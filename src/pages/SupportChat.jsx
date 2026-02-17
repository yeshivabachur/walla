import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Bot, User, Send, Sparkles, 
  ShieldCheck, Clock, HelpCircle, 
  MessageSquare, Zap, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SupportChat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Greetings. I am Walla Sentience Support. How can I optimize your experience today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Use Base44 AI Core for real response
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are the Walla Support AI. A user is asking for help with: "${input}". 
        Provide a concise, helpful, and professional response in the Walla futuristic brand voice.
        Address technical issues, booking questions, or safety concerns.`,
        temperature: 0.7
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response.content }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I encountered a neural synchronization error. Please try again or use the SOS beacon for emergencies." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10 flex flex-col items-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.1),transparent)] pointer-events-none" />
      
      <div className="w-full max-w-4xl flex-1 flex flex-col space-y-8 relative z-10">
        <header className="flex justify-between items-end border-b border-white/10 pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic flex items-center gap-4 text-indigo-400">
              <Bot className="w-12 h-12" />
              AI Sentience Support
            </h1>
            <p className="text-white/40 font-mono text-sm mt-2 uppercase">24/7 Neural Link Assistance</p>
          </div>
          <Badge className="bg-indigo-600 animate-pulse h-10 px-6 rounded-xl flex items-center gap-2">
            <Activity className="w-4 h-4" />
            CORE_SYSTEMS_OPTIMAL
          </Badge>
        </header>

        <Card className="flex-1 bg-white/5 border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
          <CardHeader className="border-b border-white/5 bg-indigo-500/5 p-4 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Live Connection: SECURE</span>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-[9px] font-mono text-white/40">
                <Clock className="w-3 h-3" />
                ETA: IMMEDIATE
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar" ref={scrollRef}>
            {messages.map((m, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.4)]' : 'bg-white/10 border border-white/10'}`}>
                    {m.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-indigo-400" />}
                  </div>
                  <div className={`p-5 rounded-3xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-white text-black font-bold' : 'bg-white/5 border border-white/10 text-white/80'}`}>
                    {m.content}
                  </div>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-4 items-center bg-white/5 p-4 rounded-3xl border border-white/10">
                  <div className="flex gap-1">
                    {[1,2,3].map(i => (
                      <motion.div 
                        key={i}
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        className="w-1.5 h-1.5 rounded-full bg-indigo-400"
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-black uppercase text-white/40">Synthesizing...</span>
                </div>
              </div>
            )}
          </CardContent>

          <div className="p-6 border-t border-white/5 bg-black/40">
            <form onSubmit={handleSend} className="flex gap-4">
              <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your inquiry or command..."
                className="bg-white/5 border-white/10 h-14 rounded-2xl text-base px-6 italic"
              />
              <Button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className="bg-indigo-600 hover:bg-indigo-700 w-14 h-14 rounded-2xl shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all"
              >
                <Send className="w-6 h-6" />
              </Button>
            </form>
          </div>
        </Card>

        {/* Quick Help Manifold */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Booking Help', icon: MessageSquare },
            { label: 'Safety SOS', icon: ShieldCheck, color: 'text-red-400' },
            { label: 'Payout Issues', icon: Zap },
            { label: 'General FAQ', icon: HelpCircle }
          ].map((item, i) => (
            <Button 
              key={i}
              variant="outline" 
              className="bg-white/5 border-white/10 h-16 rounded-2xl flex flex-col items-center justify-center gap-1 hover:bg-white/10 group transition-all"
            >
              <item.icon className={`w-5 h-5 ${item.color || 'text-indigo-400'} group-hover:scale-110 transition-transform`} />
              <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
