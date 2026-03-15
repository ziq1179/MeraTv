import { ArrowLeft, Share2, Calendar, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export interface VideoItem {
  id: string;
  title: string;
  teams: string;
  year: number;
  category: string;
  tournament: string;
  result: string;
  videoId: string;
  flag1: string;
  flag2: string;
}

interface VideoPlayerProps {
  item: VideoItem;
  onBack: () => void;
  related: VideoItem[];
  onSelectRelated: (item: VideoItem) => void;
  accentColor?: string;
}

export function VideoPlayer({ item, onBack, related, onSelectRelated, accentColor = "text-primary" }: VideoPlayerProps) {
  const { toast } = useToast();

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="relative">
        <div className="sticky top-0 z-10 flex items-center gap-2 p-2 bg-black/90 backdrop-blur-sm">
          <Button
            size="icon"
            variant="ghost"
            className="text-white"
            onClick={onBack}
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-white truncate" data-testid="text-player-title">
              {item.title} {item.year}
            </h1>
            <p className="text-white/60 text-xs truncate">{item.teams}</p>
          </div>
          <Badge variant="secondary" className="text-[10px] flex-shrink-0">{item.category}</Badge>
        </div>

        <div className="relative w-full bg-black" style={{ paddingBottom: "56.25%" }}>
          <iframe
            key={item.id}
            src={`https://www.dailymotion.com/embed/video/${item.videoId}?autoplay=1`}
            className="absolute inset-0 w-full h-full border-0"
            allow="autoplay; fullscreen"
            allowFullScreen
            data-testid="iframe-video-player"
            title={`${item.title} ${item.year}`}
          />
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-4 flex-1">
        <div className="flex flex-col gap-3">
          <div>
            <div className="flex items-center gap-2 text-2xl mb-1">
              <span>{item.flag1}</span>
              <span className="text-sm text-muted-foreground">vs</span>
              <span>{item.flag2}</span>
            </div>
            <h2 className="text-lg font-bold" data-testid="text-player-teams">{item.teams}</h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge variant="secondary">{item.category}</Badge>
              <span className="flex items-center gap-1 text-muted-foreground text-xs">
                <Calendar className="w-3 h-3" />
                {item.year}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast({ title: "Link copied to clipboard" })}
              data-testid="button-share"
            >
              <Share2 className="w-3.5 h-3.5 mr-1.5" />
              Share
            </Button>
          </div>
        </div>

        <Separator />

        <div className="space-y-1">
          <h3 className="font-semibold text-sm">About this match</h3>
          <p className="text-sm text-muted-foreground">{item.tournament}</p>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-yellow-500" />
            {item.result}
          </p>
        </div>

        {related.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="font-semibold text-sm mb-3">More to Watch</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {related.map((rel) => (
                  <Card
                    key={rel.id}
                    className="flex gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => onSelectRelated(rel)}
                    data-testid={`card-related-${rel.id}`}
                  >
                    <div className="flex items-center gap-1 text-xl flex-shrink-0">
                      <span>{rel.flag1}</span>
                      <span className="text-[10px] text-muted-foreground">v</span>
                      <span>{rel.flag2}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold line-clamp-1">{rel.teams}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{rel.tournament} · {rel.year}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
