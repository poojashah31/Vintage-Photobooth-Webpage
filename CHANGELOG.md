# Changelog

All notable changes to Vintage Photobooth are documented here.  
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.0.0] — 2026-02-27

### Added
- **StartPage** — vintage-style landing page with animated butterfly and corner decorations
- **LayoutSelection** — pick Classic Strip (3 photos), Quad Strip (4 photos), or Duo Strip (2 photos) in a responsive 3-col grid
- **CameraPage** — live camera feed via `getUserMedia`, 3-second countdown, 6 CSS photo filters (Original, Sepia, B&W, Vintage, Warm, Faded), file upload fallback when camera is unavailable
- **ResultsPage** — 320×960 px photo strip with draggable stickers, cursive notes, Save PNG (html2canvas 2× scale), and Print Strip
- **DraggableSticker** — drag (mouse + touch), pinch-to-zoom, ±scale buttons, Delete; keyboard: Arrow nudge, +/- scale, Delete
- **DraggableNote** — same interaction model as stickers; cursive font picker (6 fonts), 50-char limit, live font preview
- **useSessionPersistence** — versioned localStorage autosave (schema v1); restores `currentPage`, `selectedLayout`, `capturedImages`, `currentFilter` on reload
- **Web Share API** — "Share Strip" button on results page (falls back gracefully when API unavailable)
- **Per-page `<title>` updates** — descriptive browser tab titles on each navigation
- **ESLint + Prettier** — flat config, TypeScript + React rules
- **Vitest** — unit tests for `getCaptureCountForLayout` and session persistence helpers
- **ARIA** — `aria-label`, `aria-pressed`, `aria-busy`, `role`, `tabIndex`, `focus-visible:ring` across all interactive elements

### Fixed
- `html2canvas` was capturing the padding wrapper div instead of the strip itself
- Print CSS used `display:none` which also hid the nested strip; switched to `visibility:hidden` approach
- Download button was defined but never rendered in the UI
- Print CSS used a dynamic `stripRef.current ?` condition (always null at render) — replaced with static `.photo-strip-print` class
- `DraggableSticker` / `DraggableNote` event handlers lacked `useCallback` causing stale closure bugs in `useEffect` dependency arrays

### Technical
- Built with Vite + React 18 + TypeScript
- Styling: Tailwind CSS utility classes
- Animations: `motion/react` spring physics
- Assets: Figma-exported sticker PNGs bundled via Vite plugin
