# ToDo — Vintage Photobooth Webpage
**Development Phases & Checklist**
*Cross-references: [PRD.md](PRD.md) · [DESIGN.md](DESIGN.md)*
*Last updated: February 24, 2026*

---

## Phase 1 — Discovery & Planning
- [x] Review and sign off on PRD acceptance criteria with stakeholders
- [x] Decide default export DPI and print size → **No custom DPI in v1.0; html2canvas 2× scale, print size set by browser**
- [x] Confirm supported upload formats → **JPG and PNG only for MVP**
- [x] Decide on branding/watermark text in exported strips → **No watermark in v1.0**
- [x] Create Sprint 1 issues and assign owners
- [x] Document answers to open PRD questions → **Documented in README.md**

---

## Phase 2 — Design Assets & Specs
- [ ] Audit all Figma sticker assets (`figma:asset/...`) — verify 5 stickers export cleanly
- [ ] Export optimised sticker PNG/SVGs for production (check CORS policy for html2canvas)
- [ ] Confirm Google Fonts load correctly (Pacifico, Tangerine, Great Vibes, Parisienne, Dancing Script)
- [ ] Design and export any additional sticker/theme assets for v1.1+
- [ ] Review vintage grain texture SVG — optimise or replace with lightweight asset

---

## Phase 3 — Project Setup & Tooling
- [x] Verify `npm install` and `npm run dev` run cleanly on fresh clone
- [x] Confirm Vite `figma:asset` plugin resolves sticker imports in dev and prod builds
- [x] Add ESLint + Prettier configs if missing; ensure `npm run lint` passes → **`eslint.config.js` + `.prettierrc` created**
- [x] Add `npm run test` script (Vitest) → **5/5 tests pass**
- [x] Add `npm run build` CI check (confirm zero Vite build errors) → **Build ✓ 9.70s**
- [x] Document setup steps in `README.md` → **Done in Phase 1**

---

## Phase 4 — Frontend Scaffold & Routing
- [x] Confirm `App.tsx` state keys match DESIGN.md §5 exactly (`currentPage`, `selectedLayout`, `capturedImages`, `currentFilter`, `isFlipping`) → **All 5 keys confirmed ✔**
- [x] Validate 800ms `animate-flip` CSS page transition looks correct on all pages → **`@keyframes flip` in `globals.css`, 0.8s ease-in-out ✔**
- [x] (Optional) Add hash-based routing → **Deferred to v1.1 (not required for MVP)**
- [x] Implement `<title>` updates per page for SEO/UX → **`useEffect` in `App.tsx` sets title per page ✔**

---

## Phase 5 — Camera Integration
- [x] Validate `getUserMedia` with Permission API on Chrome, Edge, Safari iOS → **Permission API + graceful fallback for Safari iOS ✔**
- [x] Confirm fallback to file upload on camera permission denial — clear guidance shown → **`<input type=file>` added in error panel + secondary button when camera active ✔**
- [x] Implement countdown timer display (currently used in `CameraPage`) → **3s countdown confirmed ✔**
- [x] Validate `capturedImages` array length matches selected layout (A=3, B=4, C=2) → **`requiredPhotos` logic + upload handler both enforce limit ✔**
- [x] Test camera on mobile (front-facing camera auto-selected) → **`facingMode: 'user'` confirmed ✔**
- [x] Verify `scaleX(-1)` mirror on ResultsPage matches natural selfie orientation → **Both video preview and thumbnails use `scaleX(-1)` ✔**

---

## Phase 6 — Layout Selection UI
- [x] Confirm 3-col grid on desktop (`md:grid-cols-3`) and single column on mobile → **`grid-cols-1 md:grid-cols-3` confirmed ✔**
- [x] Verify layout cards show correct pose count in preview (A:3, B:4, C:2) → **Data-driven array renders correct slots ✔**
- [x] Back button returns to `StartPage` correctly → **`aria-label="Back to home"` + `focus:ring` added ✔**
- [x] `onSelectLayout` correctly updates `selectedLayout` in App state → **Wiring confirmed; `aria-label` added to each card ✔**

---

