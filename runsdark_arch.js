const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel,
  BorderStyle, WidthType, ShadingType, VerticalAlign,
  PageNumber, PageBreak, TabStopType, TabStopPosition
} = require('/tmp/npm_global/lib/node_modules/docx');
const fs = require('fs');

const DARK   = "0D1B2A";
const BLUE   = "1A73E8";
const GREEN  = "27AE60";
const RED    = "E74C3C";
const PURPLE = "8E44AD";
const ORANGE = "E67E22";
const GRAY   = "4A4A4A";
const LGRAY  = "CCCCCC";
const WHITE  = "FFFFFF";
const LBLUE  = "EAF2FF";
const LGREEN = "EAF9F0";
const LRED   = "FDECEA";
const LPURP  = "F5EEF8";

const cb = (c = LGRAY) => ({ style: BorderStyle.SINGLE, size: 1, color: c });
const bdr = (c = LGRAY) => ({ top: cb(c), bottom: cb(c), left: cb(c), right: cb(c) });
const sp = (pts = 120) => new Paragraph({ children: [new TextRun("")], spacing: { before: pts, after: 0 } });
const rule = (color = BLUE) => new Paragraph({
  children: [new TextRun("")],
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color, space: 1 } },
  spacing: { before: 0, after: 240 }
});
const h1 = (t, color = DARK) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: t, font: "Arial", size: 36, bold: true, color })] });
const h2 = (t, color = BLUE) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: t, font: "Arial", size: 26, bold: true, color })] });
const h3 = (t, color = DARK) => new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun({ text: t, font: "Arial", size: 22, bold: true, color })] });
const body = (t, opts = {}) => new Paragraph({ children: [new TextRun({ text: t, font: "Arial", size: 22, color: GRAY, ...opts })], spacing: { before: 80, after: 80 } });
const code = t => new Paragraph({ children: [new TextRun({ text: t, font: "Courier New", size: 18, color: "2E86AB" })], spacing: { before: 40, after: 40 } });
const bullet = t => new Paragraph({
  numbering: { reference: "bullets", level: 0 },
  children: [new TextRun({ text: t, font: "Arial", size: 22, color: GRAY })],
  spacing: { before: 40, after: 40 }
});
const check = (t, done = false) => new Paragraph({
  numbering: { reference: "checks", level: 0 },
  children: [new TextRun({ text: (done ? "✓ " : "○ ") + t, font: "Arial", size: 21, color: done ? GREEN : GRAY })],
  spacing: { before: 36, after: 36 }
});

const hdr = (labels, widths, fillColor = DARK) => new TableRow({
  children: labels.map((l, i) => new TableCell({
    borders: bdr(DARK), width: { size: widths[i], type: WidthType.DXA },
    shading: { fill: fillColor, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: l, font: "Arial", size: 19, bold: true, color: WHITE })] })]
  }))
});
const row = (cells, widths, fills) => new TableRow({
  children: cells.map((c, i) => new TableCell({
    borders: bdr(LGRAY), width: { size: widths[i], type: WidthType.DXA },
    shading: { fill: fills ? fills[i] : WHITE, type: ShadingType.CLEAR },
    margins: { top: 72, bottom: 72, left: 120, right: 120 },
    children: [new Paragraph({ children: [new TextRun({ text: c, font: "Arial", size: 20, color: GRAY })] })]
  }))
});
const altRow = (cells, widths, i, fill0, fill1) => row(cells, widths, cells.map((_, j) => i % 2 === 0 ? fill0 : fill1));

// ── Cover ────────────────────────────────────────────────────────────────────
const cover = () => [
  sp(2880),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "RUNSDARK", font: "Arial", size: 88, bold: true, color: BLUE })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Platform for Filipino Executive Assistants", font: "Arial", size: 30, color: DARK })] }),
  sp(200),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Full Architecture, Tech Stack & Build Plan", font: "Arial", size: 24, color: GRAY, italics: true })] }),
  sp(240),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "\"Systems that run without you.\"", font: "Arial", size: 22, color: BLUE, italics: true })] }),
  sp(500),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "August 2026  |  Confidential", font: "Arial", size: 20, color: LGRAY })] }),
  new Paragraph({ children: [new PageBreak()] })
];

