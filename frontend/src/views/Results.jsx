import { motion } from "framer-motion";
import { fmtPct } from "../data";

const EASE = [0.22, 1, 0.36, 1];

export default function Results({ score, onAgain, onHome }) {
  const pct = score?.overall_accuracy ?? 0;
  const pctInt = Math.round(pct * 100);
  const isGreat = pct >= 0.8;

  return (
    <div className="results">
      <div className="results-inner">
        <motion.div className="results-title" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
          That's a wrap{isGreat ? "." : "."}
        </motion.div>
        <motion.p className="results-sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.1 }}>
          {isGreat
            ? "Sharp eyes — you're reading the room like a professional."
            : "Every technique you learn makes you harder to fool. Here's your map."}
        </motion.p>

        <div className="results-grid">
          <div className="score">
            <motion.div className="big" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 120, damping: 18 }}>
              {pctInt}<span>%</span>
            </motion.div>
            <div className="lbl">overall accuracy</div>
            <motion.div className="stats" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
              <div><b>{score?.total_correct ?? 0}</b><span>correct</span></div>
              <div><b>{score?.total_answered ?? 0}</b><span>answered</span></div>
            </motion.div>
          </div>

          <div className="cats">
            {(score?.by_category || []).map((c, i) => {
              const acc = c.accuracy == null ? 0 : c.accuracy;
              const top = (score?.by_category || []).length > 0 && c.accuracy != null &&
                c.accuracy === Math.max(...(score?.by_category || []).map((x) => x.accuracy ?? -1));
              return (
                <motion.div
                  key={c.category_id}
                  className="catrow"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0, transition: { delay: 0.15 + i * 0.06, duration: 0.5, ease: EASE } }}
                >
                  <div className="top">
                    <span className="nm">{c.category_name}</span>
                    <span className="acc">{c.correct}/{c.wrong} · {c.accuracy == null ? "not yet" : fmtPct(c.accuracy)}</span>
                  </div>
                  <div className="bar">
                    <motion.i
                      style={top ? { background: "var(--accent)" } : {}}
                      initial={{ width: 0 }}
                      animate={{ width: `${acc * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.2 + i * 0.06, ease: EASE }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="results-actions">
          <button className="btn primary" onClick={onAgain}>Play again <span className="arr">→</span></button>
          <button className="btn ghost" onClick={onHome}>Back to home</button>
        </div>
      </div>
    </div>
  );
}
