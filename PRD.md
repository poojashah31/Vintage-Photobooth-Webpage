# Product Requirements Document — Vintage Photobooth Webpage

**Document Date:** February 24, 2026
**Status:** Active — v1.1 (updated from Feb 23 draft)

---

## Overview

**Product:** Vintage Photobooth Webpage — a lightweight, fully client-side web app that lets users capture or upload photos, pick a layout, decorate with stickers and handwritten notes, then download or print the final vintage-style photo strip.

**Repository Root:** Vite + React (TSX), no backend. Key source files:
- Entry: [`src/main.tsx`](src/main.tsx), [`src/App.tsx`](src/App.tsx)
- Pages: [`src/components/StartPage.tsx`](src/components/StartPage.tsx), [`src/components/LayoutSelection.tsx`](src/components/LayoutSelection.tsx), [`src/components/CameraPage.tsx`](src/components/CameraPage.tsx), [`src/components/ResultsPage.tsx`](src/components/ResultsPage.tsx)
- Decorations: [`src/components/DraggableSticker.tsx`](src/components/DraggableSticker.tsx), [`src/components/DraggableNote.tsx`](src/components/DraggableNote.tsx)
- Styles: [`src/styles/globals.css`](src/styles/globals.css), [`src/index.css`](src/index.css)

---

## Problem Statement & Opportunity

Users want a simple, playful web experience for creating vintage-style photo strips without installing any software. The app must require minimal onboarding, run in modern browsers (desktop & mobile), and produce shareable, download-ready or print-ready images — entirely in the browser.

---

## Goals & Success Metrics

- Ship MVP covering photo capture/upload, layout selection, sticker/note decoration, and image export.
- **KPIs:**
  - 80% of test users complete a photobooth collage within 2 minutes.
  - Exported PNGs render correctly across Chrome, Edge, and Safari (desktop & mobile).
  - Zero critical accessibility violations on core flows (Lighthouse/axe audit).

---

## User Personas

| Persona | Goal |
|---|---|
| **Casual Creator** | Quick, fun vintage strip for social sharing |
| **Event Organizer** | Stable in-browser booth for live events; values reliability |
| **Designer / Hobbyist** | Wants full control over layout, stickers, fonts, and note placement |

---

## Primary User Flows

### Flow 1 — Camera Capture
`StartPage` → `LayoutSelection` → `CameraPage` (grant camera, countdown capture) → `ResultsPage` (stickers + notes + export/print)

### Flow 2 — File Upload
`StartPage` → `LayoutSelection` → `CameraPage` (upload image fallback) → `ResultsPage`

### Navigation (Back)
Every page exposes a back button to return to the previous step; `ResultsPage` allows "Take New Photos" (back to camera) or "Start Over" (back to Start).

---

## MVP Feature List (Must-Have)

| # | Feature | Component(s) |
|---|---|---|
| 1 | Camera capture with countdown | [`CameraPage.tsx`](src/components/CameraPage.tsx) |
| 2 | File upload fallback | [`CameraPage.tsx`](src/components/CameraPage.tsx) |
| 3 | Layout selection (3 presets) | [`LayoutSelection.tsx`](src/components/LayoutSelection.tsx) |
| 4 | Draggable stickers (5 built-in) | [`DraggableSticker.tsx`](src/components/DraggableSticker.tsx) |
| 5 | Draggable text notes with font picker | [`DraggableNote.tsx`](src/components/DraggableNote.tsx) |
| 6 | Download PNG (html2canvas, 2× scale) | [`ResultsPage.tsx`](src/components/ResultsPage.tsx) |
| 7 | Print strip (window.print) | [`ResultsPage.tsx`](src/components/ResultsPage.tsx) |
| 8 | Responsive UI (mobile + desktop sidebar) | [`ResultsPage.tsx`](src/components/ResultsPage.tsx), [`index.css`](src/index.css) |

---

## Layout Presets

| Layout | Name | Poses | Strip Dimensions |
|---|---|---|---|
| A | Classic Strip | 3 | 6×2" |
| B | Quad Strip | 4 | 6×2" |
| C | Duo Strip | 2 | 6×2" |