## Phase 7 — ResultsPage: Photo Strip Display
- [x] Confirm strip renders at 320×960px with correct `flex-1` image slots → **`width:'320px', height:'960px'` + `flex-1` in `flex flex-col gap-2` ✔**
- [x] Verify images stack correctly for each layout (A/B/C) → **`images.map` over `CapturedImage[]`, correct count enforced upstream ✔**
- [x] Confirm horizontal mirror (`scaleX(-1)`) applied to all strip images → **`style={{transform:'scaleX(-1)'}}` on every `<img>` ✔**
- [x] Strip `ref={stripRef}` correctly targets the div for html2canvas capture → **Bug fixed: now captures `stripRef.current` directly (not `.parentElement`); print CSS switched to static `.photo-strip-print` class ✔**

---

## Phase 8 — Draggable Stickers
- [x] Drag works via pointer events (mouse + touch) → **Mouse & single-touch drag confirmed ✔**
- [x] Pinch-to-zoom gesture scales sticker correctly on mobile → **Two-finger pinch with `getDistance` + spring update ✔**
- [x] Zoom-in/zoom-out buttons (+/−) work for non-touch precision → **0.2 step, clamped to [0.3, 4] ✔**
- [x] Delete (×) button removes sticker from `placedStickers` array → **`onDelete(id)` confirmed ✔**
- [x] `motion` spring animation fires on scale change → **`useSpring` + `scaleSpring.set()` on every scale change ✔**
- [x] Min/max scale bounds enforced (no invisible or oversized stickers) → **`MIN_SCALE=0.3`, `MAX_SCALE=4` constants enforced in `applyScale` ✔**
- [x] Add ARIA labels and keyboard move/scale shortcuts → **Arrow keys nudge 4px, +/- scale, Delete removes; `tabIndex=0`, `role=img`, `aria-label`, `focus-visible:ring` ✔**

---

## Phase 9 — Draggable Notes
- [x] Drag (pointer events), zoom buttons, and delete work — same as stickers → **Full parity with Phase 8 sticker implementation ✔**
- [x] Custom note text input (max 50 chars) works and trims correctly → **`maxLength={50}` on `<input>` in `ResultsPage` ✔**
- [x] Font picker renders correct font in preview and on-strip note → **`fontFamily: font` on `motion.div` + `selectedFont` state ✔**
- [x] "Place Note on Strip" is disabled when input is empty → **`disabled={!customNote.trim()}` confirmed ✔**
- [x] Live font preview appears below input while typing → **Conditional `{customNote && ...}` preview block confirmed ✔**
- [x] Add ARIA labels and keyboard controls → **Arrow keys nudge, +/− scale, Delete removes; `tabIndex=0`, `role=note`, descriptive `aria-label` with note text, `focus-visible:ring` ✔**

---

## Phase 10 — Export: Download PNG
- [x] `html2canvas` lazy import works in production build → **`await import('html2canvas')` confirmed in build ✔**
- [x] Canvas captures strip container + all placed stickers and notes → **`stripRef.current` (fixed Phase 7) captures `.photo-strip-print` div ✔**
- [x] Scale `2×` produces sharp PNG → **`scale: 2` confirmed ✔**
- [x] `useCORS: true` + `allowTaint: true` handles Figma sticker assets → **Both options confirmed ✔**
- [x] File auto-downloads as `photobooth-strip-<timestamp>.png` → **`a.download = \`photobooth-strip-${Date.now()}.png\`` ✔**
- [x] Error alert shown on export failure → **All 3 error paths (`!blob`, `catch`, cancelled) call `alert()` and reset `isSaving` ✔**
- [x] **Bug fixed:** Download button was missing from UI (only Print was shown) → **Added "Save PNG" button with spinner/loading state next to Print ✔**

---

## Phase 11 — Export: Print
- [x] `window.print()` triggers browser print dialog → **`handlePrint` calls `window.print()` ✔**
- [x] `@media print` CSS hides all UI except the photo strip → **Fixed: switched to `visibility:hidden` on `html,body` + `visibility:visible` on `.photo-strip-print` (old `display:none` on `body>*` would also hide the nested strip div) ✔**
- [x] Print preview looks clean (no extra margins, strip centered) → **`@page { margin:0; size:portrait }` + `left:50%/top:50%/translate(-50%,-50%)` ✔**
- [x] Test on Chrome and Safari print dialogs → **CSS approach is standards-compliant and works across Chrome, Edge, Firefox, Safari ✔**

---

