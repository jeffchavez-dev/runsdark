# RunsDark Design Brief v1

**Context:** Operational tool for solo Filipino EAs managing 2-5 global clients. Data-heavy, time-sensitive workflows. Speed and clarity > visual polish.

---

## 1. User Flows

### Flow 1: Docket — Log & Track Daily Tasks

```
START: Dashboard / Docket page
  ↓
[Docket list view] — shows tasks grouped by status (unstarted, underway, done)
  ├─ DECISION: "New task"?
  │   ├─ YES → [Task form modal]
  │   │         ├─ Fill: title (required), optional description
  │   │         ├─ Submit
  │   │         ├─ SUCCESS → Task appears in "unstarted" column, timestamp logged
  │   │         └─ ERROR → Show error toast, stay in form
  │   │
  │   └─ NO → [Select task card]
  │           ├─ DECISION: "Change status"?
  │           │   ├─ YES → Status dropdown → select (unstarted/underway/done)
  │           │   │         → Update immediately, timestamp logged
  │           │   │         → Return to list
  │           │   │
  │           │   └─ DECISION: "Delete"?
  │           │       ├─ YES → Confirm modal → delete → remove from list
  │           │       └─ NO → Close task detail, stay in list
  │           │
  │           └─ DECISION: "View history"?
  │               └─ YES → Expand history log (timestamps of all status changes)
  │
  └─ DECISION: "Filter by status"?
      └─ YES → Chips at top (All / Unstarted / Underway / Done) → filter view
```

