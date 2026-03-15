import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function ChannelGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-video w-full" />
          <div className="p-3 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>
          </div>
          <div className="px-3 pb-3 flex gap-2">
            <Skeleton className="h-8 flex-1 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </Card>
      ))}
    </div>
  );
}

export function EmptyState({ message, icon }: { message: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center" data-testid="empty-state">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        {icon}
      </div>
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  );
}
