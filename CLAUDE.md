# RunsDark — Claude Code Project Context

## What We're Building

RunsDark is a web platform for **Filipino Executive Assistants (EAs)** serving global (US/AU/UK) clients.
It combines three layers:

1. **Free Tools** — browser-based utilities for GHL, n8n, and VA productivity (client-side only, no backend)
2. **Free Apps** — three purpose-built tools for EA workflows (100% free, no paywall)
3. **Services** — done-for-you GHL + n8n automation retainer (the only paid offering)

## Target User

Filipino EA/VA working remotely for global executives. Uses GoHighLevel (GHL), manages calendars
for busy clients, handles travel logistics, writes emails on behalf of clients.
Primary device: laptop. Pays via GCash or Maya.

---

## The Three Apps

### 1. EDrafting
AI email drafting that matches a specific client's voice and tone.
- EA uploads sample emails/docs from their client
- App builds a voice profile via RAG (chunk → embed → retrieve)
- EA inputs a brief ("write a polite decline to James re: Tuesday meeting")
- App generates a draft that sounds like the client wrote it

### 2. Calendar Booking Tracker
Status-layer dashboard across multiple client calendars.
Statuses: `confirmed` | `pending` | `needs_followup` | `rescheduled` | `cancelled` | `conflict`
Integrates with Google Calendar. GHL calendar sync optional.

### 3. Travel Manager
Lightweight executive travel itinerary builder.
- Segments: flight / hotel / car / activity
- Vendor tracking + confirmation numbers
- Document storage (visas, tickets, confirmations)
- Client approval flow via public link
- PDF itinerary export

---

## Tech Stack

### Frontend
- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **React Hook Form** + **Zod** (validation)
- **TanStack Query** (data fetching / cache)
- **Zustand** (lightweight client state)

### Backend & Data
- **Supabase** — PostgreSQL + Auth + Storage + Realtime
- **Drizzle ORM** — schema, migrations, type-safe queries
- **tRPC** — type-safe API layer (no REST endpoints for app data)
- **Supabase pgvector** — vector storage for EDrafting embeddings

### AI
- **Anthropic Claude API** — `claude-haiku-4-5-20251001` (speed/cost), `claude-sonnet-4-5` (quality drafts)
- **OpenAI API** — `text-embedding-3-small` (embeddings only — cheapest option)
- Custom RAG implementation (no Langchain — keep it lean)

### Integrations
- **PayMongo** — GCash, Maya, cards (Philippine primary payment)
- **Resend** — transactional email
- **Google Calendar API** — calendar sync
- **GHL API v2** — GoHighLevel calendar + contact sync
- **@react-pdf/renderer** — travel itinerary PDF export

### DevOps
- **pnpm** + **Turborepo** (monorepo)
- **Vercel** (hosting)
- **Supabase** (DB / Auth / Storage)
- **Cloudflare** (DNS + CDN)
- **Sentry** (error tracking)
- **PostHog** (analytics)

---

## Directory Structure

