import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import type { Episode } from "../lib/api";

interface PodcastPlayerProps {
  episode?: Episode;
}

export function PodcastPlayer({ episode }: PodcastPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);

  if (!episode) return null;

  return (
    <Card className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium truncate">{episode.title}</h4>
          <div className="flex items-center gap-2">
            <Slider
              value={[progress]}
              max={100}
              step={1}
              className="flex-1"
              onValueChange={([value]) => setProgress(value)}
            />
            <span className="text-sm text-muted-foreground">
              {Math.floor(progress * episode.duration / 100)}s
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button 
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <Button variant="ghost" size="icon">
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 w-32">
          <Volume2 className="h-4 w-4" />
          <Slider
            value={[volume]}
            max={100}
            step={1}
            onValueChange={([value]) => setVolume(value)}
          />
        </div>
      </div>
    </Card>
  );
}
