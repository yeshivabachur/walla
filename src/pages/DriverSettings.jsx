import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Settings, Shield, Bell, Zap, 
  User, MapPin, Eye, Radio,
  Smartphone, Lock, Volume2, Globe,
  Briefcase, Activity, CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function DriverSettings() {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({
    auto_accept: false,
    surge_protection: true,
    silent_mode: false,
    voice_navigation: true,
    biometric_auth: true,
    radius_limit: 15,
    preferred_language: 'English'
  });

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      // Simulate saving to DriverProfile or User entity
      return new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onSuccess: () => {
      toast.success('Neural Preferences Synchronized');
    }
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(79,70,229,0.05))] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10 space-y-10">
        <header className="border-b border-white/10 pb-8">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic flex items-center gap-4 text-indigo-400">
            <Settings className="w-12 h-12" />
            Driver Preferences
          </h1>
          <p className="text-white/40 font-mono text-sm mt-2 uppercase">Calibrate your neural-driving environment</p>
        </header>

        <div className="space-y-8">
          {/* Automation Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h3 className="text-xl font-black uppercase italic tracking-widest">Automation & Surge</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/5 border-white/10 p-6 rounded-3xl flex items-center justify-between group hover:bg-white/10 transition-all">
                <div>
                  <p className="text-sm font-black uppercase">Auto-Accept Rides</p>
                  <p className="text-[10px] text-white/40 font-mono">NEURAL_DISPATCH_SYNC</p>
                </div>
                <Switch 
                  checked={settings.auto_accept} 
                  onCheckedChange={(v) => setSettings({...settings, auto_accept: v})} 
                />
              </Card>
              <Card className="bg-white/5 border-white/10 p-6 rounded-3xl flex items-center justify-between group hover:bg-white/10 transition-all">
                <div>
                  <p className="text-sm font-black uppercase">Surge Protection Cap</p>
                  <p className="text-[10px] text-white/40 font-mono">CAUSALITY_THRESHOLD</p>
                </div>
                <Switch 
                  checked={settings.surge_protection} 
                  onCheckedChange={(v) => setSettings({...settings, surge_protection: v})} 
                />
              </Card>
            </div>
          </section>

          {/* Experience Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <Volume2 className="w-5 h-5 text-cyan-400" />
              <h3 className="text-xl font-black uppercase italic tracking-widest">In-Cabin Experience</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/5 border-white/10 p-6 rounded-3xl flex items-center justify-between group hover:bg-white/10 transition-all">
                <div>
                  <p className="text-sm font-black uppercase">Silent Ride Mode</p>
                  <p className="text-[10px] text-white/40 font-mono">ZERO_CONVERSATION</p>
                </div>
                <Switch 
                  checked={settings.silent_mode} 
                  onCheckedChange={(v) => setSettings({...settings, silent_mode: v})} 
                />
              </Card>
              <Card className="bg-white/5 border-white/10 p-6 rounded-3xl flex items-center justify-between group hover:bg-white/10 transition-all">
                <div>
                  <p className="text-sm font-black uppercase">Haptic Navigation</p>
                  <p className="text-[10px] text-white/40 font-mono">SENSORY_GUIDANCE</p>
                </div>
                <Switch 
                  checked={settings.voice_navigation} 
                  onCheckedChange={(v) => setSettings({...settings, voice_navigation: v})} 
                />
              </Card>
            </div>
          </section>

          {/* Security Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-5 h-5 text-indigo-400" />
              <h3 className="text-xl font-black uppercase italic tracking-widest">Privacy & Sovereignty</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/5 border-white/10 p-6 rounded-3xl flex items-center justify-between group hover:bg-white/10 transition-all">
                <div>
                  <p className="text-sm font-black uppercase">Neural-Face ID Login</p>
                  <p className="text-[10px] text-white/40 font-mono">BIOMETRIC_VAULT</p>
                </div>
                <Switch 
                  checked={settings.biometric_auth} 
                  onCheckedChange={(v) => setSettings({...settings, biometric_auth: v})} 
                />
              </Card>
              <Card className="bg-white/5 border-white/10 p-6 rounded-3xl flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-black uppercase">Max Pickup Radius (km)</p>
                  <span className="text-indigo-400 font-black italic">{settings.radius_limit}km</span>
                </div>
                <Input 
                  type="range" min="1" max="50" 
                  value={settings.radius_limit}
                  onChange={(e) => setSettings({...settings, radius_limit: e.target.value})}
                  className="accent-indigo-500 bg-transparent h-2"
                />
              </Card>
            </div>
          </section>

          <Button 
            onClick={() => saveMutation.mutate(settings)}
            disabled={saveMutation.isPending}
            className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-[0.2em] rounded-3xl shadow-[0_0_30px_rgba(79,70,229,0.4)]"
          >
            {saveMutation.isPending ? 'Syncing Manifold...' : 'Commit Preferences'}
          </Button>
        </div>
      </div>
    </div>
  );
}