// ── Overview ─────────────────────────────────────────────────────────────────
const overview = () => [
  h1("1. Platform Overview"),
  rule(),
  body("RunsDark is a web platform built specifically for Filipino Executive Assistants (EAs) serving global clients. It solves three daily pain points — email voice matching, booking status tracking, and travel management — while offering a suite of free browser-based tools that establish RunsDark as the go-to resource for automation-focused EAs."),
  sp(120),
  new Table({
    width: { size: 9360, type: WidthType.DXA }, columnWidths: [2340, 2340, 2340, 2340],
    rows: [
      hdr(["Target User", "Primary Stack", "Primary Payment", "Year 1 Goal"], [2340, 2340, 2340, 2340]),
      row(["Filipino EA / VA serving US/AU/UK clients", "GHL + n8n + Automation", "GCash / Maya via PayMongo", "500 Pro users · ₱249K MRR"], [2340, 2340, 2340, 2340], [LBLUE, LBLUE, LBLUE, LBLUE])
    ]
  }),
  sp(240),
  h2("Three Premium Apps"),
  sp(80),
  new Table({
    width: { size: 9360, type: WidthType.DXA }, columnWidths: [1800, 3780, 3780],
    rows: [
      hdr(["App", "What It Does", "Core Tech"], [1800, 3780, 3780]),
      ...([
        ["EDrafting", "AI email drafting that matches a specific client's voice and tone using uploaded sample emails", "Claude API + pgvector RAG + OpenAI embeddings"],
        ["Calendar Tracker", "Status-layer dashboard across multiple client calendars: Confirmed / Pending / Needs Follow-up / Conflict", "Google Calendar API + GHL API + Supabase Realtime"],
        ["Travel Manager", "Executive itinerary builder with vendor tracking, doc storage, client approval link, PDF export", "@react-pdf/renderer + Supabase Storage"],
      ]).map(([a, d, t], i) => new TableRow({ children: [
        new TableCell({ borders: bdr(LGRAY), width: { size: 1800, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? LBLUE : WHITE, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: a, font: "Arial", size: 20, bold: true, color: BLUE })] })] }),
        new TableCell({ borders: bdr(LGRAY), width: { size: 3780, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? LBLUE : WHITE, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: d, font: "Arial", size: 20, color: GRAY })] })] }),
        new TableCell({ borders: bdr(LGRAY), width: { size: 3780, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? LBLUE : WHITE, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: t, font: "Arial", size: 19, color: GRAY, italics: true })] })] }),
      ]}))
    ]
  }),
  new Paragraph({ children: [new PageBreak()] })
];

