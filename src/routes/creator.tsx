import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowDownRight, ArrowUpRight, DollarSign, Eye, ThumbsUp, Users } from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar,
} from "recharts";
import { AppShell } from "@/components/app-shell";
import { VIDEOS, VIEWS_SERIES, REVENUE_SERIES } from "@/lib/mock-data";
import { ResolutionBadge } from "@/components/video-card";

export const Route = createFileRoute("/creator")({
  component: CreatorPage,
  head: () => ({ meta: [{ title: "Creator Studio — Streamforge" }] }),
});

const stats = [
  { l: "Views · 30d", v: "1.24M", d: "+18.2%", icon: Eye, up: true },
  { l: "Watch time", v: "84.5K hrs", d: "+12.1%", icon: Users, up: true },
  { l: "Subscribers", v: "248,910", d: "+3,402", icon: Users, up: true },
  { l: "Revenue", v: "$12,480", d: "-4.1%", icon: DollarSign, up: false },
];

function CreatorPage() {
  const top = VIDEOS.slice(0, 6);
  return (
    <AppShell>
      <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Creator Studio</h1>
          <p className="text-muted-foreground mt-1">Last 30 days · all channels</p>
        </div>
        <div className="inline-flex glass rounded-xl p-1 text-sm">
          {["7d","30d","90d","12m"].map((t,i) => (
            <button key={t} className={`px-3 py-1.5 rounded-lg ${i===1?"bg-secondary text-foreground":"text-muted-foreground"}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.l}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl p-5 glass relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.l}</div>
              <div className={`h-8 w-8 grid place-items-center rounded-lg ${s.up?"bg-accent/15 text-accent":"bg-destructive/15 text-[oklch(0.78_0.18_25)]"}`}>
                <s.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-semibold">{s.v}</div>
            <div className={`mt-1 inline-flex items-center gap-1 text-xs ${s.up?"text-[oklch(0.85_0.16_155)]":"text-[oklch(0.78_0.18_25)]"}`}>
              {s.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />} {s.d}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 rounded-3xl glass p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="font-medium">Views & watch time</div>
            <div className="flex gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[oklch(0.68_0.22_300)]" /> Views</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[oklch(0.78_0.16_205)]" /> Watch</span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={VIEWS_SERIES}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                <XAxis dataKey="day" stroke="oklch(0.7 0.03 280)" fontSize={11} />
                <YAxis stroke="oklch(0.7 0.03 280)" fontSize={11} />
                <Tooltip contentStyle={{ background: "oklch(0.18 0.03 275)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12 }} />
                <Line type="monotone" dataKey="views" stroke="oklch(0.68 0.22 300)" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="watch" stroke="oklch(0.78 0.16 205)" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-3xl glass p-6">
          <div className="font-medium mb-4">Revenue · 12 months</div>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={REVENUE_SERIES}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                <XAxis dataKey="month" stroke="oklch(0.7 0.03 280)" fontSize={11} />
                <YAxis stroke="oklch(0.7 0.03 280)" fontSize={11} />
                <Tooltip contentStyle={{ background: "oklch(0.18 0.03 275)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12 }} />
                <Bar dataKey="revenue" fill="oklch(0.68 0.22 300)" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top videos */}
      <div className="rounded-3xl glass overflow-hidden">
        <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between">
          <div className="font-medium">Top performing videos</div>
          <button className="text-xs text-muted-foreground hover:text-foreground">Export</button>
        </div>
        <div className="divide-y divide-border/60">
          {top.map((v, i) => (
            <div key={v.id} className="px-6 py-4 flex items-center gap-4 hover:bg-secondary/30 transition">
              <div className="text-xs text-muted-foreground w-6">{String(i+1).padStart(2,"0")}</div>
              <div className={`h-12 w-20 rounded-lg bg-gradient-to-br ${v.thumbnail} shrink-0`} />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{v.title}</div>
                <div className="text-xs text-muted-foreground">Published {v.uploaded} · <ResolutionBadge res={v.resolution} /></div>
              </div>
              <div className="hidden sm:flex gap-8 text-sm tabular-nums">
                <div><div className="text-xs text-muted-foreground">Views</div>{v.views}</div>
                <div><div className="text-xs text-muted-foreground">Likes</div>{v.likes}</div>
                <div className="text-[oklch(0.85_0.16_155)]"><div className="text-xs text-muted-foreground">CTR</div>{(4+i*0.6).toFixed(1)}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