```
runsdark/
├── CLAUDE.md
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
├── .env.example
│
├── apps/
│   └── web/                              # Main Next.js app
│       ├── next.config.ts
│       ├── tailwind.config.ts
│       ├── src/
│       │   ├── app/
│       │   │   ├── layout.tsx            # Root layout (fonts, providers)
│       │   │   ├── (marketing)/          # Public pages — no auth required
│       │   │   │   ├── page.tsx          # Home / landing
│       │   │   │   ├── tools/
│       │   │   │   │   ├── page.tsx      # Free tools hub
│       │   │   │   │   └── [slug]/
│       │   │   │   │       └── page.tsx  # Individual tool page
│       │   │   │   ├── portfolio/
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── services/
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── pricing/
│       │   │   │   │   └── page.tsx
│       │   │   │   └── blog/
│       │   │   │       ├── page.tsx
│       │   │   │       └── [slug]/
│       │   │   │           └── page.tsx
│       │   │   ├── (auth)/
│       │   │   │   ├── login/
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── signup/
│       │   │   │   │   └── page.tsx
│       │   │   │   └── callback/
│       │   │   │       └── route.ts      # Supabase OAuth callback
│       │   │   ├── (dashboard)/          # Protected — requires auth
│       │   │   │   ├── layout.tsx        # Dashboard shell (sidebar, topbar)
│       │   │   │   ├── dashboard/
│       │   │   │   │   └── page.tsx      # Overview: app summaries
│       │   │   │   ├── clients/
│       │   │   │   │   ├── page.tsx      # Client list
│       │   │   │   │   └── [id]/
│       │   │   │   │       └── page.tsx  # Client detail
│       │   │   │   ├── edrafting/
│       │   │   │   │   ├── page.tsx              # Voice profiles list
│       │   │   │   │   ├── new/
│       │   │   │   │   │   └── page.tsx          # Create profile
│       │   │   │   │   └── [profileId]/
│       │   │   │   │       ├── page.tsx          # Draft composer
│       │   │   │   │       └── documents/
│       │   │   │   │           └── page.tsx      # Upload / manage docs
│       │   │   │   ├── calendar/
│       │   │   │   │   ├── page.tsx              # All bookings board
│       │   │   │   │   ├── new/
│       │   │   │   │   │   └── page.tsx
│       │   │   │   │   └── [bookingId]/
│       │   │   │   │       └── page.tsx
│       │   │   │   └── travel/
│       │   │   │       ├── page.tsx              # All trips list
│       │   │   │       ├── new/
│       │   │   │       │   └── page.tsx
│       │   │   │       └── [tripId]/
│       │   │   │           ├── page.tsx          # Trip detail / itinerary
│       │   │   │           └── documents/
│       │   │   │               └── page.tsx
│       │   │   └── api/
│       │   │       ├── trpc/
│       │   │       │   └── [trpc]/
│       │   │       │       └── route.ts          # tRPC handler
│       │   │       ├── webhooks/
│       │   │       │   ├── paymongo/
│       │   │       │   │   └── route.ts
│       │   │       │   └── stripe/
│       │   │       │       └── route.ts
│       │   │       └── travel/
│       │   │           └── [tripId]/
│       │   │               └── approve/
│       │   │                   └── route.ts      # Public approval endpoint
│       │   ├── components/
│       │   │   ├── ui/                   # shadcn/ui (auto-generated)
│       │   │   ├── layout/
│       │   │   │   ├── sidebar.tsx
│       │   │   │   ├── topbar.tsx
│       │   │   │   └── mobile-nav.tsx
│       │   │   ├── edrafting/
│       │   │   │   ├── voice-profile-card.tsx
│       │   │   │   ├── document-uploader.tsx
│       │   │   │   └── draft-composer.tsx
│       │   │   ├── calendar/
│       │   │   │   ├── booking-board.tsx  # Kanban-style status columns
│       │   │   │   ├── booking-card.tsx
│       │   │   │   └── status-badge.tsx
│       │   │   ├── travel/
│       │   │   │   ├── trip-card.tsx
│       │   │   │   ├── segment-form.tsx
│       │   │   │   ├── itinerary-view.tsx
│       │   │   │   └── document-shelf.tsx
│       │   │   └── tools/
│       │   │       ├── tool-card.tsx
│       │   │       └── tools/            # Each free tool as a component
│       │   ├── lib/
│       │   │   ├── supabase/
│       │   │   │   ├── client.ts         # createBrowserClient
│       │   │   │   └── server.ts         # createServerClient
│       │   │   ├── trpc/
│       │   │   │   ├── client.ts
│       │   │   │   └── server.ts
│       │   │   ├── ai/
│       │   │   │   ├── embed.ts          # chunk + embed via OpenAI
│       │   │   │   ├── generate.ts       # Claude generation helpers
│       │   │   │   └── rag.ts            # retrieve similar chunks
│       │   │   ├── extract/
│       │   │   │   ├── pdf.ts            # pdf-parse text extraction
│       │   │   │   └── docx.ts           # mammoth text extraction
│       │   │   ├── google-calendar.ts
│       │   │   ├── ghl.ts
│       │   │   ├── paymongo.ts
│       │   │   └── travel-pdf.ts         # @react-pdf/renderer
│       │   ├── server/
│       │   │   ├── context.ts            # tRPC context (session, db)
│       │   │   ├── trpc.ts               # tRPC init + middleware
│       │   │   └── routers/
│       │   │       ├── index.ts          # Root router
│       │   │       ├── clients.ts
│       │   │       ├── edrafting.ts
│       │   │       ├── calendar.ts
│       │   │       ├── travel.ts
│       │   │       └── billing.ts
│       │   └── types/
│       │       └── index.ts
│
└── packages/
    └── db/                               # Drizzle schema + migrations
        ├── src/
        │   └── schema/
        │       ├── index.ts              # Re-exports all tables
        │       ├── users.ts
        │       ├── clients.ts
        │       ├── edrafting.ts
        │       ├── calendar.ts
        │       └── travel.ts
        ├── migrations/
        └── drizzle.config.ts
```

