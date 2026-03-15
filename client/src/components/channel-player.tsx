import { ArrowLeft, Heart, Eye, Globe, Star, Share2, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Channel } from "@shared/schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ChannelPlayerProps {
  channel: Channel;
  onBack: () => void;
  relatedChannels: Channel[];
  onSelectRelated: (channel: Channel) => void;
}

export function ChannelPlayer({ channel, onBack, relatedChannels, onSelectRelated }: ChannelPlayerProps) {
  const { toast } = useToast();

  const { data: favorites = [] } = useQuery<{ id: string; channelId: string }[]>({
    queryKey: ["/api/favorites"],
  });

  const isFavorited = favorites.some((f) => f.channelId === channel.id);

  const toggleFavorite = useMutation({
    mutationFn: async () => {
      if (isFavorited) {
        await apiRequest("DELETE", `/api/favorites/${channel.id}`);
      } else {
        await apiRequest("POST", "/api/favorites", { channelId: channel.id });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      toast({
        title: isFavorited ? "Removed from favorites" : "Added to favorites",
      });
    },
  });

  const formatViewers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const hasStream = channel.streamUrl && channel.streamUrl.length > 0;

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
            <h1 className="text-sm font-semibold text-white truncate" data-testid="text-player-channel-name">
              {channel.name}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              {channel.isLive && (
                <Badge variant="destructive" className="animate-pulse">
                  LIVE
                </Badge>
              )}
              <span className="text-white/60 text-xs flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {formatViewers(channel.viewers)} {channel.isLive ? "watching" : "views"}
              </span>
            </div>
          </div>
        </div>

        {hasStream ? (
          <div className="relative w-full bg-black" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src={channel.streamUrl}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              data-testid="iframe-video-player"
              title={channel.name}
            />
          </div>
        ) : (
          <div className="relative aspect-video bg-black">
            <img
              src={channel.thumbnailUrl}
              alt={channel.name}
              className="w-full h-full object-cover"
              data-testid="img-channel-player"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 flex items-center justify-center">
              <p className="text-white/60 text-sm">No stream available for this channel</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 md:p-6 space-y-4 flex-1">
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="text-lg font-bold" data-testid="text-player-title-below">{channel.name}</h2>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <Badge variant="secondary">
                {channel.category}
              </Badge>
              <span className="flex items-center gap-1 text-muted-foreground text-sm">
                <Globe className="w-3.5 h-3.5" />
                {channel.language}
              </span>
              <span className="flex items-center gap-1 text-amber-500 dark:text-amber-400 text-sm">
                <Star className="w-3.5 h-3.5 fill-current" />
                {channel.rating}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant={isFavorited ? "default" : "outline"}
              onClick={() => toggleFavorite.mutate()}
              data-testid="button-player-favorite"
            >
              <Heart className={`w-4 h-4 mr-2 ${isFavorited ? "fill-current" : ""}`} />
              {isFavorited ? "Favorited" : "Add to Favorites"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                toast({ title: "Link copied to clipboard" });
              }}
              data-testid="button-share"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                toast({ title: "Thank you for your feedback" });
              }}
              data-testid="button-report"
            >
              <Flag className="w-4 h-4 mr-2" />
              Report
            </Button>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold text-sm mb-2">About this channel</h3>
          <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-channel-description">
            {channel.description}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="p-3 text-center">
            <p className="text-xs text-muted-foreground">Viewers</p>
            <p className="text-lg font-bold" data-testid="stat-viewers">{formatViewers(channel.viewers)}</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xs text-muted-foreground">Rating</p>
            <p className="text-lg font-bold flex items-center justify-center gap-1" data-testid="stat-rating">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              {channel.rating}
            </p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xs text-muted-foreground">Language</p>
            <p className="text-lg font-bold" data-testid="stat-language">{channel.language}</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-xs text-muted-foreground">Country</p>
            <p className="text-lg font-bold" data-testid="stat-country">{channel.country}</p>
          </Card>
        </div>

        {relatedChannels.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="font-semibold text-sm mb-3">Related Channels</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {relatedChannels.map((related) => (
                  <Card
                    key={related.id}
                    className="flex gap-3 p-2 cursor-pointer hover-elevate overflow-visible"
                    onClick={() => onSelectRelated(related)}
                    data-testid={`card-related-${related.id}`}
                  >
                    <div className="relative w-28 flex-shrink-0 overflow-hidden rounded-md">
                      <img
                        src={related.thumbnailUrl}
                        alt={related.name}
                        className="w-full aspect-video object-cover"
                      />
                      {related.isLive && (
                        <Badge
                          variant="destructive"
                          className="absolute top-1 left-1"
                        >
                          LIVE
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <p className="text-xs font-semibold line-clamp-2">{related.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {formatViewers(related.viewers)} {related.isLive ? "watching" : "views"}
                      </p>
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
