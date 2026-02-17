# Walla Source of Truth Coding Book

## Promise Statement

This book is the canonical, executable guide to build, deploy, and operate Walla as a production ride-hailing platform across web (Rider, Driver, Admin) and native mobile (iOS, Android for Rider and Driver), using Google Maps Platform as the canonical maps/places/routing layer, with Israel-specific driver navigation defaults (Waze by default in Israel; user-selectable Waze or Google Maps outside Israel), and a binding high-fidelity hotspot map quality contract.

This manuscript is repo-grounded against the codebase derived from `/mnt/data/walla Project_v1.4.zip` (current extracted workspace equivalent: `c:\Walla Dev\walla Project_v1.4`). All chapters must map to concrete file paths, runnable commands, tests, observability assets, and runbooks.

---

## Locked Product Requirements

- Platforms:
  - Web apps: Rider, Driver, Admin
  - Native apps: iOS + Android for Rider and Driver
- Maps: Google Maps Platform is canonical for maps/places/routing.
- Navigation:
  - In Israel: Waze is the default primary navigation app for drivers.
  - Outside Israel: drivers can choose Waze or Google Maps in Settings.
- Hotspot map graphics: must satisfy the binding Map Graphics Quality Contract.
- No mockups or simulated static fixture workflows for core features:
  - Use real infrastructure and real providers.
  - Provider test/sandbox modes are allowed (for example Stripe test mode), and are treated as real integrations.
- Research-first policy:
  - Every major section includes authoritative citations (official vendor docs, standards/RFCs, reputable engineering references) with vendor, title, version/date, and link.

---

## COMPLETE FEATURE COVERAGE CONTRACT (BINDING)

Definition: "Includes all the features" means every feature in the contract is:
1) implemented in code,  
2) documented with exact file paths,  
3) test-covered (unit/integration/E2E where relevant),  
4) observable (metrics/logs/traces),  
5) covered by an operational runbook, and  
6) validated via end-to-end verification checklist.

If any feature is incomplete, execution must stop; missing chapters, code artifacts, tests, observability, and runbooks must be added before continuing.

### A) Rider (Web + Native) Must-Have
- Identity & account: signup/login, session lifecycle, profile, saved places, language/region/timezone.
- Maps & request: live map, pickup/dropoff, autocomplete, reverse geocoding, route preview, ETA, fare estimate, service type.
- Lifecycle: request, match, assignment, live driver location, trip progress, cancellation rules, no-show policy.
- Payments: payment methods, auth/capture, tips, receipts/invoices, refunds, wallet/credits/promos.
- Comms & safety: push/SMS, in-app chat, share trip, emergency behavior, support ticketing with attachments.
- History & ratings: trip history, ratings/reports, rider preferences.

### B) Driver (Web + Native) Must-Have
- Onboarding: account creation, document upload, KYC, background check handling where feasible.
- Availability & dispatch: online/offline, live streaming location, offer handling, high-fidelity hotspot map.
- Trip execution: external navigation policy (Israel Waze default; global selectable), fallback handling, start/end, deviation policy.
- Earnings & payouts: earnings dashboards, fees, payout onboarding, schedule, status/failures.
- Driver quality & safety: rider ratings, fraud/safety signals, support tickets.

### C) Admin/Ops Dashboard Must-Have
- Identity & RBAC (support, ops, finance, superadmin), sensitive action audit logs.
- Live ops map with filters/drill-down, reassign/force-cancel (policy-controlled, audited), contact workflows.
- Support/disputes: queues, internal notes, refund flows, promo/credit issuance, fraud review queue.
- Finance controls: fare breakdowns, payout review/adjustments (audited), exports.
- Configuration: pricing rules, geofencing/service areas, promos, flags/rollouts.

