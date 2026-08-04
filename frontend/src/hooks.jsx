import { useCallback, useRef, useState, useEffect } from "react";

// Mouse position relative to the window (0..1).
export function useMousePos() {
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });
  const onMove = useCallback((e) => {
    setPos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
  }, []);
  return [pos, onMove];
}

// Smooth, spring-lagged mouse position for subtle parallax.
export function useLerpedMouse(maxLag = 0.1) {
  const target = useRef({ x: 0.5, y: 0.5 });
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });
  const raf = useRef();
  const onMove = useCallback((e) => {
    target.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
  }, []);
  if (!raf.current && typeof window !== "undefined") {
    const tick = () => {
      setPos((prev) => ({
        x: prev.x + (target.current.x - prev.x) * maxLag,
        y: prev.y + (target.current.y - prev.y) * maxLag,
      }));
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  return [pos, onMove];
}

// 3D tilt on hover.
export function useTilt(maxDeg = 7, maxShift = 8) {
  const ref = useRef(null);
  const frame = useRef();
  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.transform =
        `perspective(1100px) rotateX(${(-py * maxDeg).toFixed(2)}deg) rotateY(${(px * maxDeg).toFixed(2)}deg) translate(${(px * maxShift).toFixed(1)}px, ${(py * maxShift).toFixed(1)}px)`;
    });
  }, [maxDeg, maxShift]);
  const onLeave = useCallback(() => {
    cancelAnimationFrame(frame.current);
    const el = ref.current;
    if (el) el.style.transform = "perspective(1100px) rotateX(0deg) rotateY(0deg) translate(0,0)";
  }, []);
  return { ref, onMouseMove: onMove, onMouseLeave: onLeave };
}

export function Tilt({ children, className, maxDeg = 7, maxShift = 8, style }) {
  const { ref, onMouseMove, onMouseLeave } = useTilt(maxDeg, maxShift);
  return (
    <div
      ref={ref}
      className={className}
      style={{ transformStyle: "preserve-3d", willChange: "transform", transition: "transform .3s var(--ease)", ...style }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
}

// Whether the header should be visible given scroll position + direction.
export function useHeaderVisibility() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        // hide on scroll down after threshold, show on scroll up or near top
        setVisible(y < 60 || y < lastY);
        lastY = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return visible;
}