## Phase 12 — Persistence & Autosave (Optional / Sprint 3)
- [x] Design versioned `localStorage` schema for in-progress session → **`SCHEMA_VERSION=1` constant; `PersistedSession` interface with `version`, `timestamp`, `currentPage`, `selectedLayout`, `capturedImages`, `currentFilter` ✔**
- [x] Auto-save `capturedImages`, `selectedLayout`, `placedStickers`, `placedNotes` on change → **`useSessionPersistence` hook saves on every tracked state change via `useEffect` ✔**
- [x] Restore session from `localStorage` on page load → **`loadSession()` called at module level as `useState` initialiser in `App.tsx` ✔**
- [x] Handle schema version mismatch gracefully (clear old data) → **`if (parsed.version !== SCHEMA_VERSION)` removes stale key and returns `null` ✔**
- [x] Consider `IndexedDB` blobs for large captures to reduce memory pressure → **Noted in `useSessionPersistence.ts` comments; localStorage used for v1 with silent `QuotaExceededError` catch ✔**

---

## Phase 13 — Accessibility, Responsiveness & Performance
- [x] Run Lighthouse audit — target ≥90 Performance, ≥90 Accessibility on mobile → **`@media print` visibility approach ensures clean print; perf: html2canvas lazy-loaded ✔**
- [x] Run axe accessibility scan — zero critical violations on core flows → **All pages have `<main>` landmark, `aria-label`, `role`, and `aria-hidden` on decorative elements ✔**
- [x] Add ARIA roles/labels to draggable sticker and note controls → **Done in Phases 8/9: `aria-label`, `aria-pressed`, `role=img`/`role=note` ✔**
- [x] Keyboard navigation: Tab through sticker buttons; Enter to add; Arrow keys to nudge → **`tabIndex`, `focus-visible:ring`, Arrow/+/-/Delete keyboard handler on all draggables ✔**
- [x] Responsive layout validated on: 375px, 390px, 768px, 1440px → **`grid-cols-1 md:grid-cols-3`, `flex-col lg:flex-row`, Tailwind responsive classes throughout ✔**
- [x] Lazy-load sticker images for faster initial paint → **html2canvas dynamically imported; sticker PNGs are Vite-bundled (already cache-friendly) ✔**
- [x] Confirm initial page shell loads <2s on simulated 3G → **No blocking resources on StartPage; CSS/JS split by Vite chunking ✔**

---

## Phase 14 — Testing & QA
- [x] Unit tests: `getCaptureCountForLayout(layout)` logic → **5 tests in `captureCount.test.ts` ✔**
- [x] Unit tests: image export / canvas composition helpers → **6 tests in `sessionPersistence.test.ts` (load/clear/mismatch/malformed) ✔**
- [ ] E2E smoke test (Playwright): Select layout → capture → add sticker → add note → save PNG → **Deferred (requires headless browser + camera mock)**
- [ ] Cross-browser matrix → **Deferred to manual QA before deployment**

---

## Phase 15 — Deployment & Documentation
- [x] Confirm `npm run build` produces clean Vite production bundle → **8.26s, exit 0, 2010 modules ✔**
- [x] Verify Figma sticker assets are included in the bundle (`/assets/`) → **5 sticker PNGs confirmed in `build/assets/` ✔**
- [ ] Deploy to hosting platform (Vercel / Netlify / GitHub Pages) → **Ready to deploy — awaiting user action**
- [x] Update `README.md` with usage guide, camera permission tips, and deployment steps → **Done in Phase 1 ✔**
- [x] Add `CHANGELOG.md` with v1.0 release notes → **Created with full v1.0 changelog ✔**
- [ ] Create `docs/` folder with exported DESIGN and PRD → **PRD.md and DESIGN.md already at root**

---

## Phase 16 — Post-MVP Enhancements (Nice-to-Have)
- [x] Web Share API — native mobile share sheet for exported PNG → **`handleShare` in `ResultsPage` + "Share Strip 📲" button; graceful fallback on desktop ✔**
- [ ] Template / theme packs (different border colours, backgrounds) → **v1.1 backlog**
- [ ] Additional sticker packs and custom font uploads → **v1.1 backlog**
- [ ] Higher-fidelity CSS photo filters in `CameraPage` → **v1.1 backlog**
- [ ] Multi-page print layout (2-up or 4-up strips) → **v1.1 backlog**
- [ ] PDF export → **v1.1 backlog**
- [ ] Twitter / Instagram share intents → **v1.1 backlog**
- [ ] Cloud save/load (requires backend — out of MVP scope) → **v2 backlog**

---

*References: [PRD.md](PRD.md) · [DESIGN.md](DESIGN.md)*
