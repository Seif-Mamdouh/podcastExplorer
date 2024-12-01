import { PodcastCard } from "./PodcastCard";
import { type Podcast } from "../lib/api";

interface PodcastGridProps {
  podcasts: Podcast[];
  onPlay: (podcast: Podcast) => void;
  onAddToPlaylist: (podcast: Podcast) => void;
}

export function PodcastGrid({ podcasts, onPlay, onAddToPlaylist }: PodcastGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {podcasts.map((podcast) => (
        <PodcastCard
          key={podcast.id}
          podcast={podcast}
          onPlay={onPlay}
          onAddToPlaylist={onAddToPlaylist}
        />
      ))}
    </div>
  );
}
