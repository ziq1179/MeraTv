import { useState } from "react";
import { Trophy, X, Play, Calendar, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Final {
  id: string;
  tournament: string;
  year: number;
  teams: string;
  winner: string;
  result: string;
  videoId: string;
  type: "T20" | "ODI" | "CT";
  flag1: string;
  flag2: string;
}

const finals: Final[] = [
  {
    id: "ct2025",
    tournament: "ICC Champions Trophy",
    year: 2025,
    teams: "India vs New Zealand",
    winner: "India",
    result: "India won by 4 wickets",
    videoId: "x9fu2n2",
    type: "CT",
    flag1: "🇮🇳",
    flag2: "🇳🇿",
  },
  {
    id: "t20-2024",
    tournament: "ICC Men's T20 World Cup",
    year: 2024,
    teams: "India vs South Africa",
    winner: "India",
    result: "India won by 7 runs",
    videoId: "x9x5xs6",
    type: "T20",
    flag1: "🇮🇳",
    flag2: "🇿🇦",
  },
  {
    id: "odi-2023",
    tournament: "ICC Men's Cricket World Cup",
    year: 2023,
    teams: "Australia vs India",
    winner: "Australia",
    result: "Australia won by 6 wickets",
    videoId: "x8pr9un",
    type: "ODI",
    flag1: "🇦🇺",
    flag2: "🇮🇳",
  },
  {
    id: "t20-2022",
    tournament: "ICC Men's T20 World Cup",
    year: 2022,
    teams: "Pakistan vs England",
    winner: "England",
    result: "England won by 5 wickets",
    videoId: "x8fgjv8",
    type: "T20",
    flag1: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    flag2: "🇵🇰",
  },
  {
    id: "t20-2021",
    tournament: "ICC Men's T20 World Cup",
    year: 2021,
    teams: "Australia vs New Zealand",
    winner: "Australia",
    result: "Australia won by 8 wickets",
    videoId: "x85ibgt",
    type: "T20",
    flag1: "🇦🇺",
    flag2: "🇳🇿",
  },
  {
    id: "odi-2019",
    tournament: "ICC Men's Cricket World Cup",
    year: 2019,
    teams: "England vs New Zealand",
    winner: "England",
    result: "England won (Super Over)",
    videoId: "x7cg5r4",
    type: "ODI",
    flag1: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    flag2: "🇳🇿",
  },
  {
    id: "t20-2016",
    tournament: "ICC Men's T20 World Cup",
    year: 2016,
    teams: "West Indies vs England",
    winner: "West Indies",
    result: "West Indies won by 4 wickets",
    videoId: "x41whyu",
    type: "T20",
    flag1: "🏏",
    flag2: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  },
  {
    id: "odi-2015",
    tournament: "ICC Men's Cricket World Cup",
    year: 2015,
    teams: "Australia vs New Zealand",
    winner: "Australia",
    result: "Australia won by 7 wickets",
    videoId: "x2l0gkc",
    type: "ODI",
    flag1: "🇦🇺",
    flag2: "🇳🇿",
  },
  {
    id: "odi-2011",
    tournament: "ICC Men's Cricket World Cup",
    year: 2011,
    teams: "India vs Sri Lanka",
    winner: "India",
    result: "India won by 6 wickets",
    videoId: "x9ejifo",
    type: "ODI",
    flag1: "🇮🇳",
    flag2: "🇱🇰",
  },
];

const typeColors: Record<string, string> = {
  T20: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  ODI: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  CT: "bg-purple-500/15 text-purple-400 border-purple-500/30",
};

export default function WorldCupFinals() {
  const [selected, setSelected] = useState<Final | null>(null);

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
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${typeColors[final.type]}`}>
                  {final.type === "CT" ? "Champions Trophy" : final.type === "T20" ? "T20 World Cup" : "ODI World Cup"}
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

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-3xl w-full p-0 overflow-hidden">
          <DialogHeader className="px-4 pt-4 pb-2">
            <DialogTitle className="flex items-center gap-2 text-base">
              <Trophy className="w-4 h-4 text-yellow-500 flex-shrink-0" />
              <span>{selected?.tournament} {selected?.year} Final</span>
              <Badge variant="secondary" className="ml-auto text-[10px]">
                {selected?.winner} 🏆
              </Badge>
            </DialogTitle>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <Users className="w-3 h-3" />
              {selected?.teams} — {selected?.result}
            </p>
          </DialogHeader>
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            {selected && (
              <iframe
                key={selected.id}
                src={`https://www.dailymotion.com/embed/video/${selected.videoId}?autoplay=1&mute=0`}
                className="absolute inset-0 w-full h-full border-0"
                allow="autoplay; fullscreen"
                allowFullScreen
                data-testid="iframe-final-player"
                title={`${selected.tournament} ${selected.year} Final`}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
