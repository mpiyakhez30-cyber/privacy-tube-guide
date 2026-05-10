import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { VideoGrid } from "@/components/VideoGrid";
import { piped, formatViews } from "@/lib/piped";

export const Route = createFileRoute("/channel/$channelId")({
  component: ChannelPage,
  head: () => ({ meta: [{ title: "Channel — PrivateTube" }] }),
});

function ChannelPage() {
  const { channelId } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["channel", channelId],
    queryFn: () => piped.channel(channelId),
  });

  if (isLoading) return <AppShell><p className="text-muted-foreground">Loading channel…</p></AppShell>;
  if (!data) return <AppShell><p className="text-muted-foreground">Channel unavailable.</p></AppShell>;

  return (
    <AppShell>
      <div className="mb-6 flex items-center gap-4">
        {data.avatarUrl && <img src={data.avatarUrl} alt="" className="h-20 w-20 rounded-full" />}
        <div>
          <h1 className="text-2xl font-bold">{data.name}</h1>
          {typeof data.subscriberCount === "number" && (
            <p className="text-sm text-muted-foreground">{formatViews(data.subscriberCount)} subscribers</p>
          )}
        </div>
      </div>
      <VideoGrid videos={(data.relatedStreams ?? []).map((r: any) => ({ ...r, uploaderName: data.name, uploaderAvatar: data.avatarUrl }))} />
    </AppShell>
  );
}
