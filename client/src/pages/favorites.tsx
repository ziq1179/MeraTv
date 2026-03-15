import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Heart, Tv } from "lucide-react";
import { ChannelCard } from "@/components/channel-card";
import { ChannelPlayer } from "@/components/channel-player";
import { ChannelGridSkeleton, EmptyState } from "@/components/channel-grid";
import type { Channel } from "@shared/schema";

export default function Favorites() {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  const { data: favorites = [] } = useQuery<{ id: string; channelId: string }[]>({
    queryKey: ["/api/favorites"],
  });

  const { data: channels = [], isLoading } = useQuery<Channel[]>({
    queryKey: ["/api/channels"],
  });

  const favoriteChannels = channels.filter((c) =>
    favorites.some((f) => f.channelId === c.id)
  );

  if (selectedChannel) {
    const related = favoriteChannels
      .filter((c) => c.id !== selectedChannel.id)
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
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2" data-testid="text-favorites-title">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            My Favorites
          </h2>
          <p className="text-sm text-muted-foreground">
            {isLoading
              ? "Loading..."
              : `${favoriteChannels.length} channel${favoriteChannels.length !== 1 ? "s" : ""} saved`}
          </p>
        </div>

        {isLoading ? (
          <ChannelGridSkeleton />
        ) : favoriteChannels.length === 0 ? (
          <EmptyState
            message="You haven't added any favorites yet. Browse channels and tap the heart icon to save them here."
            icon={<Heart className="w-8 h-8 text-muted-foreground" />}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {favoriteChannels.map((channel) => (
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