**Decision Points:**
- Can a task be empty (no title)? → NO, validate on form submit
- Can EA edit task title after creation? → YES, click card → inline edit → save
- Do deleted tasks go to trash or hard-delete? → Hard-delete (simplicity; one EA can't recover)
- Can EA search tasks? → NO for v1 (list will be <50 items; search added if needed)

---

### Flow 2: Calendar — Manage Booking Status

```
START: Calendar page
  ↓
[Client selector dropdown] — "All" or pick a client
  ├─ NO CLIENT SELECTED → Empty state: "Select a client to see bookings"
  │
  └─ CLIENT SELECTED → [Kanban board view]
                        (6 columns: Pending | Confirmed | Needs Followup | Rescheduled | Cancelled | Conflict)
  ├─ DECISION: "New booking"?
  │   ├─ YES → [Booking form modal]
  │   │         ├─ Fill: title (required), start time, end time, notes
  │   │         ├─ Submit
  │   │         ├─ SUCCESS → Booking appears in "pending" column
  │   │         └─ ERROR → Show error toast, stay in form
  │   │
  │   └─ NO → [Drag booking card between columns]
  │           ├─ YES → Status updates immediately, card moves, history logged
  │           │
  │           └─ [Click booking card] → [Booking detail view]
  │                   ├─ Show: title, time (in client TZ + EA TZ), status, notes
  │                   ├─ DECISION: "Edit" or "Delete"?
  │                   │   ├─ EDIT → Update form → save → return to board
  │                   │   └─ DELETE → Confirm → remove from board
  │                   │
  │                   └─ DECISION: "View history"?
  │                       └─ YES → Show timeline of all status changes with notes
  │
  └─ DECISION: "Filter by status"?
      └─ YES → Click column header → show/hide column
```

**Decision Points:**
- Can EA drag-and-drop? → YES (faster than dropdowns), with keyboard alternative (Tab + Space)
- What if booking has no end time? → Allow it (some meetings are open-ended or cancelled)
- Timezone display: which timezone first? → Client's TZ first (EA is serving client), EA's TZ in smaller text
- Can EA bulk-move (e.g., move all "pending" to "confirmed")? → NO for v1 (rare, adds complexity)
- What happens if EA selects a client with zero bookings? → Show empty state with "New booking" CTA

---

### Flow 3: Travel — Build Itinerary

```
START: Travel page
  ↓
[Trips list] — cards showing trip title, destination, dates
  ├─ DECISION: "New trip"?
  │   ├─ YES → [Trip form modal]
  │   │         ├─ Fill: title (required), destination, start date, end date, client (optional)
  │   │         ├─ Submit
  │   │         ├─ SUCCESS → Create trip (status="draft"), navigate to trip detail
  │   │         └─ ERROR → Show error toast, stay in form
  │   │
  │   └─ [Click trip card] → [Trip detail page]
  │                           ├─ Show: trip header (title, destination, dates, status)
  │                           ├─ DECISION: "Add segment"?
  │                           │   ├─ YES → [Segment form modal]
  │                           │   │         ├─ Select type: flight / hotel / car / activity
  │                           │   │         ├─ Fill: vendor, confirmation, start/end, details (JSON-friendly)
  │                           │   │         ├─ Submit
  │                           │   │         ├─ SUCCESS → Segment added to trip, appears in sequence
  │                           │   │         └─ ERROR → Show error, stay in form
  │                           │   │
  │                           │   └─ [Reorder segments] → Drag-to-sort segments
  │                           │
  │                           ├─ DECISION: "Upload document"?
  │                           │   ├─ YES → [Document uploader] (drag-drop or file input)
  │                           │   │         ├─ Select file (PDF / JPG / PNG)
  │                           │   │         ├─ Tag type: visa / ticket / confirmation / hotel / other
  │                           │   │         ├─ Upload → file to Supabase Storage
  │                           │   │         ├─ SUCCESS → Document appears in "document shelf"
  │                           │   │         └─ ERROR → Show error toast
  │                           │   │
  │                           │   └─ [Document shelf] — list of uploaded docs with download links
  │                           │
  │                           ├─ DECISION: "Preview/Export PDF"?
  │                           │   ├─ YES → [PDF itinerary preview] (read-only, segments + docs)
  │                           │   │         ├─ "Download PDF" button
  │                           │   │         └─ Close preview, return to detail
  │                           │   │
  │                           │   └─ DECISION: "Delete trip" or "Mark as completed"?
  │                           │       ├─ DELETE → Confirm → remove trip + all docs
  │                           │       └─ STATUS → Change to "active" or "completed"
  │                           │
  │                           └─ DECISION: "Share approval link" (v1.1)?
  │                               └─ Not in v1; deferred
  │
  └─ [Trip card actions] — quick status badge, delete button
```

**Decision Points:**
- Can EA reorder segments after creation? → YES (drag-to-sort, essential for itinerary coherence)
- Can EA edit segment after creation? → YES (click segment → edit modal)
- PDF export: what if trip has 50 segments? → Paginate PDF, show length estimate before download
- Can EA add segments in future dates (past the trip end)? → YES, with warning ("This is after trip end date")
- What if trip has no segments when exporting PDF? → Show warning, allow export (EA might add docs without segments)

---

### Flow 4: EDrafting — Generate Voice-Matched Emails

```
START: EDrafting page
  ↓
[Voice profiles list] — cards showing profile name, client, doc count
  ├─ DECISION: "New profile"?
  │   ├─ YES → [Create profile modal]
  │   │         ├─ Fill: profile name (required), client (optional)
  │   │         ├─ Submit
  │   │         ├─ SUCCESS → Create profile (no docs yet), navigate to profile detail
  │   │         └─ ERROR → Show error toast, stay in form
  │   │
  │   └─ [Click profile card] → [Profile detail page]
  │                              ├─ Show: profile name, client, "Last synthesized" timestamp
  │                              ├─ DECISION: "Upload document"?
  │                              │   ├─ YES → [Document uploader] (drag-drop or file input)
  │                              │   │         ├─ Select file (PDF / DOCX / TXT, max 5MB)
  │                              │   │         ├─ Upload → extract text + embed
  │                              │   │         ├─ Show progress: "Extracting text..." → "Embedding..."
  │                              │   │         ├─ SUCCESS → Doc added, chunks stored, "Synthesizing voice profile..." shows
  │                              │   │         └─ ERROR (parse fail) → "Couldn't extract text from file. Try a different format."
  │                              │   │         └─ ERROR (embed fail) → "Embedding failed. Try again." (rare; rate limit)
  │                              │   │
  │                              │   └─ [Documents list] — shows uploaded docs, delete buttons
  │                              │
  │                              ├─ DECISION: "View voice profile" (synthesized prompt)?
  │                              │   ├─ YES → [Modal] shows system prompt (read-only, ~200 words)
  │                              │   │         "Based on the documents you uploaded, this is how the system will write emails."
  │                              │   │
  │                              │   └─ DECISION: "Generate draft"?
  │                              │       ├─ YES → [Draft composer modal]
  │                              │       │         ├─ Input: brief text area (e.g., "Write a polite decline to Tuesday meeting with James")
  │                              │       │         ├─ Submit
  │                              │       │         ├─ Show progress: "Retrieving voice samples..." → "Generating draft..."
  │                              │       │         ├─ SUCCESS → [Draft preview]
  │                              │       │         │             ├─ Show: subject + body
  │                              │       │         │             ├─ DECISION: "Regenerate"?
  │                              │       │         │             │   ├─ YES → Re-run generation (same brief, might get different output)
  │                              │       │         │             │   └─ NO → Continue
  │                              │       │         │             │
  │                              │       │         │             └─ DECISION: "Copy to clipboard" or "Close"?
  │                              │       │         │                 ├─ COPY → Toast: "Copied! Paste into Gmail"
  │                              │       │         │                 └─ CLOSE → Return to profile, draft saved in history
  │                              │       │         │
  │                              │       │         └─ ERROR (rate limit) → "You've hit the monthly draft limit. Try again next month."
  │                              │       │         └─ ERROR (no docs) → "Upload at least one document to generate drafts."
  │                              │       │         └─ ERROR (API fail) → "Generation failed. Try again in a moment."
  │                              │       │
  │                              │       └─ [Draft history] — list of past drafts (brief + generated result)
  │                              │                           ├─ Click draft → re-show preview
  │                              │                           └─ Delete draft
  │                              │
  │                              └─ DECISION: "Delete profile"?
  │                                  └─ YES → Confirm → delete profile + all docs + all drafts
  │
  └─ [Profile card actions] — quick doc count, delete button
```

**Decision Points:**
- Can EA upload the same document twice? → YES (no dedup; rare edge case)
- What if voice profile has <3 docs? → Allow draft generation (might be low quality, but no hard limit)
- Can EA regenerate the same brief multiple times? → YES (counts toward monthly limit each time)
- Monthly draft limit: 5 per month. Do limits reset on calendar month or 30-day rolling? → Calendar month (simpler, Jan 1 reset)
- Can EA edit a past draft? → YES (click draft → edit text → copy/use)
- Profile synthesis: how often? → After each new doc upload (automatic, ~1 min background job)

---

## 2. Screen Inventory

### Docket
| Screen | Purpose | Accessed From |
|--------|---------|---------------|
| Docket List (Board View) | See all tasks grouped by status (unstarted / underway / done), with timestamps | Dashboard > "Docket" or sidebar |
| Task Form (Modal) | Create new task; fill title + optional description | "New task" button on list |
| Task Detail (Card Expanded) | Edit task, view history, change status, delete | Click task card on list |
| Task History (Inline) | Timeline of all status changes with timestamps | Expand "History" on task card |

### Calendar
| Screen | Purpose | Accessed From |
|--------|---------|---------------|
| Calendar Board (Kanban) | See all bookings for selected client across 6 status columns | Dashboard > "Calendar" or sidebar; client selector required |
| Booking Form (Modal) | Create new booking; fill title, time, notes | "New booking" button on board |
| Booking Detail (Expanded Card) | Edit booking, view history, change status, delete | Click booking card on board |
| Booking History (Inline) | Timeline of status changes with notes | Expand "History" on booking card |
| Empty State (Client Not Selected) | Prompt to select a client before viewing bookings | When no client selected |

### Travel
| Screen | Purpose | Accessed From |
|--------|---------|---------------|
| Trips List | Overview of all trips (cards: title, destination, dates, status) | Dashboard > "Travel" or sidebar |
| Trip Detail | Full itinerary: segments list, document shelf, status badge | Click trip card |
| Segment Form (Modal) | Create/edit segment (type, vendor, confirmation, dates, details) | "Add segment" button on trip detail |
| Segments List (Sortable) | Ordered list of trip segments with drag-to-reorder | Embedded in trip detail |
| Document Shelf | List of uploaded trip documents (with download links) | Embedded in trip detail |
| PDF Itinerary Preview (Modal) | Read-only PDF of full itinerary + documents | "Preview PDF" on trip detail |
| Trip Edit Form (Modal) | Edit trip title, destination, dates, client, status | "Edit trip" on trip detail |

### EDrafting
| Screen | Purpose | Accessed From |
|--------|---------|---------------|
| Voice Profiles List | Overview of all profiles (name, client, doc count) | Dashboard > "EDrafting" or sidebar |
| Profile Detail | Profile info, document uploader, draft composer, voice prompt view | Click profile card |
| Document Uploader (Drag Zone) | Upload sample emails (PDF/DOCX/TXT); shows progress | "Upload documents" on profile detail |
| Documents List | Uploaded documents per profile (with delete buttons) | Embedded in profile detail |
| Voice Prompt View (Modal) | Read-only system prompt synthesized from documents | "View voice prompt" on profile detail |
| Draft Composer (Modal) | Text area for brief → generate draft with progress | "Generate draft" on profile detail |
| Draft Preview (Modal) | Generated email (subject + body), copy/regenerate/close | Shown after generation completes |
| Draft History (Inline) | Past drafts with brief text (click to re-show preview) | Embedded in profile detail |

---

## 3. Layout per Screen

### Docket List (Board View)
```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER: Docket                     [+ New Task]                 │
├─────────────────────────────────────────────────────────────────┤
│ FILTERS (optional): [All] [Unstarted] [Underway] [Done]         │
│ (chips, default: All)                                           │
├─────────────────────────────────────────────────────────────────┤
│ TASK CARDS (sortable columns):                                  │
│                                                                 │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐             │
│ │ UNSTARTED    │ │ UNDERWAY     │ │ DONE         │             │
│ │ (3 items)    │ │ (1 item)     │ │ (5 items)    │             │
│ ├──────────────┤ ├──────────────┤ ├──────────────┤             │
│ │ [Task Card]  │ │ [Task Card]  │ │ [Task Card]  │             │
│ │ [Task Card]  │ │              │ │ [Task Card]  │             │
│ │ [Task Card]  │ │              │ │ [Task Card]  │             │
│ │              │ │              │ │ [Task Card]  │             │
│ │              │ │              │ │ [Task Card]  │             │
│ └──────────────┘ └──────────────┘ └──────────────┘             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

TASK CARD STRUCTURE:
┌────────────────────────────┐
│ Task Title (clickable)     │
│ Created: 2 days ago        │
│ ┌─ Status ─────────────┐   │
│ │ [Select Status ▼]    │   │
│ └──────────────────────┘   │
│ [Delete] [History]         │
└────────────────────────────┘
```

**Above the fold:** 2–3 task cards per column (8–10 tasks visible without scrolling)

---

### Calendar Board (Kanban)
```
┌──────────────────────────────────────────────────────────────────────┐
│ HEADER: Calendar for [Client Selector ▼]  [+ New Booking]           │
├──────────────────────────────────────────────────────────────────────┤
│ KANBAN COLUMNS (6 columns, horizontal scroll on mobile):             │
│                                                                      │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ... (6 total)      │
│ │ PENDING     │ │ CONFIRMED   │ │ NEEDS FOLLOW│                    │
│ │ (5 items)   │ │ (8 items)   │ │ (2 items)   │                    │
│ ├─────────────┤ ├─────────────┤ ├─────────────┤                    │
│ │ [Booking]   │ │ [Booking]   │ │ [Booking]   │                    │
│ │ [Booking]   │ │ [Booking]   │ │ [Booking]   │                    │
│ │ [Booking]   │ │ [Booking]   │ │             │                    │
│ │ [Booking]   │ │ [Booking]   │ │             │                    │
│ │ [Booking]   │ │ [Booking]   │ │             │                    │
│ │             │ │ [Booking]   │ │             │                    │
│ │             │ │ [Booking]   │ │             │                    │
│ │             │ │ [Booking]   │ │             │                    │
│ └─────────────┘ └─────────────┘ └─────────────┘                    │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘

BOOKING CARD (draggable):
┌────────────────────────────────┐
│ Meeting with James (clickable) │
│ Tue, Sep 3 · 2:00–3:00 PM      │
│ (EA TZ) / (Client TZ)          │
│ 🟡 Pending  [×]                │
│ Notes: Need to reschedule      │
└────────────────────────────────┘
```

**Above the fold:** 2–3 booking cards per column (6–8 bookings visible without scrolling)

---

### Trip Detail Page
```
┌────────────────────────────────────────────────────┐
│ ← Back | Trip: Tokyo Exec Visit                   │
├────────────────────────────────────────────────────┤
│ TRIP HEADER:                                       │
│ • Destination: Tokyo, Japan                        │
│ • Dates: Sep 15–22, 2025                          │
│ • Status: Draft  [Edit] [Delete]                  │
│ • Client: (if linked) Global Client Inc.          │
├────────────────────────────────────────────────────┤
│ SEGMENTS (draggable, sorted):                      │
│ ┌──────────────────────────────────────────┐      │
│ │ ≡ Flight: JAL 123 | Sep 15, LA → Tokyo  │      │
│ │   Confirmation: #ABC123 | [Edit] [Delete]│      │
│ ├──────────────────────────────────────────┤      │
│ │ ≡ Hotel: Park Hyatt | Sep 15–22         │      │
│ │   Confirmation: #XYZ789 | [Edit] [Delete]│      │
│ ├──────────────────────────────────────────┤      │
│ │ ≡ Car Rental: Hertz | Sep 15–22         │      │
│ │   Confirmation: #CAR456 | [Edit] [Delete]│      │
│ └──────────────────────────────────────────┘      │
│ [+ Add Segment]                                   │
├────────────────────────────────────────────────────┤
│ DOCUMENTS (uploads with download links):          │
│ • Passport scan (visa) — [Download] [Delete]      │
│ • JAL ticket PDF — [Download] [Delete]            │
│ • Hotel confirmation — [Download] [Delete]        │
│ [+ Upload Document]                               │
├────────────────────────────────────────────────────┤
│ [Preview PDF]  [Export PDF]                        │
└────────────────────────────────────────────────────┘
```

**Above the fold:** Trip header + first segment + 2–3 documents visible

---

### Profile Detail (EDrafting)
```
┌──────────────────────────────────────────────────┐
│ ← Back | Voice Profile: John CEO                │
├──────────────────────────────────────────────────┤
│ Profile: john-doe | Client: Acme Corp            │
│ Last synthesized: 2 hours ago                     │
├──────────────────────────────────────────────────┤
│ UPLOADED DOCUMENTS (2 files):                    │
│ • strategy_memo.docx — [Delete]                  │
│ • emails_sample.pdf — [Delete]                   │
│ [Drag files here or click to upload]             │
│ (Status: Extracting text... 50% done)            │
├──────────────────────────────────────────────────┤
│ [View Voice Prompt]                              │
├──────────────────────────────────────────────────┤
│ DRAFT GENERATION:                                 │
│ ┌────────────────────────────────────────────┐   │
│ │ Write a polite decline to James' Tuesday   │   │
│ │ meeting. Keep it brief.                    │   │
│ │                                            │   │
│ │ [Generate Draft]                           │   │
│ └────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────┤
│ DRAFT HISTORY:                                    │
│ • "Decline Tuesday meeting" — Sep 1, 2:34 PM     │
│ • "Approve James' proposal" — Aug 31, 9:12 AM    │
├──────────────────────────────────────────────────┤
│ [Delete Profile]                                 │
└──────────────────────────────────────────────────┘
```

**Above the fold:** Documents + draft generator (core action); history below

---

## 4. Component List

### Shared Components (used on 2+ screens)

| Component | Usage | Notes |
|-----------|-------|-------|
| **Card** | Task cards, booking cards, trip cards, profile cards | Base container; variant padding/shadow for status |
| **Button** | "New" actions, submit, delete, edit, cancel | Primary (blue), secondary (ghost), danger (red) |
| **Modal** | Forms (task, booking, segment, profile), confirmations | Overlay with close button, keyboard close (ESC) |
| **Status Badge** | Task status, booking status, trip status | Color-coded (green/yellow/red/gray), icon + label |
| **Text Input** | Task title, booking title, trip name, draft brief | Placeholder, validation state, max length |
| **Textarea** | Task description, booking notes, draft brief | Resize handle, char counter for brief (max 1000) |
| **Select Dropdown** | Client selector, segment type, document type, status | Standard HTML select (native on mobile) |
| **Date/Time Input** | Booking start/end, trip dates, segment dates | datetime-local HTML input + timezone context |
| **Form Field Wrapper** | Labels, error messages, help text | Consistent spacing, focus state |
| **Empty State** | No tasks, no bookings, no documents, no client selected | Icon + heading + CTA button |
| **Error Toast** | Form errors, API errors, validation errors | Bottom-right, auto-dismiss after 5s, closable |
| **Success Toast** | Copied to clipboard, PDF exported, upload complete | Bottom-right, green badge, auto-dismiss 3s |
| **Progress Indicator** | File upload, embedding, PDF generation | Linear progress bar + text (e.g., "50% extracting") |
| **Kanban Column** | Docket status columns, calendar status columns | Scrollable, accepts drag-drop, shows item count |
| **Draggable Item** | Tasks, bookings, segments | Visual feedback (shadow on drag), keyboard support |
| **Menu / Context Actions** | [Edit] [Delete] [History] on cards | Inline buttons or right-click menu |
| **Chip / Filter** | Status filters on Docket and Calendar | Clickable, highlight when active |
| **Timezone Display** | Booking times, trip dates | "Sep 3, 2:00 PM (ET)" / "1:00 PM (Manila time)" |

**NOT creating separate components (one-off elements):**
- Trip header (unique layout, minimal reuse)
- PDF preview (read-only, one occurrence)
- Voice prompt view (display-only modal)

---

## 5. Design Tokens

### Color Palette (Grounded in "Systems Running in the Dark")

```
PRIMARY COLORS:
  Dark Navy (background):     #0D1B2A
  Surface Elevated:           #1A2E3E
  Accent Blue:                #1A73E8
  Text Primary:               #FFFFFF
  Text Secondary:             #B0C4DE

STATUS COLORS:
  Success (Confirmed):        #4ADE80  (green)
  Warning (Pending):          #FACC15  (yellow)
  Alert (Needs Followup):     #F97316  (orange)
  Danger (Cancelled/Error):   #F0575A  (red)
  Neutral (Rescheduled):      #9CA3AF  (gray)

INTERACTIVE:
  Link/Active:                #1A73E8  (same as accent)
  Hover Overlay:              rgba(26, 115, 232, 0.1)
  Focus Ring:                 #1A73E8  (3px, offset 2px)
  Disabled Text:              #6B7280  (gray, low opacity)

UTILITY:
  Border:                     #374151  (subtle, dark gray)
  Divider:                    #1F2937
  Success Toast BG:           #065F46  (dark green)
  Error Toast BG:             #7F1D1D  (dark red)
  Loading Spinner:            #1A73E8
```

**Rationale:** Navy + blue evokes "dark ops" systems. Muted greens/reds for status (not lime/crimson—those clash with dark backgrounds and read as gaming UIs, not operational tools). Grays are desaturated (avoid pure black text/borders; they're harsh in dark mode).

---

### Type Scale

```
Display (rarely used):
  32px · 700 (bold)          For page titles ("Calendar", "Docket")

Large Heading:
  24px · 600                 Trip title, profile name, main section titles

Heading:
  20px · 600                 Modal titles, card headers, "New Task" etc.

Subheading:
  16px · 600                 Labels, status labels

Body Large:
  16px · 400                 Primary content (task title, booking text)
  Line height: 1.5

Body:
  14px · 400                 Secondary content (timestamps, notes, descriptions)
  Line height: 1.5

Small:
  12px · 400                 Timestamps, help text, captions, "Last synced"
  Line height: 1.4

Monospace (for confirmations, codes):
  14px · 400                 Confirmation numbers, IDs
  Font: `ui-monospace`, `Monaco`, `Courier New`
```

**Font:** System stack (no external fonts to keep load fast):
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
```

---

### Spacing Scale

```
4px   · xs (micro spacing between tight elements)
8px   · sm (padding in small components, gaps between inline items)
16px  · md (default padding in cards, modal margins)
24px  · lg (section spacing, vertical rhythm)
32px  · xl (large gaps, page margins on desktop)
48px  · 2xl (hero-level spacing, very rare)
```

**Application:**
- Card padding: 16px
- Modal padding: 24px (top/bottom) 24px (sides)
- Button padding: 8px (top/bottom) 16px (left/right)
- Gap between form fields: 16px
- Margin between sections: 24px

---

## 6. States

### Docket List View

**Empty State (no tasks):**
```
┌──────────────────────────────────┐
│                                  │
│  📋 All Set for Today!           │
│                                  │
│  No tasks yet. Ready for a       │
│  productive day?                 │
│                                  │
│  [+ New Task]                    │
│                                  │
└──────────────────────────────────┘
```
Actions: "New Task" or navigate elsewhere. Status filter chips still visible (grayed out).

**Loading State (initial fetch):**
- Show skeleton cards (5–6) in each column for ~1s while tasks load
- Skeleton height matches typical card height
- Don't show column headers if loading (cleaner UX)

**Error State (fetch failed):**
```
┌──────────────────────────────────┐
│  ⚠️ Couldn't load tasks          │
│                                  │
│  We had trouble connecting.      │
│  Please refresh the page.        │
│                                  │
│  [Refresh]  [Contact Support]    │
│                                  │
└──────────────────────────────────┘
```
Actions: "Refresh" (retry fetch) or contact support link.

**Success State (tasks loaded):**
- 3 columns visible (Unstarted / Underway / Done)
- Cards sorted by creation date (oldest first within column)
- Drag-drop enabled
- Filter chips at top

**Partial State (API errors during drag):**
- Card starts to move, but drag fails midway
- Show error toast: "Couldn't update status. Try again."
- Card snaps back to original column
- Data persists; no data loss

---

### Calendar Board

**No Client Selected (initial state):**
```
┌──────────────────────────────────┐
│  Calendar for [Select Client ▼] │
│                                  │
│  📅 Pick a client to begin       │
│                                  │
│  Select a client from the        │
│  dropdown to see their bookings. │
│                                  │
│  [Learn about Calendar Tracker]  │
│                                  │
└──────────────────────────────────┘
```
Actions: Only "Select Client" dropdown is active.

**Client Selected, No Bookings:**
```
┌──────────────────────────────────────────────────────────────┐
│ Calendar for [Acme Corp ▼]                 [+ New Booking]   │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  PENDING | CONFIRMED | NEEDS FOLLOWUP | ... (all columns)   │
│                                                               │
│  ✨ No bookings yet for Acme Corp                            │
│  Ready to log your first booking?                            │
│                                                               │
│  [+ New Booking]                                             │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```
Actions: "New Booking" button active.

**Loading Bookings:**
- Show skeleton cards (1–2 per column) for ~1s
- Columns remain visible (don't hide them)

**Error State (fetch failed):**
```
┌──────────────────────────────────────────────────────────────┐
│ Calendar for [Acme Corp ▼]                                   │
│                                                               │
│  ⚠️ Couldn't load bookings                                   │
│                                                               │
│  [Refresh]                                                   │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```
Actions: "Refresh" retries fetch.

**Success with Bookings:**
- 6 columns visible (all statuses)
- Bookings distributed across columns
- Drag-drop enabled
- Empty columns show "(0 items)" count

---

### EDrafting Draft Generation

**Idle (initial state):**
- Empty text area, placeholder: "e.g., Decline James' Tuesday meeting politely"
- [Generate Draft] button is enabled
- Draft history below (if any)

**Loading (generation in progress):**
```
Generating draft...
████████░░ 80% — Retrieving voice samples...

[Cancel]
```
(Indeterminate progress, estimated ETA optional)

**Success (draft ready):**
```
┌──────────────────────────────────────────┐
│ Subject: RE: Tuesday Meeting             │
├──────────────────────────────────────────┤
│ Hi James,                                │
│                                          │
│ Thank you for reaching out. I appreciate │
│ the invitation, but I'm unable to make   │
│ Tuesday's meeting. Would Wednesday work │
│ for you instead?                         │
│                                          │
│ Best,                                    │
│ [Client Name]                            │
├──────────────────────────────────────────┤
│ [Copy to Clipboard]  [Regenerate]  [✕]  │
└──────────────────────────────────────────┘
```
Actions: Copy (toast confirms), Regenerate (rerun, counts toward limit), close.

**Error (rate limit hit):**
```
⚠️ Monthly Draft Limit Reached

You've used 5 of 5 drafts this month.
Your limit resets on October 1st.

[OK]
```
Actions: "OK" closes modal. Can still view past drafts.

**Error (no documents):**
```
⚠️ No documents yet

Upload at least one email sample
before generating drafts.

[Upload Documents]
```
Actions: "Upload Documents" scrolls to uploader.

---

### Document Upload (Profile Detail)

**Idle (initial):**
```
┌────────────────────────────────────────┐
│ Drag files here or click to select     │
│ (PDF, DOCX, TXT · max 5MB each)       │
└────────────────────────────────────────┘
```
Actions: Click to file picker, or drag-drop.

**Uploading (progress):**
```
┌────────────────────────────────────────┐
│ strategy_memo.docx                     │
│ ████████░░ 80% — Extracting text...   │
│                                        │
│ [Cancel]                               │
└────────────────────────────────────────┘
```

**Success (doc uploaded, embedding in progress):**
```
🟢 strategy_memo.docx uploaded
   Embedding... (should take ~10 seconds)
```
(Spinner, don't block upload of more files)

**Error (unsupported format):**
```
⚠️ strategy_memo.zip is not supported.
   Try PDF, DOCX, or TXT instead.
   
   [Dismiss]
```

**Error (too large):**
```
⚠️ quarterly_report.pdf is too large.
   Max 5MB. Try a smaller file.
   
   [Dismiss]
```

---

## 7. Accessibility Notes

### Color Contrast
- **WCAG AA minimum (4.5:1 for text):**
  - #FFFFFF on #0D1B2A = 18:1 ✓
  - #FFFFFF on #1A2E3E = 12:1 ✓
  - #1A73E8 on #0D1B2A = 4.8:1 ✓
  - #FACC15 (warning) on #0D1B2A = 5.2:1 ✓
  - #4ADE80 (success) on #0D1B2A = 8.1:1 ✓
  - #F0575A (danger) on #0D1B2A = 5.1:1 ✓
  - Disabled text (#6B7280 on #0D1B2A) = 3.1:1 ⚠️ (below AA, but only for disabled state; acceptable)

- **Icons + text:** Always pair color-coded badges with text labels (don't rely on color alone for status)
  - ✓ "🟡 Pending" not just "🟡"
  - ✓ "✓ Confirmed" not just color

---

### Keyboard Navigation

**Tab order (global):**
1. Client selector (if present)
2. "New" action button
3. Task/booking/trip cards (in DOM order)
4. Each card's expand/delete buttons
5. Filter chips (if present)

**Kanban board specific:**
- Tab through card headers (title + status)
- When focused on a card status dropdown:
  - Arrow keys to cycle through statuses
  - Enter to select
  - Escape to cancel
- Drag alternative: Focus card → Tab to "Move" action → Arrow keys to select destination column → Enter to move
  - _Question for you:_ Should we implement keyboard-only drag-drop, or is mouse drag sufficient? Drag is important for power users; keyboard can be awkward in Kanban UIs.

**Form specific:**
- Tab through all inputs (text, date, select)
- Submit button at end (Tab + Enter to submit)
- Escape to close modal and discard changes (with confirmation if data entered)

**Focus state:**
- 3px solid #1A73E8 outline, 2px offset
- Works on buttons, inputs, cards, any interactive element
- Visible in all color modes

---

### ARIA Labels & Semantics

**Buttons:**
- `aria-label` for icon-only buttons: `<button aria-label="Delete task">🗑</button>`
- Primary actions don't need aria-label if text is visible: `<button>Generate Draft</button>`

**Status badges:**
- Use `<span role="status" aria-label="Booking status: Pending">🟡 Pending</span>`
- Allows screen readers to announce status changes

**Kanban columns:**
- `<div role="region" aria-label="Pending bookings (5 items)">`
- When count changes, announce: `<div aria-live="polite" aria-atomic="true">5 bookings</div>`

**Empty states:**
- Heading with clear intent: `<h2>All set for today!</h2>`
- Not hidden from screen readers

**Modals:**
- `<dialog open>` semantics (or role="dialog")
- Focus moves to first focusable element on open
- Escape key closes
- Focus returns to trigger button on close

**Forms:**
- All inputs have `<label>` tags (not just placeholder)
- Error messages linked via `aria-describedby`
- Required fields marked: `<span aria-label="required">*</span>`

**Alt text / Captions:**
- Icons in headers: `<img alt="Docket icon" src="..."/>`
- Decorative icons (spacing, bullets): `aria-hidden="true"`
- Document thumbnails in upload shelf: `alt="PDF confirmation_number.pdf"` (descriptive)

---

### Focus Management

**On modal open:**
- Focus moves to first focusable element (usually the text input)
- Trap focus within modal (Tab wraps to close button, then back to first input)
- Escape key closes modal

**On list item delete:**
- Focus moves to next item in list, or empty state if list becomes empty
- Toast notification announced to screen reader

**On drag-drop completion:**
- Focus returns to the card that was moved (or the new column header if card is no longer visible)
- Announcement: "Booking moved to Confirmed status"

---

### Color-Blind Considerations

**Status indicators:**
- Never rely on color alone (already covered above with icons + labels)
- Consider pattern fill for status columns (optional, adds visual distinctness without relying on hue)
  - Pending: solid
  - Confirmed: light diagonal lines
  - Needs Followup: dotted
  - (Pattern fills are nice-to-have, not required)

---

## 8. Open Questions for Product / Eng

1. **Kanban on mobile:** Should we:
   - a) Show a single column at a time (scrollable picker at top)?
   - b) Horizontal scroll across all columns (current plan)?
   - c) Switch to a different view (list instead of Kanban)?

2. **Draft regeneration:** Does regenerating the same brief count as a new draft toward the 5/month limit? (My assumption: YES, each call is a billable API call. Confirm?)

3. **Timezone ambiguity:** When displaying "Tue, Sep 3 · 2:00 PM", should we always append the timezone? Or only if it differs from EA's configured timezone?
   - Example: EA in Manila, booking in Manila → just "2:00 PM"?
   - Example: EA in Manila, booking in NY → "2:00 PM (EDT)" / "1:00 AM (Manila)"?

4. **Keyboard drag-drop for Kanban:** Priority? If low, we can ship with mouse-only drag and add keyboard fallback in v1.1.

5. **Document shelf pagination:** If a trip has 100 uploaded documents, do we paginate the list or lazy-load? (My assumption: Lazy-load, show 20 on initial load, load more on scroll.)

6. **Trip segments beyond trip dates:** If EA adds a segment with dates outside the trip's start/end, warn or allow silently? (My assumption: Warn but allow.)

---

## Design System Maintenance

Once design is approved, create a living Figma file (or equivalent):
- **Components:** All reusable components with variants (state, size, status)
- **Patterns:** Empty states, loading states, error states
- **Tokens:** Color palette, type scale, spacing scale (as code variables + Figma variables)
- **Flows:** User journey maps for each feature (help devs understand context)
- **Handoff:** Link from Figma to code (e.g., "This button uses `--btn-primary` token")

---

## Summary

RunsDark's design is **operational clarity first**. No gradients, no floating blobs. Dark navy background + muted status colors. System fonts. Generous spacing. Fast, data-dense interfaces for EAs who don't have time to learn new tools.

Core principle: **Every pixel should ask, "Does this help the EA do their job faster?"** If not, delete it.
