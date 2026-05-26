import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Play } from "lucide-react";
import { type Video } from "@/lib/mock-data";

export function ResolutionBadge({ res }: { res: string }) {
  const tone =
    res === "4K" ? "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/30"
    : res === "1080p" ? "bg-cyan-500/20 text-cyan-200 border-cyan-400/30"
    : res === "720p" ? "bg-emerald-500/20 text-emerald-200 border-emerald-400/30"
    : "bg-muted text-muted-foreground border-border";
  return (
    <span className={`text-[10px] font-semibold tracking-wider px-1.5 py-0.5 rounded-md border ${tone}`}>{res}</span>
  );
}

export function VideoCard({ video, index = 0 }: { video: Video; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.03, 0.4), ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link to="/watch/$id" params={{ id: video.id }} className="block">
        <div className={`relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br ${video.thumbnail} shadow-[var(--shadow-soft)]`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_60%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-3 left-3 flex gap-1.5">
            <ResolutionBadge res={video.resolution} />
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-black/50 backdrop-blur text-white/90">{video.category}</span>
          </div>
          <div className="absolute bottom-3 right-3 text-[11px] font-medium px-1.5 py-0.5 rounded-md bg-black/70 text-white/90">{video.duration}</div>
          <div className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="h-14 w-14 rounded-full bg-white/15 backdrop-blur grid place-items-center border border-white/30">
              <Play className="h-6 w-6 text-white fill-white ml-0.5" />
            </div>
          </div>
          {/* timeline preview hint */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
            <div className="h-full bg-[image:var(--gradient-primary)]" style={{ width: `${20 + (index * 7) % 70}%` }} />
          </div>
        </div>
        <div className="flex gap-3 mt-3">
          <div className="h-9 w-9 shrink-0 rounded-full bg-[image:var(--gradient-primary)] grid place-items-center text-xs font-semibold text-primary-foreground">
            {video.creatorAvatar}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-accent transition-colors">{video.title}</div>
            <div className="text-xs text-muted-foreground mt-1 truncate">{video.creator}</div>
            <div className="text-xs text-muted-foreground">{video.views} views · {video.uploaded}</div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function VideoCardSkeleton() {
  return (
    <div>
      <div className="aspect-video rounded-2xl bg-secondary/60 shimmer" />
      <div className="flex gap-3 mt-3">
        <div className="h-9 w-9 rounded-full bg-secondary/60 shimmer" />
        <div className="flex-1 space-y-2">
          <div className="h-3 rounded bg-secondary/60 shimmer w-4/5" />
          <div className="h-3 rounded bg-secondary/60 shimmer w-2/5" />
        </div>
      </div>
    </div>
  );
}
