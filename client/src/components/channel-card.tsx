import { Heart, Eye, Globe, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Channel } from "@shared/schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ChannelCardProps {
  channel: Channel;
  onSelect: (channel: Channel) => void;
}

export function ChannelCard({ channel, onSelect }: ChannelCardProps) {
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

  return (
    <Card
      className="group overflow-visible cursor-pointer hover-elevate active-elevate-2"
      data-testid={`card-channel-${channel.id}`}
    >
      <div className="relative overflow-hidden rounded-t-md" onClick={() => onSelect(channel)}>
        <img
          src={channel.thumbnailUrl}
          alt={channel.name}
          className="w-full aspect-video object-cover"
          loading="lazy"
          data-testid={`img-channel-${channel.id}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {channel.isLive && (
          <Badge
            variant="destructive"
            className="absolute top-3 left-3 font-semibold tracking-wider"
            data-testid={`badge-live-${channel.id}`}
          >
            LIVE
          </Badge>
        )}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
          <div className="flex items-center gap-1.5 text-white/90 text-xs">
            <Eye className="w-3.5 h-3.5" />
            <span data-testid={`text-viewers-${channel.id}`}>{formatViewers(channel.viewers)}</span>
          </div>
          <div className="flex items-center gap-1 text-amber-400 text-xs">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span data-testid={`text-rating-${channel.id}`}>{channel.rating}</span>
          </div>
        </div>
      </div>
      <div className="p-3" onClick={() => onSelect(channel)}>
        <h3
          className="font-semibold text-sm leading-tight line-clamp-1"
          data-testid={`text-channel-name-${channel.id}`}
        >
          {channel.name}
        </h3>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2" data-testid={`text-channel-desc-${channel.id}`}>
          {channel.description}
        </p>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <Badge variant="secondary" data-testid={`badge-category-${channel.id}`}>
            {channel.category}
          </Badge>
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Globe className="w-3 h-3" />
            <span data-testid={`text-language-${channel.id}`}>{channel.language}</span>
          </span>
        </div>
      </div>
      <div className="px-3 pb-3 flex items-center justify-between gap-2">
        <Button
          variant="default"
          size="sm"
          className="flex-1"
          onClick={() => onSelect(channel)}
          data-testid={`button-watch-${channel.id}`}
        >
          {channel.isLive ? "Watch Live" : "Watch Now"}
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite.mutate();
          }}
          data-testid={`button-favorite-${channel.id}`}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorited ? "fill-red-500 text-red-500" : ""
            }`}
          />
        </Button>
      </div>
    </Card>
  );
}
