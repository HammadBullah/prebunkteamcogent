import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Landing from "./views/Landing";
import Play from "./views/Play";
import Results from "./views/Results";
import WordField from "./components/WordField";
import CursorDot from "./components/CursorDot";
import { apiBase, setApiBase, createSession, getPost, submitAnswer, getScore } from "./api";
import { useHeaderVisibility } from "./hooks.jsx";

export default function App() {
  const [view, setView] = useState("landing");
  const [apiURL, setApiURL] = useState(apiBase());
  const [roundLen, setRoundLen] = useState(10);

  const [sessionId, setSessionId] = useState(null);
  const [post, setPost] = useState(null);
  const [questionNum, setQuestionNum] = useState(0);
  const [liveCorrect, setLiveCorrect] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);

  const headerVisible = useHeaderVisibility();

  const handleStart = async (len) => {
    setRoundLen(len);
    setQuestionNum(0);
    setLiveCorrect(0);
    setScore(null);
    setView("play");
    window.scrollTo({ top: 0, behavior: "smooth" });
    await loadNext(null, len);
  };

  const loadNext = async (session = sessionId, len = roundLen) => {
    setLoading(true);
    setAnswered(false);
    setPost(null);
    try {
      let sid = session;
      if (!sid) {
        const s = await createSession();
        sid = s.session_id;
        setSessionId(sid);
      }
      const p = await getPost(sid);
      setPost(p);
      setQuestionNum((q) => (len && q + 1 > len ? q : q + 1));
      setLoading(false);
    } catch (e) {
      setLoading(false);
      setPost({ __err: e.message });
    }
  };

  const handleAnswer = async (catId) => {
    if (answered || !post?.post_id) return;
    setAnswered(true);
    setPost((prev) => ({ ...prev, _pick: catId }));
    try {
      const res = await submitAnswer({
        session_id: sessionId,
        post_id: post.post_id,
        selected_category: catId,
      });
      if (res.correct) setLiveCorrect((c) => c + 1);
      const correctName =
        (post.category_options || []).find((o) => o.id === res.correct_category)?.name ||
        res.correct_category;
      setPost((prev) => ({ ...prev, _answer: { ...res, correct_category_name: correctName } }));
    } catch (e) {
      setPost((prev) => ({
        ...prev,
        _answer: {
          correct: false, correct_category: "", correct_category_name: "…",
          explanation: "Couldn't submit your answer: " + e.message,
        },
      }));
    }
  };

  const handleFinish = async () => {
    try {
      setScore(await getScore(sessionId));
      setView("results");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setPost((prev) => ({ ...prev, __err: "Couldn't load your score: " + e.message }));
    }
  };

  const handleAgain = async () => {
    setSessionId(null);
    setQuestionNum(0);
    setLiveCorrect(0);
    setScore(null);
    setView("play");
    window.scrollTo({ top: 0, behavior: "smooth" });
    await loadNext(null, roundLen);
  };

  const handleHome = () => {
    setSessionId(null);
    setView("landing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const baseChange = (url) => {
    setApiURL(url);
    setApiBase(url);
  };

  const viewVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: 0.25 } },
  };

  return (
    <div className="app">
      <div className="grain" />
      <div className="base-field">
        <motion.div
          className="tint"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        />
      </div>
      {view === "landing" && <WordField />}
      <CursorDot />

      {/* Header — disappears on scroll down, returns on scroll up */}
      <motion.header className="header" initial={{ y: 0 }} animate={{ y: headerVisible || view === "landing" ? 0 : -110, opacity: headerVisible || view === "landing" ? 1 : 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
        <div className="header-inner">
          <div className="wordmark">
            prebunk<span className="dot">.</span>
            <small>media literacy</small>
          </div>
          <div className="hdr-right">
            {view === "landing" && (
              <>
                <button className="hdr-link" onClick={() => document.getElementById("techniques")?.scrollIntoView({ behavior: "smooth" })}>
                  Techniques
                </button>
                <button className="hdr-link" onClick={() => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })}>
                  How it works
                </button>
                <a className="hdr-link accent" href="#play" style={{ textDecoration: "none" }}>
                  Play →
                </a>
              </>
            )}
            {view !== "landing" && (
              <span className="hdr-link" style={{ cursor: "default" }}>Post {questionNum}/{roundLen}</span>
            )}
          </div>
        </div>
      </motion.header>

      <main className="wrap">
        <AnimatePresence mode="wait">
          {view === "landing" && (
            <motion.div key="landing" variants={viewVariants} initial="initial" animate="animate" exit="exit">
              <Landing apiBase={apiURL} setApiBase={baseChange} onStart={handleStart} />
            </motion.div>
          )}
          {view === "play" && (
            <motion.div key="play" variants={viewVariants} initial="initial" animate="animate" exit="exit">
              <Play
                post={post}
                questionNum={questionNum}
                roundLen={roundLen}
                liveCorrect={liveCorrect}
                answered={answered}
                loading={loading}
                errMsg={post?.__err}
                onAnswer={handleAnswer}
                onNext={() => loadNext()}
                onFinish={handleFinish}
              />
            </motion.div>
          )}
          {view === "results" && (
            <motion.div key="results" variants={viewVariants} initial="initial" animate="animate" exit="exit">
              <Results score={score} onAgain={handleAgain} onHome={handleHome} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
