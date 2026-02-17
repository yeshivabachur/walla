import React, { memo, useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useRideMode } from "@/state/RideModeProvider";
import type { RideMode } from "@/state/rideMode";
import { RIDE_MODE_THEME } from "@/state/rideMode";

type HubId = "commuter" | "professional" | "logistics" | "wellness";

type HubLink = {
  label: string;
  description: string;
  page: string;
};

type Hub = {
  id: HubId;
  title: string;
  subtitle: string;
  links: readonly HubLink[];
};

const HUBS: readonly Hub[] = [
  {
    id: "commuter",
    title: "Commuter Hub",
    subtitle: "Request, track, and review rides without noise.",
    links: [
      { label: "Mission Control", description: "Omni-Intelligence Dashboard.", page: "MissionControl" },
      { label: "Request Ride", description: "Instant request & pricing.", page: "RequestRide" },
      { label: "Track Request", description: "Live driver ETA + status.", page: "TrackRequest" },
      { label: "Track Ride", description: "In-ride tracking view.", page: "TrackRide" },
      { label: "My Rides", description: "History, receipts, support flows.", page: "MyRides" },
      { label: "Ride History", description: "Passenger timeline view.", page: "PassengerRideHistory" },
    ],
  },
  {
    id: "professional",
    title: "Professional Hub",
    subtitle: "Driver ops, earnings, analytics, loyalty.",
    links: [
      { label: "Driver Dashboard", description: "Go online, manage trips.", page: "DriverDashboard" },
      { label: "Earnings", description: "Revenue, payouts, insights.", page: "DriverEarnings" },
      { label: "Analytics", description: "Performance and trends.", page: "DriverAnalytics" },
      { label: "Training", description: "Skill modules and safety.", page: "DriverTraining" },
      { label: "Loyalty", description: "Rewards and tiers.", page: "DriverLoyalty" },
    ],
  },
  {
    id: "logistics",
    title: "Logistics Hub",
    subtitle: "Packages & deliveries.",
    links: [
      { label: "Send Package", description: "Courier request flow.", page: "SendPackage" },
      { label: "Packages", description: "Plans, bundle options.", page: "Packages" },
    ],
  },
  {
    id: "wellness",
    title: "Wellness Hub",
    subtitle: "Preferences & safety controls.",
    links: [
      { label: "Passenger Preferences", description: "Personalization controls.", page: "PassengerPreferences" },
      { label: "Preferences", description: "App settings & defaults.", page: "Preferences" },
      { label: "Driver Onboarding", description: "Documents & verification.", page: "DriverOnboarding" },
    ],
  },
] as const;

type RideModeOption = { mode: RideMode; label: string; hint: string };

const RIDE_MODE_OPTIONS: readonly RideModeOption[] = [
  { mode: "commuter", label: "Commuter", hint: "Day-to-day moves" },
  { mode: "nightlife", label: "Nightlife", hint: "Neon contrast, low light" },
  { mode: "medical", label: "Medical", hint: "Soft Blue, calm UX" },
  { mode: "delivery", label: "Delivery", hint: "Signal Amber, logistics" },
] as const;

function ModePill({
  active,
  label,
  hint,
  onClick,
}: {
  active: boolean;
  label: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "glass px-4 py-3 text-left transition will-change-transform",
        active ? "ring-1 ring-white/40" : "opacity-80 hover:opacity-100",
      ].join(" ")}
    >
      <div className="text-sm font-semibold">{label}</div>
      <div className="text-xs opacity-80">{hint}</div>
    </button>
  );
}

const HubCard = memo(function HubCard({ hub }: { hub: Hub }) {
  return (
    <section className="glass-strong rounded-2xl p-5">
      <header className="mb-4">
        <h2 className="text-lg font-semibold">{hub.title}</h2>
        <p className="text-sm opacity-80">{hub.subtitle}</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {hub.links.map((l) => (
          <Link
            key={l.page}
            to={createPageUrl(l.page)}
            className="glass rounded-xl p-4 transition hover:translate-y-[-1px]"
          >
            <div className="text-sm font-semibold">{l.label}</div>
            <div className="text-xs opacity-80">{l.description}</div>
          </Link>
        ))}
      </div>
    </section>
  );
});

export default function HomeScreen() {
  const { mode, setMode } = useRideMode();
  const [activeHub, setActiveHub] = useState<HubId>("commuter");

  const onSelectMode = useCallback(
    (m: RideMode) => () => {
      setMode(m);
      // Context-aware default hub: nightlife -> commuter, medical -> wellness, delivery -> logistics
      if (m === "delivery") setActiveHub("logistics");
      else if (m === "medical") setActiveHub("wellness");
      else setActiveHub("commuter");
    },
    [setMode]
  );

  const currentTheme = RIDE_MODE_THEME[mode];

  const hub = useMemo(() => HUBS.find((h) => h.id === activeHub) ?? HUBS[0], [activeHub]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider opacity-70">Walla</div>
          <h1 className="text-2xl font-semibold">Context-Aware Home</h1>
          <p className="text-sm opacity-80">
            Theme: <span className="font-semibold">{currentTheme.label}</span> · Accent:{" "}
            <span className="font-semibold">{currentTheme.accent}</span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {RIDE_MODE_OPTIONS.map((opt) => (
            <ModePill
              key={opt.mode}
              active={opt.mode === mode}
              label={opt.label}
              hint={opt.hint}
              onClick={onSelectMode(opt.mode)}
            />
          ))}
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {HUBS.map((h) => (
          <button
            key={h.id}
            type="button"
            onClick={() => setActiveHub(h.id)}
            className={[
              "glass px-4 py-2 text-sm font-semibold",
              h.id === activeHub ? "ring-1 ring-white/40" : "opacity-80 hover:opacity-100",
            ].join(" ")}
          >
            {h.title}
          </button>
        ))}
      </div>

      <HubCard hub={hub} />

      <div className="mt-6 text-xs opacity-70">
        Tip: legacy links like <code>/driver-analytics</code> will redirect to <code>/DriverAnalytics</code>.
      </div>
    </div>
  );
}
