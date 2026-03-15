import { channels, favorites, type Channel, type InsertChannel, type Favorite, type InsertFavorite } from "@shared/schema";
import { eq, and, ilike, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);

export interface IStorage {
  getChannels(filters?: { category?: string; search?: string; language?: string }): Promise<Channel[]>;
  getChannel(id: string): Promise<Channel | undefined>;
  createChannel(channel: InsertChannel): Promise<Channel>;
  getFavorites(sessionId: string): Promise<Favorite[]>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(channelId: string, sessionId: string): Promise<void>;
  getChannelCount(): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  async getChannels(filters?: { category?: string; search?: string; language?: string }): Promise<Channel[]> {
    let query = db.select().from(channels);

    const conditions: any[] = [];

    if (filters?.category) {
      if (filters.category === "live") {
        conditions.push(eq(channels.isLive, true));
      } else {
        const categoryMap: Record<string, string> = {
          highlights: "Highlights",
          news: "News",
          t20: "T20 League",
          test: "Test Cricket",
        };
        const mapped = categoryMap[filters.category];
        if (mapped) {
          conditions.push(eq(channels.category, mapped));
        }
      }
    }

    if (filters?.search) {
      conditions.push(
        or(
          ilike(channels.name, `%${filters.search}%`),
          ilike(channels.description, `%${filters.search}%`)
        )
      );
    }

    if (filters?.language) {
      conditions.push(eq(channels.language, filters.language));
    }

    if (conditions.length > 0) {
      return db.select().from(channels).where(and(...conditions));
    }

    return db.select().from(channels);
  }

  async getChannel(id: string): Promise<Channel | undefined> {
    const result = await db.select().from(channels).where(eq(channels.id, id));
    return result[0];
  }

  async createChannel(channel: InsertChannel): Promise<Channel> {
    const result = await db.insert(channels).values(channel).returning();
    return result[0];
  }

  async getFavorites(sessionId: string): Promise<Favorite[]> {
    return db.select().from(favorites).where(eq(favorites.sessionId, sessionId));
  }

  async addFavorite(favorite: InsertFavorite): Promise<Favorite> {
    const existing = await db.select().from(favorites)
      .where(and(
        eq(favorites.channelId, favorite.channelId),
        eq(favorites.sessionId, favorite.sessionId)
      ));
    if (existing.length > 0) return existing[0];

    const result = await db.insert(favorites).values(favorite).returning();
    return result[0];
  }

  async removeFavorite(channelId: string, sessionId: string): Promise<void> {
    await db.delete(favorites).where(
      and(
        eq(favorites.channelId, channelId),
        eq(favorites.sessionId, sessionId)
      )
    );
  }

  async getChannelCount(): Promise<number> {
    const result = await db.select().from(channels);
    return result.length;
  }
}

export const storage = new DatabaseStorage();
