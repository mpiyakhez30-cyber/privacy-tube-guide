import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { VideoGrid } from "@/components/VideoGrid";
import { piped } from "@/lib/piped";

export const Route = createFileRoute("/trending")({
  component: TrendingPage,
  head: () => ({ meta: [{ title: "Trending — PrivateTube" }] }),
});

function TrendingPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["trending"],
    queryFn: () => piped.trending("US"),
  });
  return (
    <AppShell>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Trending</h1>
      {isLoading ? <p className="text-muted-foreground">Loading…</p> : data && <VideoGrid videos={data} />}
    </AppShell>
  );
}