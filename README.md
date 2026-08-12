# RunsDark

The ops layer Filipino EAs run on. Purpose-built tools for global executive support.

**Live Site**: [runsdark.com](https://runsdark.com)

---

## 🎯 Overview

RunsDark is a web platform for **Filipino Executive Assistants (EAs)** serving global (US/AU/UK) clients. It combines three free productivity apps and a professional services offering.

### What We Offer

**3 Free Apps:**
- **Docket** — Client-scoped task management with statuses, priorities, subtasks, and comments
- **EDrafting** — AI email drafting that matches your client's voice using RAG
- **Availability Tracker** — Calendar booking status dashboard (confirmed, pending, needs follow-up, etc.)
- **Travel Manager** — Executive travel itinerary builder with document storage and approval flow

**Free Tools:**
- JSON Formatter, Regex Tester, QR Generator, and more (browser-based, no backend)

**Paid Service:**
- **Dark Ops Retainer** — Done-for-you GHL + n8n automation (custom pricing, discovery call required)

---

## 🛠 Tech Stack

### Frontend
- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** + **shadcn/ui**
- **React Hook Form** + **Zod** (form validation)
- **TanStack Query** (data fetching)
- **Zustand** (state management)

### Backend & Database
- **Supabase** — PostgreSQL + Auth + Storage + Realtime
- **Drizzle ORM** — Type-safe SQL queries
- **tRPC** — Type-safe API (optional for MVP)

### AI & Integrations
- **Anthropic Claude API** — Email drafting (haiku for speed, Sonnet for quality)
- **OpenAI API** — Embeddings (text-embedding-3-small)
- **Google Calendar API** — Calendar sync
- **GoHighLevel (GHL) API v2** — Calendar + contact sync

### DevOps & Hosting
- **Vercel** — App hosting
- **Turborepo** + **pnpm** — Monorepo management
- **Supabase** — PostgreSQL hosting + Auth

---

## 📁 Project Structure

```
runsdark/
├── apps/
│   └── web/
│       ├── src/
│       │   ├── app/
│       │   │   ├── (marketing)/           # Public pages
│       │   │   ├── (auth)/                # Auth: signup, login, callback
│       │   │   ├── (dashboard)/           # Protected: /app/*
│       │   │   └── layout.tsx
│       │   ├── components/
│       │   │   ├── layout/                # Sidebar, topbar
│       │   │   ├── ui/                    # shadcn/ui components
│       │   │   └── docket/                # Docket-specific components
│       │   ├── lib/
│       │   │   ├── supabase/              # Client & server clients
│       │   │   └── ai/                    # Claude, embeddings
│       │   └── server/
│       │       └── routers/               # tRPC routers (future)
│       ├── public/
│       └── package.json
├── packages/
│   └── db/
│       ├── src/
│       │   └── schema/                    # Drizzle tables
│       ├── migrations/
│       └── drizzle.config.ts
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ (recommended: 20+)
- **pnpm** 9+ (install with `npm install -g pnpm`)
- **Supabase Account** (free tier works)

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/runsdark.git
   cd runsdark
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env.local` in the project root
   - Copy `.env.local` to `apps/web/.env.local` as well
   - Fill in your Supabase credentials:
     ```bash
     NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
     SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
     DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
     ```

4. **Create Supabase database tables**
   - Go to your Supabase SQL Editor
   - Run the schema creation SQL (see `docs/database-setup.sql`)
   - Or use Drizzle migrations once configured

5. **Start dev server**
   ```bash
   pnpm dev
   ```
   - App runs at `http://localhost:3000`

---

## 🔑 Environment Variables

Create `.env.local` files in both the root and `apps/web/` directories:

```bash
# Supabase API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...

# Database
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres

# AI APIs (optional for MVP)
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

# Email (optional)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@runsdark.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

## 💻 Development

### Running the Dev Server
```bash
pnpm dev
```

### Building for Production
```bash
pnpm build
```

### Type Checking
```bash
pnpm type-check
```

### Linting
```bash
pnpm lint
```

---

## 📦 Database Setup

### Initial Schema

The database includes tables for:
- **Users** — EA accounts (auth via Supabase)
- **Clients** — Each EA's clients
- **Tasks, Subtasks, Task Comments** — Docket app
- **Bookings** — Calendar tracker
- **Trips, Trip Segments, Trip Documents** — Travel manager
- **Voice Profiles, Documents, Chunks** — EDrafting (future)

### Creating Tables

1. **Via Supabase SQL Editor** (recommended for first setup):
   ```sql
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   
   CREATE TABLE users (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     supabase_id TEXT UNIQUE NOT NULL,
     email TEXT UNIQUE NOT NULL,
     name TEXT,
     avatar_url TEXT,
     timezone TEXT DEFAULT 'Asia/Manila',
     created_at TIMESTAMP DEFAULT NOW()
   );
   
   -- See docs/database-schema.sql for full schema
   ```

2. **Via Drizzle Migrations** (once configured):
   ```bash
   npm --prefix packages/db run generate
   npm --prefix packages/db run migrate
   ```

---

## 🚢 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import the GitHub repository
   - Set environment variables (copy from `.env.local`)
   - Deploy

3. **Configure Custom Domains** (optional)
   - Add `runsdark.com`, `app.runsdark.com`, `tools.runsdark.com` in Vercel
   - Update DNS records at your registrar

---

## 📚 API Documentation

### Authentication

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: `${APP_URL}/auth/callback`,
  },
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});

// Sign out
await supabase.auth.signOut();
```

### Database Queries

Once tRPC is wired up, queries will be type-safe:

```typescript
// Example (future):
const tasks = await trpc.docket.listTasks.query({ clientId });
const updated = await trpc.docket.updateTask.mutate({ id, status });
```

For now, use Supabase client directly:

```typescript
const { data, error } = await supabase
  .from('tasks')
  .select('*')
  .eq('client_id', clientId);
```

---

## 🧪 Testing

Tests are not yet set up. Contributions welcome!

```bash
# TODO: pnpm test
```

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create a feature branch** (`git checkout -b feature/my-feature`)
3. **Commit** your changes (`git commit -m "Add my feature"`)
4. **Push** to your fork (`git push origin feature/my-feature`)
5. **Open a Pull Request** against `main`

### Code Style
- Use TypeScript for all new code
- Follow the existing component structure
- No comments unless the WHY is non-obvious
- Format with Prettier (configured in workspace)

---

## 📋 Roadmap

- **Phase 1** ✅ Foundation (Landing page, Auth, Database, Dashboard shell)
- **Phase 2** 🔄 Main Site (Marketing pages, Services page)
- **Phase 3** ⏳ Docket MVP (Task CRUD, multi-client isolation)
- **Phase 4** ⏳ Free Tools (Browser utilities)
- **Phase 5** ⏳ Additional Apps (E-Drafting, Calendar, Travel Manager)
- **Phase 6** ⏳ Services Page (Dark Ops retainer offering)

---

## 📄 License

This project is **proprietary**. All rights reserved.

For licensing inquiries, contact jeff@runsdark.com.

---

## 🙋 Support

- **Issues**: Open a GitHub issue
- **Discussions**: GitHub Discussions
- **Email**: jeff@runsdark.com

---

## 👨‍💻 Built By

**Jeff Chavez**
- [GitHub](https://github.com/jeffchavez)
- [Twitter](https://twitter.com/jeffchavez)

---

**Status**: 🚧 In Development — Phase 1 Complete, Deploying to Vercel Soon
