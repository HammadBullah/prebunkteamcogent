import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { Tilt } from "../hooks.jsx";
import Magnetic from "../components/Magnetic";
import { Reveal, ScaleIn } from "../components/Reveal";
import Counter from "../components/Counter";
import { health } from "../api";
import { TECHNIQUES, HOW_IT_WORKS, STATS } from "../data";

/* ---------------- HERO ---------------- */
function Hero() {
  // MotionValues (not plain state) so useTransform/useSpring work correctly.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(useTransform(mx, (v) => v * 14), { stiffness: 60, damping: 20 });
  const py = useSpring(useTransform(my, (v) => v * 14), { stiffness: 60, damping: 20 });

  const onMouseMove = (e) => {
    mx.set(e.clientX / window.innerWidth - 0.5);
    my.set(e.clientY / window.innerHeight - 0.5);
  };

  return (
    <section className="hero" onMouseMove={onMouseMove} style={{ position: "relative" }}>
      <motion.div style={{ x: px, y: py }}>
        <div className="eyebrow">A media-literacy game</div>
        <h1>
          <span className="mask"><span>Don't believe</span></span>
          <span className="mask"><span>everything <em>you read.</em></span></span>
        </h1>
        <p className="lede">
          Disinformation works because it feels right. <strong>Prebunk</strong> trains you to
          see the manipulation hiding inside a post — before it moves you.
        </p>
        <div className="actions">
          <a className="btn primary" href="#play" style={{ textDecoration: "none" }}>
            Begin the game <span className="arr">→</span>
          </a>
          <a className="btn ghost" href="#how" style={{ textDecoration: "none" }}>
            How it works
          </a>
        </div>
        <div className="meta-line">
          <div><b>{STATS[0].val}+</b> posts</div>
          <div><b>{STATS[1].val}</b> techniques</div>
          <div><b>{STATS[2].val}</b> languages</div>
        </div>
      </motion.div>
      <div className="scroll-cue"><span>Scroll</span><span className="line" /></div>
    </section>
  );
}

/* ---------------- STATEMENT (scroll-linked) ---------------- */
function Statement() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const ink = useSpring(scrollYProgress, { stiffness: 70, damping: 24 });
  const opacity = useTransform(ink, [0.1, 0.6], [0.25, 1]);
  // interpolate between two real hex colors (no CSS var → no runtime crash)
  const accentColor = useTransform(ink, [0.4, 0.85], ["#16151a", "#4f46e5"]);

  return (
    <section ref={ref} className="statement">
      <motion.p style={{ opacity }}>
        Most people don't fall for misinformation — they{" "}
        <motion.em style={{ color: accentColor }} className="hl">
          get moved
        </motion.em>{" "}
        before they think.
      </motion.p>
      <div className="src">— the premise of prebunking</div>
    </section>
  );
}

/* ---------------- TECHNIQUES ---------------- */
function Techniques() {
  return (
    <section className="section" id="techniques">
      <Reveal>
        <div className="slabel"><span>The six tells</span><span className="idx">01</span></div>
      </Reveal>
      <div className="techniques-grid">
        {TECHNIQUES.map((t, i) => (
          <ScaleIn key={t.id} delay={i * 0.05}>
            <Tilt className="tcard" maxDeg={4} maxShift={5}>
              <div className="tnum">
                <span>{String(i + 1).padStart(2, "0")}</span>
                <span className="glyph">{t.glyph}</span>
              </div>
              <h3>{t.title}</h3>
              <p className="ds">{t.desc}</p>
              <div className="tagline">{t.tagline}</div>
            </Tilt>
          </ScaleIn>
        ))}
      </div>
    </section>
  );
}

