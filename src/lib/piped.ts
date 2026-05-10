const INSTANCES = [
  "https://pipedapi.kavin.rocks",
  "https://pipedapi.adminforge.de",
  "https://api.piped.private.coffee",
];

async function fetchWithFallback(path: string): Promise<any> {
  let lastErr: unknown;
  for (const base of INSTANCES) {
    try {
      const res = await fetch(base + path, { headers: { accept: "application/json" } });
      if (!res.ok) throw new Error(String(res.status));
      return await res.json();
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr ?? new Error("All Piped instances failed");
}

export type PipedVideo = {
  url: string;
  title: string;
  thumbnail: string;
  uploaderName: string;
  uploaderUrl?: string;
  uploaderAvatar?: string;
  duration: number;
  views: number;
  uploadedDate?: string;
  shortDescription?: string;
};

export const piped = {
  trending: (region = "US") => fetchWithFallback(`/trending?region=${region}`) as Promise<PipedVideo[]>,
  search: (q: string) =>
    fetchWithFallback(`/search?q=${encodeURIComponent(q)}&filter=videos`) as Promise<{ items: PipedVideo[] }>,
  streams: (id: string) => fetchWithFallback(`/streams/${id}`) as Promise<any>,
  channel: (id: string) => fetchWithFallback(`/channel/${id}`) as Promise<any>,
};

export function videoIdFromUrl(url: string): string {
  const m = url.match(/[?&]v=([^&]+)/);
  return m ? m[1] : url.replace(/^\//, "");
}

export function formatViews(n: number): string {
  if (!n && n !== 0) return "";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

export function formatDuration(s: number): string {
  if (!s) return "";
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  const pad = (x: number) => x.toString().padStart(2, "0");
  return h ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`;
}