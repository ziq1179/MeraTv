import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFavoriteSchema } from "@shared/schema";

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

  return httpServer;
}
