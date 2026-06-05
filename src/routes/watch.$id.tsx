import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Activity, Bookmark, Flame, Heart, Maximize2, Pause, Play, Radio,
  Send, Share2, Sparkles, Volume2, Waves, Zap,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ResolutionBadge } from "@/components/video-card";
import { VIDEOS, gradientFor } from "@/lib/mock-data";

export const Route = createFileRoute("/watch/$id")({
  component: WatchPage,
  head: () => ({ meta: [{ title: "Now playing — Streamforge" }] }),
});

type Chapter = { t: number; label: string; icon: string };
type Reaction = { id: number; emoji: string; left: number };

const CHAPTERS: Chapter[] = [
  { t: 0, label: "Cold open", icon: "✦" },
  { t: 12, label: "Architecture", icon: "◇" },
  { t: 28, label: "Encoder farm", icon: "▲" },
  { t: 46, label: "Edge caching", icon: "◉" },
  { t: 68, label: "Live demo", icon: "✺" },
  { t: 88, label: "Outro", icon: "✧" },
];

const EDGES = [
  { city: "Tokyo", code: "NRT", rtt: 18, load: 64 },
  { city: "Frankfurt", code: "FRA", rtt: 11, load: 72 },
  { city: "Ashburn", code: "IAD", rtt: 6, load: 81, you: true },
  { city: "São Paulo", code: "GRU", rtt: 24, load: 38 },
  { city: "Singapore", code: "SIN", rtt: 21, load: 55 },
];

const BITRATE_LADDER = [
  { res: "4K",    bps: "16 Mbps", h: 100 },
  { res: "1440p", bps: "9 Mbps",  h: 76 },
  { res: "1080p", bps: "5 Mbps",  h: 58, active: true },
  { res: "720p",  bps: "2.4 Mbps",h: 38 },
  { res: "480p",  bps: "1 Mbps",  h: 22 },
];

const TRANSMISSIONS = [
  { a: "AL", u: "ada.lin",    t: "00:12:04", m: "The encoder farm shot — chef's kiss.", heat: 42 },
  { a: "MR", u: "mateo_r",    t: "00:08:21", m: "Finally HLS chunking explained visually.", heat: 28 },
  { a: "PS", u: "priya.s",    t: "00:04:55", m: "Cut our encode costs 62% with this stack.", heat: 91 },
  { a: "JV", u: "jules.v",    t: "00:01:30", m: "Loved the cold open. Color grade is unreal.", heat: 17 },
];

