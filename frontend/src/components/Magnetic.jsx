import { useRef, useState } from "react";

// A control that is gently attracted to the cursor while hovered, and springs
// back with a soft elastic when the pointer leaves. Subtle, tactile.
export default function Magnetic({ children, strength = 0.28, className = "", style, ...rest }) {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setOffset({
      x: (e.clientX - (rect.left + rect.width / 2)) * strength,
      y: (e.clientY - (rect.top + rect.height / 2)) * strength,
    });
  };
  const onLeave = () => setOffset({ x: 0, y: 0 });

  return (
    <button
      ref={ref}
      className={className}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: offset.x === 0 && offset.y === 0 ? "transform .5s var(--spring)" : "transform .06s linear",
        willChange: "transform",
        ...style,
      }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      {...rest}
    >
      {children}
    </button>
  );
}
