import { useState } from "react";
import { Sparkles, Play, Calendar } from "lucide-react";
import { VideoPlayer, type VideoItem } from "@/components/video-player";

interface WomenMatch extends VideoItem {
  filterCategory: "Final" | "Highlights" | "Classic" | "Rivalry";
}

const matches: WomenMatch[] = [
  {
    id: "wt20-2023-final",
    title: "Women's T20 World Cup Final",
    teams: "South Africa vs Australia",
    year: 2023,
    category: "Final",
    filterCategory: "Final",
    tournament: "ICC Women's T20 World Cup 2023",
    result: "Australia won by 19 runs",
    videoId: "x8imov5",
    flag1: "🇿🇦",
    flag2: "🇦🇺",
  },
  {
    id: "wt20-2020-final",
    title: "Women's T20 World Cup Final",
    teams: "Australia vs India",
    year: 2020,
    category: "Final",
    filterCategory: "Final",
    tournament: "ICC Women's T20 World Cup 2020",
    result: "Australia won by 85 runs",
    videoId: "x7zgx1d",
    flag1: "🇦🇺",
    flag2: "🇮🇳",
  },
  {
    id: "wt20-2016-final",
    title: "Women's T20 World Cup Final",
    teams: "Australia vs West Indies",
    year: 2016,
    category: "Final",
    filterCategory: "Final",
    tournament: "ICC Women's T20 World Cup 2016",
    result: "West Indies won by 8 wickets",
    videoId: "x41p8af",
    flag1: "🇦🇺",
    flag2: "🏏",
  },
  {
    id: "wt20-2010-final",
    title: "Women's T20 World Cup Final",
    teams: "England vs Australia",
    year: 2010,
    category: "Final",
    filterCategory: "Final",
    tournament: "ICC Women's T20 World Cup 2010",
    result: "England won by 7 wickets",
    videoId: "x6fo72q",
    flag1: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    flag2: "🇦🇺",
  },
  {
    id: "wodi-2013",
    title: "Women's ODI World Cup",
    teams: "Australia — Champions",
    year: 2013,
    category: "Final",
    filterCategory: "Final",
    tournament: "ICC Women's Cricket World Cup 2013",
    result: "Australia won the tournament",
    videoId: "x2hhidq",
    flag1: "🇦🇺",
    flag2: "🏆",
  },
  {
    id: "wodi-2017-sf",
    title: "Women's ODI World Cup Semi-Final",
    teams: "India vs Australia",
    year: 2017,
    category: "Highlights",
    filterCategory: "Highlights",
    tournament: "ICC Women's Cricket World Cup 2017",
    result: "India won — entered final",
    videoId: "x5u9t0o",
    flag1: "🇮🇳",
    flag2: "🇦🇺",
  },
  {
    id: "women-ashes-2023",
    title: "Women's Ashes ODI Highlights",
    teams: "England vs Australia",
    year: 2023,
    category: "Classic",
    filterCategory: "Classic",
    tournament: "Women's Ashes Series 2023",
    result: "3rd ODI highlights",
    videoId: "x8mmfl5",
    flag1: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    flag2: "🇦🇺",
  },
  {
    id: "ind-pak-women",
    title: "India vs Pakistan Women",
    teams: "India Women vs Pakistan Women",
    year: 2023,
    category: "Rivalry",
    filterCategory: "Rivalry",
    tournament: "ICC Women's Cricket",
    result: "Classic rivalry highlights",
    videoId: "x5sno0g",
    flag1: "🇮🇳",
    flag2: "🇵🇰",
  },
  {
    id: "ind-women-test",
    title: "India Women Test Match",
    teams: "India Women vs Australia Women",
    year: 2023,
    category: "Classic",
    filterCategory: "Classic",
    tournament: "Women's Test Cricket",
    result: "Day 2 Highlights",
    videoId: "x8qsyeb",
    flag1: "🇮🇳",
    flag2: "🇦🇺",
  },
  {
    id: "women-highlights-2024",
    title: "Women's Cricket Best Moments",
    teams: "International Women's Cricket",
    year: 2024,
    category: "Highlights",
    filterCategory: "Highlights",
    tournament: "ICC Women's Cricket 2024",
    result: "Best moments compilation",
    videoId: "x9guokc",
    flag1: "🏏",
    flag2: "⭐",
  },
];

const categoryColors: Record<string, string> = {
  Final: "bg-yellow-500/15 text-yellow-500 border-yellow-500/30",
  Highlights: "bg-green-500/15 text-green-400 border-green-500/30",
  Classic: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Rivalry: "bg-red-500/15 text-red-400 border-red-500/30",
};

const filters = ["All", "Final", "Highlights", "Classic", "Rivalry"] as const;
type Filter = typeof filters[number];

export default function WomenCricket() {
  const [selected, setSelected] = useState<WomenMatch | null>(null);
  const [activeFilter, setActiveFilter] = useState<Filter>("All");

  if (selected) {
    return (
      <VideoPlayer
        item={selected}
        onBack={() => setSelected(null)}
        related={matches.filter((m) => m.id !== selected.id)}
        onSelectRelated={(item) => setSelected(item as WomenMatch)}
        accentColor="text-pink-500"
      />
    );
  }

  const filtered = activeFilter === "All" ? matches : matches.filter((m) => m.filterCategory === activeFilter);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="p-4 md:p-6 border-b">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-pink-500" />
          <h1 className="text-lg font-bold" data-testid="text-women-title">Women's Cricket</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">
          World Cup finals, classic matches & rivalry highlights
        </p>
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                activeFilter === f
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
              data-testid={`filter-women-${f.toLowerCase()}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((match) => (
            <button
              key={match.id}
              onClick={() => setSelected(match)}
              className="group text-left border rounded-xl p-4 hover:bg-muted/50 hover:border-pink-500/40 transition-all"
              data-testid={`card-women-${match.id}`}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${categoryColors[match.filterCategory]}`}>
                  {match.filterCategory}
                </span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {match.year}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{match.flag1}</span>
                <span className="text-xs text-muted-foreground font-medium">vs</span>
                <span className="text-2xl">{match.flag2}</span>
              </div>

              <p className="text-sm font-semibold leading-snug" data-testid={`text-women-teams-${match.id}`}>
                {match.teams}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{match.tournament}</p>
              <p className="text-xs text-muted-foreground mt-1 italic">{match.result}</p>

              <div className="flex items-center gap-1.5 mt-3 text-xs text-pink-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="w-3.5 h-3.5" />
                Watch Now
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
