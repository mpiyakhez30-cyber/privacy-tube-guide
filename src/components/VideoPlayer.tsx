import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

type Stream = {
  url: string;
  mimeType?: string;
  quality?: string;
  videoOnly?: boolean;
  bitrate?: number;
  codec?: string;
};

type Props = {
  hls?: string | null;
  videoStreams?: Stream[];
  audioStreams?: Stream[];
  poster?: string;
  title: string;
};

export function VideoPlayer({ hls, videoStreams = [], audioStreams = [], poster, title }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Pick best progressive (muxed) stream — has both audio+video
  const muxed = videoStreams
    .filter((s) => !s.videoOnly && s.url)
    .sort((a, b) => (b.bitrate ?? 0) - (a.bitrate ?? 0));
  const progressive = muxed[0];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    setError(null);

    let hlsInstance: Hls | null = null;

    if (hls) {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = hls;
      } else if (Hls.isSupported()) {
        hlsInstance = new Hls();
        hlsInstance.loadSource(hls);
        hlsInstance.attachMedia(video);
      } else {
        setError("HLS not supported in this browser.");
      }
    } else if (progressive?.url) {
      video.src = progressive.url;
    } else {
      setError("No playable stream found.");
    }

    return () => {
      hlsInstance?.destroy();
    };
  }, [hls, progressive?.url]);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-black">
      <div className="aspect-video">
        {error ? (
          <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
            {error}
          </div>
        ) : (
          <video
            ref={videoRef}
            poster={poster}
            controls
            autoPlay
            playsInline
            title={title}
            className="h-full w-full"
          />
        )}
      </div>
    </div>
  );
}