import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { AlertTriangle, CheckCircle2, Clock, Loader2, RotateCw } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { AppShell } from "@/components/app-shell";
import { JOBS, THROUGHPUT } from "@/lib/mock-data";
import { ResolutionBadge } from "@/components/video-card";

export const Route = createFileRoute("/processing")({
  component: ProcessingPage,
  head: () => ({ meta: [{ title: "Processing Dashboard — Streamforge" }] }),
});

const statusTone: Record<string, { c: string; label: string; icon: any }> = {
  processing: { c: "bg-accent/15 text-accent border-accent/30", label: "Processing", icon: Loader2 },
  queued:     { c: "bg-muted text-muted-foreground border-border", label: "Queued", icon: Clock },
  completed:  { c: "bg-success/15 text-[oklch(0.85_0.16_155)] border-[oklch(0.72_0.17_155/0.3)]", label: "Completed", icon: CheckCircle2 },
  failed:     { c: "bg-destructive/15 text-[oklch(0.78_0.18_25)] border-destructive/30", label: "Failed", icon: AlertTriangle },
};

function ProcessingPage() {
  return (
    <AppShell>
      <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Processing</h1>
          <p className="text-muted-foreground mt-1">Real-time visibility into the encoding fleet.</p>
        </div>
        <div className="flex gap-2">
          {[
            { l: "Active", v: 4, c: "text-accent" },
            { l: "Queued", v: 2, c: "text-foreground" },
            { l: "Failed", v: 1, c: "text-[oklch(0.78_0.18_25)]" },
            { l: "Done · 24h", v: 1840, c: "text-[oklch(0.85_0.16_155)]" },
          ].map((s) => (
            <div key={s.l} className="rounded-xl px-4 py-3 glass min-w-[110px]">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
              <div className={`text-xl font-semibold mt-0.5 ${s.c}`}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Throughput chart */}
      <div className="rounded-3xl glass p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm font-medium">Encoder throughput · last 24h</div>
            <div className="text-xs text-muted-foreground">Minutes of video encoded per hour</div>
          </div>
          <div className="flex gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[oklch(0.68_0.22_300)]" /> Encoded</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[oklch(0.78_0.16_205)]" /> Queued</span>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer>
            <AreaChart data={THROUGHPUT}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.68 0.22 300)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="oklch(0.68 0.22 300)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.78 0.16 205)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="oklch(0.78 0.16 205)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
              <XAxis dataKey="hour" stroke="oklch(0.7 0.03 280)" fontSize={11} />
              <YAxis stroke="oklch(0.7 0.03 280)" fontSize={11} />
              <Tooltip contentStyle={{ background: "oklch(0.18 0.03 275)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12 }} />
              <Area type="monotone" dataKey="encoded" stroke="oklch(0.68 0.22 300)" fill="url(#g1)" strokeWidth={2} />
              <Area type="monotone" dataKey="queued" stroke="oklch(0.78 0.16 205)" fill="url(#g2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Job list */}
      <div className="rounded-3xl glass overflow-hidden">
        <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between">
          <div className="font-medium">Job queue</div>
          <div className="text-xs text-muted-foreground">Live</div>
        </div>
        <div className="divide-y divide-border/60">
          {JOBS.map((j, i) => {
            const s = statusTone[j.status];
            const Icon = s.icon;
            return (
              <motion.div
                key={j.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="p-5 flex flex-col md:flex-row md:items-center gap-4 hover:bg-secondary/30 transition"
              >
                <div className="flex items-center gap-3 min-w-0 md:w-1/3">
                  <div className={`h-10 w-10 rounded-xl border grid place-items-center ${s.c}`}>
                    <Icon className={`h-4 w-4 ${j.status === "processing" ? "animate-spin" : ""}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium truncate">{j.title}</div>
                    <div className="text-xs text-muted-foreground">{j.id} · {j.size}</div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
                    <span>{j.stage}</span>
                    <span>·</span>
                    <span>{j.worker}</span>
                    <ResolutionBadge res={j.resolution} />
                  </div>
                  <div className="h-1.5 rounded bg-secondary overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${j.progress}%` }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className={`h-full ${j.status==="failed"?"bg-destructive":"bg-[image:var(--gradient-primary)]"}`}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 md:w-40 justify-between md:justify-end">
                  <span className="text-xs text-muted-foreground">ETA {j.eta}</span>
                  {j.status === "failed" ? (
                    <button className="h-8 px-3 rounded-lg bg-destructive/15 text-[oklch(0.78_0.18_25)] text-xs font-medium inline-flex items-center gap-1"><RotateCw className="h-3 w-3" /> Retry</button>
                  ) : (
                    <button className="h-8 px-3 rounded-lg bg-secondary/60 text-xs">Details</button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
