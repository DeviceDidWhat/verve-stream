import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bookmark, Heart, Maximize2, MessageCircle, Pause, Play,
  Send, Share2, Volume2,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { VIDEOS, gradientFor } from "@/lib/mock-data";

export const Route = createFileRoute("/watch/$id")({
  component: WatchPage,
  head: () => ({ meta: [{ title: "Now playing — Streamforge" }] }),
});

type Chapter = { t: number; label: string };
type Reaction = { id: number; emoji: string; left: number };

const CHAPTERS: Chapter[] = [
  { t: 0,  label: "Cold open" },
  { t: 18, label: "First light" },
  { t: 38, label: "The descent" },
  { t: 58, label: "Stillness" },
  { t: 82, label: "Outro" },
];

const COMMENTS = [
  { a: "AL", u: "ada.lin",  t: "2h",  m: "That second chapter is pure poetry. Saving this one." },
  { a: "MR", u: "mateo_r",  t: "5h",  m: "The color grade in the descent shot — unreal." },
  { a: "PS", u: "priya.s",  t: "1d",  m: "Watched twice. The pacing is perfect.", liked: true },
  { a: "JV", u: "jules.v",  t: "1d",  m: "More like this please. ✨" },
];

function WatchPage() {
  const { id } = Route.useParams();
  const video = VIDEOS.find((v) => v.id === id) ?? VIDEOS[0];
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(34);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [hover, setHover] = useState<{ x: number; pct: number } | null>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const reactionId = useRef(0);

  // animate progress
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setProgress((p) => (p >= 100 ? 0 : p + 0.15)), 120);
    return () => clearInterval(t);
  }, [playing]);

  // ambient reactions
  useEffect(() => {
    const t = setInterval(() => {
      const emojis = ["❤️", "✨", "🌙", "🕊️"];
      setReactions((r) => [
        ...r.slice(-8),
        { id: ++reactionId.current, emoji: emojis[Math.floor(Math.random() * emojis.length)], left: 20 + Math.random() * 60 },
      ]);
    }, 2200);
    return () => clearInterval(t);
  }, []);

  function fling(emoji: string) {
    setReactions((r) => [...r, { id: ++reactionId.current, emoji, left: 30 + Math.random() * 40 }]);
  }

  // deterministic seed per id for subtle thumbnail variance
  const seed = useMemo(() => {
    let h = 0; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
    return h;
  }, [id]);

  function onHover(e: React.MouseEvent<HTMLDivElement>) {
    const rect = barRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setHover({ x, pct: Math.max(0, Math.min(100, (x / rect.width) * 100)) });
  }

  const queue = VIDEOS.filter((v) => v.id !== video.id).slice(0, 5);

  return (
    <AppShell>
      <div className="relative">
        {/* Ambient glow tinted by the video */}
        <div className={`pointer-events-none absolute -inset-x-20 -top-20 h-[560px] rounded-[3rem] opacity-30 blur-3xl bg-gradient-to-br ${video.thumbnail}`} />

        <div className="relative grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8">
          {/* CENTER */}
          <div className="min-w-0">
            {/* Tiny breadcrumb */}
            <div className="flex items-center gap-2 mb-4 text-[11px] tracking-[0.25em] uppercase text-muted-foreground">
              <span className="text-accent">{video.category}</span>
              <span className="opacity-40">/</span>
              <span>{video.uploaded}</span>
            </div>

            {/* PLAYER */}
            <div className={`relative aspect-video rounded-[1.75rem] overflow-hidden bg-gradient-to-br ${video.thumbnail} shadow-[var(--shadow-soft)]`}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_60%)]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20" />

              {/* floating reactions */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <AnimatePresence>
                  {reactions.map((r) => (
                    <motion.div
                      key={r.id}
                      initial={{ y: 0, opacity: 0, scale: 0.6 }}
                      animate={{ y: -260, opacity: [0, 1, 1, 0], scale: 1, x: [0, 8, -6, 0] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 3.6, ease: "easeOut" }}
                      onAnimationComplete={() => setReactions((rs) => rs.filter((x) => x.id !== r.id))}
                      className="absolute bottom-24 text-2xl drop-shadow-[0_0_12px_rgba(255,255,255,0.5)]"
                      style={{ left: `${r.left}%` }}
                    >
                      {r.emoji}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* center play */}
              <button onClick={() => setPlaying((p) => !p)} className="absolute inset-0 grid place-items-center group">
                <AnimatePresence>
                  {!playing && (
                    <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.4, opacity: 0 }} className="h-24 w-24 rounded-full bg-white/15 backdrop-blur grid place-items-center border border-white/30 shadow-[var(--shadow-glow)]">
                      <Play className="h-10 w-10 fill-white text-white ml-1" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              {/* Minimal scrubber */}
              <div className="absolute inset-x-0 bottom-0 p-5">
                <div
                  ref={barRef}
                  className="relative h-8 cursor-pointer mb-3 flex items-center"
                  onMouseMove={onHover}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => hover && setProgress(hover.pct)}
                >
                  <div className="relative w-full h-1 rounded-full bg-white/20 overflow-hidden">
                    <div className="absolute inset-y-0 left-0 bg-white rounded-full" style={{ width: `${progress}%` }} />
                  </div>
                  {/* playhead dot */}
                  <div className="absolute h-3 w-3 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] -translate-x-1/2" style={{ left: `${progress}%` }} />
                  {/* chapter ticks */}
                  {CHAPTERS.map((c) => (
                    <div key={c.t} className="absolute h-1.5 w-0.5 bg-white/60 rounded-full" style={{ left: `${c.t}%` }} />
                  ))}
                  {hover && (
                    <div className="absolute bottom-10 -translate-x-1/2 pointer-events-none" style={{ left: hover.x }}>
                      <div className={`h-24 w-40 rounded-xl overflow-hidden border-2 border-white/70 shadow-2xl bg-gradient-to-br ${gradientFor(video.id + Math.round(hover.pct))}`}>
                        <div className="h-full w-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.3),transparent_60%)]" />
                      </div>
                      <div className="text-center text-[11px] text-white mt-1 font-mono">{fmt(hover.pct)}</div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 text-white">
                  <button onClick={() => setPlaying((p) => !p)} className="h-11 w-11 rounded-full bg-white text-black grid place-items-center shadow-lg hover:scale-105 transition">
                    {playing ? <Pause className="h-5 w-5 fill-black" /> : <Play className="h-5 w-5 fill-black ml-0.5" />}
                  </button>
                  <button className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center backdrop-blur"><Volume2 className="h-4 w-4" /></button>
                  <div className="text-xs tabular-nums font-mono text-white/80">{fmt(progress)} / 10:12</div>
                  <div className="ml-auto flex items-center gap-2">
                    <div className="flex items-center gap-1 px-2 h-9 rounded-full bg-white/10 backdrop-blur border border-white/15">
                      {["❤️","✨","🌙","🕊️"].map((e) => (
                        <button key={e} onClick={() => fling(e)} className="h-7 w-7 rounded-full hover:bg-white/20 grid place-items-center text-sm">{e}</button>
                      ))}
                    </div>
                    <button className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center backdrop-blur"><Maximize2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            </div>

            {/* TITLE — editorial */}
            <div className="mt-8 max-w-3xl">
              <h1 className="text-3xl md:text-[2.6rem] font-semibold tracking-tight leading-[1.05]">
                {video.title}
              </h1>
              <p className="mt-4 text-muted-foreground text-base leading-relaxed">
                {video.description}
              </p>
            </div>

            {/* META row */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link to="/profile" className="flex items-center gap-3 group">
                <div className={`h-11 w-11 rounded-full bg-gradient-to-br ${video.thumbnail} grid place-items-center text-sm font-semibold text-white shadow-[var(--shadow-glow)]`}>
                  {video.creatorAvatar}
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-medium group-hover:text-accent transition">{video.creator}</div>
                  <div className="text-[11px] text-muted-foreground">1.2M followers</div>
                </div>
              </Link>
              <button className="h-9 px-4 rounded-full bg-foreground text-background text-xs font-semibold hover:opacity-90">Follow</button>

              <div className="ml-auto flex items-center gap-1.5">
                <PillButton active={liked} onClick={() => setLiked((v) => !v)}>
                  <Heart className={`h-4 w-4 ${liked ? "fill-destructive text-destructive" : ""}`} />
                  <span>{video.likes}</span>
                </PillButton>
                <PillButton><MessageCircle className="h-4 w-4" /><span>{COMMENTS.length}</span></PillButton>
                <PillButton><Share2 className="h-4 w-4" /><span className="hidden sm:inline">Share</span></PillButton>
                <PillButton active={saved} onClick={() => setSaved((v) => !v)}>
                  <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
                </PillButton>
              </div>
            </div>

            {/* CHAPTERS — soft cards */}
            <div className="mt-10">
              <div className="text-[11px] tracking-[0.3em] uppercase text-muted-foreground mb-4">Chapters</div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {CHAPTERS.map((c, i) => {
                  const active = progress >= c.t && (!CHAPTERS[i + 1] || progress < CHAPTERS[i + 1].t);
                  return (
                    <button
                      key={c.t}
                      onClick={() => setProgress(c.t)}
                      className={`group text-left rounded-2xl p-3 border transition-all ${active ? "border-primary/60 bg-primary/10 shadow-[var(--shadow-glow)]" : "border-border/50 hover:border-border bg-card/30"}`}
                    >
                      <div className={`h-14 rounded-lg bg-gradient-to-br ${gradientFor(video.id + i)} mb-2 relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.25),transparent_60%)]" />
                      </div>
                      <div className="text-[10px] font-mono text-muted-foreground">{fmt(c.t)}</div>
                      <div className="text-xs font-medium mt-0.5 leading-tight">{c.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* COMMENTS */}
            <div className="mt-12">
              <div className="flex items-baseline gap-3 mb-5">
                <h3 className="text-lg font-semibold">Conversation</h3>
                <span className="text-xs text-muted-foreground">{COMMENTS.length * 107} thoughts</span>
              </div>
              <div className="flex gap-3 mb-7">
                <div className="h-10 w-10 rounded-full bg-[image:var(--gradient-primary)] grid place-items-center text-xs font-bold text-primary-foreground shrink-0">N</div>
                <div className="flex-1 relative">
                  <input
                    placeholder="Share a thought…"
                    className="w-full h-11 pl-4 pr-12 rounded-full bg-secondary/40 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm placeholder:text-muted-foreground/70"
                  />
                  <button className="absolute right-1 top-1 h-9 w-9 rounded-full bg-[image:var(--gradient-primary)] grid place-items-center hover:scale-105 transition">
                    <Send className="h-4 w-4 text-primary-foreground" />
                  </button>
                </div>
              </div>
              <div className="space-y-5">
                {COMMENTS.map((c) => (
                  <div key={c.u} className="group flex gap-3">
                    <div className="h-10 w-10 rounded-full bg-secondary grid place-items-center text-xs font-semibold shrink-0">{c.a}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">@{c.u}</span>
                        <span>·</span>
                        <span>{c.t}</span>
                      </div>
                      <div className="text-sm mt-1 leading-relaxed">{c.m}</div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <button className={`inline-flex items-center gap-1 hover:text-destructive transition ${c.liked ? "text-destructive" : ""}`}>
                          <Heart className={`h-3.5 w-3.5 ${c.liked ? "fill-current" : ""}`} /> {c.liked ? "12" : "Like"}
                        </button>
                        <button className="hover:text-foreground transition">Reply</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — Up next, simple */}
          <aside>
            <div className="sticky top-6">
              <div className="text-[11px] tracking-[0.3em] uppercase text-muted-foreground mb-4">Up next</div>
              <div className="space-y-3">
                {queue.map((v) => (
                  <Link
                    to="/watch/$id"
                    params={{ id: v.id }}
                    key={v.id}
                    className="group flex gap-3 p-2 -mx-2 rounded-xl hover:bg-secondary/40 transition"
                  >
                    <div className={`relative h-20 w-32 rounded-xl overflow-hidden bg-gradient-to-br ${v.thumbnail} shrink-0`}>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.18),transparent_60%)]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-1 right-1 text-[10px] px-1.5 py-0.5 rounded bg-black/70 text-white font-mono">{v.duration}</div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium line-clamp-2 group-hover:text-accent transition leading-snug">{v.title}</div>
                      <div className="text-[11px] text-muted-foreground mt-1 truncate">{v.creator}</div>
                      <div className="text-[11px] text-muted-foreground/70">{v.views} views</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

function PillButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`h-9 px-3.5 rounded-full inline-flex items-center gap-1.5 text-xs font-medium transition border ${
        active
          ? "bg-primary/15 border-primary/40 text-foreground"
          : "bg-secondary/40 border-border/40 hover:bg-secondary text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function fmt(pct: number) {
  const totalSec = (pct / 100) * 612;
  const m = Math.floor(totalSec / 60);
  const s = Math.floor(totalSec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
