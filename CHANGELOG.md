# Changelog

## v1.4 (Aurora Glass + Context-Aware Home)

### UX/UI (Non-Destructive Overhaul)
- Added **Context-Aware Home Screen** (`/Home`) that groups core capabilities into **Hubs**:
  - Commuter, Professional, Logistics, Wellness
- Preserved the original marketing home at `/Landing` (no logic deleted).

### Theming
- Added global **Ride Mode** state with persistence (`src/state/RideModeProvider.tsx`):
  - commuter / nightlife / medical / delivery
- Implemented **Aurora Glassmorphism** primitives (`.glass`, `.glass-strong`) and ride-mode theme shifts via
  `<html data-ride-mode="...">` in `src/index.css`.

### Reliability
- Added a global **ErrorBoundary** that contains crashes and provides a safe reload path.

Notes:
- This is intentionally non-destructive: existing pages, routes, and handlers remain intact.
