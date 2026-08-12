# RunsDark — Design Plan

> Inspired by: Linear, basement.studio, Resend, Liveblocks, Raycast, Aceternity UI  
> Stack: Next.js 14 + Tailwind CSS + shadcn/ui + Aceternity UI

---

## 1. Brand Identity

**Positioning**: Premium dark ops tool for Filipino EAs. Feels like a tool a Silicon Valley exec would use — not a generic VA marketplace.

**Personality**: Precise. Capable. Quiet confidence. "Dark" in the sense of operating unseen, not in the sense of scary.

**Tone**: Professional but human. Never corporate. Never loud.

---

## 2. Color System

### Core Palette

| Token | Hex | Usage |
|---|---|---|
| `--bg-base` | `#080C10` | Page background |
| `--bg-surface` | `#0D1117` | Cards, panels |
| `--bg-border` | `#1A2332` | Borders, dividers |
| `--accent-primary` | `#1A73E8` | CTA buttons, links, particle color |
| `--accent-glow` | `#1A73E826` | Glow rings, hover states (blue at 15% opacity) |
| `--accent-muted` | `#2A4A7F` | Subtle tints, badge backgrounds |
| `--text-primary` | `#F0F4F8` | Headlines |
| `--text-secondary` | `#8B9AB0` | Body copy, subtext |
| `--text-muted` | `#4A5568` | Placeholders, timestamps |
| `--danger` | `#E53E3E` | Errors |
| `--success` | `#38A169` | Confirmations |

### Why this palette
- `#080C10` is darker than pure black — feels deep and premium, not flat
- `#1A73E8` (Google Blue-adjacent) reads as "trusted tech," not flashy
- The blue glow (`#1A73E826`) enables the Aceternity "glowing card" effect
- Contrast between `#F0F4F8` text and `#080C10` bg passes WCAG AA at all sizes

### Dark Ops accent (secondary)
Reserved for the Dark Ops retainer section only:

| Token | Hex | Usage |
|---|---|---|
| `--ops-accent` | `#C0392B` | Dark Ops CTA, "classified" badge |
| `--ops-glow` | `#C0392B1A` | Red glow on the Dark Ops card |

---

## 3. Typography

### Font Stack

```css
/* Headlines */
font-family: 'Inter', 'SF Pro Display', system-ui, sans-serif;

/* Body */
font-family: 'Inter', system-ui, sans-serif;

/* Mono (code, data, timestamps) */
font-family: 'JetBrains Mono', 'Fira Code', monospace;
```

Install via `next/font`:
```ts
import { Inter, JetBrains_Mono } from 'next/font/google';
```

### Type Scale

| Role | Size | Weight | Tracking |
|---|---|---|---|
| Hero Headline | `clamp(48px, 7vw, 96px)` | 800 | `-0.03em` |
| Section Headline | `clamp(32px, 4vw, 56px)` | 700 | `-0.02em` |
| Card Title | `20–24px` | 600 | `-0.01em` |
| Body | `16px` | 400 | `0` |
| Small / Caption | `13–14px` | 400 | `0.01em` |
| Mono / Data | `13px` | 400 | `0.02em` |

### Inspiration sources
- **Linear** and **Raycast**: Oversized, ultra-heavy headlines with tight letter-spacing. The headline is the hero — no decorative graphics needed.
- **Resend**: Demonstrated serif can work for display, but Inter at 800 weight feels more "ops" than editorial.

---

## 4. Navigation

**Pattern**: Raycast-style floating pill nav

```tsx
// Pill nav container — floats over the hero
<nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50
  flex items-center gap-6 px-6 py-3
  rounded-full border border-[#1A2332]
  bg-[#080C10]/80 backdrop-blur-md">
  
  <Logo />
  <NavLinks />
  
  {/* Right side */}
  <SignInButton variant="ghost" />
  <GetStartedButton variant="filled" />  {/* solid blue, rounded-full */}
</nav>
```

**Behavior**:
- On scroll past 80px: add subtle shadow + increase backdrop blur
- Active link: `text-white` + thin blue underline dot
- Mobile: collapses to hamburger → full-screen dark overlay menu

**Links**: `Platform` · `Tools` · `Dark Ops` · `For EAs`

---

## 5. Hero Section

**Layout**: Centered, full-viewport, particle background

```
[Announcement Badge]
[Massive Headline — 2–3 lines]
[Subheadline — 1–2 lines, muted text]
[CTA Row — Get started free | Learn more]
[Scrolling mockup / app preview — fades in]
```