// ── Tech Stack ────────────────────────────────────────────────────────────────
const techStack = () => [
  h1("2. Tech Stack"),
  rule(),
  new Table({
    width: { size: 9360, type: WidthType.DXA }, columnWidths: [2000, 3000, 4360],
    rows: [
      hdr(["Layer", "Choice", "Reason"], [2000, 3000, 4360]),
      ...([
        ["Framework", "Next.js 14 (App Router) + TypeScript", "File-based routing, server components, API routes in one repo"],
        ["Styling", "Tailwind CSS + shadcn/ui", "Fast development; shadcn gives production-ready accessible components"],
        ["State", "TanStack Query + Zustand", "TanStack for server state, Zustand for lightweight client state"],
        ["API Layer", "tRPC", "End-to-end type safety; no OpenAPI spec maintenance"],
        ["Database", "Supabase (PostgreSQL)", "Managed Postgres + built-in Auth + Storage + Realtime in one platform"],
        ["ORM", "Drizzle ORM", "SQL-first, lighter than Prisma, better with Supabase connection pooler"],
        ["Vector DB", "Supabase pgvector", "Same DB — no separate vector service needed for EDrafting embeddings"],
        ["Auth", "Supabase Auth", "Google OAuth + magic link; handles sessions + RLS policy integration"],
        ["File Storage", "Supabase Storage", "Signed URLs for private files; same platform as DB"],
        ["AI — Generation", "Anthropic Claude API", "claude-haiku for speed/cost; claude-sonnet for quality drafts"],
        ["AI — Embeddings", "OpenAI text-embedding-3-small", "Best cost/quality ratio; 1536 dimensions matches pgvector index"],
        ["Payments", "PayMongo", "GCash + Maya + cards — correct choice for Filipino EA market"],
        ["Email", "Resend", "Modern transactional email; great Next.js integration"],
        ["Calendar Sync", "Google Calendar API", "Most EAs use Google Calendar for their clients"],
        ["GHL Integration", "GHL API v2", "Needed for GHL calendar sync + contact data"],
        ["PDF Export", "@react-pdf/renderer", "React-based PDF generation for travel itineraries"],
        ["Monorepo", "Turborepo + pnpm", "Shared packages (db schema, ui) across potential future apps"],
        ["Hosting", "Vercel", "Best Next.js platform; global CDN; zero-config deploys"],
        ["DNS/CDN", "Cloudflare", "Free CDN layer; DDoS protection; analytics"],
        ["Errors", "Sentry", "Error tracking with source maps"],
        ["Analytics", "PostHog", "Self-serve product analytics; free tier sufficient at launch"],
      ]).map(([layer, choice, reason], i) => new TableRow({ children: [
        new TableCell({ borders: bdr(LGRAY), width: { size: 2000, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? LBLUE : WHITE, type: ShadingType.CLEAR }, margins: { top: 72, bottom: 72, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: layer, font: "Arial", size: 19, bold: true, color: DARK })] })] }),
        new TableCell({ borders: bdr(LGRAY), width: { size: 3000, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? LBLUE : WHITE, type: ShadingType.CLEAR }, margins: { top: 72, bottom: 72, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: choice, font: "Courier New", size: 18, color: "2E86AB" })] })] }),
        new TableCell({ borders: bdr(LGRAY), width: { size: 4360, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? LBLUE : WHITE, type: ShadingType.CLEAR }, margins: { top: 72, bottom: 72, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: reason, font: "Arial", size: 19, color: GRAY })] })] }),
      ]}))
    ]
  }),
  new Paragraph({ children: [new PageBreak()] })
];

