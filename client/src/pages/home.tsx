import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Search, Tv, Radio, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChannelCard } from "@/components/channel-card";
import { ChannelPlayer } from "@/components/channel-player";
import { ChannelGridSkeleton, EmptyState } from "@/components/channel-grid";
import type { Channel } from "@shared/schema";

const categoryLabels: Record<string, string> = {
  live: "Live Now",
  highlights: "Highlights",
  news: "News & Updates",
  t20: "T20 Leagues",
  test: "Test Cricket",
};

function buildChannelUrl(category?: string, search?: string, language?: string) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (search) params.set("search", search);
  if (language) params.set("language", language);
  const qs = params.toString();
  return `/api/channels${qs ? `?${qs}` : ""}`;
}

export default function Home() {
  const [, params] = useRoute("/category/:category");
  const category = params?.category;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [languageFilter, setLanguageFilter] = useState<string>("");

  const url = buildChannelUrl(category, searchQuery, languageFilter);

  const { data: channels = [], isLoading } = useQuery<Channel[]>({
    queryKey: [url],
  });

  const { data: allChannels = [] } = useQuery<Channel[]>({
    queryKey: ["/api/channels"],
  });

  const languages = Array.from(new Set(allChannels.map((c) => c.language)));
  const liveCount = channels.filter((c) => c.isLive).length;
  const pageTitle = category ? categoryLabels[category] || "All Channels" : "All Channels";

  if (selectedChannel) {
    const related = allChannels
      .filter((c) => c.id !== selectedChannel.id && c.category === selectedChannel.category)
      .slice(0, 6);
    return (
      <ChannelPlayer
        channel={selectedChannel}
        onBack={() => setSelectedChannel(null)}
        relatedChannels={related}
        onSelectRelated={setSelectedChannel}
      />
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="p-4 md:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight" data-testid="text-page-title">
              {pageTitle}
            </h2>
            <p className="text-sm text-muted-foreground" data-testid="text-channel-count">
              {isLoading
                ? "Loading channels..."
                : `${channels.length} channel${channels.length !== 1 ? "s" : ""} available`}
              {liveCount > 0 && !isLoading && (
                <span className="ml-1 text-red-500 dark:text-red-400 font-medium">
                  ({liveCount} live)
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search channels..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search"
            />
          </div>
          {languages.length > 1 && (
            <div className="flex gap-1 flex-wrap">
              <Button
                variant={languageFilter === "" ? "default" : "outline"}
                size="sm"
                onClick={() => setLanguageFilter("")}
                data-testid="button-filter-all"
              >
                <Filter className="w-3.5 h-3.5 mr-1" />
                All
              </Button>
              {languages.map((lang) => (
                <Button
                  key={lang}
                  variant={languageFilter === lang ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLanguageFilter(lang === languageFilter ? "" : lang)}
                  data-testid={`button-filter-${lang.toLowerCase()}`}
                >
                  {lang}
                </Button>
              ))}
            </div>
          )}
        </div>

        {!category && !searchQuery && !isLoading && (
          <div className="relative overflow-hidden rounded-md" data-testid="banner-hero">
            <img
              src="/images/hero-cricket.jpg"
              alt="Cricket"
              className="w-full h-48 md:h-60 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
            <div className="absolute inset-0 flex items-center p-6 md:p-8">
              <div className="flex-1">
                <Badge variant="default" className="w-fit mb-2">
                  Featured Player
                </Badge>
                {channels.some((c) => c.isLive) && (
                  <Badge variant="destructive" className="w-fit mb-2 ml-2 animate-pulse">
                    LIVE NOW
                  </Badge>
                )}
                <h3 className="text-white text-lg md:text-2xl font-bold mt-1" data-testid="text-hero-title">
                  {channels.some((c) => c.isLive)
                    ? channels.filter((c) => c.isLive)[0]?.name
                    : "Welcome to CricStream"}
                </h3>
                <p className="text-white/70 text-sm mt-1 line-clamp-2 max-w-md">
                  {channels.some((c) => c.isLive)
                    ? channels.filter((c) => c.isLive)[0]?.description
                    : "Your one-stop destination for all cricket channels, highlights, and live matches."}
                </p>
                {channels.some((c) => c.isLive) && (
                  <Button
                    variant="default"
                    size="sm"
                    className="w-fit mt-3"
                    onClick={() => {
                      const liveChannel = channels.find((c) => c.isLive);
                      if (liveChannel) setSelectedChannel(liveChannel);
                    }}
                    data-testid="button-hero-watch"
                  >
                    <Radio className="w-3.5 h-3.5 mr-1.5" />
                    Watch Live
                  </Button>
                )}
              </div>
              <div className="hidden sm:block flex-shrink-0 ml-4">
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white/20" data-testid="img-featured-player">
                  <img
                    src="/images/player-hero.jpg"
                    alt="Featured Cricket Player"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <ChannelGridSkeleton />
        ) : channels.length === 0 ? (
          <EmptyState
            message={searchQuery ? `No channels found for "${searchQuery}"` : "No channels available in this category"}
            icon={<Tv className="w-8 h-8 text-muted-foreground" />}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" data-testid="grid-channels">
            {channels.map((channel) => (
              <ChannelCard
                key={channel.id}
                channel={channel}
                onSelect={setSelectedChannel}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
