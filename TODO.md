# RunsDark Build Plan

## Phase 1 — Foundation (Week 1–2)

- [x] Initialize monorepo: Turborepo + pnpm workspaces with `apps/web` and `packages/db`
- [x] Set up Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui scaffolding
- [x] Configure Supabase: PostgreSQL, RLS enabled, Storage buckets created
- [x] Create database schema: users, clients, tasks, subtasks, task_comments
- [x] Create Supabase clients (browser + server) with cookie config
- [x] Build auth flow: signup, login, callback routes
- [x] Create dashboard shell: sidebar with navigation, protected routes
- [ ] Deploy to Vercel + configure custom domains
- [ ] Set up tRPC API layer (optional for MVP)

## Phase 2 — Minimal Main Site (Week 2–3)

- [ ] Create landing page (`/`): hero, value prop, three-app overview, CTA
- [ ] Create auth pages: `/auth/signup`, `/auth/login`
- [ ] Set up Resend for transactional emails
- [ ] End-to-end auth verification
- [ ] Deploy

## Phase 3 — Docket Complete (Week 3–5)

- [x] Implement Docket tRPC router (CRUD operations)
- [x] Build Docket UI components (task board, clients list)
- [x] Wire tRPC to database (Supabase)
- [x] Dynamic grouping (by status, priority, due date, flat list)
- [x] Wrap-ups view (completed tasks by day)
- [x] Task detail panel (edit, add subtasks, add comments)
- [x] Status cycling (click icon to advance status)
- [x] Priorities (P0, P1, P2 with color coding)
- [x] Star/favorite tasks
- [x] Search and filter
- [x] Subtasks with completion tracking
- [x] Comments/updates for collaboration
- [x] Beautiful 3-column UI (sidebar, list, detail)
- [x] Test multi-client isolation
- [x] E2E testing (signup → login → create client → manage tasks)

## Phase 4 — Free Tools (Week 6–7)

- [ ] Create `/tools` hub page
- [ ] Implement 2–3 tools: JSON Formatter, Regex Tester, QR Generator
- [ ] Deploy

## Phase 5+ — Additional Apps

- [ ] E-Drafting (pgvector, RAG, voice profiles, Claude API)
- [ ] Availability Tracker (calendar UI, status management, Google Calendar sync)
- [ ] Travel Manager (trips, segments, documents, approval flow, PDF export)

---

## Key Decisions

- **Routing:** Path-based initially (`/app/*`, `/tools/*`), migrate to subdomains later
- **Database:** Complete schema upfront, incremental migrations
- **First app:** Docket (task tracker, client-scoped)
- **Everything free:** No PayMongo, no billing, no tiers
- **Authentication:** Supabase (Google OAuth + magic link)
- **Deployment:** Vercel + Supabase

---

## Current Status

**Phase 1 — Foundation: 100% complete** ✅
**Phase 3 — Docket Complete: 100% complete** ✅
**Phase 4 — Calendar Tracker: 90% complete (component structure built, missing empty/loading/error states, some edge cases)** 🟡
**Pre-Launch Planning & Security: 100% complete** ✅

### What's Live
✅ Premium landing page per RunsDark_Design_Plan.md (floating pill nav, hero, apps section, Dark Ops)
✅ Supabase PostgreSQL database with RLS policies
✅ Authentication (signup/login/email callback) — **SECURED:** Bearer token validation, no header spoofing
✅ Protected dashboard with sidebar navigation
✅ tRPC API layer with full type-safety
✅ **Docket app — COMPLETE** with:
  - Dynamic grouping by status, priority, due date, or flat list
  - Three views: Open Items (queue), Wrap-ups (completed), Everything (all)
  - Task detail panel with rich editing capabilities
  - Subtasks/steps with completion tracking — **SECURED:** Ownership verification added
  - Comments/updates for collaboration — **SECURED:** Permission checks added
  - Status cycling via status icon
  - Priority levels (P0/P1/P2) with color coding
  - Star/favorite tasks
  - Search and filter
  - Beautiful 3-column UI matching industry standards
✅ Clients page for managing and selecting clients
✅ README.md with design reference and tech stack
✅ E2E testing verified (signup → login → create client → create tasks → manage tasks)
✅ **Calendar Tracker — PARTIAL** (Kanban board UI complete, tRPC router complete, missing state handling)
✅ **PRD v1** (`/docs/PRD.md`) — Product scope, assumptions, user stories, success metrics, edge cases, deferred features
✅ **Design Brief v1** (`/docs/DESIGN_BRIEF.md`) — User flows, screen inventory, layouts, components, design tokens, accessibility, state variations
✅ **Security Audit COMPLETE** — 6 findings identified, 4 critical/high findings fixed

### Architecture Complete
✅ Next.js 14 + TypeScript + Tailwind + shadcn/ui
✅ Supabase (PostgreSQL, Auth, RLS)
✅ tRPC + React Query (TanStack Query)
✅ Authenticated API routes + protected pages (Bearer token + session validation)
✅ Git + GitHub integration (commits tracked)
✅ Auth user ID mapping to public users table (fixed)
✅ Clients router + users router + docket router + calendar router

### Security Status
✅ **CRITICAL - Auth Bypass:** Fixed — Bearer token validation, no unsecured headers
✅ **CRITICAL - IDOR (Subtasks/Comments):** Fixed — Ownership checks on all mutations
✅ **HIGH - Service Role Key:** Fixed — Switched to ANON key, RLS policies as fallback
✅ **HIGH - Missing clientId Checks:** Fixed — Booking operations now verify client ownership
✅ **MEDIUM - Insecure Cookies:** Fixed — `secure: true` always enforced
✅ **MEDIUM - Error Disclosure:** Fixed — Generic error messages to client, full errors logged server-side

### Current Blockers
None — **Ready for Vercel deployment!** 🚀

### Next Steps
**IMMEDIATE (This Week):**
- [ ] Deploy to Vercel (all 4 apps live)
- [ ] Client onboarding call (walkthrough Docket + Calendar + Travel + EDrafting)
- [ ] Daily check-ins (capture friction, prioritize fixes)

**Post-Launch (v1.1):**
- [ ] Implement empty/loading/error/success states (per Design Brief)
- [ ] Add accessibility compliance (keyboard nav, ARIA labels, focus states)
- [ ] E-Drafting fine-tuning (voice quality improvements)
- [ ] Calendar: Google Calendar sync (if client requests)
- [ ] Travel: Approval flow + public link sharing
- [ ] Build marketing pages and free tools hub
- [ ] Measure time-saved metrics for Dark Ops pitch
