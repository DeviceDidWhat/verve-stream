import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Eye, EyeOff, Film, Github, Mail } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: AuthPage,
  head: () => ({ meta: [{ title: "Sign in — Streamforge" }] }),
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [show, setShow] = useState(false);

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-60" style={{ background: "var(--gradient-hero)" }} />

      {/* Left: form */}
      <div className="relative z-10 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link to="/" className="inline-flex items-center gap-2 mb-10">
            <div className="h-9 w-9 rounded-xl bg-[image:var(--gradient-primary)] grid place-items-center"><Film className="h-5 w-5 text-primary-foreground" /></div>
            <span className="font-semibold tracking-tight">Streamforge</span>
          </Link>

          <div className="inline-flex glass rounded-xl p-1 mb-8 text-sm">
            {(["signin","signup"] as const).map((m) => (
              <button key={m} onClick={() => setMode(m)} className={`relative px-4 py-1.5 rounded-lg ${mode===m?"text-foreground":"text-muted-foreground"}`}>
                {mode === m && <motion.div layoutId="auth-pill" className="absolute inset-0 rounded-lg bg-secondary" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                <span className="relative">{m === "signin" ? "Sign in" : "Create account"}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={mode} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
              <h1 className="text-3xl font-semibold tracking-tight">
                {mode === "signin" ? "Welcome back." : "Build with us."}
              </h1>
              <p className="text-muted-foreground mt-2 text-sm">
                {mode === "signin" ? "Sign in to access your studio." : "Free tier · 100 GB transcoding included."}
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <button className="h-11 rounded-xl glass inline-flex items-center justify-center gap-2 text-sm"><Github className="h-4 w-4" /> GitHub</button>
                <button className="h-11 rounded-xl glass inline-flex items-center justify-center gap-2 text-sm"><Mail className="h-4 w-4" /> Google</button>
              </div>
              <div className="flex items-center gap-3 my-6 text-xs text-muted-foreground">
                <div className="flex-1 h-px bg-border" /> or with email <div className="flex-1 h-px bg-border" />
              </div>

              <form className="space-y-3">
                {mode === "signup" && (
                  <Field label="Full name" placeholder="Nova Reyes" />
                )}
                <Field label="Email" placeholder="you@streamforge.com" type="email" />
                <div>
                  <label className="text-xs text-muted-foreground">Password</label>
                  <div className="mt-1.5 relative">
                    <input type={show?"text":"password"} placeholder="••••••••" className="w-full h-11 px-4 pr-10 rounded-xl bg-secondary/60 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                    <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 grid place-items-center text-muted-foreground">
                      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Link to="/feed" className="mt-2 inline-flex w-full h-11 items-center justify-center gap-2 rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground font-medium shadow-[var(--shadow-glow)]">
                  {mode === "signin" ? "Sign in" : "Create account"} <ArrowRight className="h-4 w-4" />
                </Link>
              </form>

              <div className="mt-6 text-xs text-muted-foreground text-center">
                {mode === "signin" ? <>New here? <button onClick={() => setMode("signup")} className="text-foreground underline-offset-4 hover:underline">Create an account</button></> : <>Already have one? <button onClick={() => setMode("signin")} className="text-foreground underline-offset-4 hover:underline">Sign in</button></>}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Right: visual */}
      <div className="relative hidden lg:block">
        <div className="absolute inset-0 m-12 rounded-3xl overflow-hidden glass-strong">
          <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
          <div className="relative h-full grid place-items-center p-12 text-center">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-accent">Now playing</div>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight">Distribute your story.</h2>
              <p className="mt-3 text-muted-foreground max-w-md mx-auto">Streamforge moves a 4K master across the planet in under 12 seconds.</p>
              <div className="mt-10 grid grid-cols-3 gap-3 max-w-sm mx-auto">
                {Array.from({ length: 9 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.06 }}
                    className={`aspect-square rounded-xl bg-gradient-to-br ${["from-violet-500 to-fuchsia-500","from-cyan-400 to-blue-600","from-pink-500 to-rose-500","from-emerald-400 to-teal-600","from-amber-400 to-orange-500","from-indigo-500 to-violet-700","from-fuchsia-500 to-pink-500","from-sky-400 to-cyan-500","from-lime-400 to-emerald-500"][i]}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, placeholder, type = "text" }: { label: string; placeholder: string; type?: string }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      <input type={type} placeholder={placeholder} className="mt-1.5 w-full h-11 px-4 rounded-xl bg-secondary/60 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
    </div>
  );
}
