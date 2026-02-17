import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { RideMode } from "./rideMode";
import { DEFAULT_RIDE_MODE, RideModes } from "./rideMode";

type RideModeContextValue = {
  mode: RideMode;
  setMode: (mode: RideMode) => void;
};

const RideModeContext = createContext<RideModeContextValue | null>(null);

const STORAGE_KEY = "walla:rideMode";

function isRideMode(value: unknown): value is RideMode {
  return typeof value === "string" && (RideModes as readonly string[]).includes(value);
}

export function RideModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<RideMode>(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored && isRideMode(stored)) return stored;
    } catch {
      // ignore
    }
    return DEFAULT_RIDE_MODE;
  });

  const setMode = useCallback((next: RideMode) => {
    setModeState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    // Drive global theming via an attribute — minimal and framework-agnostic.
    document.documentElement.dataset.rideMode = mode;
  }, [mode]);

  const value = useMemo<RideModeContextValue>(() => ({ mode, setMode }), [mode, setMode]);

  return <RideModeContext.Provider value={value}>{children}</RideModeContext.Provider>;
}

export function useRideMode(): RideModeContextValue {
  const ctx = useContext(RideModeContext);
  if (!ctx) throw new Error("useRideMode must be used within RideModeProvider");
  return ctx;
}
