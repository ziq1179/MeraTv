import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFavoriteSchema } from "@shared/schema";
import Parser from "rss-parser";

const rssParser = new Parser({
  customFields: {
    item: [
      ["media:thumbnail", "mediaThumbnail"],
      ["media:content", "mediaContent"],
      ["coverImages", "coverImages"],
    ],
  },
});
let newsCache: { items: any[]; fetchedAt: number } | null = null;
const NEWS_TTL = 10 * 60 * 1000; // 10 minutes

const NEWS_FEEDS = [
  "https://feeds.bbci.co.uk/sport/cricket/rss.xml",
  "https://www.espncricinfo.com/rss/content/story/feeds/0.xml",
];

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/channels", async (req, res) => {
    try {
      const { category, search, language } = req.query;
      const channels = await storage.getChannels({
        category: category as string,
        search: search as string,
        language: language as string,
      });
      res.json(channels);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch channels" });
    }
  });

  app.get("/api/channels/:id", async (req, res) => {
    try {
      const channel = await storage.getChannel(req.params.id);
      if (!channel) {
        return res.status(404).json({ error: "Channel not found" });
      }
      res.json(channel);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch channel" });
    }
  });

  app.get("/api/favorites", async (req, res) => {
    try {
      const sessionId = req.sessionID || "anonymous";
      const favs = await storage.getFavorites(sessionId);
      res.json(favs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch favorites" });
    }
  });

  app.post("/api/favorites", async (req, res) => {
    try {
      const sessionId = req.sessionID || "anonymous";
      const parsed = insertFavoriteSchema.safeParse({
        ...req.body,
        sessionId,
      });
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid request body", details: parsed.error.errors });
      }
      const fav = await storage.addFavorite(parsed.data);
      res.json(fav);
    } catch (error) {
      res.status(500).json({ error: "Failed to add favorite" });
    }
  });

  app.delete("/api/favorites/:channelId", async (req, res) => {
    try {
      const sessionId = req.sessionID || "anonymous";
      await storage.removeFavorite(req.params.channelId, sessionId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove favorite" });
    }
  });

  app.get("/api/news", async (_req, res) => {
    try {
      if (newsCache && Date.now() - newsCache.fetchedAt < NEWS_TTL) {
        return res.json(newsCache.items);
      }
      const results = await Promise.allSettled(
        NEWS_FEEDS.map((url) => rssParser.parseURL(url))
      );
      const items: any[] = [];
      for (const result of results) {
        if (result.status === "fulfilled") {
          for (const item of result.value.items.slice(0, 15)) {
            items.push({
              title: item.title || "",
              link: item.link || "",
              pubDate: item.pubDate || item.isoDate || "",
              summary: item.contentSnippet || item.content || "",
              source: result.value.title || "Cricket News",
              thumbnail: (() => {
                const raw =
                  item.mediaThumbnail?.["$"]?.url ||
                  item.mediaThumbnail?.["$"]?.URL ||
                  (typeof item.mediaThumbnail === "string" ? item.mediaThumbnail : null) ||
                  item.mediaContent?.["$"]?.url ||
                  (typeof item.coverImages === "string" ? item.coverImages : null) ||
                  item.enclosure?.url ||
                  null;
                if (raw && raw.includes("ichef.bbci.co.uk")) {
                  return raw.replace(/\/standard\/\d+\//, "/standard/624/");
                }
                return raw;
              })(),
            });
          }
        }
      }
      items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
      newsCache = { items, fetchedAt: Date.now() };
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch news" });
    }
  });

  return httpServer;
}
