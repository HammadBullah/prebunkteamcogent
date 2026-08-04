import { motion, AnimatePresence } from "framer-motion";
import { Tilt } from "../hooks.jsx";
import { fmtPct, userInfo, sharesFor, titleize } from "../data";

const EASE = [0.22, 1, 0.36, 1];
const optAnim = (i) => ({
  initial: { opacity: 0, scale: 0.97 },
  animate: { opacity: 1, scale: 1, transition: { delay: i * 0.05, duration: 0.5, ease: EASE } },
});

export default function Play({ post, questionNum, roundLen, liveCorrect, answered, onAnswer, onNext, onFinish, loading, errMsg }) {
  const info = post ? userInfo(post.post_id, post.language) : { name: "…", time: "now" };

  return (
    <div className="play">
      <div className="play-top">
        <div className="count">
          <small>Post {questionNum} of {roundLen}</small>
          {questionNum}
        </div>
        <div className="acc">
          Accuracy&nbsp; <b>{questionNum ? fmtPct(liveCorrect / questionNum) : "—"}</b>
        </div>
      </div>

      <div className="play-layout">
        <Tilt className="post" maxDeg={3} maxShift={4}>
          {!post && loading && (
            <div className="loading-cnt"><div className="spin" />Fetching next post</div>
          )}
          {!post && !loading && errMsg && <div className="error"><b>Couldn't load the post.</b>{errMsg}</div>}
          {post && (
            <>
              <div className="post-top">
                <div className="mono">{(post.text || "?").trim().charAt(0).toUpperCase()}</div>
                <div>
                  <div className="un">{info.name}</div>
                  <div className="h">{info.time} · Public</div>
                </div>
                <div className="more">···</div>
              </div>
              <div className="post-meta">
                <span className={`tag diff-${post.difficulty || "easy"}`}>{post.difficulty || "easy"}</span>
                <span className="tag">{post.type || "text"}</span>
                <span className="tag">{(post.language || "en").toUpperCase()}</span>
              </div>
              <div className="post-body">{post.text}</div>
              <div className="post-actions">
                <span>Reply</span><span>↻ {sharesFor(post.post_id)}</span><span>♡</span>
              </div>
            </>
          )}
        </Tilt>

        <div className="play-side">
          <motion.h2 className="question" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}>
            Which technique is <em>hiding here?</em>
          </motion.h2>

          <div className="opts">
            {(post?.category_options || []).map((opt, i) => {
              let cls = "opt";
              if (answered) {
                if (opt.id === post._answer?.correct_category) cls += " right";
                else if (opt.id === post._pick) cls += " wrong";
                else cls += " dim";
              }
              return (
                <motion.button
                  key={opt.id}
                  className={cls}
                  {...optAnim(i)}
                  disabled={answered}
                  whileHover={answered ? {} : { y: -2 }}
                  whileTap={answered ? {} : { scale: 0.98 }}
                  onClick={() => onAnswer(opt.id)}
                >
                  <span className="glyph">{opt.id.slice(0, 2)}</span>
                  <span className="name">{titleize(opt.id)}</span>
                  {answered && opt.id === post._answer?.correct_category && <span className="tick">✓</span>}
                  {answered && opt.id === post._pick && opt.id !== post._answer?.correct_category && (
                    <span className="cross">✕</span>
                  )}
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {answered && post?._answer && (
              <motion.div className="feedback" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: EASE }}>
                <div className={`stamp ${post._answer.correct ? "ok" : "bad"}`}>
                  {post._answer.correct ? "Spotted it." : "Missed it."}
                  <em> — {post._answer.correct_category_name}</em>
                </div>
                <p className="expl">{post._answer.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {!answered && (
            <div className="end-row">
              <button className="btn ghost sm" onClick={onFinish}>End round &amp; see results</button>
            </div>
          )}

          {answered && (
            <div className="next-wrap">
              <motion.button className="btn primary" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} onClick={onFinish}>
                {questionNum >= roundLen ? "See results" : "Next post"} <span className="arr">→</span>
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
