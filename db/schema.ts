import { pgTable, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  preferences: jsonb("preferences").$type<string[]>().default([]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const playlists = pgTable("playlists", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const playlistItems = pgTable("playlist_items", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  playlistId: integer("playlist_id").notNull().references(() => playlists.id),
  podcastId: text("podcast_id").notNull(),
  episodeId: text("episode_id").notNull(),
  addedAt: timestamp("added_at").defaultNow().notNull()
});

export const userHistory = pgTable("user_history", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").notNull().references(() => users.id),
  podcastId: text("podcast_id").notNull(),
  episodeId: text("episode_id").notNull(),
  listenedAt: timestamp("listened_at").defaultNow().notNull()
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertPlaylistSchema = createInsertSchema(playlists);
export const selectPlaylistSchema = createSelectSchema(playlists);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof selectUserSchema>;
export type InsertPlaylist = z.infer<typeof insertPlaylistSchema>;
export type Playlist = z.infer<typeof selectPlaylistSchema>;