---

## Database Schema (Drizzle + PostgreSQL)

### packages/db/src/schema/users.ts
```typescript
import { pgTable, uuid, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const tierEnum = pgEnum('tier', ['free', 'pro']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  supabaseId: text('supabase_id').notNull().unique(),
  email: text('email').notNull().unique(),
  name: text('name'),
  avatarUrl: text('avatar_url'),
  timezone: text('timezone').default('Asia/Manila'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  // No tier column — everything is free
});
```

### packages/db/src/schema/clients.ts
```typescript
export const clients = pgTable('clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  email: text('email'),
  company: text('company'),
  timezone: text('timezone').default('UTC'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### packages/db/src/schema/edrafting.ts
```typescript
import { pgTable, uuid, text, timestamp, integer, index } from 'drizzle-orm/pg-core';
import { vector } from 'drizzle-orm/pg-core'; // requires pgvector extension

export const voiceProfiles = pgTable('voice_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  clientId: uuid('client_id').references(() => clients.id, { onDelete: 'set null' }),
  name: text('name').notNull(),
  systemPrompt: text('system_prompt'), // synthesized from uploaded docs by Claude
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const voiceDocuments = pgTable('voice_documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  profileId: uuid('profile_id').notNull().references(() => voiceProfiles.id, { onDelete: 'cascade' }),
  filename: text('filename').notNull(),
  storagePath: text('storage_path').notNull(), // Supabase Storage path
  mimeType: text('mime_type'),
  embeddedAt: timestamp('embedded_at'), // null = not yet processed
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const documentChunks = pgTable('document_chunks', {
  id: uuid('id').primaryKey().defaultRandom(),
  documentId: uuid('document_id').notNull().references(() => voiceDocuments.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  embedding: vector('embedding', { dimensions: 1536 }), // text-embedding-3-small
  chunkIndex: integer('chunk_index').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  embeddingIdx: index('document_chunks_embedding_idx').using('ivfflat', table.embedding.op('vector_cosine_ops')),
}));

export const emailDrafts = pgTable('email_drafts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  profileId: uuid('profile_id').notNull().references(() => voiceProfiles.id),
  prompt: text('prompt').notNull(),     // EA's brief
  subject: text('subject'),
  draftContent: text('draft_content'),
  status: text('status', { enum: ['generating', 'ready', 'exported'] }).default('generating'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### packages/db/src/schema/calendar.ts
```typescript
export const bookingStatusEnum = pgEnum('booking_status', [
  'confirmed', 'pending', 'needs_followup', 'rescheduled', 'cancelled', 'conflict'
]);

export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  clientId: uuid('client_id').references(() => clients.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  startTime: timestamp('start_time', { withTimezone: true }),
  endTime: timestamp('end_time', { withTimezone: true }),
  status: bookingStatusEnum('status').notNull().default('pending'),
  platform: text('platform', { enum: ['google', 'ghl', 'manual'] }).default('manual'),
  gcalEventId: text('gcal_event_id'),
  ghlEventId: text('ghl_event_id'),
  notes: text('notes'),
  followUpAt: timestamp('follow_up_at', { withTimezone: true }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const bookingHistory = pgTable('booking_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  bookingId: uuid('booking_id').notNull().references(() => bookings.id, { onDelete: 'cascade' }),
  oldStatus: bookingStatusEnum('old_status'),
  newStatus: bookingStatusEnum('new_status').notNull(),
  note: text('note'),
  changedAt: timestamp('changed_at').defaultNow().notNull(),
});
```

### packages/db/src/schema/travel.ts
```typescript
import { numeric, date, jsonb } from 'drizzle-orm/pg-core';

export const tripStatusEnum = pgEnum('trip_status', [
  'draft', 'pending_approval', 'approved', 'active', 'completed', 'cancelled'
]);

export const segmentTypeEnum = pgEnum('segment_type', [
  'flight', 'hotel', 'car', 'activity', 'other'
]);

export const trips = pgTable('trips', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  clientId: uuid('client_id').references(() => clients.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  destination: text('destination'),
  startDate: date('start_date'),
  endDate: date('end_date'),
  status: tripStatusEnum('status').default('draft'),
  approvalToken: uuid('approval_token').defaultRandom().unique(), // public approval link key
  approvedAt: timestamp('approved_at', { withTimezone: true }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const tripSegments = pgTable('trip_segments', {
  id: uuid('id').primaryKey().defaultRandom(),
  tripId: uuid('trip_id').notNull().references(() => trips.id, { onDelete: 'cascade' }),
  type: segmentTypeEnum('type').notNull(),
  vendor: text('vendor'),
  confirmationNumber: text('confirmation_number'),
  startDatetime: timestamp('start_datetime', { withTimezone: true }),
  endDatetime: timestamp('end_datetime', { withTimezone: true }),
  details: jsonb('details').$type<Record<string, unknown>>(), // flexible per type
  cost: numeric('cost', { precision: 10, scale: 2 }),
  currency: text('currency').default('USD'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const tripDocuments = pgTable('trip_documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  tripId: uuid('trip_id').notNull().references(() => trips.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  storagePath: text('storage_path').notNull(),
  type: text('type', { enum: ['visa', 'ticket', 'confirmation', 'hotel', 'other'] }),
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
});
```

---

## EDrafting — RAG Architecture

```
UPLOAD PHASE
────────────
User uploads file (PDF / DOCX / TXT)
    → Store raw file in Supabase Storage (voice-docs/{userId}/{profileId}/{filename})
    → Extract text:
        PDF  → pdf-parse
        DOCX → mammoth
        TXT  → read directly
    → Split into chunks (~500 tokens, 50 token overlap)
    → For each chunk:
        POST to OpenAI /embeddings (text-embedding-3-small)
        INSERT into document_chunks (content, embedding, chunk_index)
    → Mark voiceDocuments.embeddedAt = now()

PROFILE SYNTHESIS (runs after all docs embedded)
────────────────────────────────────────────────
SELECT top 20 diverse chunks across all profile documents
Send to Claude (claude-haiku):
    "You will analyze email writing samples from one person. 
     Identify and describe their: tone (formal/casual), sentence 
     length patterns, greeting/closing phrases, signature words/phrases,
     how they handle disagreement, urgency, and requests.
     Output a concise system prompt (max 300 words) that, if used as 
     a system prompt for an AI, would make it write emails that sound 
     exactly like this person."
Store result → voice_profiles.system_prompt

DRAFT GENERATION
────────────────
EA submits brief (e.g. "Decline Tuesday meeting with James, friendly tone, keep it short")
    → Embed brief via OpenAI text-embedding-3-small
    → SELECT top 5 chunks FROM document_chunks
        WHERE document.profile_id = {profileId}
        ORDER BY embedding <=> {brief_embedding}    ← cosine similarity
        LIMIT 5
    → Build prompt:
        SYSTEM: {voice_profiles.system_prompt}
        USER:
          Here are sample emails from this person for reference:
          ---
          {chunk_1_content}
          ---
          {chunk_2_content}
          ... (up to 5 chunks)
          ---
          Now write an email based on this instruction:
          {EA's brief}
          
          Return JSON: { "subject": "...", "body": "..." }
    → Parse Claude response → return to EA for review
```

---

## tRPC Router Structure

### server/routers/edrafting.ts (example)
```typescript
export const edraftingRouter = router({
  // Voice profiles
  listProfiles: protectedProcedure.query(async ({ ctx }) => { ... }),
  createProfile: protectedProcedure.input(z.object({ name: z.string(), clientId: z.string().uuid().optional() })).mutation(async ({ ctx, input }) => { ... }),
  deleteProfile: protectedProcedure.input(z.object({ profileId: z.string().uuid() })).mutation(async ({ ctx, input }) => { ... }),

  // Documents
  listDocuments: protectedProcedure.input(z.object({ profileId: z.string().uuid() })).query(async ({ ctx, input }) => { ... }),
  deleteDocument: protectedProcedure.input(z.object({ documentId: z.string().uuid() })).mutation(async ({ ctx, input }) => { ... }),

  // Drafts
  generateDraft: protectedProcedure.input(z.object({
    profileId: z.string().uuid(),
    brief: z.string().min(10).max(1000),
  })).mutation(async ({ ctx, input }) => {
    // 1. Check free tier limit (5 drafts/month)
    // 2. Embed brief
    // 3. Retrieve similar chunks
    // 4. Call Claude
    // 5. Save draft
    // 6. Return { subject, body, draftId }
  }),

  listDrafts: protectedProcedure.input(z.object({ profileId: z.string().uuid() })).query(async ({ ctx, input }) => { ... }),
});
```

---

## Supabase Storage Buckets

| Bucket | Path pattern | Access |
|--------|-------------|--------|
| `voice-docs` | `{userId}/{profileId}/{filename}` | Private (signed URLs) |
| `trip-docs` | `{userId}/{tripId}/{filename}` | Private (signed URLs) |
| `portfolio-assets` | `portfolio/{slug}/{filename}` | Public |

RLS policy for voice-docs and trip-docs:
```sql
CREATE POLICY "Users access own files"
ON storage.objects FOR ALL
USING (auth.uid()::text = (storage.foldername(name))[1]);
```

---

## Free Tools (Client-Side Only — No Backend)

All tools in `/app/(marketing)/tools/[slug]/` are pure client-side React components.
No API calls. Files never leave the browser.

| Slug | Tool | Library |
|------|------|---------|
| `ghl-workflow` | GHL Workflow Visualizer | Mermaid.js |
| `n8n-validator` | n8n JSON Validator | Custom Zod schema |
| `json-formatter` | JSON Formatter / Beautifier | Native JSON |
| `cron-gen` | Cron Expression Generator | cronstrue |
| `regex-tester` | Regex Tester | Native RegExp |
| `pdf-merge` | PDF Merge (client-side) | pdf-lib |
| `image-resize` | Image Resizer | Canvas API |
| `bg-remove` | Background Remover | @imgly/background-removal |
| `qr-gen` | QR Code Generator | qrcode |
| `base64` | Base64 Encoder/Decoder | Native btoa/atob |
| `webhook-fmt` | Webhook Payload Formatter | Custom |

---

## Pricing Model

**Everything is free. No paywalls. No subscription tiers.**

| Offering | Price | Notes |
|----------|-------|-------|
| All browser tools | ₱0 | Client-side, no account needed |
| EDrafting | ₱0 | Account required (Supabase Auth) |
| Calendar Tracker | ₱0 | Account required |
| Travel Manager | ₱0 | Account required |
| Dark Ops Retainer | Custom | Done-for-you GHL + n8n automation. Contact form → discovery call. This is the sole revenue stream. |

**Why free?**
The tools and apps are the portfolio and the lead magnet. Every EA who uses RunsDark daily
is a warm prospect for the Dark Ops retainer when they or their client needs automation built.
Trust is earned through the product, not a pricing page.

**No PayMongo integration needed at launch.** Remove billing router, paymongo lib,
and webhook routes from the build. Add a simple "Work with me" contact form instead.

**No tier enforcement middleware.** All `(dashboard)` routes are accessible to any
authenticated user. Remove `users.tier` column — it is not needed.

---

## Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# AI
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...           # embeddings only

# PayMongo — NOT NEEDED (everything is free, no subscriptions)

# Email
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@runsdark.com

# Google Calendar
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALENDAR_REDIRECT_URI=https://runsdark.com/api/auth/google/callback

# GHL (GoHighLevel)
GHL_CLIENT_ID=...
GHL_CLIENT_SECRET=...

# App
NEXT_PUBLIC_APP_URL=https://runsdark.com
DATABASE_URL=postgresql://...   # Direct Supabase connection string
```

---

## Build Phases

### Phase 1 — Foundation (Week 1–2)
- [ ] Init monorepo: `pnpm create turbo` + configure workspaces
- [ ] Setup Next.js 14 app with TypeScript + Tailwind + shadcn/ui
- [ ] Connect Supabase: Auth (Google OAuth + magic link) + DB
- [ ] Setup Drizzle ORM + run initial migrations (no tier column — everything is free)
- [ ] Build dashboard shell: sidebar, topbar, mobile nav
- [ ] Clients CRUD (create, list, edit, delete)
- [ ] Deploy to Vercel + configure Supabase connection pooling
- [ ] Skip: PayMongo, billing router, tier enforcement, /pricing page

### Phase 2 — Free Tools (Week 3–4)
- [ ] Tools hub page with category filtering
- [ ] GHL Workflow Visualizer (Mermaid.js render)
- [ ] JSON Formatter + n8n JSON Validator
- [ ] Cron Expression Generator (cronstrue)
- [ ] Regex Tester
- [ ] PDF Merge (pdf-lib, fully client-side)
- [ ] Image Resizer (Canvas API)
- [ ] QR Generator (qrcode library)

### Phase 3 — EDrafting (Week 5–7)
- [ ] Enable pgvector extension in Supabase
- [ ] Voice profiles CRUD
- [ ] Document upload UI → Supabase Storage
- [ ] Text extraction (pdf-parse + mammoth)
- [ ] Chunking + embedding pipeline (background, show progress)
- [ ] Profile synthesis (Claude generates system prompt)
- [ ] Draft composer UI (brief input → generated output)
- [ ] Free tier limit enforcement (5 drafts/month)
- [ ] Draft history list

### Phase 4 — Calendar Tracker (Week 8–9)
- [ ] Bookings CRUD
- [ ] Kanban-style board view (columns per status)
- [ ] Status transitions with history log
- [ ] Google Calendar OAuth + read events
- [ ] Manual booking entry form
- [ ] Follow-up date alerts (email via Resend)

### Phase 5 — Travel Manager (Week 10–12)
- [ ] Trips CRUD
- [ ] Segment builder (drag-to-reorder)
- [ ] Document upload + storage
- [ ] Client approval flow: generate public link → client views itinerary → approves
- [ ] PDF itinerary export (@react-pdf/renderer)
- [ ] Status tracking (draft → pending approval → approved → active → completed)

### Phase 6 — Services Page + Launch (Week 13–14)
- [ ] "Work with me" contact form + discovery call CTA (no billing needed)
- [ ] Dark Ops services page: what's included, retainer tiers, book a call
- [ ] Marketing home page (hero, tools preview, apps overview, services, testimonials)
- [ ] Portfolio page (GHL builds, n8n workflow screenshots, case studies)
- [ ] Blog (MDX-based, static)
- [ ] Launch: Filipino EA Facebook groups + OLJ community
- [ ] NOTE: No PayMongo, no pricing page, no subscription logic

---

## Subdomain Structure

One domain (`runsdark.com`), one Vercel project, one Next.js app.
Subdomains are free DNS records — no additional domain purchases.

| Subdomain | Purpose | Auth Required |
|-----------|---------|---------------|
| `runsdark.com` | Marketing, portfolio, services, blog | No |
| `app.runsdark.com` | All authenticated apps — EDrafting, Calendar, Travel | Yes |
| `tools.runsdark.com` | All free browser tools | No |

**Vercel setup (per subdomain):**
In Vercel project → Domains, add each subdomain. Vercel provides a CNAME record.
Add that CNAME in Namecheap DNS pointing to `cname.vercel-dns.com`. Repeat for each.

**Next.js middleware routing:**
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const subdomain = hostname.split('.')[0];

  if (subdomain === 'app') {
    // Check auth, rewrite to /app/* routes
    const url = request.nextUrl.clone();
    url.pathname = `/app${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  if (subdomain === 'tools') {
    const url = request.nextUrl.clone();
    url.pathname = `/tools${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
```

**CRITICAL — Supabase cross-subdomain auth:**
Cookies must be scoped to `.runsdark.com` (leading dot = all subdomains).
Without this, a user logged in on `runsdark.com` won't be recognized on `app.runsdark.com`.

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        domain: '.runsdark.com', // ← leading dot = works across all subdomains
        path: '/',
        sameSite: 'lax',
        secure: true,
      },
    }
  );
}
```

Set the same `cookieOptions` in `lib/supabase/server.ts` for the server client.
In local dev, use `localhost` (no dot prefix needed — subdomains don't apply locally).

---

## Hero Animation (tealneuro.io-inspired)

Landing page hero: dark particle field that reacts to mouse movement.
Fits RunsDark's "systems running in the dark" identity.

**Implementation:** `@tsparticles/react` + `@tsparticles/slim`

```bash
pnpm add @tsparticles/react @tsparticles/slim
```

```typescript
// components/hero-particles.tsx
'use client';
import { useCallback } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Engine } from '@tsparticles/engine';

export function HeroParticles() {
  const init = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="hero-particles"
      init={init}
      options={{
        background: { color: { value: '#0D1B2A' } }, // RunsDark navy
        fpsLimit: 60,
        interactivity: {
          events: {
            onHover: { enable: true, mode: 'repulse' }, // particles flee cursor
            onClick: { enable: true, mode: 'push' },
          },
          modes: {
            repulse: { distance: 120, duration: 0.4 },
            push: { quantity: 4 },
          },
        },
        particles: {
          color: { value: '#1A73E8' },  // RunsDark blue
          links: {
            color: '#1A73E8',
            distance: 150,
            enable: true,
            opacity: 0.2,
            width: 1,
          },
          move: { enable: true, speed: 1, outModes: { default: 'bounce' } },
          number: { value: 80, density: { enable: true } },
          opacity: { value: 0.4 },
          shape: { type: 'circle' },
          size: { value: { min: 1, max: 3 } },
        },
        detectRetina: true,
      }}
      className="absolute inset-0 -z-10"
    />
  );
}
```

Place `<HeroParticles />` inside the hero section of `app/(marketing)/page.tsx`.
The `'use client'` directive keeps it client-side only — no SSR impact.

---

## Key Architectural Decisions

1. **Everything is free** — No billing system, no PayMongo, no tier enforcement.
   Revenue comes solely from Dark Ops retainer inquiries via contact form.
   The platform is the portfolio; the portfolio sells the service.

2. **tRPC over REST** — End-to-end type safety; no need to maintain API docs.
   All mutations and queries go through tRPC. Only webhooks use raw API routes.

3. **Custom RAG over Langchain** — Langchain adds abstraction overhead.
   Simple: chunk → embed → store → retrieve → prompt. ~100 lines of code.

4. **Drizzle over Prisma** — Drizzle is lighter, SQL-first, better for Supabase's
   connection pooler (no Prisma-style connection issues at serverless scale).

5. **Client-side tools** — Free tools run entirely in the browser. Zero infrastructure
   cost, no privacy concerns (files never leave user's machine), instant page load.

6. **Supabase Storage for all files** — Signed URLs for private files (voice docs,
   trip documents). Never store file content in the database.

7. **Timezone handling** — Always store timestamps in UTC. Display in user's
   configured timezone (default: Asia/Manila for Filipino EAs).

---

## Conventions

- Server code in `src/server/` or API routes — never expose service keys to the client
- Use `protectedProcedure` for all authenticated tRPC routes
- Validate all inputs with Zod before processing
- All file uploads: client → Supabase Storage (never stream through Next.js server)
- Error responses: use tRPC's `TRPCError` with appropriate codes
- Date display: use `date-fns-tz` with user's timezone preference
- Image optimization: use `next/image` for all marketing assets
- Supabase RLS: enable on all tables; service role key only used in server context
