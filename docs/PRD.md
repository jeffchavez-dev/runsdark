# RunsDark v1 PRD

**Status:** Ready to ship | **Timeline:** This week | **Client:** Live today

---

## ⚡ CRITICAL CONTEXT

First real client started TODAY. Need Docket + Calendar + Travel + EDrafting operational ASAP to validate product-market fit and generate time-saved metrics.

---

## 📌 Assumptions

**1. This client is the validation:**
Success with this one client (daily usage + visible time savings) proves the concept works. This is NOT a general market launch; it's a focused MVP for one power user to generate proof points for Dark Ops retainer pitch.

**2. Lead magnet strategy:**
These free apps exist to earn trust and demonstrate EA workflow expertise. The real revenue comes from Dark Ops retainer (done-for-you GHL + n8n automation). Each tool should subtly surface this.

**3. Budget = free-tier APIs only:**
No paid Anthropic credits, no expensive third-party services. EDrafting runs on Claude's free tier. Calendar stays manual (no Google Sync complexity). Travel uses @react-pdf/renderer.

**4. Solo execution:**
You are building, shipping, and supporting. Features must be simple enough to debug and iterate alone. Complexity ≠ quality.

---

## 🎯 Problem Statement

Filipino Executive Assistants managing multiple global clients struggle with fragmented tools (Gmail, Google Calendar, Notion, Sheets) to track daily tasks, monitor calendar bookings, and organize travel. This manual monitoring is tedious, error-prone, and distracts from higher-impact work. EAs need a unified workspace where they can own their clients' time, calendar, and logistics from one place.

---

## 👤 Target User / Persona

**Primary: The Operations Ninja (Filipino EA)**

- **Who:** Filipino Executive Assistant, 3-10 years experience, managing 2-5 global clients (US/AU/UK timezones)
- **Pain:** Spends 2-3 hours daily monitoring Gmail, calendar, and travel logistics across fragmented tools. Misses calendar conflicts, forgets to follow up on pending bookings, juggles timezone confusion.
- **Tech fluency:** Mid-level. Comfortable with Notion, Google Workspace, Slack. Wants tools that "just work"—not high-friction setup.
- **Goal:** Be the "CEO of the client's calendar"—own their time completely, minimize manual checks, free up time for strategic support.

---

## 📖 User Stories

### Docket (Task Management)
- **As** an EA, **I want** to log tasks with timestamps **so that** I can see exactly when work was added and measure productivity over time.
- **As** an EA, **I want** to group tasks by status (unstarted, underway, done) **so that** I can focus on what matters now without context-switching.
- **As** an EA, **I want** to mark tasks as done **so that** I see progress and feel momentum.

### Calendar (Booking Tracker)
- **As** an EA, **I want** to log bookings with statuses (pending, confirmed, needs followup) **so that** I can spot gaps and follow up without checking Gmail repeatedly.
- **As** an EA, **I want** to see all bookings in one Kanban board **so that** I can manage status at a glance (confirmed vs. pending vs. conflict).
- **As** an EA, **I want** to change booking status with one click **so that** I don't need to open email or calendar to update records.

### Travel (Itinerary Builder)
- **As** an EA, **I want** to build a trip itinerary (flights, hotels, cars, activities) **so that** I can organize all travel details in one place.
- **As** an EA, **I want** to upload confirmations and documents **so that** I have a single source of truth for visas, tickets, and hotel bookings.
- **As** an EA, **I want** to export a clean PDF itinerary **so that** my client can carry it on their phone or share with travel companions.

### EDrafting (Voice Profile Email Generator)
- **As** an EA, **I want** to upload sample emails from my client **so that** the system learns their writing voice and tone.
- **As** an EA, **I want** to type a brief ("decline Tuesday meeting politely") **so that** the system generates a draft that sounds like my client wrote it.
- **As** an EA, **I want** to edit and send the draft **so that** I save 15+ minutes per email versus writing from scratch.

---

## ⚙️ Core Features: MVP vs. Later

### MVP (Ship This Week)

- **Docket:** Create, view, update, delete tasks. Group by status. Timestamp on creation. Status transitions logged. Zero collaboration features.
- **Calendar:** Create bookings manually. Kanban board view with 6 statuses (pending, confirmed, needs_followup, rescheduled, cancelled, conflict). Click to change status. No Google Calendar sync.
- **Travel:** Create trips. Add segments (flight, hotel, car, activity). Upload documents. Export PDF itinerary. No public approval link (v1.1).
- **EDrafting:** Upload sample emails. System extracts voice profile. Generate drafts from brief text. View and edit drafts. NO voice quality refinement (RAG only, simple retrieval).
- **Auth:** Supabase magic link sign-up. One user per account (no team features).

### Later (v1.1+, Explicitly Deferred)

- **Google Calendar Sync:** Why deferred? Adds OAuth complexity + requires handling deletions/conflicts. v1 proves concept with manual entry; v1.1 adds sync if EA asks for it.
- **Gmail/Inbox Integration:** Why deferred? Separate surface; EA doesn't need it to prove time-saved. Roadmapped for 2026 as second lead magnet.
- **Team Collaboration:** Why deferred? Solo EA focus for now. No shared projects, no permissions matrix. Raises complexity exponentially.
- **Mobile App:** Why deferred? Web-responsive first. 80% of work happens on laptop. Mobile web suffices for v1.
- **Voice Quality Refinement:** Why deferred? RAG + Claude generates adequate drafts. Fine-tuning / training happens post-launch if needed.

