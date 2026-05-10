import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { subs, type Subscription } from "@/lib/local-store";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/subscriptions")({
  component: SubsPage,
  head: () => ({ meta: [{ title: "Subscriptions — UMABONAKUDE" }] }),
});

function SubsPage() {
  const [list, setList] = useState<Subscription[]>([]);
  useEffect(() => setList(subs.list()), []);

  return (
    <AppShell>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Your subscriptions</h1>
      {list.length === 0 ? (
        <div className="rounded-xl border border-border p-10 text-center">
          <Heart className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <p className="text-muted-foreground">No subscriptions yet. Open any video and tap Subscribe.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {list.map((s) => (
            <Link
              key={s.id}
              to="/channel/$channelId"
              params={{ channelId: s.id }}
              className="flex flex-col items-center rounded-xl border border-border p-4 transition-colors hover:bg-secondary"
            >
              {s.avatar ? (
                <img src={s.avatar} alt={s.name} className="h-16 w-16 rounded-full" />
              ) : (
                <div className="h-16 w-16 rounded-full bg-secondary" />
              )}
              <span className="mt-2 line-clamp-1 text-sm font-medium">{s.name}</span>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}