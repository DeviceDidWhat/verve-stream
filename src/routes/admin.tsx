import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Activity, AlertOctagon, CheckCircle2, Cpu, Server, Zap } from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  RadialBarChart, RadialBar, PolarAngleAxis,
} from "recharts";
import { AppShell } from "@/components/app-shell";
import { THROUGHPUT, WORKERS } from "@/lib/mock-data";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Admin Monitoring — Streamforge" }] }),
});

const sla = [{ name: "uptime", value: 99.97, fill: "oklch(0.72 0.17 155)" }];

const statusTone: Record<string, string> = {
  healthy: "bg-success/15 text-[oklch(0.85_0.16_155)] border-[oklch(0.72_0.17_155/0.3)]",
  degraded: "bg-warning/15 text-[oklch(0.88_0.16_80)] border-[oklch(0.82_0.17_80/0.3)]",
  offline: "bg-destructive/15 text-[oklch(0.78_0.18_25)] border-destructive/30",
};

function AdminPage() {
  return (
    <AppShell>
      <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">System monitoring</h1>
          <p className="text-muted-foreground mt-1">Global fleet · 1,284 workers · 38 regions</p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs">
          <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full rounded-full bg-[oklch(0.72_0.17_155)] opacity-75 animate-ping" /><span className="relative inline-flex rounded-full h-2 w-2 bg-[oklch(0.72_0.17_155)]" /></span>
          All systems operational
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { l: "Throughput", v: "8.42 GB/s", i: Zap, c: "text-accent" },
          { l: "Active workers", v: "1,184", i: Cpu, c: "text-foreground" },
          { l: "Jobs / min", v: "942", i: Activity, c: "text-foreground" },
          { l: "Incidents · 24h", v: "2", i: AlertOctagon, c: "text-[oklch(0.78_0.18_25)]" },
        ].map((s, i) => (
          <motion.div key={s.l} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*0.05 }} className="rounded-2xl p-5 glass">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.l}</div>
              <s.i className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className={`mt-3 text-2xl font-semibold ${s.c}`}>{s.v}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 rounded-3xl glass p-6">
          <div className="font-medium mb-4">Queue depth · 24h</div>
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={THROUGHPUT}>
                <defs>
                  <linearGradient id="qd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.78 0.16 205)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.78 0.16 205)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                <XAxis dataKey="hour" stroke="oklch(0.7 0.03 280)" fontSize={11} />
                <YAxis stroke="oklch(0.7 0.03 280)" fontSize={11} />
                <Tooltip contentStyle={{ background: "oklch(0.18 0.03 275)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="queued" stroke="oklch(0.78 0.16 205)" fill="url(#qd)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-3xl glass p-6 flex flex-col items-center justify-center">
          <div className="font-medium self-start mb-2">SLA · 30d</div>
          <div className="relative h-52 w-full">
            <ResponsiveContainer>
              <RadialBarChart innerRadius="70%" outerRadius="100%" data={sla} startAngle={210} endAngle={-30}>
                <PolarAngleAxis type="number" domain={[0,100]} tick={false} />
                <RadialBar background={{ fill: "oklch(1 0 0 / 0.06)" }} dataKey="value" cornerRadius={20} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center">
                <div className="text-3xl font-semibold text-[oklch(0.85_0.16_155)]">99.97%</div>
                <div className="text-xs text-muted-foreground">uptime</div>
              </div>
            </div>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">Last incident · 12 days ago</div>
        </div>
      </div>

      {/* Worker nodes */}
      <div className="rounded-3xl glass overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between">
          <div className="font-medium flex items-center gap-2"><Server className="h-4 w-4 text-accent" /> Worker fleet</div>
          <div className="text-xs text-muted-foreground">Live · refreshed every 2s</div>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-px bg-border/60">
          {WORKERS.map((w, i) => (
            <motion.div key={w.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i*0.04 }} className="bg-card/40 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="font-mono text-xs">{w.id}</div>
                <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md border ${statusTone[w.status]}`}>{w.status}</span>
              </div>
              <div className="text-xs text-muted-foreground mb-3">{w.region} · {w.jobs} jobs</div>
              <div className="space-y-2">
                <Meter label="CPU" value={w.cpu} />
                <Meter label="GPU" value={w.gpu} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent events */}
      <div className="rounded-3xl glass overflow-hidden">
        <div className="px-6 py-4 border-b border-border/60 font-medium">Activity stream</div>
        <div className="divide-y divide-border/60">
          {[
            { t: "12s ago", e: "worker-us-11 finished job_8821 in 11.4s", ok: true },
            { t: "42s ago", e: "worker-eu-08 reported degraded — high CPU pressure", ok: false },
            { t: "1m ago",  e: "Autoscaler added 4 GPU workers in ap-northeast-1", ok: true },
            { t: "3m ago",  e: "job_8825 failed: encoder crash on x265 pass 2", ok: false },
            { t: "4m ago",  e: "Edge cache purge completed across 240 POPs", ok: true },
          ].map((ev, i) => (
            <div key={i} className="px-6 py-3 flex items-center gap-3 text-sm">
              {ev.ok
                ? <CheckCircle2 className="h-4 w-4 text-[oklch(0.85_0.16_155)] shrink-0" />
                : <AlertOctagon className="h-4 w-4 text-[oklch(0.78_0.18_25)] shrink-0" />}
              <div className="flex-1">{ev.e}</div>
              <div className="text-xs text-muted-foreground">{ev.t}</div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  const color = value > 85 ? "bg-[oklch(0.78_0.18_25)]" : value > 70 ? "bg-[oklch(0.82_0.17_80)]" : "bg-[image:var(--gradient-primary)]";
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
        <span>{label}</span><span className="tabular-nums">{value}%</span>
      </div>
      <div className="h-1.5 rounded bg-secondary overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1.2, ease: "easeOut" }} className={`h-full ${color}`} />
      </div>
    </div>
  );
}
