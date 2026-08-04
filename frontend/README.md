# prebunk. — a media-literacy game (frontend)

A calm, confident, handcrafted React + Vite frontend for the Prebunk game. Designed to
feel like a premium product — minimal, elegant, and interactive — with a **single indigo
accent** against a light monochrome palette.

## Design language

- **Editorial typography** — Instrument Serif for display, Inter for body, JetBrains Mono
  for technical/labels. Oversized headlines, tight tracking, varied weights for rhythm.
- **Light monochrome + one accent.** No gradients-overuse, no neon, no generic glassmorphism.
  Depth comes from soft shadows, hairlines, fine grain texture, and layered background motion.
- **Progressive storytelling** — the landing page reveals itself as you scroll instead of
  dumping everything at once.
- **Restrained motion** — mask/curtain reveals, scale-into-place, a pinned "how it works"
  section, animated counters, 3D-tilting cards, magnetic buttons, and a cursor dot that
  appears only over interactive elements. Smooth easing curves throughout.

## Run it

```bash
# Terminal 1 — backend
cd ../backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000

# Terminal 2 — frontend
cd frontend
npm install
npm run dev
```

Open the printed URL, set the **Backend URL** to `http://127.0.0.1:8000` in the bottom
game section, and the status dot turns green when connected.

## Structure

```
src/
├── App.jsx            # header (hides on scroll), view switching, game state machine
├── api.js             # /health /session /post /answer /score wrapper
├── data.js            # techniques, how-it-works steps, stats, helpers
├── hooks.jsx          # mouse pos, tilt, header visibility, lerped mouse
├── styles.css         # the full design system
├── components/
│   ├── Magnetic.jsx   # cursor-attracted control
│   ├── Reveal.jsx     # mask/scale/fade reveals
│   ├── Counter.jsx    # animated metric counter
│   └── CursorDot.jsx  # subtle cursor follower
└── views/
    ├── Landing.jsx    # hero → statement → techniques → how-it-works → stats → CTA
    ├── Play.jsx       # two-column game screen
    └── Results.jsx    # big score + per-technique bars
```
