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

## Phase 3 — Docket MVP (Week 3–5)

- [x] Implement Docket tRPC router (CRUD operations)
- [x] Build Docket UI components (task board, clients list)
- [x] Wire tRPC to database (Supabase)
- [ ] Test multi-client isolation
- [ ] Deploy + test in production

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
**Phase 3 — Docket MVP: 100% complete** ✅

### What's Live
✅ Premium landing page per RunsDark_Design_Plan.md (floating pill nav, hero, apps section, Dark Ops)
✅ Supabase PostgreSQL database with RLS policies
✅ Authentication (signup/login/email callback)
✅ Protected dashboard with sidebar navigation
✅ tRPC API layer with full type-safety
✅ Docket app — full CRUD (create, list, update status, delete tasks/subtasks/comments)
✅ Clients page for managing and selecting clients
✅ README.md with design reference and tech stack

### Architecture Complete
✅ Next.js 14 + TypeScript + Tailwind + shadcn/ui
✅ Supabase (PostgreSQL, Auth, RLS)
✅ tRPC + React Query (TanStack Query)
✅ Authenticated API routes + protected pages
✅ Git + GitHub integration (commits tracked)

### Current Blocker
🔴 Email confirmation required before login (Supabase default)
   → Need to disable in Supabase Authentication settings for testing

### Next Steps
⏳ Disable email confirmation in Supabase → retry Docket E2E test
⏳ Deploy to Vercel
⏳ Build E-Drafting (RAG, Claude API, voice profiles)
⏳ Build Calendar Tracker (Google Calendar sync, status board)
⏳ Build Travel Manager (trips, segments, PDF export)