// ── Architecture ──────────────────────────────────────────────────────────────
const architecture = () => [
  h1("3. System Architecture"),
  rule(),

  h2("3.1 Application Layers"),
  sp(80),
  body("RunsDark is a monorepo with one main web app and two shared packages:"),
  sp(80),
  new Table({
    width: { size: 9360, type: WidthType.DXA }, columnWidths: [2400, 6960],
    rows: [
      hdr(["Package", "Contents"], [2400, 6960]),
      ...([
        ["apps/web", "Next.js 14 application — all pages, components, API routes, tRPC routers"],
        ["packages/db", "Drizzle ORM schema + migrations; imported by apps/web server code only"],
        ["packages/ui", "Shared UI components (if needed for future apps)"],
      ]).map(([p, c], i) => new TableRow({ children: [
        new TableCell({ borders: bdr(LGRAY), width: { size: 2400, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? LBLUE : WHITE, type: ShadingType.CLEAR }, margins: { top: 72, bottom: 72, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: p, font: "Courier New", size: 19, bold: true, color: BLUE })] })] }),
        new TableCell({ borders: bdr(LGRAY), width: { size: 6960, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? LBLUE : WHITE, type: ShadingType.CLEAR }, margins: { top: 72, bottom: 72, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: c, font: "Arial", size: 20, color: GRAY })] })] }),
      ]}))
    ]
  }),
  sp(240),

  h2("3.2 Route Groups (Next.js App Router)"),
  sp(80),
  new Table({
    width: { size: 9360, type: WidthType.DXA }, columnWidths: [2400, 2400, 4560],
    rows: [
      hdr(["Route Group", "Auth Required", "Pages"], [2400, 2400, 4560]),
      ...([
        ["(marketing)", "No", "/, /tools, /tools/[slug], /portfolio, /services, /pricing, /blog, /blog/[slug]"],
        ["(auth)", "No", "/login, /signup, /callback"],
        ["(dashboard)", "Yes", "/dashboard, /clients, /edrafting, /calendar, /travel (and sub-routes)"],
        ["api/trpc", "Varies", "All tRPC endpoints — auth checked per procedure"],
        ["api/webhooks", "No (HMAC signed)", "/api/webhooks/paymongo, /api/webhooks/stripe"],
      ]).map(([g, a, p], i) => new TableRow({ children: [
        new TableCell({ borders: bdr(LGRAY), width: { size: 2400, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? LBLUE : WHITE, type: ShadingType.CLEAR }, margins: { top: 72, bottom: 72, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: g, font: "Courier New", size: 18, color: BLUE })] })] }),
        new TableCell({ borders: bdr(LGRAY), width: { size: 2400, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? LBLUE : WHITE, type: ShadingType.CLEAR }, margins: { top: 72, bottom: 72, left: 120, right: 120 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: a, font: "Arial", size: 19, color: a === "Yes" ? RED : a === "No" ? GREEN : GRAY })] })] }),
        new TableCell({ borders: bdr(LGRAY), width: { size: 4560, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? LBLUE : WHITE, type: ShadingType.CLEAR }, margins: { top: 72, bottom: 72, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: p, font: "Arial", size: 18, color: GRAY })] })] }),
      ]}))
    ]
  }),
  sp(240),

  h2("3.3 EDrafting — RAG Pipeline"),
  sp(80),
  body("EDrafting is the most technically complex feature. It uses a custom RAG (Retrieval-Augmented Generation) pipeline:"),
  sp(80),
  h3("Step 1 — Upload"),
  bullet("EA uploads PDF, DOCX, or TXT file containing sample emails from their client"),
  bullet("File stored in Supabase Storage: voice-docs/{userId}/{profileId}/{filename}"),
  bullet("Text extracted: pdf-parse (PDF), mammoth (DOCX), native read (TXT)"),
  bullet("Text split into ~500-token chunks with 50-token overlap"),
  bullet("Each chunk embedded via OpenAI text-embedding-3-small (1536 dimensions)"),
  bullet("Chunks + embeddings stored in document_chunks table with pgvector"),
  sp(80),
  h3("Step 2 — Profile Synthesis"),
  bullet("After embedding, Claude (haiku) reads a sample of chunks"),
  bullet("Claude outputs a system prompt describing the client's voice, tone, patterns"),
  bullet("System prompt saved to voice_profiles.system_prompt"),
  sp(80),
  h3("Step 3 — Draft Generation"),
  bullet("EA inputs a brief: e.g. \"Decline Tuesday meeting with James, polite, keep short\""),
  bullet("Brief is embedded → top-5 most similar document chunks retrieved (cosine similarity)"),
  bullet("Prompt built: system_prompt + retrieved chunks + brief → Claude generates draft"),
  bullet("Output: { subject, body } returned to EA for review and copy"),
  sp(240),

  h2("3.4 Database Tables"),
  sp(80),
  new Table({
    width: { size: 9360, type: WidthType.DXA }, columnWidths: [2400, 2400, 4560],
    rows: [
      hdr(["Table", "App", "Key Columns"], [2400, 2400, 4560]),
      ...([
        ["users", "All", "id, supabase_id, email, tier (free|pro), timezone, paymongo_customer_id"],
        ["clients", "All", "id, user_id, name, email, company, timezone"],
        ["voice_profiles", "EDrafting", "id, user_id, client_id, name, system_prompt"],
        ["voice_documents", "EDrafting", "id, profile_id, filename, storage_path, embedded_at"],
        ["document_chunks", "EDrafting", "id, document_id, content, embedding (vector 1536), chunk_index"],
        ["email_drafts", "EDrafting", "id, user_id, profile_id, prompt, subject, draft_content, status"],
        ["bookings", "Calendar", "id, user_id, client_id, title, start_time, end_time, status, platform, gcal_event_id"],
        ["booking_history", "Calendar", "id, booking_id, old_status, new_status, changed_at"],
        ["trips", "Travel", "id, user_id, client_id, title, destination, start_date, end_date, status, approval_token"],
        ["trip_segments", "Travel", "id, trip_id, type, vendor, confirmation_number, start_datetime, cost, currency, details (jsonb)"],
        ["trip_documents", "Travel", "id, trip_id, name, storage_path, type"],
      ]).map(([t, a, c], i) => new TableRow({ children: [
        new TableCell({ borders: bdr(LGRAY), width: { size: 2400, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? LBLUE : WHITE, type: ShadingType.CLEAR }, margins: { top: 72, bottom: 72, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: t, font: "Courier New", size: 18, bold: true, color: BLUE })] })] }),
        new TableCell({ borders: bdr(LGRAY), width: { size: 2400, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? LBLUE : WHITE, type: ShadingType.CLEAR }, margins: { top: 72, bottom: 72, left: 120, right: 120 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: a, font: "Arial", size: 19, color: GRAY })] })] }),
        new TableCell({ borders: bdr(LGRAY), width: { size: 4560, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? LBLUE : WHITE, type: ShadingType.CLEAR }, margins: { top: 72, bottom: 72, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: c, font: "Arial", size: 18, color: GRAY })] })] }),
      ]}))
    ]
  }),
  new Paragraph({ children: [new PageBreak()] })
];

