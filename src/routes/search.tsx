import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { AppShell } from "@/components/AppShell";
import { VideoGrid } from "@/components/VideoGrid";
import { piped } from "@/lib/piped";

const searchSchema = z.object({ q: z.string().optional().default("") });

export const Route = createFileRoute("/search")({
  validateSearch: searchSchema,
  component: SearchPage,
  head: () => ({ meta: [{ title: "Search — PrivateTube" }] }),
});

function SearchPage() {
  const { q } = Route.useSearch();
  const { data, isLoading } = useQuery({
    queryKey: ["search", q],
    queryFn: () => piped.search(q),
    enabled: !!q,
  });
  return (
    <AppShell>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">
        {q ? <>Results for <span className="text-primary">"{q}"</span></> : "Search"}
      </h1>
      {!q && <p className="text-muted-foreground">Type something in the search bar to begin.</p>}
      {isLoading && <p className="text-muted-foreground">Searching…</p>}
      {data?.items && <VideoGrid videos={data.items} />}
    </AppShell>
  );
}