### D) Backend Platform Must-Have
- Service boundaries, canonical OpenAPI, versioning/backward compatibility policy.
- Formal ride state machine, cancellation/no-show policy, idempotent writes, retry semantics.
- Geospatial indexing, matching/scoring/timeouts, surge mechanism, ETA integration, hotspot generation pipeline.
- Realtime WebSocket auth/reconnect/resync/event sequencing, location ingest with limits/TTL.
- Stripe: customer/payment methods/setup intents/payment intents/refunds/webhooks/idempotency/connect payouts.
- Notifications: push/SMS/email, templates/localization, retries and dead-letter handling.
- Data layer: schema constraints, migrations, backup/restore drills, retention/deletion, PII classification/access controls.
- Security: OWASP-aligned validation, rate limiting/abuse prevention, secrets rotation, immutable audit strategy, threat model, SAST/SCA.
- Reliability: OpenTelemetry, dashboards/alerts, SLOs/error budgets, IR runbooks, load/capacity planning.

### E) Mobile Platform (iOS/Android) Must-Have
- Deep links (Waze/Google Maps), push token lifecycle, background location (driver), permissions UX, crash/perf monitoring, release pipelines.

### F) Maps + Hotspots Graphics Must Meet Contract
- Web: high-performance overlays (WebGL/tiles) + CI perf gates.
- Native: performant overlays + frame timing/perf gates.
- Accessibility, day/night themes, profiling + regression tooling.

### G) Globalization + Israel Policy Must-Have
- Israel Waze default for drivers; global nav choice outside Israel.
- Locale/timezone support with Israel defaults.
- Address/phone/unit formatting and regional pricing behavior.

### H) Done Gates (Mandatory)
Completion requires:
- Feature Index maps every feature to chapters, endpoints, DB tables, tests, dashboards/alerts.
- End-to-end suites:
  1. Rider signup -> request -> match -> trip complete -> payment -> receipt  
  2. Driver onboarding -> online -> accept -> navigate -> complete -> payout visibility  
  3. Admin live ops -> force cancel/reassign -> refund -> audit verification
- Critical dashboards/alerts in place (realtime, payments, matching, location ingest).
- Runbooks for at least:
  - payments webhook failures
  - realtime outage
  - DB incident
  - queue backlog
  - maps quota/billing incident

---

## Map Graphics Quality Contract (Binding Reference)

The full canonical contract text is maintained in:

- `book/SPECS-MAPS-HOTSPOTS.md` (section: **Map Graphics Quality Contract (Binding)**)

All map/hotspot chapters in Volumes 05, 06, and 07 must satisfy contract budgets for:
- web FPS, latency, update timing, and memory stability,
- native FPS, marker interpolation smoothness, UI thread budget, battery budget,
- visual integrity, accessibility, caching/data contracts, and CI regression gating.

No chapter may weaken these thresholds without an ADR and governance approval.

---

## Feature Index Enforcement Rule

The book must include:

- `book/FEATURE-INDEX.md`

`FEATURE-INDEX.md` is a hard completeness gate. For each contractual feature, it must map to:
- chapter(s)
- API endpoint(s)
- DB table(s)
- tests
- dashboards/alerts

If any feature lacks this mapping, the manuscript is incomplete.

---

## Initial Local Run Guide (Best Current Baseline)

> This section captures the current best-known startup path from the existing repo baseline. It is refined in later volumes as the monorepo is expanded.

### Prerequisites

- Node.js `>=20.19.0 || >=22.12.0`
- npm or pnpm (pnpm becomes canonical in Volume 01 migration)
- Docker Desktop (required for later backend services)

### Current Baseline Commands

```bash
cd "c:\Walla Dev\walla Project_v1.4"
npm install
npm run dev
```

### Current Baseline Build/Lint

```bash
npm run build
npm run lint
```

### Known Baseline State

- Existing app: Vite + React frontend (`src/*`)
- Existing integration layer: Base44 SDK (`src/api/base44Client.js`, `src/api/entities.js`, `src/api/integrations.js`)
- Backend and native production structure: introduced in Volume 01+ migration chapters

---

## Locked Architecture Overview

### Client Platforms

- Web:
  - `apps/web-rider`
  - `apps/web-driver`
  - `apps/web-admin`