// ── Free Tools ───────────────────────────────────────────────────────────────
const freeTools = () => [
  h1("4. Free Tools (Client-Side Only)"),
  rule(),
  body("All free tools run entirely in the browser. Files never leave the user's machine. Zero backend cost. Privacy-first — a key selling point for EAs handling sensitive client data."),
  sp(120),
  new Table({
    width: { size: 9360, type: WidthType.DXA }, columnWidths: [2800, 2400, 4160],
    rows: [
      hdr(["Tool", "URL Slug", "Library / Method"], [2800, 2400, 4160]),
      ...([
        ["GHL Workflow Visualizer", "/tools/ghl-workflow", "Mermaid.js — paste Mermaid code, render diagram"],
        ["n8n JSON Validator", "/tools/n8n-validator", "Custom Zod schema for n8n workflow JSON"],
        ["JSON Formatter", "/tools/json-formatter", "Native JSON.parse/stringify + syntax highlight"],
        ["Cron Expression Generator", "/tools/cron-gen", "cronstrue — human-readable cron explanations"],
        ["Regex Tester", "/tools/regex-tester", "Native JavaScript RegExp"],
        ["Webhook Payload Formatter", "/tools/webhook-fmt", "Custom — pretty-print + key extractor"],
        ["PDF Merge (client-side)", "/tools/pdf-merge", "pdf-lib — runs in browser, no upload"],
        ["Image Resizer", "/tools/image-resize", "HTML5 Canvas API"],
        ["Background Remover", "/tools/bg-remove", "@imgly/background-removal (WASM)"],
        ["QR Code Generator", "/tools/qr-gen", "qrcode npm package"],
        ["Base64 Encoder/Decoder", "/tools/base64", "Native btoa / atob"],
      ]).map(([t, s, l], i) => new TableRow({ children: [
        new TableCell({ borders: bdr(LGRAY), width: { size: 2800, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? LGREEN : WHITE, type: ShadingType.CLEAR }, margins: { top: 72, bottom: 72, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: t, font: "Arial", size: 20, bold: true, color: DARK })] })] }),
        new TableCell({ borders: bdr(LGRAY), width: { size: 2400, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? LGREEN : WHITE, type: ShadingType.CLEAR }, margins: { top: 72, bottom: 72, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: s, font: "Courier New", size: 18, color: GREEN })] })] }),
        new TableCell({ borders: bdr(LGRAY), width: { size: 4160, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? LGREEN : WHITE, type: ShadingType.CLEAR }, margins: { top: 72, bottom: 72, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: l, font: "Arial", size: 19, color: GRAY })] })] }),
      ]}))
    ]
  }),
  new Paragraph({ children: [new PageBreak()] })
];

