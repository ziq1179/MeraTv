import type { Channel, InsertChannel, Favorite, InsertFavorite } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getChannels(filters?: { category?: string; search?: string; language?: string }): Promise<Channel[]>;
  getChannel(id: string): Promise<Channel | undefined>;
  createChannel(channel: InsertChannel): Promise<Channel>;
  getFavorites(sessionId: string): Promise<Favorite[]>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(channelId: string, sessionId: string): Promise<void>;
  getChannelCount(): Promise<number>;
}

export class MemStorage implements IStorage {
  private channels: Map<string, Channel> = new Map();
  private favorites: Map<string, Favorite> = new Map();

  async getChannels(filters?: { category?: string; search?: string; language?: string }): Promise<Channel[]> {
    let results = Array.from(this.channels.values());

    if (filters?.category) {
      if (filters.category === "live") {
        results = results.filter(c => c.isLive);
      } else {
        const categoryMap: Record<string, string> = {
          highlights: "Highlights",
          news: "News",
          t20: "T20 League",
          test: "Test Cricket",
        };
        const mapped = categoryMap[filters.category];
        if (mapped) results = results.filter(c => c.category === mapped);
      }
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(c =>
        c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
      );
    }

    if (filters?.language) {
      results = results.filter(c => c.language === filters.language);
    }

    return results;
  }

  async getChannel(id: string): Promise<Channel | undefined> {
    return this.channels.get(id);
  }

  async createChannel(channel: InsertChannel): Promise<Channel> {
    const newChannel: Channel = { id: randomUUID(), ...channel } as Channel;
    this.channels.set(newChannel.id, newChannel);
    return newChannel;
  }

  async getFavorites(sessionId: string): Promise<Favorite[]> {
    return Array.from(this.favorites.values()).filter(f => f.sessionId === sessionId);
  }

  async addFavorite(favorite: InsertFavorite): Promise<Favorite> {
    const existing = Array.from(this.favorites.values()).find(
      f => f.channelId === favorite.channelId && f.sessionId === favorite.sessionId
    );
    if (existing) return existing;
    const newFav: Favorite = { id: randomUUID(), ...favorite };
    this.favorites.set(newFav.id, newFav);
    return newFav;
  }

  async removeFavorite(channelId: string, sessionId: string): Promise<void> {
    for (const [key, fav] of this.favorites.entries()) {
      if (fav.channelId === channelId && fav.sessionId === sessionId) {
        this.favorites.delete(key);
        break;
      }
    }
  }

  async getChannelCount(): Promise<number> {
    return this.channels.size;
  }
}

export const storage = new MemStorage();