### Announcement Badge
Borrowed from **Resend** + **Liveblocks**:

```tsx
<div className="inline-flex items-center gap-2 px-3 py-1
  rounded-full border border-[#1A2332] bg-[#0D1117]
  text-xs text-[#8B9AB0]">
  <span className="px-1.5 py-0.5 rounded bg-[#1A73E8] text-white text-[10px] font-bold uppercase tracking-wider">
    Free
  </span>
  Now open for Filipino EAs — no waitlist
  <ArrowRight className="w-3 h-3" />
</div>
```

### Headline Copy (suggested)
```
The ops layer
Filipino EAs run on.
```
Subheadline: "Purpose-built tools for global executive support. Draft emails, track calendars, manage travel — all in one dark, focused workspace."

### CTA Row
```tsx
<div className="flex gap-3">
  <Button className="bg-[#1A73E8] hover:bg-[#1557B0] text-white px-6 py-3 rounded-full font-semibold">
    Get started free
  </Button>
  <Button variant="ghost" className="text-[#8B9AB0] hover:text-white px-6 py-3 rounded-full">
    See how it works →
  </Button>
</div>
```

### Hero Background
`@tsparticles/react` with mouse-repulse, blue particles, `#080C10` bg — already specced in CLAUDE.md.

Optionally layer a very subtle radial gradient glow centered on the headline:
```css
background: radial-gradient(ellipse 800px 500px at 50% 30%, #1A73E808 0%, transparent 70%);
```

---

## 6. Features Section — Three Apps

**Pattern**: Aceternity UI **Bento Grid** layout

```
┌─────────────────────┬───────────────┐
│                     │               │
│    EDrafting        │   Calendar    │
│    (large card)     │   Tracker     │
│                     │               │
├─────────────────────┴───────────────┤
│         Travel Manager (wide)       │
└─────────────────────────────────────┘
```

### Bento Card Anatomy
Each card uses Aceternity's **Glowing Effect** component:

```tsx
<GlowingCard className="bg-[#0D1117] border border-[#1A2332] rounded-2xl p-6
  hover:border-[#1A73E8]/30 transition-colors group">
  
  {/* Icon or mini app mockup at top */}
  <AppMockup />
  
  {/* Label */}
  <p className="text-xs text-[#1A73E8] font-mono uppercase tracking-widest mt-4">
    EDrafting
  </p>
  
  {/* Card headline */}
  <h3 className="text-xl font-semibold text-white mt-1">
    Draft emails that sound like your client
  </h3>
  
  {/* Description */}
  <p className="text-sm text-[#8B9AB0] mt-2">
    Upload reference docs. AI learns the voice. You approve in seconds.
  </p>
</GlowingCard>
```

**Aceternity component to use**: `<GlowingStarsBackgroundCard>` or `<BentoGrid>` from `ui.aceternity.com/components`

---

## 7. Free Tools Section

**Pattern**: Linear-style **horizontal scroll strip** or 3-column grid

