import { useEffect, useRef } from "react";

// A quiet background field of words that stay nearly invisible until the cursor
// roams nearby. As the cursor approaches, a word gently lights up — gaining
// opacity, tinting toward the accent, and nudging slightly larger — like a soft
// light source revealing what's hidden. Always subtle, never a distraction.

const WORDS = [
  "urgency","consensus","bias","doubt","influence","fear","credibility",
  "echo","angle","spin","authority","mass","pull","trust","amplify","tell",
  "frame","hype","seed","pressure","panic","weight","grain","motion",
  "shadow","pulse","signal","noise",
];

function seeded(i) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const COUNT = 60;
const RADIUS = 130;
const MAX = 0.5;
const BASE = 0.05;

// deterministic layout
const LAYOUT = Array.from({ length: COUNT }, (_, i) => ({
  x: 6 + seeded(i * 2) * 88,
  y: 8 + seeded(i * 2 + 1) * 84,
  rot: (seeded(i * 3) - 0.5) * 8,
}));

export default function WordField() {
  const containerRef = useRef(null);
  const glowRef = useRef(null);
  const wordEls = useRef([]);
  const mouse = useRef({ x: -9999, y: -9999 });
  const light = useRef({ x: -9999, y: -9999 });
  const inited = useRef(false);
  const size = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const r = container.getBoundingClientRect();
      size.current = { w: r.width, h: r.height };
      wordEls.current.forEach((el, i) => {
        const L = LAYOUT[i];
        if (!el || !L) return;
        el.style.left = L.x + "%";
        el.style.top = L.y + "%";
        el.style.transform = `translate(-50%,-50%) rotate(${L.rot.toFixed(1)}deg)`;
        el.dataset.cx = ((L.x / 100) * size.current.w + el.offsetWidth / 2).toFixed(1);
        el.dataset.cy = ((L.y / 100) * size.current.h + el.offsetHeight / 2).toFixed(1);
      });
    };
    measure();
    window.addEventListener("resize", measure);

    const onMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      // snap the light to the cursor on first move so it responds immediately
      if (!inited.current) {
        inited.current = true;
        light.current.x = e.clientX;
        light.current.y = e.clientY;
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    let raf;
    const tick = () => {
      light.current.x += (mouse.current.x - light.current.x) * 0.12;
      light.current.y += (mouse.current.y - light.current.y) * 0.12;
      const lx = light.current.x, ly = light.current.y;
      const glow = glowRef.current;
      if (glow) {
        glow.style.transform = `translate(${lx - 160}px, ${ly - 160}px)`;
        glow.style.opacity = mouse.current.x > -5000 ? "1" : "0";
      }

      // reveal words from the ACTUAL cursor position (CSS smooths the change)
      const mx = mouse.current.x, my = mouse.current.y;
      for (let i = 0; i < wordEls.current.length; i++) {
        const el = wordEls.current[i];
        if (!el || el.dataset.cx == null) continue;
        const dx = mx - parseFloat(el.dataset.cx);
        const dy = my - parseFloat(el.dataset.cy);
        const d = Math.sqrt(dx * dx + dy * dy);
        let t = 1 - d / RADIUS;
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        t = t * t * (3 - 2 * t); // smoothstep
        const opacity = BASE + (MAX - BASE) * t;
        const scale = 1 + 0.18 * t;
        const L = LAYOUT[i];
        el.style.opacity = opacity.toFixed(3);
        el.style.color = t > 0.01 ? "var(--accent)" : "";
        el.style.transform =
          `translate(-50%,-50%) rotate(${L.rot.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
        el.style.fontWeight = t > 0.5 ? "600" : "400";
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="wordfield" aria-hidden>
      <span ref={glowRef} className="wf-glow" />
      {LAYOUT.map((L, i) => (
        <span
          key={i}
          ref={(el) => { if (el) wordEls.current[i] = el; }}
          className="wf-word"
        >
          {WORDS[i % WORDS.length]}
        </span>
      ))}
    </div>
  );
}
