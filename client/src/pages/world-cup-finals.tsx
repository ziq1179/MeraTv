import { useState } from "react";
import { Trophy, Play, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { VideoPlayer, type VideoItem } from "@/components/video-player";

const finals: VideoItem[] = [
  {
    id: "ct2025",
    title: "ICC Champions Trophy Final",
    teams: "India vs New Zealand",
    year: 2025,
    category: "CT",
    tournament: "ICC Champions Trophy 2025",
    result: "India won by 4 wickets",
    videoId: "x9fu2n2",
    flag1: "🇮🇳",
    flag2: "🇳🇿",
  },
  {
    id: "t20-2024",
    title: "ICC Men's T20 World Cup Final",
    teams: "India vs South Africa",
    year: 2024,
    category: "T20",
    tournament: "ICC Men's T20 World Cup 2024",
    result: "India won by 7 runs",
    videoId: "x9x5xs6",
    flag1: "🇮🇳",
    flag2: "🇿🇦",
  },
  {
    id: "odi-2023",
    title: "ICC Men's Cricket World Cup Final",
    teams: "Australia vs India",
    year: 2023,
    category: "ODI",
    tournament: "ICC Men's Cricket World Cup 2023",
    result: "Australia won by 6 wickets",
    videoId: "x8pr9un",
    flag1: "🇦🇺",
    flag2: "🇮🇳",
  },
  {
    id: "t20-2022",
    title: "ICC Men's T20 World Cup Final",
    teams: "Pakistan vs England",
    year: 2022,
    category: "T20",
    tournament: "ICC Men's T20 World Cup 2022",
    result: "England won by 5 wickets",
    videoId: "x8fgjv8",
    flag1: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    flag2: "🇵🇰",
  },
  {
    id: "t20-2021",
    title: "ICC Men's T20 World Cup Final",
    teams: "Australia vs New Zealand",
    year: 2021,
    category: "T20",
    tournament: "ICC Men's T20 World Cup 2021",
    result: "Australia won by 8 wickets",
    videoId: "x85ibgt",
    flag1: "🇦🇺",
    flag2: "🇳🇿",
  },
  {
    id: "odi-2019",
    title: "ICC Men's Cricket World Cup Final",
    teams: "England vs New Zealand",
    year: 2019,
    category: "ODI",
    tournament: "ICC Men's Cricket World Cup 2019",
    result: "England won (Super Over)",
    videoId: "x7cg5r4",
    flag1: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    flag2: "🇳🇿",
  },
  {
    id: "t20-2016",
    title: "ICC Men's T20 World Cup Final",
    teams: "West Indies vs England",
    year: 2016,
    category: "T20",
    tournament: "ICC Men's T20 World Cup 2016",
    result: "West Indies won by 4 wickets",
    videoId: "x41whyu",
    flag1: "🏏",
    flag2: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  },
  {
    id: "odi-2015",
    title: "ICC Men's Cricket World Cup Final",
    teams: "Australia vs New Zealand",
    year: 2015,
    category: "ODI",
    tournament: "ICC Men's Cricket World Cup 2015",
    result: "Australia won by 7 wickets",
    videoId: "x2l0gkc",
    flag1: "🇦🇺",
    flag2: "🇳🇿",
  },
  {
    id: "odi-2011",
    title: "ICC Men's Cricket World Cup Final",
    teams: "India vs Sri Lanka",
    year: 2011,
    category: "ODI",
    tournament: "ICC Men's Cricket World Cup 2011",
    result: "India won by 6 wickets",
    videoId: "x9ejifo",
    flag1: "🇮🇳",
    flag2: "🇱🇰",
  },
];

const typeLabels: Record<string, string> = {
  T20: "T20 World Cup",
  ODI: "ODI World Cup",
  CT: "Champions Trophy",
};

const typeColors: Record<string, string> = {
  T20: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  ODI: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  CT: "bg-purple-500/15 text-purple-400 border-purple-500/30",
};

export default function WorldCupFinals() {
  const [selected, setSelected] = useState<VideoItem | null>(null);

  if (selected) {
    return (
      <VideoPlayer
        item={selected}
        onBack={() => setSelected(null)}
        related={finals.filter((f) => f.id !== selected.id)}
        onSelectRelated={setSelected}
      />
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="p-4 md:p-6 border-b">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <h1 className="text-lg font-bold" data-testid="text-finals-title">World Cup Finals</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">
          Relive every ICC World Cup & Champions Trophy final
        </p>
      </div>

      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {finals.map((final) => (
            <button
              key={final.id}
              onClick={() => setSelected(final)}
              className="group text-left border rounded-xl p-4 hover:bg-muted/50 hover:border-primary/50 transition-all"
              data-testid={`card-final-${final.id}`}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${typeColors[final.category]}`}>
                  {typeLabels[final.category]}
                </span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {final.year}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{final.flag1}</span>
                <span className="text-xs text-muted-foreground font-medium">vs</span>
                <span className="text-2xl">{final.flag2}</span>
              </div>

              <p className="text-sm font-semibold leading-snug" data-testid={`text-final-teams-${final.id}`}>
                {final.teams}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{final.result}</p>

              <div className="flex items-center gap-1.5 mt-3 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="w-3.5 h-3.5" />
                Watch Highlights
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
