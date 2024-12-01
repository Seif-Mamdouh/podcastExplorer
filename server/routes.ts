import { Express } from "express";
import { setupAuth } from "./auth";
import { db } from "../db";
import { playlists, playlistItems } from "@db/schema";
import { eq } from "drizzle-orm";

import { searchPodcasts, getEpisodes } from "./podcastIndex";

export function registerRoutes(app: Express) {
  setupAuth(app);

  // Podcast routes
  app.get("/api/podcasts", async (req, res) => {
    try {
      const query = req.query.q as string | undefined;
      const podcasts = await searchPodcasts(query);
      res.json(podcasts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch podcasts" });
    }
  });

  app.get("/api/podcasts/:feedId/episodes", async (req, res) => {
    try {
      const feedId = parseInt(req.params.feedId);
      const episodes = await getEpisodes(feedId);
      res.json(episodes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch episodes" });
    }
  });

  // Playlists
  app.get("/api/playlists", async (req, res) => {
    if (!req.user) {
      return res.status(401).send("Not authenticated");
    }

    const userPlaylists = await db.query.playlists.findMany({
      where: eq(playlists.userId, req.user.id),
    });

    res.json(userPlaylists);
  });

  app.post("/api/playlists", async (req, res) => {
    if (!req.user) {
      return res.status(401).send("Not authenticated");
    }

    const { name, description } = req.body;

    const [playlist] = await db
      .insert(playlists)
      .values({
        userId: req.user.id,
        name,
        description,
      })
      .returning();

    res.json(playlist);
  });

  app.post("/api/playlists/:id/items", async (req, res) => {
    if (!req.user) {
      return res.status(401).send("Not authenticated");
    }

    const { podcastId, episodeId } = req.body;
    const playlistId = parseInt(req.params.id);

    // Verify playlist ownership
    const [playlist] = await db.query.playlists.findMany({
      where: eq(playlists.id, playlistId),
      limit: 1,
    });

    if (!playlist || playlist.userId !== req.user.id) {
      return res.status(403).send("Not authorized");
    }

    const [item] = await db
      .insert(playlistItems)
      .values({
        playlistId,
        podcastId,
        episodeId,
      })
      .returning();

    res.json(item);
  });
}