function WatchPage() {
  const { id } = Route.useParams();
  const video = VIDEOS.find((v) => v.id === id) ?? VIDEOS[0];
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(34);
  const [quality, setQuality] = useState(video.resolution);
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
      const emojis = ["🔥", "❤️", "✨", "🤯", "👏", "💎"];
      setReactions((r) => [
        ...r.slice(-12),
        { id: ++reactionId.current, emoji: emojis[Math.floor(Math.random() * emojis.length)], left: 20 + Math.random() * 60 },
      ]);
    }, 1400);
    return () => clearInterval(t);
  }, []);

  function fling(emoji: string) {
    setReactions((r) => [...r, { id: ++reactionId.current, emoji, left: 30 + Math.random() * 40 }]);
  }

  // waveform bars (deterministic per id)
  const bars = useMemo(() => {
    let h = 0; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
    return Array.from({ length: 96 }).map((_, i) => {
      h = (h * 1103515245 + 12345) >>> 0;
      return 0.25 + ((h % 1000) / 1000) * 0.75;
    });
  }, [id]);

  function onHover(e: React.MouseEvent<HTMLDivElement>) {
    const rect = barRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setHover({ x, pct: Math.max(0, Math.min(100, (x / rect.width) * 100)) });
  }

  const queue = VIDEOS.filter((v) => v.id !== video.id).slice(0, 6);

  return (
    <AppShell>
      {/* ambient backdrop */}
      <div className="relative">
        <div className={`pointer-events-none absolute -inset-x-10 -top-10 h-[520px] rounded-[3rem] opacity-40 blur-3xl bg-gradient-to-br ${video.thumbnail}`} />

        <div className="relative grid grid-cols-1 xl:grid-cols-[88px_minmax(0,1fr)_340px] gap-6">
          {/* LEFT — chapter rail */}
          <aside className="hidden xl:flex flex-col items-center pt-6">
            <div className="text-[10px] tracking-[0.3em] text-muted-foreground rotate-180 [writing-mode:vertical-rl] mb-6">SCENES</div>
            <div className="relative flex-1 w-px bg-border/60">
              {CHAPTERS.map((c, i) => {
                const top = (c.t / 100) * 100;
                const active = progress >= c.t && (!CHAPTERS[i + 1] || progress < CHAPTERS[i + 1].t);
                return (
                  <button
                    key={c.t}
                    onClick={() => setProgress(c.t)}
                    style={{ top: `${top}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group"
                  >
                    <div className={`h-8 w-8 rounded-full grid place-items-center text-xs font-bold transition-all ${active ? "bg-[image:var(--gradient-primary)] text-primary-foreground scale-125 shadow-[var(--shadow-glow)]" : "bg-secondary/80 border border-border/60 text-muted-foreground hover:scale-110"}`}>
                      {c.icon}
                    </div>
                    <div className="absolute left-12 top-1/2 -translate-y-1/2 whitespace-nowrap text-xs opacity-0 group-hover:opacity-100 transition bg-popover px-2 py-1 rounded-md border border-border/60 pointer-events-none">
                      {c.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* CENTER */}
          <div className="min-w-0">
            {/* Title strip */}
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 h-6 rounded-full bg-destructive/15 text-destructive text-[10px] font-semibold tracking-wider uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" /> Live mix
              </span>
              <span className="text-[11px] tracking-[0.25em] text-muted-foreground uppercase">{video.category} · {video.uploaded}</span>
              <div className="ml-auto flex items-center gap-2 text-[11px] text-muted-foreground">
                <Activity className="h-3.5 w-3.5 text-success" /> Streaming from IAD · 48ms
              </div>
            </div>

            {/* PLAYER */}
            <div className={`relative aspect-video rounded-[2rem] overflow-hidden bg-gradient-to-br ${video.thumbnail} shadow-[var(--shadow-soft)]`}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_60%)]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

              {/* floating reactions */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <AnimatePresence>
                  {reactions.map((r) => (
                    <motion.div
                      key={r.id}
                      initial={{ y: "100%", opacity: 0, scale: 0.6 }}
                      animate={{ y: "-20%", opacity: 1, scale: 1, x: [0, 10, -8, 0] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 4, ease: "easeOut" }}
                      onAnimationComplete={() => setReactions((rs) => rs.filter((x) => x.id !== r.id))}
                      className="absolute bottom-20 text-2xl drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                      style={{ left: `${r.left}%` }}
                    >
                      {r.emoji}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* top chips */}
              <div className="absolute top-5 left-5 flex gap-2">
                <ResolutionBadge res={quality} />
                <span className="text-[10px] font-semibold tracking-[0.2em] px-2 py-1 rounded-md bg-white/10 text-white/90 backdrop-blur border border-white/15">HDR · DOLBY</span>
              </div>
              <div className="absolute top-5 right-5 flex items-center gap-1.5 px-3 h-7 rounded-full bg-black/40 backdrop-blur border border-white/10 text-white text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> 12,438 watching
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

              {/* WAVEFORM scrubber */}
              <div className="absolute inset-x-0 bottom-0 p-5">
                <div
                  ref={barRef}
                  className="relative h-14 cursor-pointer mb-3"
                  onMouseMove={onHover}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => hover && setProgress(hover.pct)}
                >
                  <div className="absolute inset-0 flex items-end gap-[2px]">
                    {bars.map((v, i) => {
                      const pct = (i / bars.length) * 100;
                      const past = pct <= progress;
                      return (
                        <div
                          key={i}
                          className={`flex-1 rounded-sm transition-colors ${past ? "bg-white" : "bg-white/25"}`}
                          style={{ height: `${v * 100}%` }}
                        />
                      );
                    })}
                  </div>
                  {/* chapter markers on scrubber */}
                  {CHAPTERS.map((c) => (
                    <div key={c.t} className="absolute top-0 bottom-0 w-px bg-white/40" style={{ left: `${c.t}%` }} />
                  ))}
                  {hover && (
                    <div className="absolute bottom-16 -translate-x-1/2 pointer-events-none" style={{ left: hover.x }}>
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
                    {/* react buttons */}
                    <div className="flex items-center gap-1 px-2 h-9 rounded-full bg-white/10 backdrop-blur border border-white/15">
                      {["🔥","❤️","✨","🤯"].map((e) => (
                        <button key={e} onClick={() => fling(e)} className="h-7 w-7 rounded-full hover:bg-white/20 grid place-items-center text-sm">{e}</button>
                      ))}
                    </div>
                    <button className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center backdrop-blur"><Maximize2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            </div>

            {/* TITLE + ACTIONS — asymmetric */}
            <div className="mt-7 grid md:grid-cols-[1fr_auto] gap-6 items-end">
              <div>
                <div className="text-[11px] tracking-[0.3em] text-accent uppercase font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="h-3 w-3" /> Featured transmission
                </div>
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight leading-[1.1]">{video.title}</h1>
                <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="font-mono">{video.views} views</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1"><Flame className="h-3.5 w-3.5 text-warning" /> 94% retention</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1"><Heart className="h-3.5 w-3.5 text-destructive" /> {video.likes}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="h-11 px-5 rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground text-sm font-semibold shadow-[var(--shadow-glow)] hover:scale-[1.03] transition inline-flex items-center gap-2">
                  <Zap className="h-4 w-4" /> Tip creator
                </button>
                <button className="h-11 w-11 rounded-full glass grid place-items-center hover:bg-secondary"><Share2 className="h-4 w-4" /></button>
                <button className="h-11 w-11 rounded-full glass grid place-items-center hover:bg-secondary"><Bookmark className="h-4 w-4" /></button>
              </div>
            </div>

            {/* CREATOR HOLO CARD */}
            <div className="mt-6 relative overflow-hidden rounded-2xl border border-border/60 glass p-5">
              <div className={`absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl opacity-40 bg-gradient-to-br ${video.thumbnail}`} />
              <div className="relative flex items-center gap-5">
                <div className="relative">
                  <div className="h-16 w-16 rounded-2xl bg-[image:var(--gradient-primary)] grid place-items-center text-lg font-bold text-primary-foreground shadow-[var(--shadow-glow)]">
                    {video.creatorAvatar}
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-success border-2 border-background grid place-items-center text-[8px] font-bold">✓</div>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{video.creator}</span>
                    <span className="text-[10px] tracking-widest font-mono text-accent">PRO · TIER S</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 font-mono">1.2M subscribers · 248 transmissions</div>
                </div>
                <div className="hidden md:flex gap-6 ml-6 pl-6 border-l border-border/60">
                  <Stat label="encoded" value="148TB" />
                  <Stat label="watch hrs" value="9.4M" />
                  <Stat label="streak" value="42d" />
                </div>
                <button className="ml-auto h-10 px-5 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-90">Subscribe</button>
              </div>
              <p className="relative mt-4 text-sm text-muted-foreground leading-relaxed max-w-3xl">{video.description}</p>
            </div>

            {/* ENGAGEMENT PULSE — heat across video */}
            <div className="mt-6 rounded-2xl border border-border/60 glass p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Waves className="h-4 w-4 text-accent" />
                  <span className="font-semibold text-sm">Audience heatmap</span>
                </div>
                <span className="text-[10px] tracking-widest font-mono text-muted-foreground">REWIND PEAKS · REACTIONS · COMMENTS</span>
              </div>
              <div className="relative h-16">
                <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
                  <defs>
                    <linearGradient id="heat" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.78 0.16 205)" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="oklch(0.68 0.22 300)" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  <path
                    d={`M0,30 ${bars.slice(0, 50).map((v, i) => `L${(i / 49) * 100},${30 - v * 22}`).join(" ")} L100,30 Z`}
                    fill="url(#heat)"
                  />
                  <path
                    d={`M0,30 ${bars.slice(0, 50).map((v, i) => `L${(i / 49) * 100},${30 - v * 22}`).join(" ")}`}
                    fill="none" stroke="oklch(0.78 0.16 205)" strokeWidth="0.4"
                  />
                </svg>
                <div className="absolute top-0 bottom-0 w-0.5 bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.6)]" style={{ left: `${progress}%` }} />
              </div>
            </div>

            {/* TRANSMISSIONS (comments) */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold flex items-center gap-2"><Radio className="h-4 w-4 text-accent" /> Transmissions <span className="text-muted-foreground font-normal">· 428</span></h3>
                <div className="text-[10px] tracking-widest font-mono text-muted-foreground">SORTED BY HEAT</div>
              </div>
              <div className="flex gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-[image:var(--gradient-primary)] grid place-items-center text-xs font-bold text-primary-foreground">NR</div>
                <div className="flex-1 relative">
                  <input placeholder="Broadcast a transmission…" className="w-full h-11 pl-4 pr-12 rounded-xl bg-secondary/40 border border-border/60 focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm" />
                  <button className="absolute right-1 top-1 h-9 w-9 rounded-lg bg-[image:var(--gradient-primary)] grid place-items-center"><Send className="h-4 w-4 text-primary-foreground" /></button>
                </div>
              </div>
              <div className="space-y-3">
                {TRANSMISSIONS.map((c) => (
                  <div key={c.u} className="group flex gap-4 p-4 rounded-2xl border border-border/40 hover:border-border/80 hover:bg-secondary/30 transition">
                    <div className="h-10 w-10 rounded-xl bg-secondary grid place-items-center text-xs font-bold shrink-0">{c.a}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-mono text-muted-foreground">@{c.u}</span>
                        <span className="font-mono text-accent">{c.t}</span>
                        <button className="ml-auto opacity-0 group-hover:opacity-100 transition text-muted-foreground hover:text-foreground">Reply</button>
                      </div>
                      <div className="text-sm mt-1.5">{c.m}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <div className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-warning/15 text-warning"><Flame className="h-3 w-3" /> {c.heat}</div>
                      <button className="text-muted-foreground hover:text-destructive transition"><Heart className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — signal panel */}
          <aside className="space-y-5">
            {/* Bitrate ladder */}
            <div className="rounded-2xl border border-border/60 glass p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] tracking-[0.25em] font-mono text-muted-foreground uppercase">Bitrate ladder</span>
                <span className="text-[10px] font-mono text-accent">ABR · AUTO</span>
              </div>
              <div className="flex items-end gap-2 h-28">
                {BITRATE_LADDER.map((b) => (
                  <button
                    key={b.res}
                    onClick={() => setQuality(b.res as any)}
                    className={`flex-1 rounded-lg relative group transition-all ${quality === b.res ? "bg-[image:var(--gradient-primary)] shadow-[var(--shadow-glow)]" : "bg-secondary/60 hover:bg-secondary"}`}
                    style={{ height: `${b.h}%` }}
                  >
                    <div className={`absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono ${quality === b.res ? "text-foreground" : "text-muted-foreground"}`}>{b.res}</div>
                  </button>
                ))}
              </div>
              <div className="mt-3 flex justify-between text-[10px] font-mono text-muted-foreground">
                <span>{quality}</span>
                <span>{BITRATE_LADDER.find((b) => b.res === quality)?.bps ?? "5 Mbps"}</span>
              </div>
            </div>

            {/* Edge map */}
            <div className="rounded-2xl border border-border/60 glass p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] tracking-[0.25em] font-mono text-muted-foreground uppercase">Edge network</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-success"><span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> 5 PoPs</span>
              </div>
              <div className="space-y-2">
                {EDGES.map((e) => (
                  <div key={e.code} className={`flex items-center gap-3 p-2 rounded-lg ${e.you ? "bg-primary/10 border border-primary/30" : ""}`}>
                    <div className="font-mono text-[10px] w-9 text-muted-foreground">{e.code}</div>
                    <div className="text-xs flex-1">{e.city}{e.you && <span className="ml-1.5 text-[9px] font-mono text-primary">YOU</span>}</div>
                    <div className="flex-1 h-1 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full bg-[image:var(--gradient-primary)]" style={{ width: `${e.load}%` }} />
                    </div>
                    <div className="font-mono text-[10px] text-muted-foreground w-10 text-right">{e.rtt}ms</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Up-next queue as filmstrip */}
            <div className="rounded-2xl border border-border/60 glass p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] tracking-[0.25em] font-mono text-muted-foreground uppercase">Next in queue</span>
                <span className="text-[10px] font-mono text-accent">AUTOPLAY</span>
              </div>
              <div className="space-y-3">
                {queue.map((v, i) => (
                  <Link to="/watch/$id" params={{ id: v.id }} key={v.id} className="group flex gap-3 items-center">
                    <div className="font-mono text-[10px] w-5 text-muted-foreground tabular-nums">{String(i + 1).padStart(2, "0")}</div>
                    <div className={`relative h-14 w-24 rounded-lg overflow-hidden bg-gradient-to-br ${v.thumbnail} shrink-0`}>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition" />
                      <div className="absolute bottom-0.5 right-0.5 text-[9px] px-1 rounded bg-black/70 text-white font-mono">{v.duration}</div>
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium line-clamp-2 group-hover:text-accent transition leading-tight">{v.title}</div>
                      <div className="text-[10px] text-muted-foreground mt-1 font-mono truncate">{v.creator} · {v.views}</div>
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-base font-semibold tabular-nums">{value}</div>
      <div className="text-[9px] tracking-widest uppercase text-muted-foreground font-mono">{label}</div>
    </div>
  );
}

function fmt(pct: number) {
  const totalSec = (pct / 100) * 612;
  const m = Math.floor(totalSec / 60);
  const s = Math.floor(totalSec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
