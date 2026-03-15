import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { Satellite, ExternalLink, Maximize2, Minimize2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const streams = [
  { id: "stream1", label: "Stream 1", url: "https://me.webcric.com/watch-t20-world-cup-2026-live-cricket-streaming-3.htm", group: "webcric" },
  { id: "stream2", label: "Stream 2", url: "https://me.webcric.com/t20-world-cup-2026-live-cricket-streaming-3.htm", group: "webcric" },
  { id: "stream3", label: "Stream 3", url: "https://me.webcric.com/watch-icc-t20-world-cup-2026-live-cricket-streaming-3.htm", group: "webcric" },
  { id: "stream4", label: "Stream 4", url: "https://me.webcric.com/icc-t20-world-cup-2026-live-cricket-streaming-3.htm", group: "webcric" },
  { id: "stream5", label: "Stream 5", url: "https://me.webcric.com/watch-icc-t20-world-cup-live-cricket-streaming-7.htm", group: "webcric" },
  { id: "stream6", label: "Stream 6", url: "https://me.webcric.com/watch-icc-t20-world-cup-live-cricket-streaming-8.htm", group: "webcric" },
  { id: "streamhd", label: "HD Stream", url: "https://me.webcric.com/watch-icc-t20-world-cup-live-cricket-streaming-9.htm", group: "webcric" },
  { id: "ptvsports", label: "PTV Sports", url: "https://www.ptvsportstv.com/ptv-sports-live-tv-hd/", group: "ptvsports" },
];

export default function LiveTV() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const streamParam = params.get("stream");

  const initialStream = streamParam
    ? (streams.find((s) => s.id === streamParam || s.group === streamParam) ?? streams[0])
    : streams[0];

  const [activeStream, setActiveStream] = useState(initialStream);

  useEffect(() => {
    if (streamParam) {
      const match = streams.find((s) => s.id === streamParam || s.group === streamParam);
      if (match) setActiveStream(match);
    }
  }, [streamParam]);

  const [isFullWidth, setIsFullWidth] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-2 border-b flex-wrap">
        <Satellite className="w-4 h-4 text-primary" />
        <h1 className="text-sm font-bold" data-testid="text-livetv-title">Live TV</h1>
        <Badge variant="destructive" className="animate-pulse" data-testid="badge-live-indicator">
          LIVE
        </Badge>
        <span className="text-xs text-muted-foreground">T20 World Cup 2026</span>
        <div className="ml-auto flex items-center gap-1">
          {streams.map((s) => (
            <Button
              key={s.id}
              variant={activeStream.id === s.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveStream(s)}
              data-testid={`button-${s.id}`}
            >
              {s.label}
            </Button>
          ))}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsFullWidth(!isFullWidth)}
            data-testid="button-toggle-fullwidth"
          >
            {isFullWidth ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => window.open(activeStream.url, "_blank")}
            data-testid="button-open-external"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 relative" data-testid="container-player">
        <iframe
          key={activeStream.id}
          src={activeStream.url}
          className="absolute inset-0 w-full h-full border-0"
          allow="autoplay; fullscreen; encrypted-media"
          allowFullScreen
          data-testid="iframe-livetv-player"
          title={`WebCric - ${activeStream.label}`}
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
      </div>

      <div className="flex items-center gap-2 px-4 py-1.5 border-t bg-muted/50 text-xs text-muted-foreground">
        <Info className="w-3 h-3 flex-shrink-0" />
        <span data-testid="text-stream-info">Watching: {activeStream.label}</span>
        <span className="hidden sm:inline">— If a stream is not loading, try a different option above. If the site blocks embedding, use the ↗ button to open it in a new tab.</span>
      </div>
    </div>
  );
}
