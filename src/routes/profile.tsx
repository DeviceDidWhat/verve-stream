import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, Edit3, Link2, MapPin } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { VideoCard } from "@/components/video-card";
import { VIDEOS } from "@/lib/mock-data";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
  head: () => ({ meta: [{ title: "Nova Reyes — Streamforge" }] }),
});

const tabs = ["Videos", "Playlists", "About"] as const;

function ProfilePage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Videos");
  const mine = VIDEOS.slice(0, 12);
  return (
    <AppShell>
      {/* Banner */}
      <div className="relative h-56 rounded-3xl overflow-hidden bg-gradient-to-br from-violet-600 via-fuchsia-500 to-cyan-400">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.3),transparent_60%)]" />
      </div>
      <div className="relative -mt-16 px-6 flex flex-col md:flex-row gap-6 md:items-end">
        <div className="h-32 w-32 rounded-3xl bg-[image:var(--gradient-primary)] grid place-items-center text-3xl font-semibold text-primary-foreground ring-4 ring-background shadow-[var(--shadow-glow)]">
          NR
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-semibold tracking-tight">Nova Reyes</h1>
            <CheckCircle2 className="h-5 w-5 text-accent" />
          </div>
          <div className="text-muted-foreground text-sm mt-1">@novareyes · 248K subscribers · 142 videos</div>
          <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Lisbon, Portugal</span>
            <span className="inline-flex items-center gap-1.5"><Link2 className="h-3.5 w-3.5" /> novareyes.studio</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="h-10 px-5 rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground font-medium">Subscribe</button>
          <button className="h-10 px-4 rounded-xl glass inline-flex items-center gap-2"><Edit3 className="h-4 w-4" /> Edit</button>
        </div>
      </div>

      <div className="mt-6 px-6 max-w-3xl text-sm text-muted-foreground leading-relaxed">
        Building Streamforge in public. Talks about distributed systems, video, and the boring infrastructure that makes the magic feel inevitable.
      </div>

      <div className="mt-8 border-b border-border/60 flex gap-1">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative px-4 py-3 text-sm transition ${tab===t?"text-foreground":"text-muted-foreground hover:text-foreground"}`}
          >
            {t}
            {tab === t && <motion.div layoutId="profile-tab" className="absolute inset-x-2 -bottom-px h-0.5 bg-[image:var(--gradient-primary)] rounded-full" />}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "Videos" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {mine.map((v, i) => <VideoCard key={v.id} video={v} index={i} />)}
          </div>
        )}
        {tab === "Playlists" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {["Distributed systems deep dives", "Behind the scenes", "Color & cinema"].map((p, i) => (
              <div key={p} className="rounded-2xl p-6 glass">
                <div className={`aspect-video rounded-xl bg-gradient-to-br ${mine[i].thumbnail} mb-4`} />
                <div className="font-medium">{p}</div>
                <div className="text-xs text-muted-foreground mt-1">{8 + i*3} videos · updated this week</div>
              </div>
            ))}
          </div>
        )}
        {tab === "About" && (
          <div className="max-w-2xl space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>Hi, I'm Nova. I make videos about the people and systems behind the internet's most demanding workloads.</p>
            <p>Currently building Streamforge — a distributed video platform that turns terabytes of raw footage into adaptive streams in seconds.</p>
            <div className="grid grid-cols-2 gap-3 mt-6">
              {[
                { l: "Joined", v: "March 2021" },
                { l: "Total views", v: "84.2M" },
                { l: "Country", v: "Portugal" },
                { l: "Languages", v: "EN · PT · ES" },
              ].map((s) => (
                <div key={s.l} className="rounded-xl p-4 glass">
                  <div className="text-xs text-muted-foreground">{s.l}</div>
                  <div className="text-foreground font-medium mt-1">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
