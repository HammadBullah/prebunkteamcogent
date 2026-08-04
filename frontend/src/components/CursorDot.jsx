import { useEffect, useState } from "react";

// A small accent dot that follows the cursor and subtly scales up over
// interactive elements. Understated — present on hover, gone otherwise.
export default function CursorDot() {
  const [on, setOn] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      const target = e.target;
      setOn(!!(target && target.closest && target.closest("button, a, select, input, .tcard, .opt, .hiw-step")));
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      className={`cursor-dot${on ? " on" : ""}`}
      style={{
        transform: `translate(${pos.x - 3.5}px, ${pos.y - 3.5}px) scale(${on ? 2.2 : 1})`,
      }}
    />
  );
}
