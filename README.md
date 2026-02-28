# Vintage Photobooth Webpage

A lightweight, fully client-side web app that lets users capture or upload photos, pick a layout, decorate with stickers and handwritten notes, then download or print the final vintage-style photo strip — all in the browser.

---

## Tech Stack

- **Vite** + **React 18** + **TypeScript**
- **TailwindCSS** utility classes
- **motion/react** — spring-based sticker animations
- **html2canvas** — client-side PNG export
- **lucide-react** — icons

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- npm v9+

### Install & Run

```bash
# 1. Install dependencies
npm install

# 2. Start the development server (opens at http://localhost:3000)
npm run dev
```

### Production Build

```bash
npm run build
```

Output goes to the `build/` directory.

---

## Camera Permissions

The app uses `navigator.mediaDevices.getUserMedia` to access your camera.

- **Chrome / Edge:** Click the camera icon 🎥 in the address bar → Allow
- **Firefox:** Click the lock icon 🔒 → Permissions → Camera → Allow
- **Safari:** Safari menu → Settings for This Website → Camera → Allow
- **No camera?** The app will show a clear error with a file-upload fallback option.

> ⚠️ Camera access requires HTTPS or `localhost`. It will not work over plain HTTP on a remote host.

---

## Supported Features

| Feature | Details |
|---|---|
| Camera capture | Countdown timer (3s), live CSS filters, mirror preview |
| File upload fallback | Upload JPG or PNG when camera is unavailable |
| Layout selection | Classic (3 photos), Quad (4 photos), Duo (2 photos) |
| Draggable stickers | 5 built-in stickers, pinch-to-zoom, zoom buttons, delete |
| Draggable notes | Custom text (max 50 chars), 5 cursive font choices |
| Download PNG | Exports strip at 2× resolution via html2canvas |
| Print | `window.print()` — hides all UI except the photo strip |

---

## Supported File Formats

- **Upload:** JPG / PNG
- **Export:** PNG (auto-downloaded as `photobooth-strip-<timestamp>.png`)

> WEBP upload may work in modern browsers but is not officially tested in v1.0.

---

## Export Notes

- Exported PNGs are generated at 2× screen resolution for sharpness.
- No custom DPI setting is available in v1.0 — print size is determined by the browser.
- No watermarks or branding are added to exported strips in v1.0.

---

## Project Structure

```
src/
├── App.tsx                   # Root — global state & page routing
├── components/
│   ├── StartPage.tsx         # Landing page
│   ├── LayoutSelection.tsx   # Layout picker (A/B/C)
│   ├── CameraPage.tsx        # Camera capture & file upload
│   ├── ResultsPage.tsx       # Strip, stickers, notes, export
│   ├── DraggableSticker.tsx  # Draggable + scalable sticker
│   └── DraggableNote.tsx     # Draggable + scalable text note
├── styles/
│   └── globals.css           # CSS variables, animations, Google Fonts
└── assets/                   # Sticker PNG assets (resolved by Vite)
```

---

## References

- [PRD.md](PRD.md) — Product requirements and acceptance criteria
- [DESIGN.md](DESIGN.md) — Architecture, component design, styling
- [todo.md](todo.md) — Development phase checklist
