import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const channels = pgTable("channels", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  streamUrl: text("stream_url").notNull().default(""),
  isLive: boolean("is_live").notNull().default(false),
  viewers: integer("viewers").notNull().default(0),
  language: text("language").notNull().default("English"),
  country: text("country").notNull().default("International"),
  rating: text("rating").notNull().default("4.0"),
});

export const favorites = pgTable("favorites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  channelId: varchar("channel_id").notNull().references(() => channels.id),
  sessionId: text("session_id").notNull(),
});

export const insertChannelSchema = createInsertSchema(channels).omit({ id: true });
export const insertFavoriteSchema = createInsertSchema(favorites).omit({ id: true });

export type InsertChannel = z.infer<typeof insertChannelSchema>;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Channel = typeof channels.$inferSelect;
export type Favorite = typeof favorites.$inferSelect;
