
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Car, Plus, User, LogOut, Menu, MapPin } from 'lucide-react';
import AIChatbot from '@/components/support/AIChatbot';
import SmartNotificationCenter from '@/components/notifications/SmartNotificationCenter';
import SocialProofWidget from '@/components/social/SocialProofWidget';
import { motion } from 'framer-motion';
import SmoothScrollToTop from '@/components/ui/SmoothScroll';
import { cn } from '@/lib/utils';

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (e) {
        setUser(null);
      }
    };
    loadUser();
  }, []);

  const handleLogout = () => {
    base44.auth.logout();
  };

  const navLinks = [
    { name: 'Request Ride', page: 'RequestRide', icon: Plus },
    { name: 'My Rides', page: 'MyRides', icon: Car },
    { name: 'Send Package', page: 'SendPackage', icon: Plus },
    { name: 'Rewards', page: 'Preferences', icon: User },
    { name: 'Drive', page: 'DriverDashboard', icon: MapPin },
  ];

  const driverLinks = [
    { name: 'Dashboard', page: 'DriverDashboard' },
    { name: 'Training', page: 'DriverTraining' },
    { name: 'Analytics', page: 'DriverAnalytics' },
    { name: 'Earnings', page: 'DriverEarnings' },
    { name: 'Loyalty', page: 'DriverLoyalty' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SmoothScrollToTop />
      
      {/* Header */}
      <header className="glass-strong border-b border-white/20 sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center gap-2 group">
              <motion.div 
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
              >
                <Car className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
                Walla
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.page}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={createPageUrl(link.page)}>
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        variant="ghost" 
                        className={cn(
                          'rounded-xl relative overflow-hidden',
                          currentPageName === link.page 
                            ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 shadow-sm' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        )}
                      >
                        {currentPageName === link.page && (
                          <motion.div
                            layoutId="activeNav"
                            className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-xl"
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                        <link.icon className="w-4 h-4 mr-2 relative z-10" />
                        <span className="relative z-10">{link.name}</span>
                      </Button>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* User Menu / Auth */}
            <div className="flex items-center gap-3">
              {user && (
                <SmartNotificationCenter userEmail={user.email} />
              )}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="rounded-xl gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                        {user.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                      </div>
                      <span className="hidden sm:block font-medium text-gray-700">
                        {user.full_name || user.email?.split('@')[0]}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-xl">
                    <DropdownMenuItem asChild>
                      <Link to={createPageUrl('MyRides')} className="cursor-pointer">
                        <Car className="w-4 h-4 mr-2" />
                        My Rides
                      </Link>
                    </DropdownMenuItem>
                    {user?.role === 'driver' && (
                      <>
                        <DropdownMenuSeparator />
                        {driverLinks.map((link) => (
                          <DropdownMenuItem key={link.page} asChild>
                            <Link to={createPageUrl(link.page)} className="cursor-pointer">
                              {link.name}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  onClick={() => base44.auth.redirectToLogin()}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
                >
                  Sign In
                </Button>
              )}

              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon" className="rounded-xl">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72">
                  <div className="flex flex-col gap-2 mt-8">
                    {navLinks.map((link) => (
                      <Link 
                        key={link.page} 
                        to={createPageUrl(link.page)}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button 
                          variant="ghost" 
                          className={`w-full justify-start rounded-xl ${currentPageName === link.page ? 'bg-indigo-50 text-indigo-600' : ''}`}
                        >
                          <link.icon className="w-4 h-4 mr-3" />
                          {link.name}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* AI Chatbot */}
      {user && <AIChatbot userType={user.role === 'driver' ? 'driver' : 'passenger'} />}

      {/* Social Proof */}
      <SocialProofWidget />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Car className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900">Walla</span>
            </div>
            <p className="text-sm text-gray-500">
              Ride anytime, anywhere
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