- Native (React Native + Expo Dev Client/EAS):
  - `apps/mobile-rider`
  - `apps/mobile-driver`

### Backend and Data

- API platform: NestJS (TypeScript)
- Database: PostgreSQL + PostGIS
- Cache/queue: Redis + BullMQ
- Realtime: WebSockets with versioned protocol
- Object storage: S3-compatible

### External Providers

- Maps/Places/Routing: Google Maps Platform (canonical)
- Driver external navigation:
  - Israel default: Waze
  - Outside Israel: Waze or Google Maps (driver setting)
- Payments: Stripe + Stripe Connect
- Notifications:
  - Push: FCM/APNs
  - SMS: Twilio (or approved equivalent)
  - Email: SendGrid (or approved equivalent)

### Canonical Policies

- One canonical OpenAPI spec
- One canonical DB schema catalog
- One canonical ride lifecycle state machine
- One canonical realtime protocol
- One canonical maps/navigation/hotspot specification

---

## Living Specs (Canonical Files)

- `book/SPECS-OPENAPI.md`
- `book/SPECS-DB.md`
- `book/SPECS-STATE-MACHINE.md`
- `book/SPECS-REALTIME.md`
- `book/SPECS-MAPS-HOTSPOTS.md`

Supporting governance:
- `book/CHANGELOG.md`
- `book/INDICES.md`
- `book/FEATURE-INDEX.md`
- `book/GLOSSARY.md`
- `book/APPENDICES.md`

---

## High-Level Volume Map (12 Volumes)

1. `book/VOLUME-01.md` — Foundation, monorepo migration, standards, contracts
2. `book/VOLUME-02.md` — Domain model, PostGIS schema, lifecycle and pricing/matching specs
3. `book/VOLUME-03.md` — Backend API implementation and platform modules
4. `book/VOLUME-04.md` — Realtime protocol, eventing, queues, location ingest
5. `book/VOLUME-05.md` — Maps, navigation policy, hotspot data contracts, graphics quality enforcement
6. `book/VOLUME-06.md` — Web Rider/Driver/Admin production implementation
7. `book/VOLUME-07.md` — Native Rider/Driver iOS/Android production implementation
8. `book/VOLUME-08.md` — Payments, payouts, notifications, support, trust/safety
9. `book/VOLUME-09.md` — Security engineering, threat modeling, privacy controls
10. `book/VOLUME-10.md` — Observability, SLOs, incident response, reliability
11. `book/VOLUME-11.md` — CI/CD, release engineering, App Store/Play Store operations
12. `book/VOLUME-12.md` — Production launch, operations handover, long-term governance

---

## Changelog Policy in Manuscript

Two changelog streams are mandatory and continuously maintained:

- **Book Changelog:** `book/CHANGELOG.md` (documentation and specification evolution)
- **Repo Changelog:** embedded chapter sections that record exact code-level deltas and deployment-impact notes, then summarized in root `CHANGELOG.md` as implementation advances

No chapter is complete until both changelog streams are updated.

---

## Credential Matrix Policy

When credentials are required, each chapter must include:
- exact variable names,
- where they are configured,
- minimal permissions,
- rotation guidance,
- verification commands and expected signals once populated.

Scaffolding, config wiring, tests, observability, and runbooks must be implemented even before real secrets are provided.

---

## Citation Policy

Every chapter must include a **Source citations** section with:
- Vendor/standard body
- Document title
- Version/date
- Link

At minimum, major domains cite official docs/standards:
- Google Maps Platform, Waze integration docs
- Stripe/Connect
- PostgreSQL/PostGIS
- Redis/BullMQ
- NestJS, WebSocket RFCs
- Apple/Google mobile tooling and performance docs
- OWASP, OpenTelemetry, SRE references

---

## Execution Order for This Manuscript

1. Read this README.
2. Read canonical specs files before any volume implementation.
3. Execute volumes in order.
4. Enforce Feature Index completeness at the end of each volume.
5. Enforce map graphics contract budgets before completing Volumes 05/06/07 and before production launch.