/* ---------------- HOW IT WORKS (pinned scroll) ---------------- */
function HowItWorks() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const stepIndex = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [0, 1, 2, 3]);
  const bgX = useTransform(scrollYProgress, [0, 1], ["2%", "-18%"]);
  const bgY = useSpring(bgX, { stiffness: 40, damping: 20 });
  const leftOpacity = useTransform(stepIndex, (s) => (Math.floor(s) === 0 ? 1 : 0.25));

  return (
    <section ref={ref} className="hiw" id="how">
      <div className="hiw-pin">
        <motion.div className="bg-word" style={{ x: bgY }}>prebunk</motion.div>
        <div className="hiw-inner">
          <motion.div className="hiw-left">
            <motion.div style={{ opacity: leftOpacity }}>
              <div className="stepnum">Step 01</div>
              <h2>Read the post.</h2>
              <p>You're shown a realistic, AI-generated social post — just like one you'd see in your feed.</p>
            </motion.div>
          </motion.div>
          <div className="hiw-right">
            {HOW_IT_WORKS.map((s, i) => (
              <StepRow key={s.n} s={s} i={i} stepIndex={stepIndex} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepRow({ s, i, stepIndex }) {
  const active = useTransform(stepIndex, (v) => v >= i + 1 && v < i + 2 ? true : v >= 3 && i === 2);
  return (
    <motion.div className="hiw-step" animate={{ opacity: 1 }} whileHover={{ x: 4 }}>
      <span className="n">{s.n}</span>
      <div>
        <h4>{s.title}</h4>
        <p>{s.body}</p>
      </div>
    </motion.div>
  );
}

/* ---------------- STATS ---------------- */
function Stats() {
  return (
    <section className="section">
      <Reveal>
        <div className="slabel"><span>The toolkit</span><span className="idx">02</span></div>
      </Reveal>
      <div className="stats-grid">
        {STATS.map((s, i) => (
          <ScaleIn key={s.label} delay={i * 0.06}>
            <div className="stat">
              <div className="val"><Counter to={s.val} />{s.suffix && <span>{s.suffix}</span>}</div>
              <div className="lbl">{s.label}</div>
              <div className="sub">{s.sub}</div>
            </div>
          </ScaleIn>
        ))}
      </div>
    </section>
  );
}

/* ---------------- CTA / game entry ---------------- */
function CTA({ apiBase, setApiBase, onStart, status, error }) {
  const [roundLen, setRoundLen] = useState(10);
  return (
    <section className="cta" id="play">
      <ScaleIn>
        <div className="cta-card">
          <h2>Ready to spot<br />what's moving you?</h2>
          <p>Choose how long a round you want. Each session adapts to the techniques you get wrong.</p>
          <div className="cta-row">
            <div className="settings">
              <label className="field">
                <span className="k">Posts per round</span>
                <select value={roundLen} onChange={(e) => setRoundLen(+e.target.value)}>
                  {[5, 10, 15, 20].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>
              <label className="field">
                <span className="k">Backend URL</span>
                <input
                  value={apiBase}
                  onChange={(e) => setApiBase(e.target.value)}
                  placeholder="http://127.0.0.1:8000"
                />
              </label>
            </div>
            <Magnetic className="btn primary" disabled={status !== "online"} onClick={() => onStart(roundLen)}>
              Begin <span className="arr">→</span>
            </Magnetic>
          </div>
          <div className="status-row">
            <span className={`dot ${status}`} />
            <span>
              {status === "online" ? "Backend connected · ready to play"
                : status === "loading" ? "Connecting to backend…"
                : "Backend not reachable"}
            </span>
          </div>
          {error && (
            <div className="error">
              <b>Can't reach the backend.</b> Make sure your friend's server is running
              (<code>uvicorn app.main:app --reload</code>) and the URL above points to it.
            </div>
          )}
        </div>
      </ScaleIn>
    </section>
  );
}

/* ---------------- LANDING ---------------- */
export default function Landing({ apiBase, setApiBase, onStart }) {
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(false);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        await health();
        if (live) { setStatus("online"); setError(false); }
      } catch (_) {
        if (live) { setStatus("offline"); setError(true); }
      }
    })();
    return () => { live = false; };
  }, [apiBase]);

  return (
    <div className="landing">
      <Hero />
      <Statement />
      <Techniques />
      <HowItWorks />
      <Stats />
      <CTA apiBase={apiBase} setApiBase={setApiBase} onStart={onStart} status={status} error={error} />
    </div>
  );
}