// ── Pricing ───────────────────────────────────────────────────────────────────
const pricing = () => [
  h1("5. Pricing & Monetization"),
  rule(),
  new Table({
    width: { size: 9360, type: WidthType.DXA }, columnWidths: [1800, 2000, 2000, 3560],
    rows: [
      hdr(["Tier", "Price", "Payment", "Includes"], [1800, 2000, 2000, 3560]),
      ...([
        ["Free", "₱0", "—", "All browser tools · 1 voice profile · 3 docs max · 5 drafts/month"],
        ["Pro", "₱499/month\nor ₱4,499/year", "GCash, Maya, Visa/MC via PayMongo", "Unlimited profiles + docs + drafts · Calendar Tracker · Travel Manager · Priority support"],
        ["Dark Ops", "Custom", "Invoice / bank transfer", "Done-for-you GHL + n8n automation retainer. Contact form → discovery call"],
      ]).map(([tier, price, pay, inc], i) => new TableRow({ children: [
        new TableCell({ borders: bdr(LGRAY), width: { size: 1800, type: WidthType.DXA }, shading: { fill: i === 0 ? LGREEN : i === 1 ? LBLUE : LPURP, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: tier, font: "Arial", size: 20, bold: true, color: i === 0 ? GREEN : i === 1 ? BLUE : PURPLE })] })] }),
        new TableCell({ borders: bdr(LGRAY), width: { size: 2000, type: WidthType.DXA }, shading: { fill: i === 0 ? LGREEN : i === 1 ? LBLUE : LPURP, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: price, font: "Arial", size: 20, bold: true, color: DARK })] })] }),
        new TableCell({ borders: bdr(LGRAY), width: { size: 2000, type: WidthType.DXA }, shading: { fill: i === 0 ? LGREEN : i === 1 ? LBLUE : LPURP, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: pay, font: "Arial", size: 19, color: GRAY })] })] }),
        new TableCell({ borders: bdr(LGRAY), width: { size: 3560, type: WidthType.DXA }, shading: { fill: i === 0 ? LGREEN : i === 1 ? LBLUE : LPURP, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: inc, font: "Arial", size: 19, color: GRAY })] })] }),
      ]}))
    ]
  }),
  sp(240),
  h2("Revenue Projection"),
  sp(80),
  new Table({
    width: { size: 9360, type: WidthType.DXA }, columnWidths: [2800, 2000, 2280, 2280],
    rows: [
      hdr(["Milestone", "Active Users", "Pro Conversion", "MRR"], [2800, 2000, 2280, 2280]),
      ...([
        ["Month 3 (tools live)", "500 free", "5% = 25 pro", "₱12,475"],
        ["Month 6 (all apps live)", "2,000 free", "8% = 160 pro", "₱79,840"],
        ["Month 12 (post-launch)", "8,000 free", "10% = 800 pro", "₱399,200"],
      ]).map(([m, u, c, mrr], i) => new TableRow({ children: [
        new TableCell({ borders: bdr(LGRAY), width: { size: 2800, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? LBLUE : WHITE, type: ShadingType.CLEAR }, margins: { top: 72, bottom: 72, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: m, font: "Arial", size: 20, bold: true, color: DARK })] })] }),
        new TableCell({ borders: bdr(LGRAY), width: { size: 2000, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? LBLUE : WHITE, type: ShadingType.CLEAR }, margins: { top: 72, bottom: 72, left: 120, right: 120 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: u, font: "Arial", size: 20, color: GRAY })] })] }),
        new TableCell({ borders: bdr(LGRAY), width: { size: 2280, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? LBLUE : WHITE, type: ShadingType.CLEAR }, margins: { top: 72, bottom: 72, left: 120, right: 120 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: c, font: "Arial", size: 20, color: GRAY })] })] }),
        new TableCell({ borders: bdr(LGRAY), width: { size: 2280, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? LBLUE : WHITE, type: ShadingType.CLEAR }, margins: { top: 72, bottom: 72, left: 120, right: 120 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: mrr, font: "Arial", size: 20, bold: true, color: BLUE })] })] }),
      ]}))
    ]
  }),
  new Paragraph({ children: [new PageBreak()] })
];

