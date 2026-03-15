import { useLocation, Link } from "wouter";
import { Tv, Heart, Radio, TrendingUp, Newspaper, Trophy, Zap, Satellite, Rss, Globe } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

const liveStreams = [
  { title: "Webcric", url: "/live-tv?stream=webcric" },
  { title: "PTV Sports", url: "/live-tv?stream=ptvsports" },
];

const categories = [
  { title: "All Channels", url: "/", icon: Tv },
  { title: "Live Now", url: "/category/live", icon: Radio },
  { title: "Highlights", url: "/category/highlights", icon: TrendingUp },
  { title: "News", url: "/category/news", icon: Newspaper },
  { title: "T20 Leagues", url: "/category/t20", icon: Zap },
  { title: "Test Cricket", url: "/category/test", icon: Trophy },
];

const personalItems = [
  { title: "Live TV", url: "/live-tv", icon: Satellite },
  { title: "News & Updates", url: "/news", icon: Rss },
  { title: "Favorites", url: "/favorites", icon: Heart },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4 pb-0">
        <Link href="/" data-testid="link-home-logo">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <Tv className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight">CricStream</h1>
              <p className="text-xs text-muted-foreground">Cricket Channels</p>
            </div>
          </div>
        </Link>
        <div className="mt-3 rounded-md overflow-hidden">
          <img
            src="/images/header-logo.jpg"
            alt="Cricket Masterclass"
            className="w-full object-cover"
            data-testid="img-header-banner"
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Browse</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                      {item.title === "Live Now" && (
                        <Badge variant="destructive" className="ml-auto text-[10px] px-1.5 py-0">
                          LIVE
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Personal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location === "/live-tv"}
                  data-testid="nav-live-tv"
                >
                  <Link href="/live-tv">
                    <Satellite className="w-4 h-4" />
                    <span>Live TV</span>
                    <Badge variant="destructive" className="ml-auto text-[10px] px-1.5 py-0">
                      LIVE
                    </Badge>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  {liveStreams.map((stream) => (
                    <SidebarMenuSubItem key={stream.title}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={location.startsWith("/live-tv") && location.includes(stream.url.split("=")[1])}
                        data-testid={`nav-livestream-${stream.title.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        <Link href={stream.url}>
                          <Globe className="w-3 h-3" />
                          <span>{stream.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </SidebarMenuItem>
              {personalItems.filter(i => i.title !== "Live TV").map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <p className="text-xs text-muted-foreground text-center">
          CricStream v1.0
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
