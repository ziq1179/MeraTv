import { useQuery } from "@tanstack/react-query";
import { Newspaper, ExternalLink, Clock, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { queryClient } from "@/lib/queryClient";

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  summary: string;
  source: string;
  thumbnail: string | null;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function NewsCardSkeleton() {
  return (
    <div className="flex gap-3 p-4 border rounded-lg">
      <Skeleton className="w-24 h-16 rounded flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}

export default function News() {
  const { data: news = [], isLoading, isError, dataUpdatedAt } = useQuery<NewsItem[]>({
    queryKey: ["/api/news"],
    staleTime: 5 * 60 * 1000,
  });

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/news"] });
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="p-4 md:p-6 border-b flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-bold" data-testid="text-news-title">News & Updates</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Latest cricket news from BBC Sport & ESPN Cricinfo
          </p>
        </div>
        <div className="flex items-center gap-2">
          {dataUpdatedAt > 0 && (
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Updated {timeAgo(new Date(dataUpdatedAt).toISOString())}
            </span>
          )}
          <Button size="icon" variant="ghost" onClick={handleRefresh} data-testid="button-refresh-news">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 md:p-6">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => <NewsCardSkeleton key={i} />)}
          </div>
        ) : isError ? (
          <div className="text-center py-16 text-muted-foreground">
            <Newspaper className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Could not load news</p>
            <p className="text-sm mt-1">Check your connection and try refreshing.</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={handleRefresh}>
              Try Again
            </Button>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Newspaper className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No news articles found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {news.map((item, i) => (
              <a
                key={i}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors group"
                data-testid={`card-news-${i}`}
              >
                {item.thumbnail && (
                  <img
                    src={item.thumbnail}
                    alt=""
                    className="w-24 h-16 object-cover rounded flex-shrink-0 bg-muted"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors"
                      data-testid={`text-news-title-${i}`}
                    >
                      {item.title}
                    </h3>
                    <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 opacity-0 group-hover:opacity-60 transition-opacity mt-0.5" />
                  </div>
                  {item.summary && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.summary}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      {item.source}
                    </Badge>
                    {item.pubDate && (
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="w-2.5 h-2.5" />
                        {timeAgo(item.pubDate)}
                      </span>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
