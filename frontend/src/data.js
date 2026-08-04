// Content + display metadata for the six techniques.

export const TECHNIQUES = [
  {
    id: "false_urgency",
    glyph: "⏱",
    title: "False Urgency",
    desc: "Pressure to act or share instantly, before you can think.",
    tagline: "The countdown that isn't",
  },
  {
    id: "fake_authority",
    glyph: "◎",
    title: "Fake Authority",
    desc: "Borrowed credibility — vague experts, invented titles, unnamed insiders.",
    tagline: "Trust borrowed, never earned",
  },
  {
    id: "emotional_bait",
    glyph: "✳",
    title: "Emotional Bait",
    desc: "Content engineered to trigger a strong reaction before reasoning kicks in.",
    tagline: "Feel first, think never",
  },
  {
    id: "fake_consensus",
    glyph: "≈",
    title: "Fake Consensus",
    desc: "“Everyone already believes this” — social pressure standing in for truth.",
    tagline: "Popularity posing as proof",
  },
  {
    id: "misleading_stats",
    glyph: "‰",
    title: "Misleading Stats",
    desc: "Real-sounding numbers presented without context, baseline, or source.",
    tagline: "Accurate, and still a lie",
  },
  {
    id: "ai_content_cues",
    glyph: "∿",
    title: "AI Content Cues",
    desc: "The subtle tells that an image, voice, or video was generated or altered.",
    tagline: "Six fingers, no shadows",
  },
];

export const TECH = Object.fromEntries(TECHNIQUES.map((t) => [t.id, t]));

export const CAT_META = Object.fromEntries(TECHNIQUES.map((t) => [t.id, t.desc]));

export const HOW_IT_WORKS = [
  {
    n: "01",
    title: "Read the post",
    body: "You're shown a realistic, AI-generated social post — just like one you'd see in your feed.",
  },
  {
    n: "02",
    title: "Spot the tell",
    body: "Choose which of the six manipulation techniques it's hiding. Trust your instinct, then commit.",
  },
  {
    n: "03",
    title: "Learn the why",
    body: "Get an instant, plain-English explanation. The game adapts to the techniques you struggle with.",
  },
];

export const STATS = [
  { val: 30, suffix: "+", label: "hand-crafted posts", sub: "synthetic · never real news" },
  { val: 6, suffix: "", label: "techniques to master", sub: "from urgency to AI cues" },
  { val: 2, suffix: "", label: "languages", sub: "English & Hinglish" },
  { val: 100, suffix: "%", label: "adaptive difficulty", sub: "learns your weak spots" },
];

export function titleize(id) {
  const t = TECH[id];
  return t ? t.title : id.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
}

export function fmtPct(x) {
  return x == null ? "—" : Math.round(x * 100) + "%";
}

export function userInfo(postId, lang) {
  const names = lang && lang.startsWith("hi")
    ? ["Rakesh", "Sunita", "Mohit", "Pooja", "Amit", "Kiran", "Neha", "Rajesh", "Divya", "Alok"]
    : ["Nisha", "Priya", "Rohan", "Arjun", "Sneha", "Kavya", "Vikram", "Anjali", "Sanjay", "Meera"];
  let h = 0;
  for (const c of postId || "") h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const times = ["now", "2m", "18m", "1h", "3h", "7h"];
  return { name: names[h % names.length], time: times[h % times.length] };
}

export function sharesFor(postId) {
  return (String(postId).split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 900) + 12;
}
