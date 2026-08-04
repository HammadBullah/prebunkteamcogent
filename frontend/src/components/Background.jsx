import { motion } from "framer-motion";

// Fixed full-screen animated aurora layer behind all content. Soft glowing
// blobs drift slowly and gently scale, giving the page a living, cinematic
// background that the glass cards sit on top of.
const BLOBS = [
  { color: "rgba(255,93,177,.32)", size: 560, top: "-12%",  left: "-10%", x: 60,  y: 40,  dur: 19, delay: 0 },
  { color: "rgba(169,107,255,.28)", size: 680, top: "22%",  left: "68%",  x: -60, y: -30, dur: 23, delay: 2 },
  { color: "rgba(75,214,255,.22)", size: 500, bottom: "-14%", left: "6%", x: 40,  y: -46, dur: 21, delay: 1 },
  { color: "rgba(255,209,102,.16)", size: 460, top: "58%",  left: "-8%", x: 50,  y: 36,  dur: 26, delay: 3 },
  { color: "rgba(46,230,184,.16)", size: 380, top: "8%",   left: "40%", x: 30,  y: 50,  dur: 24, delay: 4 },
];

export default function Background() {
  return (
    <div className="bg" aria-hidden>
      <div className="bg-base" />
      {BLOBS.map((b, i) => (
        <motion.div
          key={i}
          className="blob"
          style={{
            width: b.size,
            height: b.size,
            top: b.top,
            left: b.left,
            bottom: b.bottom,
            background: `radial-gradient(circle, ${b.color}, transparent 68%)`,
          }}
          animate={{ x: [0, b.x, 0], y: [0, b.y, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: b.dur, delay: b.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