---

## Sticker Library (v1)

Five Figma-sourced sticker assets available for placement on strips:
- Butterfly
- Hibiscus (Brown)
- Golden Flower
- Snoopy
- White Hibiscus

---

## Note / Font Picker

Users type a custom message (max 50 chars) and select from 5 cursive fonts:
`Pacifico`, `Tangerine`, `Great Vibes`, `Parisienne`, `Dancing Script`

---

## MVP Technical Requirements

- **Stack:** Vite, React 18 + TypeScript, vanilla/utility CSS (TailwindCSS class names via Vite config).
- **Camera API:** `MediaDevices.getUserMedia`; fallback to file upload on denial.
- **Image export:** `html2canvas` (lazy-loaded, `scale: 2`, `useCORS: true`) → PNG blob → auto-download.
- **Print:** `window.print()` with CSS `@media print` targeting the strip element.
- **State:** React component-level state in `App.tsx`; no external state library.
- **Animations:** `motion` (from `motion/react`) for spring-based sticker scale; CSS `animate-flip` for page transitions (800ms).
- **Assets:** Figma assets (`figma:asset/...`) resolved at build time via Vite plugin.
- **Persistence (optional):** `localStorage` autosave for in-progress collage.

---

## Non-Functional Requirements

- **Performance:** Initial page shell loads under 2s on simulated 3G; `html2canvas` imported lazily.
- **Privacy & Security:** All processing is 100% client-side — no images are sent to any server.
- **Accessibility:** ARIA labels on all interactive controls (camera trigger, sticker buttons, back buttons); keyboard navigation for major flows.
- **Cross-browser:** Chrome, Edge, Safari (mobile & desktop) are primary targets.

---

## Acceptance Criteria

| Feature | Acceptance Condition |
|---|---|
| Camera capture | User grants permission and captures ≥1 photo; captured image appears in editor |
| File upload | User uploads JPG/PNG; it appears in the layout without errors |
| Layout selection | Selecting A/B/C correctly sets the number of required captures (3/4/2) |
| Stickers | Stickers are draggable, scalable (pinch-to-zoom / zoom buttons), and deletable |
| Notes | Notes placed on strip are draggable, scalable, and deletable |
| Download | Exported PNG matches on-screen composition and downloads automatically |
| Print | `window.print()` shows only the photo strip |

---

## Nice-to-Have (Post-MVP)

- Web Share API integration (native mobile share sheet)
- Template / theme packs and custom color borders
- Higher-fidelity photo filters beyond current CSS filters
- Multi-page print layout and PDF export
- Cloud save/load (requires backend)
- Social sharing intents (Twitter, Instagram)

---

## Milestones & Sprint Plan

| Sprint | Deliverables |
|---|---|
| Sprint 1 | Core capture & upload, layout selection, basic results export |
| Sprint 2 | Draggable stickers & notes, responsive layout, accessibility pass |
| Sprint 3 | Polish, performance, cross-browser QA, optional autosave & sharing |

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Camera permission denied | Clear in-app guidance + file upload fallback |
| Large image → slow export | 2× downscale in html2canvas; future: user toggle for high-res |
| CORS sticker assets in html2canvas | `useCORS: true` + `allowTaint: true`; test in production build |
| Mobile layout/UX inconsistencies | Responsive tested on iOS Safari + Android Chrome |

---

## Testing & QA Plan

- **Unit tests:** Image composition helpers, capture count per layout.
- **Manual cross-browser matrix:** Chrome/Edge/Safari on desktop; Safari iOS and Chrome Android.
- **Accessibility audit:** Lighthouse + axe for core flows.
- **E2E smoke test:** Select layout → capture → add sticker → add note → save PNG.

---

## Open Questions

- Default export DPI / target print size for high-res option?
- Any required branding or watermark text on exported strips?
- Supported image formats beyond PNG/JPEG for upload?

---

*Generated from repository code scan on February 24, 2026.*
