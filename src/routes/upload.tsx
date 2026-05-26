import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, CloudUpload, File as FileIcon, Pause, X, Zap } from "lucide-react";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/upload")({
  component: UploadPage,
  head: () => ({ meta: [{ title: "Upload Studio — Streamforge" }] }),
});

type Upload = {
  id: string; name: string; size: string; progress: number;
  parts: { idx: number; done: boolean }[];
  status: "uploading" | "paused" | "done";
};

function UploadPage() {
  const [drag, setDrag] = useState(false);
  const [uploads, setUploads] = useState<Upload[]>([
    mockUpload("Sunset_Reel_Master_4K.mov", "4.2 GB", 62, "uploading"),
    mockUpload("Interview_Cut_v3.mp4", "1.1 GB", 100, "done"),
    mockUpload("Devlog_Episode_03.mkv", "768 MB", 23, "paused"),
  ]);

  useEffect(() => {
    const t = setInterval(() => {
      setUploads((us) => us.map((u) =>
        u.status === "uploading" && u.progress < 100
          ? { ...u, progress: Math.min(100, u.progress + Math.random() * 3),
              parts: u.parts.map((p, i) => ({ ...p, done: (u.progress + 4) / 100 * u.parts.length > i })) }
          : u
      ));
    }, 600);
    return () => clearInterval(t);
  }, []);

  function addFile() {
    setUploads((u) => [
      mockUpload(`Untitled_Clip_${u.length + 1}.mp4`, "2.4 GB", 0, "uploading"),
      ...u,
    ]);
  }

  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Upload Studio</h1>
        <p className="text-muted-foreground mt-1">Drag, drop, ship. Resumable multipart uploads with real-time transcoding.</p>
      </div>

      {/* Dropzone */}
      <motion.div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); addFile(); }}
        animate={{ scale: drag ? 1.01 : 1 }}
        className={`relative rounded-3xl border-2 border-dashed overflow-hidden p-12 text-center transition-all ${
          drag ? "border-primary bg-primary/5" : "border-border/60 bg-card/30"
        }`}
      >
        <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ background: "var(--gradient-hero)" }} />
        <div className="relative">
          <motion.div animate={{ y: drag ? -6 : 0 }} className="mx-auto h-20 w-20 rounded-2xl bg-[image:var(--gradient-primary)] grid place-items-center shadow-[var(--shadow-glow)]">
            <CloudUpload className="h-9 w-9 text-primary-foreground" />
          </motion.div>
          <h2 className="mt-6 text-2xl font-semibold">Drop your video here</h2>
          <p className="text-muted-foreground mt-2">MP4, MOV, MKV, WebM — up to 50 GB per file.</p>
          <div className="mt-6 flex justify-center gap-3">
            <button onClick={addFile} className="h-11 px-6 rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground font-medium">Select files</button>
            <button className="h-11 px-6 rounded-xl glass">Import from URL</button>
          </div>
          <div className="mt-6 text-xs text-muted-foreground flex justify-center gap-6">
            <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-accent" /> Auto HLS</span>
            <span>Resumable</span>
            <span>Parallel chunks</span>
            <span>HDR / DOLBY preserved</span>
          </div>
        </div>
      </motion.div>

      {/* Active uploads */}
      <div className="mt-10">
        <div className="flex items-end justify-between mb-4">
          <h3 className="text-lg font-semibold tracking-tight">Active uploads</h3>
          <Link to="/processing" className="text-sm text-muted-foreground hover:text-foreground">Open processing queue →</Link>
        </div>
        <div className="space-y-3">
          <AnimatePresence>
            {uploads.map((u) => (
              <motion.div
                key={u.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 30 }}
                className="rounded-2xl p-5 glass"
              >
                <div className="flex items-center gap-4">
                  <div className="h-11 w-11 rounded-xl bg-secondary grid place-items-center"><FileIcon className="h-5 w-5 text-accent" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 justify-between">
                      <div className="font-medium truncate">{u.name}</div>
                      <div className="text-xs text-muted-foreground">{u.size} · {Math.round(u.progress)}%</div>
                    </div>
                    {/* Parts viz */}
                    <div className="mt-3 grid grid-cols-32 gap-[2px] h-2 rounded overflow-hidden" style={{ gridTemplateColumns: `repeat(${u.parts.length}, minmax(0,1fr))` }}>
                      {u.parts.map((p) => (
                        <div key={p.idx} className={p.done ? "bg-[image:var(--gradient-primary)]" : "bg-secondary"} />
                      ))}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground flex gap-4">
                      <span>{u.parts.filter(p=>p.done).length}/{u.parts.length} parts</span>
                      <span>· 24 MB/s</span>
                      <span>· ETA {u.status === "done" ? "—" : "1m 42s"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {u.status === "done" ? (
                      <div className="h-8 px-3 rounded-lg bg-success/15 text-[oklch(0.85_0.16_155)] text-xs font-medium inline-flex items-center gap-1"><Check className="h-3.5 w-3.5" /> Ready</div>
                    ) : (
                      <button className="h-8 w-8 grid place-items-center rounded-lg bg-secondary/60"><Pause className="h-3.5 w-3.5" /></button>
                    )}
                    <button className="h-8 w-8 grid place-items-center rounded-lg bg-secondary/60"><X className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </AppShell>
  );
}

function mockUpload(name: string, size: string, progress: number, status: Upload["status"]): Upload {
  const parts = Array.from({ length: 32 }).map((_, i) => ({ idx: i, done: (progress / 100) * 32 > i }));
  return { id: name + Math.random(), name, size, progress, parts, status };
}
