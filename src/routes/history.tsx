import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { history, type HistoryItem } from "@/lib/local-store";

export const Route = createFileRoute("/history")({
  component: HistoryPage,
  head: () => ({ meta: [{ title: "History — UMABONAKUDE" }] }),
});

function HistoryPage() {
  const [list, setList] = useState<HistoryItem[]>([]);
  useEffect(() => setList(history.list()), []);

  return (
    <AppShell>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Watch history</h1>
        {list.length > 0 && (
          <Button variant="outline" onClick={() => { history.clear(); setList([]); }}>
            Clear all
          </Button>
        )}
      </div>
      {list.length === 0 ? (
        <p className="text-muted-foreground">Nothing watched yet.</p>
      ) : (
        <div className="space-y-3">
          {list.map((h) => (
            <Link
              key={h.id + h.watchedAt}
              to="/watch/$videoId"
              params={{ videoId: h.id }}
              className="flex gap-4 rounded-xl border border-border p-3 transition-colors hover:bg-secondary"
            >
              <img src={h.thumbnail} alt="" className="aspect-video w-40 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0">
                <h3 className="line-clamp-2 font-semibold">{h.title}</h3>
                <p className="text-sm text-muted-foreground">{h.uploader}</p>
                <p className="text-xs text-muted-foreground">{new Date(h.watchedAt).toLocaleString()}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