// ── Build Plan ────────────────────────────────────────────────────────────────
const buildPlan = () => [
  h1("6. Build Phases"),
  rule(),
  body("14-week build plan with clear milestones. Each phase ends with a deployable increment."),
  sp(200),

  h2("Phase 1 — Foundation (Week 1–2)"),
  sp(80),
  ...[
    "Init Turborepo monorepo with pnpm workspaces",
    "Setup Next.js 14 + TypeScript + Tailwind + shadcn/ui",
    "Connect Supabase: Auth (Google OAuth + magic link)",
    "Setup Drizzle ORM + run initial migrations (users, clients tables)",
    "Build dashboard shell: sidebar, topbar, mobile nav",
    "Clients CRUD (create, list, edit, delete)",
    "Deploy to Vercel + configure Supabase connection pooling",
  ].map(t => check(t)),
  sp(200),

  h2("Phase 2 — Free Tools (Week 3–4)"),
  sp(80),
  ...[
    "Tools hub page with category filter",
    "GHL Workflow Visualizer (Mermaid.js)",
    "JSON Formatter + n8n JSON Validator",
    "Cron Expression Generator (cronstrue)",
    "Regex Tester",
    "PDF Merge (pdf-lib, client-side only)",
    "Image Resizer (Canvas API)",
    "QR Generator",
  ].map(t => check(t)),
  sp(200),

  h2("Phase 3 — EDrafting (Week 5–7)"),
  sp(80),
  ...[
    "Enable pgvector extension in Supabase",
    "Voice profiles CRUD + UI",
    "Document upload → Supabase Storage",
    "Text extraction pipeline (pdf-parse + mammoth)",
    "Chunking + embedding pipeline (OpenAI, background job)",
    "Profile synthesis — Claude generates system prompt",
    "Draft composer UI (brief input → generated output)",
    "Free tier limit enforcement (5 drafts/month)",
    "Draft history list",
  ].map(t => check(t)),
  sp(200),

  h2("Phase 4 — Calendar Tracker (Week 8–9)"),
  sp(80),
  ...[
    "Bookings CRUD",
    "Kanban board view (columns per status)",
    "Status transitions with history log",
    "Google Calendar OAuth + read events",
    "Manual booking entry form",
    "Follow-up reminders via Resend email",
  ].map(t => check(t)),
  sp(200),

  h2("Phase 5 — Travel Manager (Week 10–12)"),
  sp(80),
  ...[
    "Trips CRUD + segment builder (drag-to-reorder)",
    "Document upload + storage (Supabase Storage)",
    "Client approval flow: public link → approve",
    "PDF itinerary export (@react-pdf/renderer)",
    "Status tracking: draft → approval → active → completed",
  ].map(t => check(t)),
  sp(200),

  h2("Phase 6 — Billing + Launch (Week 13–14)"),
  sp(80),
  ...[
    "PayMongo subscription integration (GCash / Maya / cards)",
    "Tier enforcement middleware across all apps",
    "Pricing page + upgrade modal",
    "Marketing home page (hero, features, pricing, CTA)",
    "Portfolio page (GHL builds, n8n workflow screenshots)",
    "Services page (retainer tiers + book a call)",
    "Blog setup (MDX, static generation)",
    "Launch: Filipino EA Facebook groups + OLJ community",
  ].map(t => check(t)),
  new Paragraph({ children: [new PageBreak()] })
];