Tools listed with:
- Tool name in mono font
- One-line description
- "Browser only · No upload" badge
- Tags: `GHL` · `n8n` · `PDF` etc.

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
  {tools.map(tool => (
    <ToolCard key={tool.id}
      className="flex items-start gap-3 p-4 rounded-xl
        border border-[#1A2332] bg-[#0D1117]
        hover:bg-[#111823] transition-colors">
      <ToolIcon />
      <div>
        <p className="font-mono text-sm text-white">{tool.name}</p>
        <p className="text-xs text-[#8B9AB0] mt-0.5">{tool.desc}</p>
        <div className="flex gap-1 mt-2">
          {tool.tags.map(tag => (
            <span className="px-1.5 py-0.5 text-[10px] rounded bg-[#1A2332] text-[#8B9AB0]">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </ToolCard>
  ))}
</div>
```

---

## 8. Dark Ops Section

This is the one paid section — it should feel different from the rest of the page. Use a contained card with red accent instead of blue.

```
┌──────────────────────────────────────────┐
│  ████ DARK OPS                           │
│                                          │
│  "For founders who need it handled."     │
│                                          │
│  Dedicated EA. Async-first. No fluff.    │
│  [Apply for a spot →]                    │
└──────────────────────────────────────────┘
```

```tsx
<section className="relative overflow-hidden rounded-3xl
  border border-[#C0392B]/20 bg-[#0D0808] p-12 my-24">
  
  {/* Red radial glow */}
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_600px_400px_at_50%_50%,#C0392B0D,transparent)]" />
  
  {/* Classified badge */}
  <span className="font-mono text-xs text-[#C0392B] tracking-[0.3em] uppercase">
    ████ Dark Ops
  </span>
  
  <h2 className="text-4xl font-bold text-white mt-3">
    For founders who need<br />it handled.
  </h2>
  
  <p className="text-[#8B9AB0] mt-4 max-w-md">
    Dedicated Filipino EA, matched to your workflow.
    Retainer-based. Async-first. Results, not check-ins.
  </p>
  
  <Button className="mt-8 border border-[#C0392B] text-[#C0392B]
    hover:bg-[#C0392B] hover:text-white rounded-full px-8 py-3 transition-colors">
    Apply for a spot →
  </Button>
</section>
```

---

## 9. App Interior (app.runsdark.com)

**Pattern**: Vercel dashboard — tight sidebar, dark surface cards, no wasted space

```
┌──────┬────────────────────────────────────┐
│      │  Page Header + Breadcrumb          │
│ Side │────────────────────────────────────│
│ bar  │                                    │
│      │   Main content area                │
│      │   (bg-surface, rounded cards)      │
│      │                                    │
└──────┴────────────────────────────────────┘
```

- Sidebar: `#0D1117`, 240px wide, icon + label nav items
- Active state: `bg-[#1A2332]` + left blue bar `w-0.5 bg-[#1A73E8]`
- Content area: `#080C10` bg, cards at `#0D1117`
- All inputs: `bg-[#1A2332] border-[#1A2332] focus:border-[#1A73E8]`
- shadcn/ui components, overridden to dark theme via `globals.css`

---

## 10. Animation & Motion

| Element | Animation | Library |
|---|---|---|
| Hero particles | Mouse-repulse field | `@tsparticles/react` |
| Hero headline | Text reveal (chars slide up) | Aceternity `TextReveal` or Framer Motion |
| Bento cards | Subtle float on hover + glow ring | Aceternity `GlowingEffect` |
| Page transitions | Fade + slight upward slide | Framer Motion `AnimatePresence` |
| Announcement badge | Pulse shimmer on load | CSS `@keyframes shimmer` |
| Number counters | Count-up on scroll-into-view | `react-countup` |
| Scroll sections | Fade-in from below | `framer-motion` `whileInView` |

**Motion rules**:
- Duration: `200ms` for micro-interactions, `400ms` for section reveals
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (spring-like, no bounce)
- No looping animations in the app interior — only on the marketing page
- Respect `prefers-reduced-motion` — wrap all animations:

```ts
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

---

## 11. Component Priorities

Install order for Claude Code:

1. `shadcn/ui` — base components (Button, Input, Card, Badge, Dialog, Tabs)
2. `Aceternity UI` — Bento Grid, Glowing Effect, Text Reveal, Background Beams
3. `@tsparticles/react` + `@tsparticles/slim` — hero particles
4. `framer-motion` — page transitions + scroll reveals
5. Custom: `HeroParticles`, `GlowingCard`, `AnnouncementBadge`, `DarkOpsSection`

---

## 12. Page Sections Order (runsdark.com)

1. `<Nav>` — floating pill
2. `<Hero>` — particle bg + badge + headline + CTA
3. `<LogoStrip>` — "As seen with" / EA community logos (optional)
4. `<AppsSection>` — Bento Grid, three apps
5. `<FreeToolsSection>` — grid of browser tools
6. `<HowItWorks>` — 3-step process (numbered, minimal)
7. `<DarkOpsSection>` — red-accent card, apply CTA
8. `<Footer>` — minimal: logo, links, "Built for Filipino EAs"

---

## 13. Quick Reference: What to Steal from Each Site

| Site | Steal This |
|---|---|
| **Linear** | Depth card effect below hero fold; pure black bg; card hover transitions |
| **basement.studio** | Ambient 3D/particle hero concept; monospaced nav labels |
| **Resend** | Announcement pill badge pattern; serif-meets-sans contrast; smoke bg layer |
| **Liveblocks** | Bold heavy headline weight; badge → headline → two-button CTA flow |
| **Raycast** | Floating pill nav container; centered oversized headline; coral/red single accent |
| **Aceternity UI** | Bento Grid, Glowing Effect, Text Reveal — copy-paste React+Tailwind components |
