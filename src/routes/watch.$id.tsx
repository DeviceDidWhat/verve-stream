import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bookmark, Maximize2, MoreHorizontal, Pause, Play, Settings2, Share2,
  SkipBack, SkipForward, ThumbsDown, ThumbsUp, Volume2,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { VideoCard, ResolutionBadge } from "@/components/video-card";
import { VIDEOS, gradientFor } from "@/lib/mock-data";

export const Route = createFileRoute("/watch/$id")({
  component: WatchPage,
  head: () => ({ meta: [{ title: "Now playing — Streamforge" }] }),
});

function WatchPage() {
  const { id } = Route.useParams();
  const video = VIDEOS.find((v) => v.id === id) ?? VIDEOS[0];
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(34);
  const [hover, setHover] = useState<{ x: number; pct: number } | null>(null);
  const [quality, setQuality] = useState(video.resolution);
  const barRef = useRef<HTMLDivElement>(null);

  function onHover(e: React.MouseEvent<HTMLDivElement>) {
    const rect = barRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setHover({ x, pct: Math.max(0, Math.min(100, (x / rect.width) * 100)) });
  }

  const related = VIDEOS.filter((v) => v.id !== video.id).slice(0, 8);

  return (
    <AppShell>
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8">
        <div>
          {/* Player */}
          <div className={`relative aspect-video rounded-3xl overflow-hidden bg-gradient-to-br ${video.thumbnail} shadow-[var(--shadow-soft)] group`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_60%)]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

            {/* Center play */}
            <button
              onClick={() => setPlaying((p) => !p)}
              className="absolute inset-0 grid place-items-center"
              aria-label="play"
            >
              <AnimatePresence>
                {!playing && (
                  <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.2, opacity: 0 }} className="h-20 w-20 rounded-full bg-white/15 backdrop-blur grid place-items-center border border-white/30">
                    <Play className="h-9 w-9 fill-white text-white ml-1" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Bottom controls */}
            <div className="absolute inset-x-0 bottom-0 p-4">
              {/* timeline */}
              <div
                ref={barRef}
                className="relative h-1.5 rounded-full bg-white/15 cursor-pointer mb-3"
                onMouseMove={onHover}
                onMouseLeave={() => setHover(null)}
                onClick={() => hover && setProgress(hover.pct)}
              >
                <div className="h-full rounded-full bg-[image:var(--gradient-primary)]" style={{ width: `${progress}%` }} />
                <div className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-white shadow" style={{ left: `${progress}%` }} />
                {hover && (
                  <div className="absolute bottom-6 -translate-x-1/2 pointer-events-none" style={{ left: hover.x }}>
                    <div className={`h-20 w-32 rounded-lg overflow-hidden border-2 border-white/60 shadow-2xl bg-gradient-to-br ${gradientFor(video.id + Math.round(hover.pct))}`}>
                      <div className="h-full w-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.25),transparent_60%)]" />
                    </div>
                    <div className="text-center text-[11px] text-white mt-1 font-medium">{Math.floor(hover.pct/100 * 612 / 60)}:{String(Math.floor(hover.pct/100 * 612 % 60)).padStart(2,"0")}</div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 text-white">
                <button onClick={() => setPlaying((p) => !p)} className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center backdrop-blur">
                  {playing ? <Pause className="h-4 w-4 fill-white" /> : <Play className="h-4 w-4 fill-white ml-0.5" />}
                </button>
                <button className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center backdrop-blur"><SkipBack className="h-4 w-4" /></button>
                <button className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center backdrop-blur"><SkipForward className="h-4 w-4" /></button>
                <button className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center backdrop-blur"><Volume2 className="h-4 w-4" /></button>
                <div className="text-xs tabular-nums text-white/80">{Math.floor(progress*6.12/60)}:{String(Math.floor(progress*6.12%60)).padStart(2,"0")} / 10:12</div>
                <div className="ml-auto flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-1 px-2 h-8 rounded-md bg-white/10 backdrop-blur text-xs">
                    {(["4K","1080p","720p","480p"] as const).map((q) => (
                      <button key={q} onClick={() => setQuality(q as any)} className={`px-2 py-0.5 rounded ${quality===q?"bg-white/20":""}`}>{q}</button>
                    ))}
                  </div>
                  <button className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center backdrop-blur"><Settings2 className="h-4 w-4" /></button>
                  <button className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center backdrop-blur"><Maximize2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>

            <div className="absolute top-4 left-4 flex gap-2">
              <ResolutionBadge res={quality} />
              <span className="text-[10px] font-semibold tracking-wider px-1.5 py-0.5 rounded-md bg-black/40 text-white/90 backdrop-blur">HDR · DOLBY</span>
            </div>
          </div>

          {/* Meta */}
          <h1 className="mt-6 text-2xl font-semibold tracking-tight">{video.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 justify-between">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-[image:var(--gradient-primary)] grid place-items-center text-sm font-semibold text-primary-foreground">{video.creatorAvatar}</div>
              <div>
                <div className="font-medium">{video.creator}</div>
                <div className="text-xs text-muted-foreground">1.2M subscribers</div>
              </div>
              <button className="ml-3 h-9 px-4 rounded-xl bg-foreground text-background text-sm font-medium">Subscribe</button>
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center rounded-xl bg-secondary/60 border border-border/60 text-sm">
                <button className="px-4 h-9 inline-flex items-center gap-2"><ThumbsUp className="h-4 w-4" /> {video.likes}</button>
                <div className="w-px h-5 bg-border" />
                <button className="px-3 h-9"><ThumbsDown className="h-4 w-4" /></button>
              </div>
              <button className="h-9 px-4 rounded-xl bg-secondary/60 border border-border/60 text-sm inline-flex items-center gap-2"><Share2 className="h-4 w-4" /> Share</button>
              <button className="h-9 px-4 rounded-xl bg-secondary/60 border border-border/60 text-sm inline-flex items-center gap-2"><Bookmark className="h-4 w-4" /> Save</button>
              <button className="h-9 w-9 grid place-items-center rounded-xl bg-secondary/60 border border-border/60"><MoreHorizontal className="h-4 w-4" /></button>
            </div>
          </div>

          <div className="mt-5 rounded-2xl p-5 bg-secondary/40 border border-border/60">
            <div className="text-xs text-muted-foreground">{video.views} views · {video.uploaded}</div>
            <p className="mt-2 text-sm leading-relaxed">{video.description}</p>
          </div>

          {/* Comments */}
          <div className="mt-8">
            <h3 className="font-semibold mb-4">428 comments</h3>
            <div className="flex gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-[image:var(--gradient-primary)] grid place-items-center text-xs font-semibold text-primary-foreground">NR</div>
              <input placeholder="Add a comment…" className="flex-1 h-10 px-4 rounded-xl bg-secondary/60 border border-border/60 focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            <div className="space-y-5">
              {[
                { u: "Ada Lin", a: "AL", t: "2h ago", m: "The encoder farm visualization is gorgeous — what's powering the dashboard?" },
                { u: "Mateo R.", a: "MR", t: "5h ago", m: "Finally a video about HLS that actually shows the chunking 🙌" },
                { u: "Priya S.", a: "PS", t: "1d ago", m: "Adopted Streamforge last month. Cut our encode costs by 62%." },
              ].map((c, i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-10 w-10 rounded-full bg-secondary grid place-items-center text-xs font-semibold">{c.a}</div>
                  <div>
                    <div className="text-sm"><span className="font-medium">{c.u}</span> <span className="text-muted-foreground">· {c.t}</span></div>
                    <div className="text-sm mt-0.5">{c.m}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        <aside className="space-y-4">
          <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Up next</div>
          {related.map((v, i) => (
            <Link to="/watch/$id" params={{ id: v.id }} key={v.id} className="flex gap-3 group">
              <div className={`relative h-20 w-36 rounded-xl overflow-hidden bg-gradient-to-br ${v.thumbnail} shrink-0`}>
                <div className="absolute bottom-1 right-1 text-[10px] px-1 rounded bg-black/70 text-white">{v.duration}</div>
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium line-clamp-2 group-hover:text-accent">{v.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5 truncate">{v.creator}</div>
                <div className="text-xs text-muted-foreground">{v.views} views</div>
              </div>
            </Link>
          ))}
        </aside>
      </div>
    </AppShell>
  );
}