// ── Launch Strategy ───────────────────────────────────────────────────────────
const launch = () => [
  h1("7. Launch Strategy — Filipino EA Market"),
  rule(),
  body("Filipino EAs are highly community-driven. They share tools in private Facebook groups, OLJ (OnlineJobs.ph) forums, and Telegram channels. The launch strategy is community-first, not paid ads."),
  sp(200),

  h2("Target Communities"),
  bullet("Filipino Virtual Assistants Facebook groups (50K+ members combined)"),
  bullet("OLJ (OnlineJobs.ph) employer and worker forums"),
  bullet("EA-specific Telegram and Discord groups"),
  bullet("BrewedOps community (GHL-focused VAs — already warm to automation tools)"),
  bullet("LinkedIn — Filipino professionals working in EA/admin roles"),
  sp(200),

  h2("Launch Sequence"),
  sp(80),
  new Table({
    width: { size: 9360, type: WidthType.DXA }, columnWidths: [1800, 3780, 3780],
    rows: [
      hdr(["Week", "Action", "Goal"], [1800, 3780, 3780]),
      ...([
        ["Week 11–12", "Soft launch free tools only — post in 3 EA Facebook groups", "First 100 users, validation that tools are used"],
        ["Week 13", "EDrafting beta — invite 20 EAs from communities to try for free", "Testimonials + real feedback on voice matching quality"],
        ["Week 14", "Public Pro launch — post across all channels with demo video", "First paying users; target 50 Pro signups in week 1"],
        ["Month 3", "Partnership with Filipino VA training programs / coaches", "Affiliate referral program; bulk discount for their students"],
      ]).map(([w, a, g], i) => new TableRow({ children: [
        new TableCell({ borders: bdr(LGRAY), width: { size: 1800, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? LBLUE : WHITE, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: w, font: "Arial", size: 19, bold: true, color: BLUE })] })] }),
        new TableCell({ borders: bdr(LGRAY), width: { size: 3780, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? LBLUE : WHITE, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: a, font: "Arial", size: 19, color: GRAY })] })] }),
        new TableCell({ borders: bdr(LGRAY), width: { size: 3780, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? LBLUE : WHITE, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: g, font: "Arial", size: 19, color: GRAY })] })] }),
      ]}))
    ]
  }),
];

// ── Build Document ────────────────────────────────────────────────────────────
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: DARK },
        paragraph: { spacing: { before: 480, after: 120 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: BLUE },
        paragraph: { spacing: { before: 360, after: 80 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 22, bold: true, font: "Arial", color: DARK },
        paragraph: { spacing: { before: 240, after: 80 }, outlineLevel: 2 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "checks", levels: [{ level: 0, format: LevelFormat.BULLET, text: "‣", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [{
    properties: {
      page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
    },
    headers: {
      default: new Header({ children: [new Paragraph({
        children: [
          new TextRun({ text: "RUNSDARK", font: "Arial", size: 18, bold: true, color: BLUE }),
          new TextRun({ text: "\tArchitecture & Build Plan  |  Confidential", font: "Arial", size: 18, color: LGRAY }),
        ],
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: BLUE, space: 1 } },
      })] })
    },
    footers: {
      default: new Footer({ children: [new Paragraph({
        children: [
          new TextRun({ text: "Confidential  |  RunsDark  |  August 2026", font: "Arial", size: 16, color: LGRAY }),
          new TextRun({ text: "\tPage ", font: "Arial", size: 16, color: LGRAY }),
          new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 16, color: LGRAY }),
        ],
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: BLUE, space: 1 } },
      })] })
    },
    children: [
      ...cover(),
      ...overview(),
      ...techStack(),
      ...architecture(),
      ...freeTools(),
      ...pricing(),
      ...buildPlan(),
      ...launch(),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('/sessions/stoic-amazing-davinci/mnt/outputs/RunsDark_Architecture.docx', buf);
  console.log('Done');
});
