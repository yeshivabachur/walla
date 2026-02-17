import React from 'react';
import { useRideMode } from '@/state/RideModeProvider';
import { RIDE_MODE_THEME, RideModes } from '@/state/rideMode';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Palette } from 'lucide-react';

export function ThemeSwitcher() {
  const { mode, setMode } = useRideMode();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="rounded-full shadow-lg bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-background">
            <Palette className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-56 p-2 bg-background/90 backdrop-blur-md border-primary/20">
          <div className="grid gap-1">
            <h4 className="font-medium text-sm px-2 py-1.5 text-muted-foreground">Select Theme</h4>
            {RideModes.map((m) => {
              const theme = RIDE_MODE_THEME[m];
              const isActive = mode === m;
              return (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`
                    w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-md transition-colors
                    ${isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground'}
                  `}
                >
                  <span>{theme.label}</span>
                  {isActive && <span className="h-2 w-2 rounded-full bg-current" />}
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
