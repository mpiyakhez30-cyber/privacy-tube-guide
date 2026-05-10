import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { VideoGrid } from "@/components/VideoGrid";
import { piped } from "@/lib/piped";
import { Shield, Zap, EyeOff } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "PrivateTube — Watch YouTube without tracking" },
      { name: "description", content: "A privacy-first YouTube client. No ads, no cookies, no account required." },
    ],
  }),
});

function Index() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["trending", "US"],
    queryFn: () => piped.trending("US"),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <AppShell>
      <section
        className="relative mb-8 overflow-hidden rounded-2xl border border-border p-8 md:p-12"
        style={{ background: "var(--gradient-surface)" }}
      >
        <div
          className="absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-30 blur-3xl"
          style={{ background: "var(--gradient-primary)" }}
        />
        <h1 className="relative max-w-2xl text-3xl font-bold tracking-tight md:text-5xl">
          Watch YouTube. <span className="text-primary">Without the watching.</span>
        </h1>
        <p className="relative mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
          No ads. No Google cookies. No account. PrivateTube routes through privacy-friendly proxies and keeps everything local.
        </p>
        <div className="relative mt-6 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-primary" /> No tracking</span>
          <span className="inline-flex items-center gap-1.5"><EyeOff className="h-3.5 w-3.5 text-primary" /> No ads</span>
          <span className="inline-flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-primary" /> Local-only data</span>
        </div>
      </section>

      <h2 className="mb-4 text-xl font-bold tracking-tight">Trending now</h2>
      {isLoading && <GridSkeleton />}
      {error && <p className="text-sm text-muted-foreground">Couldn't reach Piped instances. Try again in a moment.</p>}
      {data && <VideoGrid videos={data.slice(0, 24)} />}
    </AppShell>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="aspect-video animate-pulse rounded-xl bg-secondary" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-secondary" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-secondary" />
        </div>
      ))}
    </div>
  );
}
