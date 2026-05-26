import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Flame, Sparkles, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { VideoCard, VideoCardSkeleton } from "@/components/video-card";
import { CATEGORIES, VIDEOS } from "@/lib/mock-data";

export const Route = createFileRoute("/feed")({
  component: FeedPage,
  head: () => ({ meta: [{ title: "Home Feed — Streamforge" }] }),
});

function FeedPage() {
  const [cat, setCat] = useState("All");
  const [batch, setBatch] = useState(1);
  const [loading, setLoading] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  const filtered = (cat === "All" ? VIDEOS : VIDEOS.filter((v) => v.category === cat));
  const visible = Array.from({ length: batch }).flatMap((_, i) =>
    filtered.map((v) => ({ ...v, id: `${v.id}_${i}` }))
  );

  useEffect(() => {
    if (!sentinel.current) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading && batch < 4) {
        setLoading(true);
        setTimeout(() => {
          setBatch((b) => b + 1);
          setLoading(false);
        }, 700);
      }
    }, { rootMargin: "400px" });
    obs.observe(sentinel.current);
    return () => obs.disconnect();
  }, [loading, batch]);

  const trending = VIDEOS.slice(0, 4);

  return (
    <AppShell>
      {/* Hero strip */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl overflow-hidden relative mb-8 glass-strong"
      >
        <div className="grid md:grid-cols-2">
          <div className={`aspect-video md:aspect-auto bg-gradient-to-br ${trending[0].thumbnail} relative`}>
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent md:bg-gradient-to-r" />
          </div>
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 text-xs px-3 py-1 rounded-full bg-accent/15 text-accent"><Sparkles className="h-3 w-3" /> Featured today</div>
            <h2 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight">{trending[0].title}</h2>
            <p className="mt-3 text-muted-foreground line-clamp-3">{trending[0].description}</p>
            <div className="mt-5 flex items-center gap-3">
              <button className="h-11 px-5 rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground font-medium">Watch now</button>
              <button className="h-11 px-5 rounded-xl glass">Add to library</button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-6 sticky top-16 z-30 -mx-4 px-4 lg:mx-0 lg:px-0">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`shrink-0 px-4 h-9 rounded-full text-sm border transition ${
              cat === c
                ? "bg-foreground text-background border-foreground"
                : "bg-secondary/60 text-muted-foreground border-border/60 hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Trending row */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="h-4 w-4 text-accent" />
          <h3 className="text-lg font-semibold tracking-tight">Trending now</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {trending.map((v, i) => <VideoCard key={v.id} video={v} index={i} />)}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-4 w-4 text-accent" />
          <h3 className="text-lg font-semibold tracking-tight">Recommended for you</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {visible.map((v, i) => <VideoCard key={v.id} video={v} index={i} />)}
          {loading && Array.from({ length: 4 }).map((_, i) => <VideoCardSkeleton key={`s${i}`} />)}
        </div>
        <div ref={sentinel} className="h-10" />
      </section>
    </AppShell>
  );
}
