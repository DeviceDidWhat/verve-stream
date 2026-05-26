import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Bell, Compass, Film, Flame, Home, LayoutDashboard, Search, Settings,
  ShieldCheck, Upload, User, Video, Sparkles, Activity,
} from "lucide-react";
import { type ReactNode } from "react";

const navMain = [
  { to: "/feed", label: "Home", icon: Home },
  { to: "/feed", label: "Trending", icon: Flame, hash: "trending" },
  { to: "/feed", label: "Explore", icon: Compass, hash: "explore" },
];
const navStudio = [
  { to: "/upload", label: "Upload", icon: Upload },
  { to: "/processing", label: "Processing", icon: Activity },
  { to: "/creator", label: "Creator Studio", icon: LayoutDashboard },
];
const navYou = [
  { to: "/profile", label: "Profile", icon: User },
  { to: "/admin", label: "Admin", icon: ShieldCheck },
];

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <div className="relative h-9 w-9 rounded-xl bg-[image:var(--gradient-primary)] grid place-items-center shadow-[var(--shadow-glow)]">
        <Film className="h-5 w-5 text-primary-foreground" />
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-[image:var(--gradient-primary)] blur-md -z-10" />
      </div>
      <div className="leading-none">
        <div className="font-semibold tracking-tight text-foreground">Streamforge</div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">video infra</div>
      </div>
    </Link>
  );
}

function NavItem({ to, label, icon: Icon, active }: { to: string; label: string; icon: any; active: boolean }) {
  return (
    <Link
      to={to}
      className={[
        "group relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all",
        active ? "text-foreground bg-secondary/60" : "text-muted-foreground hover:text-foreground hover:bg-secondary/40",
      ].join(" ")}
    >
      {active && (
        <motion.div
          layoutId="nav-active"
          className="absolute inset-0 rounded-xl bg-[image:var(--gradient-primary)] opacity-15"
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
        />
      )}
      <Icon className="h-[18px] w-[18px] relative z-10" />
      <span className="relative z-10">{label}</span>
    </Link>
  );
}

export function Sidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col gap-6 py-6 px-4 border-r border-border/60 bg-sidebar sticky top-0 h-screen">
      <Brand />
      <nav className="flex flex-col gap-1">
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground px-3 mb-1">Discover</div>
        {navMain.map((n) => (
          <NavItem key={n.label} to={n.to} label={n.label} icon={n.icon} active={path === n.to && !n.hash} />
        ))}
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground px-3 mb-1 mt-4">Studio</div>
        {navStudio.map((n) => (
          <NavItem key={n.label} to={n.to} label={n.label} icon={n.icon} active={path.startsWith(n.to)} />
        ))}
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground px-3 mb-1 mt-4">You</div>
        {navYou.map((n) => (
          <NavItem key={n.label} to={n.to} label={n.label} icon={n.icon} active={path.startsWith(n.to)} />
        ))}
      </nav>
      <div className="mt-auto glass rounded-2xl p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground"><Sparkles className="h-3.5 w-3.5 text-accent" /> Streamforge Pro</div>
        <div className="mt-1 text-sm font-medium">Unlock 4K transcoding</div>
        <button className="mt-3 w-full text-xs font-medium py-2 rounded-lg bg-[image:var(--gradient-primary)] text-primary-foreground">
          Upgrade
        </button>
      </div>
    </aside>
  );
}

export function Topbar() {
  return (
    <header className="sticky top-0 z-40 glass-strong border-b border-border/60">
      <div className="flex items-center gap-3 px-4 lg:px-6 h-16">
        <div className="lg:hidden"><Brand /></div>
        <div className="flex-1 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search videos, creators, jobs…"
              className="w-full h-10 pl-9 pr-24 rounded-xl bg-secondary/60 border border-border/60 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition"
            />
            <kbd className="hidden sm:inline-flex absolute right-2 top-1/2 -translate-y-1/2 items-center px-2 py-1 rounded-md text-[10px] bg-background/60 text-muted-foreground border border-border/60">⌘K</kbd>
          </div>
        </div>
        <Link to="/upload" className="hidden sm:inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-secondary/60 hover:bg-secondary text-sm transition border border-border/60">
          <Upload className="h-4 w-4" /> Upload
        </Link>
        <button className="relative h-10 w-10 grid place-items-center rounded-xl bg-secondary/60 hover:bg-secondary transition border border-border/60">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-accent" />
        </button>
        <Link to="/profile" className="h-10 w-10 grid place-items-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground text-sm font-semibold">
          NR
        </Link>
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-background relative overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 opacity-50" style={{ background: "var(--gradient-hero)" }} />
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 relative">
        <Topbar />
        <main className="flex-1 px-4 lg:px-6 py-6 lg:py-8 max-w-[1600px] w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
