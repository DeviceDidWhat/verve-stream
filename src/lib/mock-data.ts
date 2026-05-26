export type Video = {
  id: string;
  title: string;
  creator: string;
  creatorAvatar: string;
  thumbnail: string;
  duration: string;
  views: string;
  uploaded: string;
  resolution: "4K" | "1080p" | "720p" | "480p";
  category: string;
  likes: string;
  description: string;
};

const gradients = [
  "from-violet-500 via-fuchsia-500 to-cyan-400",
  "from-cyan-400 via-blue-500 to-indigo-600",
  "from-rose-500 via-orange-400 to-amber-300",
  "from-emerald-400 via-teal-500 to-cyan-500",
  "from-indigo-500 via-purple-600 to-pink-500",
  "from-amber-400 via-rose-500 to-fuchsia-600",
  "from-sky-400 via-violet-500 to-fuchsia-500",
  "from-lime-400 via-emerald-500 to-teal-600",
  "from-pink-500 via-red-500 to-yellow-500",
  "from-blue-500 via-indigo-600 to-violet-700",
  "from-fuchsia-500 via-pink-500 to-rose-400",
  "from-teal-400 via-cyan-500 to-blue-600",
];

export function gradientFor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return gradients[h % gradients.length];
}

const creators = [
  "Nova Reyes", "Kai Tanaka", "Mira Holm", "Leo Costa", "Aya Okafor",
  "Ezra Park", "Jules Vidal", "Sasha Lin", "Theo Marsh", "Indira Vale",
];

const categories = ["All", "Music", "Gaming", "Tech", "Film", "Sports", "Education", "Travel", "Cooking", "Design"];
export const CATEGORIES = categories;

const titles = [
  "Inside the Distributed Render Farm",
  "Building a 4K Live Pipeline from Scratch",
  "Neon Nights: A Tokyo Drift Cinematic",
  "How We Transcode 10M Videos a Day",
  "The Art of Slow Cinema",
  "Edge Compute for Video Streaming",
  "Sunset Run — Ambient Synthwave Mix",
  "GPU vs CPU Encoding Benchmarks 2026",
  "A Quiet Walk Through Reykjavik",
  "Designing the Perfect Video Player",
  "Inside Netflix's Open Connect",
  "Reactive Streams in Production",
  "From RAW to HDR in 8 minutes",
  "Why Adaptive Bitrate Matters",
  "Building Streamforge — Devlog #3",
  "Cinematic Drone Reels in 4K",
  "Real-time Chat at 1M Concurrent",
  "Color Grading for the Web",
  "Behind the scenes: 100k worker fleet",
  "Lo-fi Beats to Ship Code To",
];

const resolutions: Video["resolution"][] = ["4K", "1080p", "1080p", "720p", "1080p", "4K", "720p", "480p"];

export const VIDEOS: Video[] = Array.from({ length: 32 }).map((_, i) => {
  const id = `vid_${(i + 1).toString().padStart(4, "0")}`;
  const creator = creators[i % creators.length];
  return {
    id,
    title: titles[i % titles.length],
    creator,
    creatorAvatar: creator.split(" ").map((n) => n[0]).join(""),
    thumbnail: gradientFor(id),
    duration: ["3:24", "8:11", "12:45", "1:02:18", "4:56", "27:30", "0:48", "15:09"][i % 8],
    views: ["1.2M", "248K", "12.4M", "984K", "32K", "5.8M", "812K", "67K"][i % 8],
    uploaded: ["2 hours ago", "1 day ago", "3 days ago", "1 week ago", "2 weeks ago", "1 month ago"][i % 6],
    resolution: resolutions[i % resolutions.length],
    category: categories[1 + (i % (categories.length - 1))],
    likes: ["12K", "4.2K", "98K", "1.1K", "44K", "230"][i % 6],
    description:
      "A deep dive into modern distributed video infrastructure — encoding farms, edge caching, adaptive streaming, and the operational realities of running at planetary scale.",
  };
});

export type Job = {
  id: string;
  title: string;
  status: "queued" | "processing" | "completed" | "failed";
  progress: number;
  stage: string;
  worker: string;
  eta: string;
  resolution: string;
  size: string;
};

export const JOBS: Job[] = [
  { id: "job_8821", title: "Inside the Distributed Render Farm", status: "processing", progress: 64, stage: "Transcoding 1080p", worker: "worker-eu-03", eta: "2m 14s", resolution: "1080p", size: "1.4 GB" },
  { id: "job_8822", title: "Sunset Run — Synthwave Mix", status: "processing", progress: 28, stage: "Generating HLS chunks", worker: "worker-us-11", eta: "6m 42s", resolution: "4K", size: "3.8 GB" },
  { id: "job_8823", title: "Cinematic Drone Reels", status: "queued", progress: 0, stage: "Awaiting worker", worker: "—", eta: "queued", resolution: "4K", size: "2.1 GB" },
  { id: "job_8824", title: "Devlog #3 — Streamforge", status: "completed", progress: 100, stage: "Published", worker: "worker-ap-02", eta: "done", resolution: "1080p", size: "742 MB" },
  { id: "job_8825", title: "GPU vs CPU Benchmarks", status: "failed", progress: 47, stage: "Encoder crash", worker: "worker-eu-08", eta: "retry", resolution: "1080p", size: "980 MB" },
  { id: "job_8826", title: "Quiet Walk Through Reykjavik", status: "processing", progress: 89, stage: "Thumbnail extraction", worker: "worker-us-04", eta: "32s", resolution: "1080p", size: "1.1 GB" },
  { id: "job_8827", title: "Color Grading for the Web", status: "queued", progress: 0, stage: "Awaiting worker", worker: "—", eta: "queued", resolution: "720p", size: "420 MB" },
];

export const WORKERS = [
  { id: "worker-us-01", region: "us-east-1", status: "healthy", cpu: 42, gpu: 71, jobs: 3 },
  { id: "worker-us-04", region: "us-west-2", status: "healthy", cpu: 68, gpu: 88, jobs: 4 },
  { id: "worker-us-11", region: "us-east-1", status: "healthy", cpu: 81, gpu: 94, jobs: 5 },
  { id: "worker-eu-03", region: "eu-west-1", status: "healthy", cpu: 55, gpu: 62, jobs: 2 },
  { id: "worker-eu-08", region: "eu-central-1", status: "degraded", cpu: 92, gpu: 38, jobs: 1 },
  { id: "worker-ap-02", region: "ap-northeast-1", status: "healthy", cpu: 37, gpu: 51, jobs: 3 },
  { id: "worker-ap-07", region: "ap-southeast-1", status: "offline", cpu: 0, gpu: 0, jobs: 0 },
  { id: "worker-sa-01", region: "sa-east-1", status: "healthy", cpu: 64, gpu: 79, jobs: 4 },
];

export const THROUGHPUT = Array.from({ length: 24 }).map((_, i) => ({
  hour: `${i}h`,
  encoded: Math.round(120 + Math.sin(i / 2) * 60 + Math.random() * 40),
  queued: Math.round(80 + Math.cos(i / 3) * 40 + Math.random() * 30),
}));

export const VIEWS_SERIES = Array.from({ length: 30 }).map((_, i) => ({
  day: `D${i + 1}`,
  views: Math.round(8000 + Math.sin(i / 3) * 2500 + i * 180 + Math.random() * 1200),
  watch: Math.round(2200 + Math.cos(i / 4) * 800 + i * 60 + Math.random() * 400),
}));

export const REVENUE_SERIES = Array.from({ length: 12 }).map((_, i) => ({
  month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  revenue: Math.round(2400 + i * 380 + Math.random() * 600),
}));
