import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { VideoPlayer } from "@/components/VideoPlayer";
import { piped, formatViews } from "@/lib/piped";
import { subs, history } from "@/lib/local-store";
import { Heart, HeartOff, ThumbsUp, Eye } from "lucide-react";

export const Route = createFileRoute("/watch/$videoId")({
  component: WatchPage,
  head: () => ({ meta: [{ title: "Watch — PrivateTube" }] }),
});

function WatchPage() {
  const { videoId } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["streams", videoId],
    queryFn: () => piped.streams(videoId),
  });
  const [subbed, setSubbed] = useState(false);

  useEffect(() => {
    if (!data) return;
    const channelId = (data.uploaderUrl || "").replace("/channel/", "");
    setSubbed(subs.has(channelId));
    history.add({
      id: videoId,
      title: data.title,
      thumbnail: data.thumbnailUrl,
      uploader: data.uploader,
    });
  }, [data, videoId]);

  if (isLoading) return <AppShell><p className="text-muted-foreground">Loading video…</p></AppShell>;
  if (!data) return <AppShell><p className="text-muted-foreground">Video unavailable.</p></AppShell>;

  const channelId = (data.uploaderUrl || "").replace("/channel/", "");

  const toggleSub = () => {
    subs.toggle({ id: channelId, name: data.uploader, avatar: data.uploaderAvatar });
    setSubbed((s) => !s);
  };

  return (
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          <VideoPlayer
            hls={data.hls}
            videoStreams={data.videoStreams}
            audioStreams={data.audioStreams}
            poster={data.thumbnailUrl}
            title={data.title}
          />

          <h1 className="mt-4 text-xl font-bold leading-snug md:text-2xl">{data.title}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Eye className="h-4 w-4" /> {formatViews(data.views)} views</span>
            {data.likes > 0 && <span className="inline-flex items-center gap-1.5"><ThumbsUp className="h-4 w-4" /> {formatViews(data.likes)}</span>}
            {data.uploadDate && <span>• {data.uploadDate}</span>}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-border p-3">
            {data.uploaderAvatar && <img src={data.uploaderAvatar} alt="" className="h-11 w-11 rounded-full" />}
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{data.uploader}</p>
              {typeof data.uploaderSubscriberCount === "number" && (
                <p className="text-xs text-muted-foreground">{formatViews(data.uploaderSubscriberCount)} subscribers</p>
              )}
            </div>
            <Button onClick={toggleSub} variant={subbed ? "outline" : "default"}>
              {subbed ? <><HeartOff className="mr-2 h-4 w-4" /> Unsubscribe</> : <><Heart className="mr-2 h-4 w-4" /> Subscribe</>}
            </Button>
          </div>

          {data.description && (
            <div
              className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap rounded-xl border border-border p-4 text-sm text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: data.description }}
            />
          )}
        </div>

        <aside className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Up next</h2>
          {(data.relatedStreams ?? []).slice(0, 12).map((r: any) => {
            const id = (r.url || "").match(/v=([^&]+)/)?.[1] ?? "";
            return (
              <a
                key={id}
                href={`/watch/${id}`}
                className="flex gap-3 rounded-lg p-1 transition-colors hover:bg-secondary"
              >
                <img src={r.thumbnail} alt="" className="aspect-video w-40 shrink-0 rounded-md object-cover" />
                <div className="min-w-0">
                  <p className="line-clamp-2 text-sm font-medium leading-snug">{r.title}</p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{r.uploaderName}</p>
                  <p className="text-xs text-muted-foreground">{formatViews(r.views)} views</p>
                </div>
              </a>
            );
          })}
        </aside>
      </div>
    </AppShell>
  );
}