---

## 📊 Success Metrics

### Primary (For Your Client)
- **Daily Active Usage:** Client logs into at least one app (Docket / Calendar / Travel / EDrafting) every weekday for 2+ weeks straight.
- **Time Saved Per Week:** Client reports measurable time reduction in calendar booking checks, task logging, and email drafting. Target: 3+ hours saved per week.
- **Booking Accuracy:** Zero "missed followup" incidents (the main pain point). Calendar status board is the source of truth.

### Secondary (For RunsDark)
- **Feature Usage Pattern:** Which app does the EA use most? (Docket vs. Calendar vs. Travel vs. EDrafting). This signals which feature to iterate next.
- **Engagement Depth:** Not just logged in—actively updated tasks/bookings. Proxy: tasks created per day, status changes per day, emails drafted per week.
- **Feedback Loop:** Client provides qualitative feedback (friction points, features they want). Use to pitch Dark Ops retainer: "I could automate all this via n8n + GHL."

### North Star (After v1)
- **Conversion to Dark Ops:** Does this EA sign up for the $X/month retainer for automated booking ingestion + workflow setup? That's the real metric.

---

## ⚠️ Edge Cases (At Least 5)

1. **Timezone Confusion:** Client is US-based, EA is Manila-based, booking is for UK client. How do we display the booking time without confusing the EA? Solution: Always show in client's timezone + EA's timezone side-by-side.

2. **Stale Bookings:** EA logs a booking as "confirmed" 2 months ago. Client cancels last-minute. EA doesn't see it in RunsDark. Solution: No TTL on bookings (EA owns lifecycle). v1.1 adds Slack reminders for old pending bookings.

3. **Empty Docket:** Client has no tasks on Monday morning. Does Docket show "no tasks" gracefully, or does it confuse the EA? Solution: Clear empty state: "All set for today!"

4. **Large Email Sample Upload:** EA uploads 500 sample emails at once. Chunking + embedding takes 5 minutes. Does the UI freeze? Solution: Background job + progress indicator. User can close browser; we email when done.

5. **Conflicting Bookings:** EA manually logs two overlapping time slots. Does the system warn them, or silently allow it? Solution: v1 allows it (EA owns data integrity). v1.1 adds a conflict warning.

6. **Permission Creep:** Client gives EA access to their GHL account. Should RunsDark sync GHL calendar automatically? Solution: NO. v1 is manual only. Dark Ops retainer handles the automation pitch.

---

## 🚫 Out of Scope (We Are NOT Building)

- **Gmail / Inbox Management:** RunsDark does NOT sync Gmail. No inbox zero tracking, no email forwarding. Roadmapped for 2026; not v1.
- **Google Calendar Sync:** Calendar Tracker is manual entry only. No automatic sync from Google Calendar. We stay focused on "booking tracking" not "calendar sync."
- **Team Collaboration:** Single-user accounts only. No shared Dockets, no shared Calendars. No permission matrix. This is solo EA tooling, not team tooling.
- **Mobile App:** No iOS / Android app. Web-responsive on mobile. Desktop-first product.
- **EDrafting Voice Fine-Tuning:** RAG + Claude's base model only. No model training, no custom embeddings beyond OpenAI text-embedding-3-small.
- **Real-Time Notifications:** No push notifications, no Slack alerts (v1). Email reminders in v1.1 if needed.

---

## ❓ Open Questions & Risks

1. **EDrafting Voice Quality:** Will RAG-only retrieval + Claude generate drafts that actually sound like the client? Or will they sound generic? We don't know until the EA tries it. Plan: v1 ships with basic voice profile, v1.1 refines based on feedback.

2. **Travel MVP Utility:** Does an EA actually need RunsDark to store travel itineraries, or do they already use Notion? Validating via the client this week. Might discover it's lower-priority than Docket/Calendar.

3. **Time-Saved Measurement:** How do we quantify time saved? Manual logging? Surveys? We'll ask the client to estimate before/after. Might be imprecise, but good enough for Dark Ops pitch.

4. **API Cost Blowout:** EDrafting uses Claude API on free tier. If the client drafts 50+ emails in a week, costs climb. v1 has a "draft limit" (5 per month) to stay cheap. Might frustrate the EA. Plan: v1.1 raises limit, charges $5/mo if needed.

5. **Solo Support Load:** If the EA hits a bug, can you debug + fix alone? Yes, for small issues. If product fundamentally doesn't fit their workflow, we pivot. Keep iteration cycles tight.

---

## 🚀 Launch Plan (This Week)

1. **Deploy to Vercel:** Get all 4 apps (Docket + Calendar + Travel + EDrafting) live by end of day.
2. **Client Onboarding Call:** Walk the EA through each feature. Set expectation: "This is v1, still rough. Let's find friction fast."
3. **Daily Check-ins (Days 1–5):** Short Slack/email syncs. "What broke? What's missing?" Capture feedback, prioritize fixes.
4. **Weekly Retrospective (Day 7):** Ask the client: "Time saved? Which app is most valuable? What's confusing?" Feed into v1.1 roadmap.
5. **Dark Ops Pitch (Week 2):** Once the EA feels the pain relief, offer: "I can automate the booking sync + task generation via n8n + GHL. Let's talk about a retainer."
