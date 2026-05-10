import { Link } from "@tanstack/react-router";
import { formatDuration, formatViews, videoIdFromUrl, type PipedVideo } from "@/lib/piped";

export function VideoGrid({ videos }: { videos: PipedVideo[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {videos.map((v) => {
        const id = videoIdFromUrl(v.url);
        return (
          <Link
            key={id}
            to="/watch/$videoId"
            params={{ videoId: id }}
            className="group flex flex-col gap-2.5"
          >
            <div className="relative aspect-video overflow-hidden rounded-xl bg-secondary">
              <img
                src={v.thumbnail}
                alt={v.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {v.duration > 0 && (
                <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
                  {formatDuration(v.duration)}
                </span>
              )}
            </div>
            <div className="flex gap-3">
              {v.uploaderAvatar && (
                <img src={v.uploaderAvatar} alt="" className="h-9 w-9 shrink-0 rounded-full" />
              )}
              <div className="min-w-0">
                <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-primary">
                  {v.title}
                </h3>
                <p className="mt-1 truncate text-xs text-muted-foreground">{v.uploaderName}</p>
                <p className="text-xs text-muted-foreground">
                  {formatViews(v.views)} views{v.uploadedDate ? ` • ${v.uploadedDate}` : ""}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}