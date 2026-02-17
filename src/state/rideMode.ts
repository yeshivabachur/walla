export type RideMode = "commuter" | "nightlife" | "medical" | "delivery" | "cyberpunk" | "minimalist" | "eco" | "scifi";

export const RideModes: ReadonlyArray<RideMode> = [
  "commuter",
  "nightlife",
  "medical",
  "delivery",
  "cyberpunk",
  "minimalist",
  "eco",
  "scifi",
] as const;

export const DEFAULT_RIDE_MODE: RideMode = "commuter";

export type RideModeTheme = {
  label: string;
  /**
   * Applied to <html data-ride-mode="...">. CSS uses this for theming.
   */
  dataAttr: RideMode;
  /**
   * Human-facing accent label (used in UI).
   */
  accent: string;
};

export const RIDE_MODE_THEME: Record<RideMode, RideModeTheme> = {
  commuter: { label: "Commuter", dataAttr: "commuter", accent: "Aurora Teal" },
  nightlife: { label: "Nightlife", dataAttr: "nightlife", accent: "Neon" },
  medical: { label: "Medical", dataAttr: "medical", accent: "Soft Blue" },
  delivery: { label: "Delivery", dataAttr: "delivery", accent: "Signal Amber" },
  cyberpunk: { label: "Cyberpunk", dataAttr: "cyberpunk", accent: "Neon Pink" },
  minimalist: { label: "Minimalist", dataAttr: "minimalist", accent: "Pure White" },
  eco: { label: "Eco-Futurism", dataAttr: "eco", accent: "Leaf Green" },
  scifi: { label: "Sci-Fi", dataAttr: "scifi", accent: "Holographic Blue" },
} as const;
