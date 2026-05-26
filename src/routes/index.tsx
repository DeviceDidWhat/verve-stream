import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowRight, Cpu, Film, Gauge, Globe2, Layers, PlayCircle, Shield,
  Sparkles, Workflow, Zap,
} from "lucide-react";
import { VIDEOS, gradientFor } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Streamforge — Distributed Video Processing Platform" },
      { name: "description", content: "Upload, transcode, distribute. The video infrastructure platform engineered for the next billion creators." },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      {/* Nav */}
      <header className="relative z-20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-[image:var(--gradient-primary)] grid place-items-center shadow-[var(--shadow-glow)]">
              <Film className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold tracking-tight">Streamforge</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition">Platform</a>
            <a href="#pipeline" className="hover:text-foreground transition">Pipeline</a>
            <a href="#showcase" className="hover:text-foreground transition">Showcase</a>
            <Link to="/admin" className="hover:text-foreground transition">Dashboard</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className="h-9 px-4 grid place-items-center rounded-lg text-sm text-muted-foreground hover:text-foreground transition">Sign in</Link>
            <Link to="/feed" className="h-9 px-4 grid place-items-center rounded-lg text-sm font-medium bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]">
              Launch app
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-24 lg:pt-20 lg:pb-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 text-accent" />
            Now processing 2.4M hours of video per day
          </div>
          <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.02]">
            Video infrastructure
            <br />
            <span className="gradient-text">for the next billion creators.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
            Upload once. Transcode globally. Stream anywhere. Streamforge is the distributed media platform that turns a raw upload into adaptive HLS in seconds.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link to="/feed" className="group inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground font-medium shadow-[var(--shadow-glow)]">
              Start streaming <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition" />
            </Link>
            <Link to="/upload" className="inline-flex items-center gap-2 h-12 px-6 rounded-xl glass text-foreground font-medium">
              <PlayCircle className="h-4 w-4" /> Watch demo
            </Link>
          </div>
        </motion.div>

        {/* Floating preview */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 relative"
        >
          <div className="rounded-3xl overflow-hidden glass-strong p-3 shadow-[var(--shadow-soft)]">
            <div className="rounded-2xl overflow-hidden bg-background">
              {/* Mock dashboard */}
              <div className="grid grid-cols-12 gap-px bg-border/50">
                <div className="col-span-12 md:col-span-3 bg-sidebar p-5 space-y-3">
                  {["Library","Upload","Processing","Analytics","Workers"].map((l, i) => (
                    <div key={l} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${i===2?"bg-secondary text-foreground":"text-muted-foreground"}`}>
                      <div className="h-2 w-2 rounded-full bg-[image:var(--gradient-primary)] opacity-70" />
                      {l}
                    </div>
                  ))}
                </div>
                <div className="col-span-12 md:col-span-9 bg-background p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-muted-foreground">Active jobs · 142</div>
                    <div className="flex gap-2 text-xs">
                      <span className="px-2 py-1 rounded-md bg-success/15 text-[oklch(0.85_0.16_155)]">98 healthy</span>
                      <span className="px-2 py-1 rounded-md bg-warning/15 text-[oklch(0.88_0.16_80)]">3 degraded</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {VIDEOS.slice(0, 4).map((v, i) => (
                      <motion.div
                        key={v.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.08, duration: 0.5 }}
                        className={`aspect-video rounded-lg bg-gradient-to-br ${v.thumbnail} relative overflow-hidden`}
                      >
                        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                          <div className="text-[10px] text-white/90 font-medium truncate">{v.title}</div>
                          <div className="mt-1 h-1 rounded bg-white/20 overflow-hidden">
                            <div className="h-full bg-[image:var(--gradient-primary)]" style={{ width: `${30 + i*15}%` }} />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {[
                      { l: "Throughput", v: "8.4 GB/s", c: "text-accent" },
                      { l: "Avg encode", v: "12.4s", c: "text-foreground" },
                      { l: "Edge hit rate", v: "97.8%", c: "text-[oklch(0.85_0.16_155)]" },
                    ].map((s) => (
                      <div key={s.l} className="rounded-lg p-3 bg-secondary/50">
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
                        <div className={`text-lg font-semibold mt-1 ${s.c}`}>{s.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute -inset-10 rounded-[3rem] bg-[image:var(--gradient-primary)] opacity-20 blur-3xl -z-10" />
        </motion.div>
      </section>

      {/* Logos */}
      <section className="relative z-10 border-y border-border/60 bg-card/30">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-wrap items-center justify-center gap-x-14 gap-y-4 text-muted-foreground text-sm">
          {["NEBULA","ORBIT","PRISM","HELIOS","KAIROS","ATLAS"].map((n) => (
            <span key={n} className="tracking-[0.3em] font-semibold opacity-70">{n}</span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-28">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.2em] text-accent">Platform</div>
          <h2 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight">Built for scale, designed for craft.</h2>
          <p className="mt-4 text-muted-foreground">Every piece of the stack — ingest, transcode, package, deliver — engineered to feel like a single product.</p>
        </div>
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { i: Workflow, t: "Distributed transcoding", d: "Spin up thousands of GPU workers across 38 regions. Zero queue lag, zero ops." },
            { i: Cpu, t: "Adaptive bitrate", d: "HLS and DASH manifests generated automatically with per-title encoding." },
            { i: Globe2, t: "Edge delivery", d: "Cache video segments at 240+ POPs with 97.8% hit rate." },
            { i: Layers, t: "Multipart uploads", d: "Resumable, parallel chunked uploads with backpressure-aware retries." },
            { i: Gauge, t: "Real-time pipeline", d: "Watch jobs progress through ingest, probe, transcode and publish stages." },
            { i: Shield, t: "DRM & geofencing", d: "Widevine, FairPlay, signed URLs, regional restrictions out of the box." },
          ].map((f, i) => (
            <motion.div
              key={f.t}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="group relative rounded-2xl p-6 glass hover:-translate-y-1 transition-all"
            >
              <div className="h-11 w-11 rounded-xl bg-[image:var(--gradient-primary)] grid place-items-center mb-5">
                <f.i className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="font-medium text-lg">{f.t}</div>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{f.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pipeline */}
      <section id="pipeline" className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="rounded-3xl glass-strong p-10 md:p-16 relative overflow-hidden">
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[image:var(--gradient-primary)] opacity-20 blur-3xl" />
          <div className="text-xs uppercase tracking-[0.2em] text-accent">Pipeline</div>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight max-w-xl">From upload to viewer in under 12 seconds.</h2>
          <div className="mt-12 grid md:grid-cols-5 gap-6">
            {[
              { t: "Ingest", d: "Multipart resumable" },
              { t: "Probe", d: "Codec + metadata" },
              { t: "Transcode", d: "GPU parallel ladder" },
              { t: "Package", d: "HLS / DASH / CMAF" },
              { t: "Deliver", d: "Edge POPs worldwide" },
            ].map((s, i) => (
              <div key={s.t} className="relative">
                <div className="h-12 w-12 rounded-xl bg-secondary grid place-items-center font-semibold text-accent border border-border/60">{i+1}</div>
                <div className="mt-4 font-medium">{s.t}</div>
                <div className="text-sm text-muted-foreground">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase */}
      <section id="showcase" className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-accent">Showcase</div>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight">Built by creators, run by engineers.</h2>
          </div>
          <Link to="/feed" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            See feed <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {VIDEOS.slice(0, 8).map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className={`aspect-[3/4] rounded-2xl bg-gradient-to-br ${v.thumbnail} relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="text-[10px] uppercase tracking-wider text-white/70">{v.category}</div>
                <div className="mt-1 text-sm font-medium text-white line-clamp-2">{v.title}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
        <div className="rounded-3xl p-12 md:p-20 text-center relative overflow-hidden glass-strong">
          <div className="absolute inset-0 opacity-40" style={{ background: "var(--gradient-hero)" }} />
          <div className="relative">
            <Zap className="h-8 w-8 mx-auto text-accent" />
            <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">Ready to ship video at scale?</h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Free tier includes 100 GB of transcoding and unlimited streaming for the first 30 days.</p>
            <div className="mt-8 inline-flex gap-3">
              <Link to="/login" className="h-12 px-6 grid place-items-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground font-medium shadow-[var(--shadow-glow)]">Create account</Link>
              <Link to="/feed" className="h-12 px-6 grid place-items-center rounded-xl glass text-foreground font-medium">Browse demo</Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-border/60">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Film className="h-4 w-4 text-accent" /> Streamforge © 2026
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">Docs</a>
            <a href="#" className="hover:text-foreground">Status</a>
            <a href="#" className="hover:text-foreground">Pricing</a>
            <a href="#" className="hover:text-foreground">Careers</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
